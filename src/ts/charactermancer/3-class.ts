import { skillsByLevel } from "#game/constants.js";
import {
  classes, type ClassDef, type FloatingBonus,
} from "#game/data/classes.js";
import {
  SkillLevels, allSaves, allStats, type Stat,
} from "#game/enums.js";
import { titleCase } from "#game/text.js";
import { translateOr } from "#rules/translation.js";

import {
  attributeKey, charmancerData, resolveNumber, stepRows, stepValues,
} from "./helpers";
import { Steps } from "./types";

const CLASS_LIST = "sheet-t__classes";
const SKILL_CHOICE_LIST = "sheet-t__skill_choice";
const FLOATING_CHOICE_LIST = "sheet-t__floating_choice";
const CUSTOM_CLASS = "custom";

/** Attributes the class step owns, cleared before a new class writes its own. */
const CLASS_ATTRIBUTES = [
  "class",
  "sanity_mod",
  "fear_mod",
  "body_mod",
  "strength_mod",
  "speed_mod",
  "intellect_mod",
  "combat_mod",
  "skill_points",
  "stress_effect",
  "skills",
] as const;

/** Shows the chosen class, or the picker when nothing is chosen yet. */
export function onLoadClass(): void {
  const data = charmancerData();
  const selected = stepValues(data, Steps.Class)["selected"];
  if (selected === undefined || selected === "") {
    generateClassList();
    return;
  }
  instanceClass(selected);
}

/** Builds one selectable card per class, plus the custom option. */
export function generateClassList(): void {
  hideChoices([]);
  showChoices(["showclasses"]);
  clearRepeatingSections(CLASS_LIST);

  for (const definition of Object.values(classes)) {
    addClassCard(definition);
  }
  addClassCard(undefined);
}

function addClassCard(definition: ClassDef | undefined): void {
  const name = definition?.name ?? CUSTOM_CLASS;

  addRepeatingSection(CLASS_LIST, "class", (rowId: string) => {
    const title = definition === undefined ? translateOr(CUSTOM_CLASS) : name;
    const description = definition?.desc
      ?? translateOr("choose this option to enter your own information");

    setAttrs({ [`${rowId}_name`]: name });
    setCharmancerText({
      [`${rowId} .sheet-t__title`]: title,
      [`${rowId} .sheet-t__desc`]: `<p>${description}</p>`,
      [`${rowId} .sheet-t__grants`]: grantsList(definition),
    });
  });
}

/**
 * What a class gives, as a list.
 *
 * This replaces the class art the compendium used to supply: the numbers are
 * what the player is actually choosing between, and they come straight from the
 * rules data rather than being baked into an image.
 */
function grantsList(definition: ClassDef | undefined): string {
  if (definition === undefined) return "";

  const items: string[] = [];
  for (const line of grantLines(definition)) {
    items.push(`<li>${line}</li>`);
  }
  const joined = items.join("");
  return `<ul class="ms-cm-class__grantlist">${joined}</ul>`;
}

function grantLines(definition: ClassDef): readonly string[] {
  const lines: string[] = [];

  const stats = describeBonuses(definition.statBonus, allStats.length, "Stats");
  for (const line of stats) lines.push(line);

  const saves = describeBonuses(definition.saveBonus, allSaves.length, "Saves");
  for (const line of saves) lines.push(`${line} Save`);

  const floating = definition.floating;
  if (floating !== undefined) {
    const sign = floating.amount > 0 ? "+" : "";
    lines.push(`${sign}${floating.amount} to ${floating.count} Stat of your choice`);
  }

  if (definition.maxWoundsBonus > 0) {
    lines.push(`+${definition.maxWoundsBonus} Maximum Wound`);
  }

  const granted = definition.skills.granted;
  if (granted.length > 0) {
    const names: string[] = [];
    for (const skill of granted) {
      const display = titleCase(skill);
      names.push(display);
    }
    const joined = names.join(", ");
    lines.push(joined);
  }

  lines.push(`${definition.skills.skillPoints} Skill Points`);
  return lines;
}

