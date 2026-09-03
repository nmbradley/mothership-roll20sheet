import type { WoundEffect } from "#game/data/wounds.js";
import {
  DamageTypes, allDamageTypes, type DamageType,
} from "#game/enums.js";
import { titleCase } from "#game/text.js";

import { destroyWornArmor } from "./equipment";
import {
  TEMPLATE_PHRASES,
  notesFlag,
  translated,
} from "./rollTemplate";
import { woundEffect } from "./tables";

/**
 * Automated Damage and Wounds (#52).
 *
 * Two entry points: Take a Wound bypasses Health for an attack that deals a
 * Wound outright, and Take Damage runs an ordinary hit through Armor and
 * Health. Both are pure functions of their state and dice so the carryover
 * cascade below -- the hard part -- is testable without Roll20.
 */

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

/**
 * Applies Damage Reduction and the Armor Points threshold (#53) to one hit.
 *
 * Order of operations: DR is flat and always applies first (Advanced Battle
 * Dress reduces every hit before armor is even judged); the AP threshold is
 * then tested against what's left. Below AP, the hit is absorbed outright --
 * Health never sees it, and the armor stands. At or above AP, the armor is
 * destroyed (AP -> 0), but the *reduced* hit still passes through in full: 1e
 * does not spend AP down the way a ship's Hull absorbs a hit, it just breaks.
 */
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
    // Already-bare skin (armorPoints 0) has nothing to destroy.
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

/**
 * Applies one hit of incoming damage to Health, cascading Wounds as needed.
 *
 * Armor and DR are judged once, against the original hit -- the carryover a
 * wound cycle subtracts afterward is Health overflow, not a second hit, so it
 * is never run back through armor again.
 *
 * Reaching 0 Health or below gains a Wound, rolls the Wounds Table, and
 * resets Health to Maximum; whatever carries past zero is subtracted from
 * that fresh Maximum, repeating if it drops below zero again. The loop is
 * bounded by Wounds remaining under its Maximum rather than by Health
 * itself, which is what keeps it finite even when Maximum Health is 0: each
 * pass still costs exactly one Wound, and Wounds cannot climb past its own
 * Maximum.
 *
 * `woundDice` is consumed one d10 per Wound the cascade triggers -- pre-rolled
 * by the caller, since a pure function cannot itself ask Roll20 for more dice
 * mid-loop. A cascade that runs out of dice (more Wounds than were rolled for)
 * falls back to 0 rather than throwing, which the caller avoids in practice by
 * rolling one per Wound of headroom the character has left.
 */
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

/**
 * Take a Wound: bypasses Health entirely, for an attack that deals a Wound
 * directly. Always costs exactly one Wound, capped at Maximum so the tracker
 * never reads past it.
 */
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

/**
 * The prompt #52 owes the player once Wounds reach Maximum. A loud, untranslated
 * warning, matching how ships.ts's Stress/Panic alerts read (SHIP_STRESS_MESSAGE) --
 * #54 already implements the Death Save roll itself, this only has to say to make one.
 */
export const MAX_WOUNDS_ALERT = "MAXIMUM WOUNDS REACHED. MAKE A DEATH SAVE.";

/** The Take Damage card's notes: what armor did, then every Wound rolled. */
function damageNotes(outcome: DamageOutcome): string {
  const lines: string[] = [];
  if (outcome.absorbed) {
    const absorbedLine = translated(TEMPLATE_PHRASES.ArmorAbsorbed);
    lines.push(absorbedLine);
  }
  if (outcome.armorDestroyed) {
    const destroyedLine = translated(TEMPLATE_PHRASES.ArmorDestroyed);
    lines.push(destroyedLine);
  }
  for (const wound of outcome.woundRolls) {
    const line = woundLine(wound);
    lines.push(line);
  }
  const notes = lines.join("\n");
  return notes;
}

/**
 * The Damage Type query, coded numerically (like EDGE_QUERY) so it can sit
 * inside an inline roll and be read back from `results` -- a `?{}` outside
 * `[[...]]` only ever reaches chat as text, never the sheetworker.
 * Built from allDamageTypes rather than hand-listed, so the option order and
 * the index readDamageType() decodes it against can never drift apart.
 */
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

/**
 * Records a rolled Wound as a lasting Affliction (#55) -- the same repeating
 * section a failed Panic Check's Condition already lands in -- so a Wound's
 * penalty stays on record rather than only ever having appeared in chat.
 */
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

/**
 * Roll20 Sheetworker: Take Damage
 *
 * An explicit action rather than a change:health listener. Health is also
 * just a plain number a player can edit by hand -- healing, correcting a typo,
 * narration -- and a change: handler cannot tell that apart from a hit without
 * either mis-firing on those edits or re-entering itself the moment it writes
 * the resolved Health back. This sidesteps both: the query supplies the raw
 * hit, Armor/DR/Wounds resolve against it here, and Health is written back
 * exactly once, already final. It is also the only route that keeps this
 * PC-only mechanic off the NPC sheet, which shares the health/wounds/armor_points
 * attributes (see pcFields.ts) but has no Take Damage button of its own.
 */
export function handleTakeDamage(): void {
  readDamageState((state) => {
    void rollTakeDamage(state);
  });
}

/** The roll half of Take Damage, once the current state has been read. */
async function rollTakeDamage(state: DamageState): Promise<void> {
  // As many wound-table dice as Wounds has headroom for: the cascade in
  // applyDamage can never trigger more than that, since each pass costs one.
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
    "{{hasnotes=[[0]]}}",
    "{{alert=[[0]]}}",
  ].join(" ");

  const rollData = await startRoll(formula);
  const damageEntry = rollData.results.damage;
  const typeEntry = rollData.results.damage_type;
  if (damageEntry === undefined || typeEntry === undefined) return;

  const damageType = readDamageType(typeEntry.result);
  const woundDice = diceFields.map((field) => rollData.results[field]?.result ?? 0);
  const outcome = applyDamage(damageEntry.result, state, damageType, woundDice);

  // Armor is a function of the rows worn (#112), so a hit that breaks it
  // zeroes the worn Armor rows' own AP/DR rather than the pooled total --
  // the panel's totals fall out of that section's own recalculation.
  const damageText = damageNotes(outcome);

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
      alert: outcome.requiresDeathSave ? MAX_WOUNDS_ALERT : "",
    });
  };

  if (outcome.armorDestroyed) {
    destroyWornArmor(writeOutcome);
    return;
  }

  writeOutcome({});
}

/**
 * Roll20 Sheetworker: Take a Wound
 *
 * For attacks that deal a Wound directly, bypassing Health.
 */
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
    "{{notes=[[0]]}} {{hasnotes=[[0]]}}",
    "{{hasnotes=[[0]]}}",
    "{{alert=[[0]]}}",
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

  finishRoll(rollData.rollId, {
    notes: woundNote,
    hasnotes: notesFlag(woundNote),
    alert: outcome.requiresDeathSave ? MAX_WOUNDS_ALERT : "",
  });
}
