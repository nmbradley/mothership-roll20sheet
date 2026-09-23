import {
  allSaves, allStats, type EntryOf,
} from "#game/enums.js";

import { rollSaveCheck } from "./checks";
import { TEMPLATE_PHRASES, notesFlag } from "./rollTemplate";
import { translateOr } from "./translation";

/** Radiation exposure (33.2): a per-round control the sheet cannot time on its own. */

export const RadiationLevels = {
  Trace: "trace",
  Acute: "acute",
  Lethal: "lethal",
} as const;
export type RadiationLevel = EntryOf<typeof RadiationLevels>;

/** Level 2's flat penalty to every Stat and Save, applied once per round used. */
const STAT_SAVE_PENALTY = -1;

export type RadiationRoundEffect =
  | { kind: "none" }
  | {
    kind: "stat-penalty";
    amount: number;
  }
  | { kind: "body-save" };

/** What one round at the current Radiation Level does, per the 33.2 table. */
export function radiationRoundEffect(level: string): RadiationRoundEffect {
  if (level === RadiationLevels.Acute) {
    return {
      kind: "stat-penalty",
      amount: STAT_SAVE_PENALTY,
    };
  }
  if (level === RadiationLevels.Lethal) return { kind: "body-save" };
  return { kind: "none" };
}

export type ModValues = Record<string, number>;

/** The `_mod` attributes Acute exposure stacks through, alongside any class bonus. */
export const MOD_ATTRIBUTES: readonly string[] = [...allStats, ...allSaves]
  .map((attribute) => `${attribute}_mod`);

/** Shifts every Stat/Save modifier by the same amount, additive on top of any class bonus. */
export function shiftStatSaveMods(mods: ModValues, amount: number): ModValues {
  const next: ModValues = {};
  for (const [key, value] of Object.entries(mods)) {
    next[key] = value + amount;
  }
  return next;
}

function readMods(done: (mods: ModValues) => void): void {
  getAttrs([...MOD_ATTRIBUTES], (attrs) => {
    const mods: ModValues = {};
    for (const key of MOD_ATTRIBUTES) {
      mods[key] = Number(attrs[key]) || 0;
    }
    done(mods);
  });
}

async function postRadiationRoundCard(): Promise<void> {
  const formula = [
    "&{template:ms}",
    `{{title=^{${TEMPLATE_PHRASES.RadiationExposure}}}}`,
    "{{subtitle=@{character_name}}}",
    "{{alert=[[0]]}} {{hasalert=[[0]]}}",
  ].join(" ");

  const rollData = await startRoll(formula);
  const alert = translateOr(TEMPLATE_PHRASES.RadiationRoundPenalty);
  finishRoll(rollData.rollId, {
    alert,
    hasalert: notesFlag(alert),
  });
}

/** Roll20 Sheetworker: applies one round of the current Radiation Level's effect. */
export function handleRadiationRound(): void {
  getAttrs(["radiation_level"], (attrs) => {
    const effect = radiationRoundEffect(attrs.radiation_level ?? "");

    if (effect.kind === "body-save") {
      rollSaveCheck("body");
      return;
    }
    if (effect.kind === "none") return;

    readMods((mods) => {
      getAttrs(["radiation_penalty_rounds"], (extra) => {
        const rounds = (Number(extra.radiation_penalty_rounds) || 0) + 1;
        setAttrs({
          ...shiftStatSaveMods(mods, effect.amount),
          radiation_penalty_rounds: rounds,
        });
        void postRadiationRoundCard();
      });
    });
  });
}

/** Roll20 Sheetworker: reverses any stacked Acute penalty once the level clears to Trace. */
export function handleRadiationLevelChange(): void {
  getAttrs(["radiation_level", "radiation_penalty_rounds"], (attrs) => {
    if (attrs.radiation_level !== RadiationLevels.Trace) return;

    const rounds = Number(attrs.radiation_penalty_rounds) || 0;
    if (rounds <= 0) return;

    readMods((mods) => {
      setAttrs({
        ...shiftStatSaveMods(mods, rounds),
        radiation_penalty_rounds: 0,
      });
    });
  });
}
