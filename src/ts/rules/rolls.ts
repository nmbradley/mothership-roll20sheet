import type { EntryOf } from "#game/enums.js";

/** Grading d100 rolls against a target, and the tables a failure sends you to. */

export const Outcomes = {
  CriticalSuccess: "Critical Success",
  Success: "Success",
  Failure: "Failure",
  CriticalFailure: "Critical Failure",
} as const;
export type Outcome = EntryOf<typeof Outcomes>;

/** Situational advantage, as one value since Advantage and Disadvantage cancel out. */
export const Edges = {
  Advantage: "advantage",
  Disadvantage: "disadvantage",
  None: "none",
} as const;
export type Edge = EntryOf<typeof Edges>;

/** Which direction a roll has to go: under its target, or over it. */
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

/** The reading at which a roll-under check fails whatever its target says. */
const AUTO_FAIL_THRESHOLD = 90;

/** Whether a d100 shows doubles (00, 11, 22 and so on), which makes a roll critical. */
export function isDoubles(roll: number): boolean {
  const tens = Math.floor(roll / 10);
  const ones = roll % 10;
  return tens === ones;
}

/** Combines the situational flags, which cancel each other out (§19.1). */
export function resolveEdge(
  hasAdvantage: boolean,
  hasDisadvantage: boolean,
  hasStandingDisadvantage = false,
): Edge {
  const isDisadvantaged = hasDisadvantage || hasStandingDisadvantage;
  if (hasAdvantage === isDisadvantaged) return Edges.None;
  return hasAdvantage ? Edges.Advantage : Edges.Disadvantage;
}

/** Picks the die that counts: lowest when rolling under, highest when rolling over. */
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

/** Grades a roll against its target, including the readings that ignore it. */
export function outcomeOf(roll: number, target: number, comparison: Comparison): Outcome {
  if (roll === ALWAYS_CRITICAL_SUCCESS) return Outcomes.CriticalSuccess;
  if (roll === ALWAYS_CRITICAL_FAILURE) return Outcomes.CriticalFailure;

  const isUnder = comparison === Comparisons.RollUnder;
  if (isUnder && roll >= AUTO_FAIL_THRESHOLD) return Outcomes.Failure;

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
  /** Translation key for the name; absent when the name comes from player data. */
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
  /** Whether a Critical Failure on this check forces a Panic Check. */
  triggersPanic: boolean;
};

/** Resolves any roll-under check: Stat Checks, Saves and attacks alike. */
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

/** What a graded check costs the character who rolled it. */
export type CheckGrade = {
  stressDelta: number;
  panics: boolean;
};

/** A check whose Stress and Panic fall on somebody else, as a Ship's crew bear its checks. */
export const NO_CONSEQUENCES: CheckGrade = {
  stressDelta: 0,
  panics: false,
};

/** 18.1 and 18.2: a failed Stat Check or Save gains 1 Stress. */
function failureStress(check: CheckResult): number {
  return isFailure(check.outcome) ? 1 : 0;
}

/** Grades a check into the Stress a failure costs and the Panic a Critical Failure forces. */
export function gradeCheck(
  check: CheckResult,
  stress: (check: CheckResult) => number = failureStress,
): CheckGrade {
  return {
    stressDelta: stress(check),
    panics: check.triggersPanic,
  };
}

/** Grades a single roll-under check of one die, with no edge and no bonuses. */
export function evaluateRoll(roll: number, target: number): Outcome {
  const outcome = outcomeOf(roll, target, Comparisons.RollUnder);
  return outcome;
}
