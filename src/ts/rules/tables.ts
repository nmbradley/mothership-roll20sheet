import { panicTable, type PanicEffect } from "#game/data/panic.js";
import { deathTable, type DeathEffect } from "#game/data/wounds.js";

import {
  Comparisons,
  Edges,
  isFailure,
  makeCheck,
  type CheckResult,
  type Edge,
} from "./rolls";

/**
 * Rolling on a table is a different job from making a check: nothing succeeds
 * or fails, a die just indexes an entry. Panic is both — a check whose failure
 * sends you to the Panic Table — so it composes the two rather than blurring
 * them together.
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

export const PANIC_TABLE: RollTable<PanicEffect> = {
  name: "Panic",
  entries: panicTable,
  rollOf: (entry) => entry.roll,
};

/**
 * One row of the Death Table, indexed by a single d10 result.
 *
 * The table's own rows cover a range each (e.g. "5-9"), which rollOnTable's
 * exact-match lookup cannot index directly, so each row is expanded here to
 * one entry per roll it covers -- the way PANIC_TABLE already has one entry
 * per roll.
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

export type PanicCheck = {
  check: CheckResult;
  /** The table entry, present only where the check failed. */
  effect?: PanicEffect;
};

/**
 * Resolves a Panic Check.
 *
 * The Panic Die is a d20 rolled *over* current Stress. Failing sends you to the
 * Panic Table, read from the same die, so no second roll is needed.
 */
export function makePanicCheck(
  stress: number,
  rolls: readonly number[],
  edge: Edge = Edges.None,
): PanicCheck {
  const check = makeCheck({
    name: "Panic Check",
    target: stress,
    rolls,
    edge,
    comparison: Comparisons.RollOver,
  });

  const hasPanicked = isFailure(check.outcome);
  if (!hasPanicked) return { check };

  const result = rollOnTable(PANIC_TABLE, check.roll);
  if (result === undefined) return { check };
  return {
    check,
    effect: result.entry,
  };
}