/**
 * Renders a bonus map, collapsing a bonus applied to everything into one line
 * so the Teamster reads "+5 All" rather than the same number four times.
 */
function describeBonuses(
  bonuses: Partial<Record<string, number>>,
  total: number,
  collectiveNoun: string,
): readonly string[] {
  const entries = Object.entries(bonuses);
  if (entries.length === 0) return [];

  const amounts = new Set<number>();
  for (const [, amount] of entries) amounts.add(amount ?? 0);

  const first = entries[0]?.[1] ?? 0;
  const isUniform = entries.length === total && amounts.size === 1;
  if (isUniform) return [`+${first} All ${collectiveNoun}`];

  const lines: string[] = [];
  for (const [name, amount] of entries) {
    const value = amount ?? 0;
    const sign = value > 0 ? "+" : "";
    lines.push(`${sign}${value} ${titleCase(name)}`);
  }
  return lines;
}

/** Looks a class up by the name stored on the sheet. */
function findClass(name: string): ClassDef | undefined {
  for (const definition of Object.values(classes)) {
    if (definition.name === name) return definition;
  }
  return undefined;
}

/** Records the player's pick and deselects every other card. */
export function onSelectClass(sourceSection: string, sourceType: string): void {
  if (sourceType !== "player") return;

  const data = charmancerData();
  const chosen = stepValues(data, Steps.Class)[`${sourceSection}_name`];
  if (chosen === undefined) return;

  getRepeatingSections(CLASS_LIST, (details) => {
    const attrs: Record<string, string | number> = { selected: chosen };
    for (const rowId of details.list) {
      if (rowId !== sourceSection) attrs[`${rowId}_selected`] = 0;
    }
    setAttrs(attrs, () => {
      instanceClass(chosen);
    });
  });
}

/** Loads a class's saves, modifiers and skills onto the sheet. */
export function instanceClass(className: string): void {
  hideChoices([]);
  showChoices(["showclassinfo"]);

  if (className === CUSTOM_CLASS) {
    hideChoices(["presetclass"]);
    showChoices(["customclass"]);
    clearRepeatingSections(SKILL_CHOICE_LIST);
    clearRepeatingSections(FLOATING_CHOICE_LIST);
    return;
  }

  const definition = findClass(className);
  if (definition === undefined) {
    generateClassList();
    return;
  }

  showChoices(["presetclass"]);
  hideChoices(["customclass"]);
  applyClass(definition);
}

function applyClass(definition: ClassDef): void {
  const attrs: Record<string, string | number> = {};
  const text: Record<string, string> = {};

  for (const attribute of CLASS_ATTRIBUTES) {
    attrs[attribute] = "";
  }

  attrs["class"] = definition.name;
  text["t__cname"] = definition.name;

  // Saves are rolled on the Stats step; the class only adds a modifier on top,
  // so the roll stays visible in `${save}` and the bonus lives in `${save}_mod`.
  const data = charmancerData();
  for (const save of allSaves) {
    const bonus = definition.saveBonus[save] ?? 0;
    attrs[`${save}_mod`] = bonus;
    text[`t__${save}`] = String(resolveNumber(data, save) + bonus);
  }

  const mods = statModifiers(definition);
  for (const stat of allStats) {
    attrs[`${stat}_mod`] = mods[stat];
  }

  // 1e Max Wounds: the printed base plus the class's own bonus (#42); Health
  // is not class-dependent in 1e, so nothing here touches it.
  const wounds = maxWounds(definition);
  attrs["wounds"] = wounds;
  attrs["wounds_max"] = wounds;
  attrs["stress_effect"] = definition.traumaResponse;
  text["t__stress_effect"] = definition.traumaResponse;

  const granted = definition.skills.granted;
  attrs["skills"] = JSON.stringify(granted);
  text["t__skills"] = granted.join(", ");

  attrs["skill_points"] = definition.skills.skillPoints;
  text["t__skill_points"] = String(definition.skills.skillPoints);

  setAttrs(attrs);
  setCharmancerText(text);
  offerSkillChoices(definition);
  offerFloatingChoice(definition);
}

