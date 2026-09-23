import type { WoundEffect } from "#game/data/wounds.js";
import {
  DamageTypes, allDamageTypes, type DamageType,
} from "#game/enums.js";
import { titleCase } from "#game/text.js";

import { destroyWornArmor } from "./equipment";
import {
  TEMPLATE_PHRASES,
  notesFlag,
} from "./rollTemplate";
import { woundEffect } from "./tables";
import { translateOr } from "./translation";

/** Automated damage and wounds: armor, the health cascade, and taking a wound outright. */

export type DamageState = {
  health: number;
  healthMax: number;
  wounds: number;
  woundsMax: number;
  armorPoints: number;
  damageReduction: number;
};

export type WoundRollResult = {
  damageType: DamageType;
  /** The d10 that indexed the Wounds Table, 0-9. */
  roll: number;
  effect: WoundEffect;
};

export type ArmorOutcome = {
  /** Damage that reaches Health once DR and the AP threshold are applied. */
  damage: number;
  /** Armor Points after this hit. */
  armorPoints: number;
  /** True where this hit met or exceeded AP and there was armor to break. */
  armorDestroyed: boolean;
  /** True where AP alone stopped this hit outright. */
  absorbed: boolean;
};

/** Applies Damage Reduction and the Armor Points threshold to one hit. */
export function applyArmor(
  hit: number,
  armorPoints: number,
  damageReduction: number,
): ArmorOutcome {
  const reduced = Math.max(0, hit - damageReduction);

  if (reduced < armorPoints) {
    return {
      damage: 0,
      armorPoints,
      armorDestroyed: false,
      absorbed: true,
    };
  }

  return {
    damage: reduced,
    armorPoints: 0,
    armorDestroyed: armorPoints > 0,
    absorbed: false,
  };
}

export type DamageOutcome = {
  health: number;
  armorPoints: number;
  wounds: number;
  armorDestroyed: boolean;
  absorbed: boolean;
  /** One entry per Wounds Table roll the cascade triggered, in order. */
  woundRolls: WoundRollResult[];
  requiresDeathSave: boolean;
};

/** Applies one hit to Health, cascading a Wound each time Health drops to zero or below. */
export function applyDamage(
  hit: number,
  state: DamageState,
  damageType: DamageType,
  woundDice: readonly number[],
): DamageOutcome {
  const armor = applyArmor(hit, state.armorPoints, state.damageReduction);

  let health = state.health - armor.damage;
  let wounds = state.wounds;
  const woundRolls: WoundRollResult[] = [];
  let diceIndex = 0;

  while (health <= 0 && wounds < state.woundsMax) {
    const carryover = -health;
    wounds += 1;

    const roll = woundDice[diceIndex] ?? 0;
    diceIndex += 1;
    const effect = woundEffect(roll);
    if (effect !== undefined) woundRolls.push({
      damageType,
      roll,
      effect,
    });

    health = state.healthMax - carryover;
  }

  return {
    health,
    armorPoints: armor.armorPoints,
    wounds,
    armorDestroyed: armor.armorDestroyed,
    absorbed: armor.absorbed,
    woundRolls,
    requiresDeathSave: wounds >= state.woundsMax,
  };
}

export type WoundOutcome = {
  wounds: number;
  requiresDeathSave: boolean;
  /** Absent only where the roll somehow fell outside the table -- see woundEffect. */
  woundRoll?: WoundRollResult;
};

/** Takes a Wound directly, bypassing Health, capped at Maximum Wounds. */
export function applyWound(
  damageType: DamageType,
  roll: number,
  state: {
    wounds: number;
    woundsMax: number;
  },
): WoundOutcome {
  const wounds = Math.min(state.woundsMax, state.wounds + 1);
  const effect = woundEffect(roll);

  return {
    wounds,
    requiresDeathSave: wounds >= state.woundsMax,
    ...(effect === undefined
      ? {}
      : {
          woundRoll: {
            damageType,
            roll,
            effect,
          },
        }),
  };
}

/** One Wounds Table result as a chat line: its severity, then the column the damage type rolled. */
export function woundLine(entry: WoundRollResult): string {
  return `${entry.effect.severity}: ${entry.effect[entry.damageType]}`;
}

/** The chat warning shown once Wounds reach Maximum and a Death Save is owed. */
export const MAX_WOUNDS_ALERT = "MAXIMUM WOUNDS REACHED. MAKE A DEATH SAVE.";

/** The Take Damage card's notes: what armor did, then every Wound rolled. */
function damageNotes(outcome: DamageOutcome): string {
  const lines: string[] = [];
  if (outcome.absorbed) {
    const absorbedLine = translateOr(TEMPLATE_PHRASES.ArmorAbsorbed);
    lines.push(absorbedLine);
  }
  if (outcome.armorDestroyed) {
    const destroyedLine = translateOr(TEMPLATE_PHRASES.ArmorDestroyed);
    lines.push(destroyedLine);
  }
  for (const wound of outcome.woundRolls) {
    const line = woundLine(wound);
    lines.push(line);
  }
  const notes = lines.join("\n");
  return notes;
}

/** The Damage Type query, coded numerically so it can be read back from an inline roll. */
function damageTypeQuery(): string {
  const options = allDamageTypes
    .map((type, index) => `${titleCase(type)},${index}`)
    .join("|");
  return `?{Damage Type|${options}}`;
}

function readDamageType(index: number): DamageType {
  return allDamageTypes[index] ?? DamageTypes.Blunt;
}

