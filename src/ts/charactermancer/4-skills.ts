import { skillsByKey, skillsByLevel } from "#game/constants.js";
import { SkillLevels, type SkillLevel } from "#game/enums.js";
import { translateOr } from "#rules/translation.js";

import {
  charmancerData, parseStringList, stepRows, stepValues,
} from "./helpers";
import { Steps } from "./types";

/** What one skill costs, by tier. */
const SKILL_COST: Record<SkillLevel, number> = {
  [SkillLevels.Trained]: 1,
  [SkillLevels.Expert]: 2,
  [SkillLevels.Master]: 3,
};

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

/** Skills the class grants outright, plus any the player picked from a group. */
function classGrantedSkills(): readonly string[] {
  const data = charmancerData();
  const values = stepValues(data, Steps.Class);

  const granted = parseStringList(values["skills"]);
  const keys = granted.map((name) => name.replaceAll(" ", "_"));

  const choiceRows = stepRows(data, Steps.Class).filter((id) => id.includes("choicerow"));
  for (const rowId of choiceRows) {
    const chosen = values[`${rowId}_skill`];
    if (chosen === undefined || chosen === "choose") continue;
    const lower = chosen.toLowerCase();
    const key = lower.replaceAll(" ", "_");
    keys.push(key);
  }
  return keys;
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

  let spent = 0;
  for (const [level, entries] of Object.entries(skillsByLevel)) {
    const cost = SKILL_COST[level as SkillLevel];
    for (const entry of entries) {
      const isOwned = skills[entry.key] === "on";
      const isGranted = skills[`${entry.key}_type`] === CLASS_SKILL;
      if (isOwned && !isGranted) spent += cost;
    }
  }

  const remaining = total - spent;
  setAttrs({
    skillpoints: remaining,
    trained_lock: remaining <= 0 ? "on" : "0",
    expert_lock: remaining <= 1 ? "on" : "0",
    master_lock: remaining <= 2 ? "on" : "0",
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
