import {
  deathTable, woundsTable, type DeathEffect, type WoundEffect,
} from "#game/data/wounds.js";

/**
 * Rolling on a table is a different job from making a check: nothing succeeds
 * or fails, a die just indexes an entry. Death and Wounds are both read this
 * way, off the same die a check or a hit already rolled.
 */

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

/**
 * Looks a roll up on a table.
 *
 * Returns undefined rather than guessing when the roll falls outside the
 * table, so a mis-sized die shows up instead of silently reading the last row.
 */
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

/**
 * One row of the Death Table, indexed by a single d10 result.
 *
 * The table's own rows cover a range each (e.g. "5-9"), which rollOnTable's
 * exact-match lookup cannot index directly, so each row is expanded here to
 * one entry per roll it covers.
 */
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

/**
 * Looks a d10 result up on the Death Table.
 *
 * A Death Save is a plain table read, not a check: nothing succeeds or
 * fails, the die just picks a row.
 */
export function deathSaveEffect(roll: number): DeathEffect | undefined {
  const result = rollOnTable(DEATH_TABLE, roll);
  return result?.entry.effect;
}

/**
 * The Wounds Table, indexed by a single d10 result (0-9).
 *
 * Unlike the Death Table, every row answers to exactly one roll already, so
 * this needs no expanding the way DEATH_TABLE does.
 */
export const WOUNDS_TABLE: RollTable<WoundEffect> = {
  name: "Wounds",
  entries: woundsTable,
  rollOf: (entry) => entry.roll,
};

/**
 * Looks a d10 result up on the Wounds Table.
 *
 * A plain table read, like a Death Save: the die picks a row, the caller's
 * chosen damage type then picks which of that row's columns applies.
 */
export function woundEffect(roll: number): WoundEffect | undefined {
  const result = rollOnTable(WOUNDS_TABLE, roll);
  return result?.entry;
}
