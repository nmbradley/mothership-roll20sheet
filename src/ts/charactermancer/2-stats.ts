import { allSaves, allStats } from "#game/enums.js";

import { charmancerData, stepValues } from "./helpers";
import { Steps } from "./types";

/** Stress and wounds every character starts with, before class modifiers. */
const STARTING_STRESS = 2;
const STARTING_WOUNDS = 2;

/** Every field the Stats step rolls in one pass, in the roll's template order. */
const ROLLED_FIELDS = [...allStats, ...allSaves];

/** Health rolls after the stats and saves in the same template (see rolledAttrs). */
const HEALTH_ROLL_INDEX = ROLLED_FIELDS.length;

/** Restores the rolled stats and saves when the player returns to the slide. */
export function onLoadStats(): void {
  const data = charmancerData();
  const values = stepValues(data, Steps.Stats);
  if (values["strength"] === undefined) return;

  showChoices(["showstats"]);

  const updates: Record<string, string> = {};
  for (const field of ROLLED_FIELDS) {
    updates[`t__${field}`] = values[field] ?? "";
  }
  setCharmancerText(updates);
}

/**
 * The attributes one stats-and-saves roll writes: the rolled stats and saves
 * themselves, plus the vitals that follow from Strength alone.
 */
export function rolledAttrs(rolls: readonly RollResult[]): Record<string, string | number> {
  const attrs: Record<string, string | number> = {};
  for (const [index, field] of ROLLED_FIELDS.entries()) {
    const roll = rolls[index];
    if (roll === undefined) continue;
    attrs[field] = roll.result;
  }

  // 1e Max Health: its own 1d10+10 roll, independent of Strength (#42).
  const healthRoll = rolls[HEALTH_ROLL_INDEX];
  if (healthRoll !== undefined) attrs["health"] = healthRoll.result;
  attrs["stress"] = STARTING_STRESS;
  attrs["wounds"] = STARTING_WOUNDS;
  return attrs;
}

/** Records a fresh set of rolled stats and saves, and the vitals derived from them. */
export function onRollStats(rolls: readonly RollResult[]): void {
  showChoices(["showstats"]);

  const attrs = rolledAttrs(rolls);
  const updates: Record<string, string> = {};
  for (const field of ROLLED_FIELDS) {
    const value = attrs[field];
    if (value !== undefined) updates[`t__${field}`] = String(value);
  }

  setCharmancerText(updates);
  setAttrs(attrs);
}
