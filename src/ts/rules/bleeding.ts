/** Bleeding (32.2): a cumulative per-round rate, independent of the Armor/DR path. */

const BLEEDING_INCREASE = /Bleeding \+(\d+)/;

/** Adds a Bleeding gain onto the current rate; cumulative, never below zero. */
export function addBleeding(current: number, amount: number): number {
  const next = Math.max(0, current + amount);
  return next;
}

/** The amount a Wounds Table result's own text adds to Bleeding, 0 where it names none. */
export function bleedingIncrease(effectText: string): number {
  const match = BLEEDING_INCREASE.exec(effectText);
  if (match === null) return 0;
  return Number(match[1]) || 0;
}
