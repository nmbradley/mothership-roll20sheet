import {
  deathTable, woundsTable, type DeathEffect, type WoundEffect,
} from "#game/data/wounds.js";

/** Reading a die result off a table, as Death and Wounds are both read. */

/** Any table indexed by a die result. */
export type RollTable<TEntry> = {
  name: string;
  /** Entries in roll order. */
  entries: readonly TEntry[];
  /** The roll each entry answers to. */
  rollOf: (entry: TEntry) => number;
};

export type TableResult<TEntry> = {
  table: string;
  roll: number;
  entry: TEntry;
};

/** Looks a roll up on a table, returning undefined when it falls outside. */
export function rollOnTable<TEntry>(
  table: RollTable<TEntry>,
  roll: number,
): TableResult<TEntry> | undefined {
  for (const entry of table.entries) {
    const at = table.rollOf(entry);
    if (at === roll) {
      return {
        table: table.name,
        roll,
        entry,
      };
    }
  }
  return undefined;
}

/** One row of the Death Table, expanded to one entry per roll it covers. */
type DeathRow = {
  roll: number;
  effect: DeathEffect;
};

function expandDeathRows(rows: readonly DeathEffect[]): readonly DeathRow[] {
  const expanded: DeathRow[] = [];
  for (const effect of rows) {
    const [low, high] = effect.roll.split("-").map(Number);
    const start = low ?? 0;
    const end = high ?? start;
    for (let roll = start; roll <= end; roll++) {
      expanded.push({
        roll,
        effect,
      });
    }
  }
  return expanded;
}

export const DEATH_TABLE: RollTable<DeathRow> = {
  name: "Death",
  entries: expandDeathRows(deathTable),
  rollOf: (row) => row.roll,
};

/** Looks a d10 result up on the Death Table. */
export function deathSaveEffect(roll: number): DeathEffect | undefined {
  const result = rollOnTable(DEATH_TABLE, roll);
  return result?.entry.effect;
}

/** The Wounds Table, indexed by a single d10 result (0-9). */
export const WOUNDS_TABLE: RollTable<WoundEffect> = {
  name: "Wounds",
  entries: woundsTable,
  rollOf: (entry) => entry.roll,
};

/** Looks a d10 result up on the Wounds Table. */
export function woundEffect(roll: number): WoundEffect | undefined {
  const result = rollOnTable(WOUNDS_TABLE, roll);
  return result?.entry;
}