function readDamageState(done: (state: DamageState) => void): void {
  getAttrs(
    ["health", "health_max", "wounds", "wounds_max", "armor_points", "damage_reduction"],
    (attrs) => {
      done({
        health: Number(attrs.health) || 0,
        healthMax: Number(attrs.health_max) || 0,
        wounds: Number(attrs.wounds) || 0,
        woundsMax: Number(attrs.wounds_max) || 0,
        armorPoints: Number(attrs.armor_points) || 0,
        damageReduction: Number(attrs.damage_reduction) || 0,
      });
    },
  );
}

function readWoundState(done: (state: {
  wounds: number;
  woundsMax: number;
}) => void): void {
  getAttrs(["wounds", "wounds_max"], (attrs) => {
    done({
      wounds: Number(attrs.wounds) || 0,
      woundsMax: Number(attrs.wounds_max) || 0,
    });
  });
}

/** Records each rolled Wound as a lasting Affliction row. */
function woundAfflictionRows(rolls: readonly WoundRollResult[]): Record<string, string> {
  const attrs: Record<string, string> = {};
  for (const wound of rolls) {
    const rowId = generateRowID();
    const row = `repeating_afflictions_${rowId}_affliction`;
    attrs[`${row}_name`] = `${wound.effect.severity} (${titleCase(wound.damageType)})`;
    attrs[`${row}_effect`] = wound.effect[wound.damageType];
    attrs[`${row}_settings`] = "0";
  }
  return attrs;
}

/** Roll20 Sheetworker: applies a queried hit through Armor, Health and Wounds. */
export function handleTakeDamage(): void {
  readDamageState((state) => {
    void rollTakeDamage(state);
  });
}

/** The roll half of Take Damage, once the current state has been read. */
async function rollTakeDamage(state: DamageState): Promise<void> {
  const capacity = Math.max(0, state.woundsMax - state.wounds);
  const diceFields = Array.from({ length: capacity }, (_, index) => `wound_roll_${index}`);

  const formula = [
    "&{template:ms}",
    `{{title=^{${TEMPLATE_PHRASES.TakeDamage}}}}`,
    "{{subtitle=@{character_name}}}",
    "{{damage=[[?{Damage?|0}]]}}",
    `{{damage_type=[[${damageTypeQuery()}]]}}`,
    ...diceFields.map((field) => `{{${field}=[[1d10-1]]}}`),
    "{{notes=[[0]]}} {{hasnotes=[[0]]}}",
    "{{alert=[[0]]}} {{hasalert=[[0]]}}",
  ].join(" ");

  const rollData = await startRoll(formula);
  const damageEntry = rollData.results.damage;
  const typeEntry = rollData.results.damage_type;
  if (damageEntry === undefined || typeEntry === undefined) return;

  const damageType = readDamageType(typeEntry.result);
  const woundDice = diceFields.map((field) => rollData.results[field]?.result ?? 0);
  const outcome = applyDamage(damageEntry.result, state, damageType, woundDice);

  const damageText = damageNotes(outcome);
  const alertText = outcome.requiresDeathSave ? MAX_WOUNDS_ALERT : "";

  const writeOutcome = (armorUpdates: Record<string, number>): void => {
    setAttrs({
      health: outcome.health,
      wounds: outcome.wounds,
      ...armorUpdates,
      ...woundAfflictionRows(outcome.woundRolls),
    });

    finishRoll(rollData.rollId, {
      notes: damageText,
      hasnotes: notesFlag(damageText),
      alert: alertText,
      hasalert: notesFlag(alertText),
    });
  };

  if (outcome.armorDestroyed) {
    destroyWornArmor(writeOutcome);
    return;
  }

  writeOutcome({});
}

/** Roll20 Sheetworker: deals a Wound directly, bypassing Health. */
export function handleTakeWound(): void {
  readWoundState((state) => {
    void rollTakeWound(state);
  });
}

/** The roll half of Take a Wound, once the current Wounds have been read. */
async function rollTakeWound(state: {
  wounds: number;
  woundsMax: number;
}): Promise<void> {
  const formula = [
    "&{template:ms}",
    `{{title=^{${TEMPLATE_PHRASES.TakeAWound}}}}`,
    "{{subtitle=@{character_name}}}",
    `{{damage_type=[[${damageTypeQuery()}]]}}`,
    "{{roll=[[1d10-1]]}}",
    "{{edge=[[0]]}}",
    "{{notes=[[0]]}} {{hasnotes=[[0]]}}",
    "{{alert=[[0]]}} {{hasalert=[[0]]}}",
  ].join(" ");

  const rollData = await startRoll(formula);
  const typeEntry = rollData.results.damage_type;
  const rollEntry = rollData.results.roll;
  if (typeEntry === undefined || rollEntry === undefined) return;

  const damageType = readDamageType(typeEntry.result);
  const outcome = applyWound(damageType, rollEntry.result, state);

  setAttrs({
    wounds: outcome.wounds,
    ...(outcome.woundRoll === undefined ? {} : woundAfflictionRows([outcome.woundRoll])),
  });

  const woundNote = outcome.woundRoll === undefined
    ? ""
    : woundLine(outcome.woundRoll);
  const alertText = outcome.requiresDeathSave ? MAX_WOUNDS_ALERT : "";

  finishRoll(rollData.rollId, {
    notes: woundNote,
    hasnotes: notesFlag(woundNote),
    alert: alertText,
    hasalert: notesFlag(alertText),
  });
}
