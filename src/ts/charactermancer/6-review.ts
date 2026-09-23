import { skillsByKey } from "#game/constants.js";
import { titleCase } from "#game/text.js";

import {
  charmancerData,
  describeItems,
  displayTotal,
  parseJSON,
  statTotals,
  stepValues,
} from "./helpers";
import { Steps, TrackedStats } from "./types";

/** Shown where the player skipped an optional roll. */
const NOT_ROLLED = "Not Rolled";

/** Skills-step attributes that are bookkeeping rather than chosen skills. */
const SKILL_BOOKKEEPING = new Set([
  "owned",
  "unlocked",
  "skillpoints",
  "skillpoints_max",
  "trained_lock",
  "expert_lock",
  "master_lock",
]);

/** Writes the finished character to the review slide, mirroring each value into `*_final`. */
export function onLoadReview(): void {
  const data = charmancerData();
  const text: Record<string, string> = {};
  const attrs: Record<string, string | number> = {};

  const totals = statTotals(data);
  for (const stat of TrackedStats) {
    const total = displayTotal(totals[stat]);
    text[`t__${stat}`] = total;
    attrs[`${stat}_final`] = total;
  }

  const classValues = stepValues(data, Steps.Class);
  const skillValues = stepValues(data, Steps.Skills);
  const equipment = stepValues(data, Steps.Equipment);

  const summary: Record<string, string> = {
    class: classValues["class"] ?? "",
    stresseffect: classValues["stress_effect"] ?? "",
    skillpoints: skillValues["skillpoints"] ?? "0",
    credits: equipment["credits"] ?? NOT_ROLLED,
    trinket: equipment["trinket"] ?? NOT_ROLLED,
    patch: equipment["patch"] ?? NOT_ROLLED,
  };
  for (const [key, value] of Object.entries(summary)) {
    text[`t__${key}`] = value;
    attrs[`${key}_final`] = value;
  }

  const skills = chosenSkillKeys(data);
  text["t__skilllist"] = describeSkills(skills);
  attrs["skills_final"] = JSON.stringify(skills);

  const packed = equipment["equipment"] ?? "";
  const parsed = parseJSON(packed);
  const items = Array.isArray(parsed) ? (parsed as (string | [string, string])[]) : [];
  text["t__equipmentlist"] = describeItems(items);
  attrs["equipment_final"] = packed;

  setCharmancerText(text);
  setAttrs(attrs);
}

/** Attribute keys for every skill the player ended up with. */
function chosenSkillKeys(data: ReturnType<typeof charmancerData>): readonly string[] {
  const values = stepValues(data, Steps.Skills);
  const chosen: string[] = [];

  for (const [key, value] of Object.entries(values)) {
    if (value !== "on") continue;

    const isBookkeeping = SKILL_BOOKKEEPING.has(key);
    const isTypeMarker = key.endsWith("_type");
    if (isBookkeeping || isTypeMarker) continue;

    chosen.push(key);
  }
  return chosen;
}

/** Renders skill keys as the names the player recognises. */
function describeSkills(keys: readonly string[]): string {
  const names: string[] = [];
  for (const key of keys) {
    const entry = skillsByKey[key];
    const spaced = key.replaceAll("_", " ");
    const name = entry === undefined ? spaced : entry.name;
    const display = titleCase(name);
    names.push(display);
  }
  const joined = names.join(", ");
  return joined;
}