/**
 * Every stat's flat modifier: the class's fixed bonus, plus its floating bonus
 * on the stat the player chose for it (Android's -10, Scientist's +5).
 */
export function statModifiers(definition: ClassDef, chosenStat?: Stat): Record<Stat, number> {
  const mods = {} as Record<Stat, number>;
  for (const stat of allStats) {
    const base = definition.statBonus[stat] ?? 0;
    const floating = stat === chosenStat ? (definition.floating?.amount ?? 0) : 0;
    mods[stat] = base + floating;
  }
  return mods;
}

/** The printed base of Max Wounds, before any class bonus. */
const BASE_MAX_WOUNDS = 2;

/** Max Wounds: the base plus the class's own bonus, e.g. the Marine's +1. */
export function maxWounds(definition: ClassDef): number {
  return BASE_MAX_WOUNDS + definition.maxWoundsBonus;
}

/**
 * Adds a picker row for a class that chooses a Master skill.
 *
 * Only the Scientist does this: it takes a Master skill outright, so the player
 * picks which one and its prerequisites come with it.
 */
function offerSkillChoices(definition: ClassDef): void {
  clearRepeatingSections(SKILL_CHOICE_LIST);
  if (definition.skills.grantsMasterChain !== true) return;

  const masters = skillsByLevel[SkillLevels.Master];
  const options: string[] = [];
  for (const skill of masters) {
    options.push(skill.name);
  }

  addRepeatingSection(SKILL_CHOICE_LIST, "skillselection", (rowId: string) => {
    setCharmancerOptions(`${rowId}_skill`, options);
  });
}

/**
 * Adds a picker row for a class with a floating bonus (Android's -10,
 * Scientist's +5): the amount is fixed but which stat it lands on is not.
 */
function offerFloatingChoice(definition: ClassDef): void {
  clearRepeatingSections(FLOATING_CHOICE_LIST);
  const floating = definition.floating;
  if (floating === undefined) return;

  const options = allStats.map((stat) => titleCase(stat));
  const label = floatingLabel(floating);

  for (let index = 0; index < floating.count; index += 1) {
    addRepeatingSection(FLOATING_CHOICE_LIST, "floatingchoice", (rowId: string) => {
      setCharmancerText({ [`${rowId} .t__floatlabel`]: label });
      setCharmancerOptions(`${rowId}_floatstat`, options);
    });
  }
}

/** Describes a floating bonus as an instruction, e.g. "Increase a Stat by 5". */
function floatingLabel(floating: FloatingBonus): string {
  const verb = floating.amount > 0 ? "Increase" : "Decrease";
  return `${verb} a Stat by ${Math.abs(floating.amount)}`;
}

/** Clears the pick and returns to the class list. */
export function reselectClass(): void {
  getRepeatingSections(CLASS_LIST, (details) => {
    hideChoices([]);
    const attrs: Record<string, string | number> = { selected: "" };
    for (const rowId of details.list) {
      attrs[`${rowId}_selected`] = 0;
    }
    setAttrs(attrs, () => {
      onLoadClass();
    });
  });
}

/** Stops the same skill being chosen twice across the choice rows. */
export function disableChosenSkill(chosen: string): void {
  const data = charmancerData();
  const key = attributeKey(chosen);
  const rows = stepRows(data, Steps.Class);
  for (const rowId of rows) {
    disableCharmancerOptions(`${rowId}_skill`, [key]);
  }
}

/**
 * Applies the class's floating bonus to the stat the player picked.
 *
 * Recomputes every stat's modifier from scratch rather than adjusting the
 * previous pick in place, so changing the pick cannot leave the bonus applied
 * to two stats at once.
 */
export function applyFloatingBonus(chosen: string): void {
  const data = charmancerData();
  const selected = stepValues(data, Steps.Class)["selected"];
  const definition = selected === undefined ? undefined : findClass(selected);
  if (definition?.floating === undefined) return;

  const stat = attributeKey(chosen) as Stat;
  const mods = statModifiers(definition, stat);
  const attrs: Record<string, number> = {};
  for (const s of allStats) {
    attrs[`${s}_mod`] = mods[s];
  }
  setAttrs(attrs);
}
