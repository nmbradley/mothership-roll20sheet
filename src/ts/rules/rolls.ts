import type { EntryOf } from "#game/enums.js";

/**
 * Mothership 1e resolves almost everything by rolling a d100 and trying to get
 * under a target. This module covers that, the handful of rolls that go the
 * other way, and the tables a failure sends you to.
 */

export const Outcomes = {
  CriticalSuccess: "Critical Success",
  Success: "Success",
  Failure: "Failure",
  CriticalFailure: "Critical Failure",
} as const;
export type Outcome = EntryOf<typeof Outcomes>;

/**
 * Situational advantage. Both at once cancel out, so this is one value rather
 * than a pair of flags.
 */
export const Edges = {
  Advantage: "advantage",
  Disadvantage: "disadvantage",
  None: "none",
} as const;
export type Edge = EntryOf<typeof Edges>;

/**
 * Which direction a roll has to go.
 *
 * Stat Checks, Saves and attacks roll under their target; a Panic Check rolls
 * over current Stress. The direction decides both success and, under an edge,
 * which of the two dice counts.
 */
export const Comparisons = {
  RollUnder: "under",
  RollOver: "over",
} as const;
export type Comparison = EntryOf<typeof Comparisons>;

/** Skill bonuses, added to the target before rolling. */
export const SKILL_BONUS = {
  trained: 10,
  expert: 15,
  master: 20,
} as const;

/** A d100 always reads 00-99, so these are the extremes of the die. */
const ALWAYS_CRITICAL_SUCCESS = 0;
const ALWAYS_CRITICAL_FAILURE = 99;

/**
 * Doubles on a d100: 00, 11, 22 and so on.
 *
 * Doubles are what make a roll critical, in whichever direction it already
 * went.
 */
export function isDoubles(roll: number): boolean {
  const tens = Math.floor(roll / 10);
  const ones = roll % 10;
  return tens === ones;
}

/** Combines the two situational flags, which cancel each other out. */
export function resolveEdge(hasAdvantage: boolean, hasDisadvantage: boolean): Edge {
  if (hasAdvantage === hasDisadvantage) return Edges.None;
  return hasAdvantage ? Edges.Advantage : Edges.Disadvantage;
}

/**
 * Picks the die that counts.
 *
 * "Take the best result" depends on which way the roll goes: the lowest die is
 * best when rolling under, the highest when rolling over.
 */
export function selectRoll(
  rolls: readonly number[],
  edge: Edge,
  comparison: Comparison,
): number {
  const first = rolls[0] ?? 0;
  if (edge === Edges.None || rolls.length < 2) return first;

  const second = rolls[1] ?? first;
  const low = Math.min(first, second);
  const high = Math.max(first, second);

  const isLowBetter = comparison === Comparisons.RollUnder;
  const isAdvantage = edge === Edges.Advantage;
  if (isAdvantage) return isLowBetter ? low : high;
  return isLowBetter ? high : low;
}

/**
 * Grades a roll against its target.
 *
 * A roll of 00 is always a Critical Success and 99 always a Critical Failure,
 * whatever the target says.
 */
export function outcomeOf(roll: number, target: number, comparison: Comparison): Outcome {
  if (roll === ALWAYS_CRITICAL_SUCCESS) return Outcomes.CriticalSuccess;
  if (roll === ALWAYS_CRITICAL_FAILURE) return Outcomes.CriticalFailure;

  const isUnder = comparison === Comparisons.RollUnder;
  const isSuccess = isUnder ? roll <= target : roll > target;
  const isCritical = isDoubles(roll);

  if (isCritical) return isSuccess ? Outcomes.CriticalSuccess : Outcomes.CriticalFailure;
  return isSuccess ? Outcomes.Success : Outcomes.Failure;
}

/** True where the outcome counts as any kind of success. */
export function isSuccess(outcome: Outcome): boolean {
  return outcome === Outcomes.Success || outcome === Outcomes.CriticalSuccess;
}

/** True where the outcome counts as any kind of failure. */
export function isFailure(outcome: Outcome): boolean {
  return !isSuccess(outcome);
}

export type CheckRequest = {
  /** Display name, e.g. "Strength Check" or "Body Save". */
  name: string;
  /**
   * Translation key for the name. Fixed vocabulary like "strength check" has
   * one; a name taken from an attribute, such as a weapon's, must not, since
   * player data is never translated.
   */
  i18nKey?: string;
  /** The number to beat, before any skill bonus. */
  target: number;
  /** One die, or two when there is an edge. */
  rolls: readonly number[];
  edge?: Edge;
  comparison?: Comparison;
  /** Added to the target, giving a higher number to roll under. */
  skillBonus?: number;
  /** Situational modifier the player entered. */
  modifier?: number;
};

export type CheckResult = {
  name: string;
  i18nKey?: string;
  /** The target actually rolled against, after bonuses. */
  target: number;
  /** The die that counted. */
  roll: number;
  /** The die that did not count, where an edge discarded one. */
  discarded?: number;
  edge: Edge;
  comparison: Comparison;
  outcome: Outcome;
  /**
   * A Critical Failure on a Stat Check or Save forces a Panic Check. Rolling
   * over does not, so a failed Panic Check cannot cascade into another.
   */
  triggersPanic: boolean;
};

/**
 * Resolves any roll-under check: Stat Checks, Saves and attacks alike.
 *
 * They differ only in what supplies the target, so the caller works that out
 * and this decides what the dice mean.
 */
export function makeCheck(request: CheckRequest): CheckResult {
  const edge = request.edge ?? Edges.None;
  const comparison = request.comparison ?? Comparisons.RollUnder;

  const skillBonus = request.skillBonus ?? 0;
  const modifier = request.modifier ?? 0;
  const target = request.target + skillBonus + modifier;

  const roll = selectRoll(request.rolls, edge, comparison);
  const outcome = outcomeOf(roll, target, comparison);

  const isCriticalFailure = outcome === Outcomes.CriticalFailure;
  const isUnder = comparison === Comparisons.RollUnder;

  const result: CheckResult = {
    name: request.name,
    target,
    roll,
    edge,
    comparison,
    outcome,
    triggersPanic: isCriticalFailure && isUnder,
  };

  if (request.i18nKey !== undefined) result.i18nKey = request.i18nKey;

  const discarded = discardedRoll(request.rolls, roll, edge);
  if (discarded !== undefined) result.discarded = discarded;
  return result;
}

/** The die an edge threw away, for the template to show alongside the result. */
function discardedRoll(
  rolls: readonly number[],
  counted: number,
  edge: Edge,
): number | undefined {
  if (edge === Edges.None || rolls.length < 2) return undefined;
  const first = rolls[0];
  const second = rolls[1];
  if (first === undefined || second === undefined) return undefined;
  return first === counted ? second : first;
}

/**
 * Grades a single roll-under check.
 *
 * A shorthand for the common case of one die, no edge and no bonuses, which is
 * how the ship checks resolve.
 */
export function evaluateRoll(roll: number, target: number): Outcome {
  const outcome = outcomeOf(roll, target, Comparisons.RollUnder);
  return outcome;
}
