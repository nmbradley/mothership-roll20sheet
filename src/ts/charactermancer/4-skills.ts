import {
  prerequisiteChain, skillKey, skillsByKey, skillsByLevel,
} from "#game/constants.js";
import { evaluateSkillBudget, type ClassSkills } from "#game/data/classes.js";
import {
  SkillLevels, allSkillLevels, type Skill, type SkillLevel,
} from "#game/enums.js";
import { translateOr } from "#rules/translation.js";

import {
  charmancerData, parseJSON, parseStringList, stepRows, stepValues,
} from "./helpers";
import { Steps } from "./types";

/** Marks a skill granted by the class rather than bought with points. */
const CLASS_SKILL = "class";

/** Loads the slide, seeding the point budget from the chosen class. */
export function onLoadSkills(): void {
  resetClassSkills();

  const data = charmancerData();
  const skills = stepValues(data, Steps.Skills);
  if (skills["skillpoints_max"] !== undefined) {
    recalculateSkillPoints();
    return;
  }

  const classPoints = stepValues(data, Steps.Class)["skill_points"];
  if (classPoints === undefined) {
    setCharmancerText({
      t__skillpointserror: translateOr("Ensure you have selected a class"),
    });
    return;
  }

  setAttrs({ skillpoints_max: classPoints }, () => {
    recalculateSkillPoints();
  });
}

/**
 * Re-grants the class's skills, clearing any granted by a previous class.
 * Skills the player bought are left alone.
 */
function resetClassSkills(): void {
  const data = charmancerData();
  const skills = stepValues(data, Steps.Skills);
  const attrs: Record<string, string | number> = {};

  for (const key of Object.keys(skillsByKey)) {
    if (skills[`${key}_type`] === CLASS_SKILL) {
      attrs[key] = 0;
      attrs[`${key}_type`] = "";
    }
  }

  for (const key of classGrantedSkills()) {
    attrs[key] = "on";
    attrs[`${key}_type`] = CLASS_SKILL;
  }

  setAttrs(attrs, () => {
    recordOwnedSkills();
  });
}

/**
 * Skills the class grants outright, plus any the player picked from a group.
 *
 * A Master-chain class (the Scientist) adds one choice row per tier it needs a
 * decision at (see `offerSkillChoices`/`advanceSkillChoice` in 3-class.ts), so
 * this walks every repeating row on the Class step: a row without a `_skill`
 * value (the class list's own rows, or a choice row not yet reached) is
 * skipped, and a row with one contributes the skill it names plus whatever
 * `prerequisiteChain` grants beneath it without asking.
 */
function classGrantedSkills(): readonly string[] {
  const data = charmancerData();
  const values = stepValues(data, Steps.Class);

  const granted = parseStringList(values["skills"]);
  const keys = granted.map((name) => name.replaceAll(" ", "_"));

  for (const rowId of stepRows(data, Steps.Class)) {
    const chosen = values[`${rowId}_skill`];
    if (chosen === undefined || chosen === "" || chosen === "choose") continue;
    const skillName = chosen.toLowerCase() as Skill;
    const key = skillKey(skillName);
    keys.push(key);

    const { granted: autoGranted } = prerequisiteChain(skillName);
    for (const name of autoGranted) {
      const autoKey = skillKey(name);
      keys.push(autoKey);
    }
  }
  return keys;
}

/** The class's required tier breakdown, or undefined for a free point budget. */
function classRequiredTiers(): ClassSkills["requiredTiers"] {
  const data = charmancerData();
  const raw = stepValues(data, Steps.Class)["required_tiers"];
  const parsed = parseJSON(raw);
  if (typeof parsed !== "object" || parsed === null) return undefined;

  const entries = Object.entries(parsed as Record<string, unknown>)
    .filter((entry): entry is [string, number] => typeof entry[1] === "number");
  if (entries.length === 0) return undefined;
  const requiredTiers = Object.fromEntries(entries);
  return requiredTiers;
}

/**
 * Totals what the player has spent and locks the tiers they can no longer
 * afford, so the UI cannot offer a skill there are no points for.
 */
export function recalculateSkillPoints(): void {
  const data = charmancerData();
  const skills = stepValues(data, Steps.Skills);

  const budgetRaw = skills["skillpoints_max"] ?? "0";
  const budget = Number.parseInt(budgetRaw, 10);
  const total = Number.isNaN(budget) ? 0 : budget;

  const purchasedByLevel = {} as Record<SkillLevel, number>;
  for (const level of allSkillLevels) purchasedByLevel[level] = 0;
  for (const [level, entries] of Object.entries(skillsByLevel)) {
    for (const entry of entries) {
      const isOwned = skills[entry.key] === "on";
      const isGranted = skills[`${entry.key}_type`] === CLASS_SKILL;
      if (isOwned && !isGranted) purchasedByLevel[level as SkillLevel] += 1;
    }
  }

  const requiredTiers = classRequiredTiers();
  const classSkills: ClassSkills = requiredTiers === undefined
    ? {
        granted: [],
        skillPoints: total,
      }
    : {
        granted: [],
        requiredTiers,
      };
  const { remaining, locked } = evaluateSkillBudget(classSkills, purchasedByLevel);

  setAttrs({
    skillpoints: remaining,
    trained_lock: locked[SkillLevels.Trained] ? "on" : "0",
    expert_lock: locked[SkillLevels.Expert] ? "on" : "0",
    master_lock: locked[SkillLevels.Master] ? "on" : "0",
  });
  setCharmancerText({ t__skillpoints: `${remaining} / ${total}` });
}

/** Buys or refunds a skill. Class-granted skills cannot be toggled off. */
export function toggleSkill(key: string): void {
  const data = charmancerData();
  const skills = stepValues(data, Steps.Skills);
  if (skills[`${key}_type`] === CLASS_SKILL) return;

  const isOwned = skills[key] === "on";
  setAttrs({ [key]: isOwned ? 0 : "on" }, () => {
    recordOwnedSkills();
  });
}

/**
 * Publishes which skills are owned and which the player has thereby unlocked,
 * which is what the slide's CSS keys off to enable the next tier.
 */
function recordOwnedSkills(): void {
  const data = charmancerData();
  const skills = stepValues(data, Steps.Skills);

  const owned: string[] = [];
  const unlocked: string[] = [];

  for (const [key, entry] of Object.entries(skillsByKey)) {
    if (skills[key] !== "on") continue;
    owned.push(key);
    for (const name of entry.unlocks) {
      const unlockedKey = name.replaceAll(" ", "_");
      if (!unlocked.includes(unlockedKey)) unlocked.push(unlockedKey);
    }
  }

  setAttrs({
    owned: owned.join(" "),
    unlocked: unlocked.join(" "),
  });
}
