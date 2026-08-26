import { allStats } from "#game/enums.js";

import { charmancerData, stepValues } from "./helpers";
import { Steps } from "./types";

/** Stress and wounds every character starts with, before class modifiers. */
const STARTING_STRESS = 2;
const STARTING_WOUNDS = 2;
const STARTING_ARMOR = 0;

/** Restores the rolled stats when the player returns to the slide. */
export function onLoadStats(): void {
  const data = charmancerData();
  const values = stepValues(data, Steps.Stats);
  if (values["strength"] === undefined) return;

  showChoices(["showstats"]);

  const updates: Record<string, string> = {};
  for (const stat of allStats) {
    updates[`t__${stat}`] = values[stat] ?? "";
  }
  setCharmancerText(updates);
}

/** Records a fresh set of rolled stats and the vitals derived from them. */
export function onRollStats(rolls: readonly RollResult[]): void {
  showChoices(["showstats"]);

  const updates: Record<string, string> = {};
  const attrs: Record<string, string | number> = {};

  allStats.forEach((stat, index) => {
    const roll = rolls[index];
    if (roll === undefined) return;
    updates[`t__${stat}`] = String(roll.result);
    attrs[stat] = roll.result;
  });

  const strength = rolls[0]?.result ?? 0;
  attrs["health"] = strength * 2;
  attrs["stress"] = STARTING_STRESS;
  attrs["wounds"] = STARTING_WOUNDS;
  attrs["armor_points"] = STARTING_ARMOR;

  setCharmancerText(updates);
  setAttrs(attrs);
}
