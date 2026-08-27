import { allSaves, allStats } from "#game/enums.js";
import { titleCase } from "#game/text.js";

import {
  checkComputed,
  checkTemplate,
  deathSaveComputed,
  deathSaveTemplate,
  panicComputed,
  panicTemplate,
  TEMPLATE_PHRASES,
} from "./rollTemplate";
import {
  isFailure,
  makeCheck,
  resolveEdge,
  SKILL_BONUS,
  type CheckRequest,
  type CheckResult,
  type Edge,
} from "./rolls";
import { deathSaveEffect, makePanicCheck } from "./tables";

/**
 * Sheetworker entry points for rolling.
 *
 * These sit behind action buttons rather than roll buttons: the dice go out
 * through startRoll, the rules grade them, and finishRoll fills the verdict in.
 * The roll template therefore holds no comparison logic at all.
 */

/**
 * Attributes with a check button, each rolling under the same-named attribute.
 *
 * Exported so the translation generator can derive the `^{...}` keys these
 * produce, rather than the key list drifting from the buttons.
 */
export const CHECK_ATTRIBUTES = [
  ...allStats,
  ...allSaves,
  "instinct",
] as const;

/** The translation key a check button uses. */
export function checkKey(attribute: string): string {
  return `${titleCase(attribute)} Check`;
}

/** Fixed vocabulary the roll templates translate through `^{...}`. */
/** Ship checks are rolled from ships.ts rather than a check button. */
export const SHIP_CHECKS = ["systems", "thrusters", "battle"] as const;

function rollPhrases(): readonly string[] {
  const phrases: string[] = [];
  for (const phrase of Object.values(TEMPLATE_PHRASES)) {
    phrases.push(phrase);
  }
  for (const attribute of SHIP_CHECKS) {
    const phrase = checkKey(attribute);
    phrases.push(phrase);
  }
  return phrases;
}

export const ROLL_PHRASES: readonly string[] = rollPhrases();

/** The characters `?{...}` reserves for its own structure. */
const QUERY_SYNTAX = /[|,{}]/g;

/** Asked once as a roll query, so the player answers in place. */
export const EDGE_QUERY = "?{Advantage/Disadvantage|Normal,0|Advantage,1|Disadvantage,2}";
const MODIFIER_QUERY = "?{Modifier?|0}";

/**
 * A translation, with the characters a roll query treats as syntax removed.
 *
 * A query reads `?{prompt|label,value|label,value}`, so text carrying any of
 * `| , { }` splits the prompt, invents an option or closes the query early --
 * and a malformed query takes the whole roll down with it. A translator has no
 * reason to know that, so the text is cleaned here rather than trusted.
 *
 * `?` is left alone: only `?{` opens a query, and dropping the brace is enough.
 */
function queryText(key: string): string {
  const translated = getTranslationByKey(key);
  const cleaned = translated.replace(QUERY_SYNTAX, "").trim();
  if (cleaned !== "") return cleaned;

  // A translation of nothing but syntax leaves the English standing.
  const fallback = key.replace(QUERY_SYNTAX, "").trim();
  return fallback;
}

/** Prompt and option labels the skill query asks through. */
export const SKILL_PROMPT = "Apply Skill?";
export const UNTRAINED_LABEL = "Untrained";

/**
 * Asked before a Stat or Save check: training raises the number rolled under.
 *
 * The text is translated here rather than with `^{...}`. Roll20 resolves those
 * in the sheet and not inside a query, so the closing brace of `^{...}` would
 * end the query early and take the roll with it. A roll button would have to
 * park the finished string in an attribute for that reason; these rolls are
 * made from a sheetworker, so the lookup happens where the string is built.
 *
 * Called per roll rather than once at load: translations are not in place when
 * this module is first evaluated.
 *
 * Values come from SKILL_BONUS so they cannot drift from the rules.
 */
export function skillQuery(): string {
  const untrained = queryText(UNTRAINED_LABEL);
  const options: string[] = [`${untrained},0`];

  for (const [level, bonus] of Object.entries(SKILL_BONUS)) {
    const name = titleCase(level);
    const label = queryText(name);
    options.push(`${label},${String(bonus)}`);
  }

  const choices = options.join("|");
  const prompt = queryText(SKILL_PROMPT);
  return `?{${prompt}|${choices}}`;
}

const EDGE_NORMAL = 0;
const EDGE_ADVANTAGE = 1;

/** Checks and saves roll a d100 reading 00-99. */
const D100 = "1d100-1";

type RolledDice = {
  rolls: readonly number[];
  edge: Edge;
};

/**
 * Reads the dice back off a started roll.
 *
 * Both dice are always rolled; the edge decides whether the second one counts,
 * which is why the query travels with them.
 */
function readDice(results: RollResults): RolledDice {
  const first = results["roll"]?.result ?? 0;
  const second = results["roll2"]?.result ?? first;
  const answer = results["edge"]?.result ?? EDGE_NORMAL;

  const hasAdvantage = answer === EDGE_ADVANTAGE;
  const hasDisadvantage = answer !== EDGE_NORMAL && !hasAdvantage;

  return {
    rolls: [first, second],
    edge: resolveEdge(hasAdvantage, hasDisadvantage),
  };
}

/** The target the dice were actually measured against. */
function readTarget(results: RollResults): number {
  const target = results["target"]?.result ?? 0;
  return target;
}

export type CheckOptions = {
  /** Display name, for a roll named by player data such as a weapon. */
  name?: string;
  /** Translation key, for fixed vocabulary such as "strength check". */
  i18nKey?: string;
  /**
   * Dice expression for the target, e.g. "@{strength}". The bonus query is
   * appended here so the total is rolled server-side and comes back computed.
   */
  target: string;
  /** Query asked for the bonus; a plain modifier unless a skill can apply. */
  bonus?: string;
  /** Also sends the roll to Roll20's Turn Tracker (#50's Initiative rolls). */
  sendToTracker?: boolean;
};

/**
 * Rolls a stat check, save or attack.
 *
 * All three are the same roll against a different target, which is why they
 * share one entry point. Returns the graded CheckResult so a caller that
 * needs to act on it -- granting Stress on a failure, say -- can do so once
 * the roll is resolved, without reinventing the grading itself.
 */
export async function rollCheck(options: CheckOptions): Promise<CheckResult> {
  const templateOptions = {
    target: `${options.target}+${options.bonus ?? MODIFIER_QUERY}`,
    die: D100,
    ...(options.name === undefined ? {} : { name: options.name }),
    ...(options.i18nKey === undefined ? {} : { i18nKey: options.i18nKey }),
    ...(options.sendToTracker ? { sendToTracker: true } : {}),
  };

  const template = `${checkTemplate(templateOptions)} {{edge=[[${EDGE_QUERY}]]}}`;
  const roll = await startRoll(template);
  const dice = readDice(roll.results);

  const request: CheckRequest = {
    name: options.name ?? "",
    target: readTarget(roll.results),
    rolls: dice.rolls,
    edge: dice.edge,
  };
  if (options.i18nKey !== undefined) request.i18nKey = options.i18nKey;

  const check = makeCheck(request);
  const computed = checkComputed(check);
  finishRoll(roll.rollId, computed);
  return check;
}

/**
 * Rolls Initiative for the optional Speed Check Initiative rule (#50): a
 * Speed Check whose result also lands in Roll20's Turn Tracker.
 */
export async function rollPCInitiative(): Promise<CheckResult> {
  const check = await rollCheck({
    i18nKey: TEMPLATE_PHRASES.Initiative,
    target: "@{speed}",
    bonus: skillQuery(),
    sendToTracker: true,
  });
  return check;
}

/**
 * Rolls Initiative for an NPC: an Instinct Check, since NPCs have no Speed
 * stat, whose result also lands in Roll20's Turn Tracker.
 */
export async function rollNPCInitiative(): Promise<CheckResult> {
  const check = await rollCheck({
    i18nKey: TEMPLATE_PHRASES.Initiative,
    target: "@{instinct}",
    sendToTracker: true,
  });
  return check;
}

/**
 * Applies a Stress change and writes it back, clamped to the given bounds.
 *
 * stress_min and stress_max are not declared attributes yet (#42 owns that),
 * so the bounds travel with the call rather than being read here; once they
 * exist, a caller passes them straight through from getAttrs. This is the one
 * place that writes Stress so the several checks that grant or reduce it
 * (#47, #48, #51) agree on how the clamp works.
 */
export function applyStressDelta(current: number, delta: number, min: number, max: number): void {
  const floored = Math.max(min, current + delta);
  const next = Math.min(max, floored);
  setAttrs({ stress: next });
}

/**
 * Rolls a Panic Check.
 *
 * The Panic Die goes over current Stress, and failing reads the Panic Table off
 * the same die.
 */
export async function rollPanicCheck(): Promise<void> {
  const template = `${panicTemplate()} {{edge=[[${EDGE_QUERY}]]}}`;
  const roll = await startRoll(template);
  const dice = readDice(roll.results);

  const stress = readTarget(roll.results);
  const panic = makePanicCheck(stress, dice.rolls, dice.edge);
  const computed = panicComputed(panic);
  finishRoll(roll.rollId, computed);
}

/**
 * 1e's Stress bounds. stress_min and stress_max are not declared attributes
 * yet (#42 owns that); these stand in until it does.
 */
const STRESS_MIN = 2;
const STRESS_MAX = 20;

/**
 * Ticks Stress up or down by 1 from the Status Report's +/- buttons (#18),
 * without a roll behind it. Reads the current value fresh via getAttrs and
 * writes through applyStressDelta, so a plain tick is clamped the same way as
 * every roll that changes Stress.
 */
export function adjustStress(delta: number): void {
  getAttrs(["stress"], (attrs) => {
    const stress = Number(attrs.stress);
    applyStressDelta(stress, delta, STRESS_MIN, STRESS_MAX);
  });
}

/** A Rest Save targets whichever Save reads lowest -- the player has no say in it. */
export function worstSave(sanity: number, fear: number, body: number): number {
  const lowest = Math.min(sanity, fear, body);
  return lowest;
}

/**
 * How a Rest Save changes Stress: success heals by the ones digit of the roll
 * (24 heals 4), failure costs a flat 1. Reads straight off CheckResult so the
 * digit trick is testable without Roll20.
 */
export function restSaveStressDelta(check: CheckResult): number {
  const hasFailed = isFailure(check.outcome);
  if (hasFailed) return 1;

  const onesDigit = check.roll % 10;
  return -onesDigit;
}

/**
 * Rolls a Rest Save.
 *
 * The target is not player-chosen: it is whichever of Sanity, Fear or Body
 * currently reads lowest, read fresh via getAttrs rather than assumed.
 */
export async function rollRestSave(): Promise<void> {
  const attrs = await new Promise<Record<string, string>>((resolve) => {
    getAttrs(["sanity", "fear", "body", "stress"], resolve);
  });

  const sanity = Number(attrs.sanity);
  const fear = Number(attrs.fear);
  const body = Number(attrs.body);
  const target = worstSave(sanity, fear, body);

  const check = await rollCheck({
    i18nKey: TEMPLATE_PHRASES.RestSave,
    target: String(target),
  });

  const delta = restSaveStressDelta(check);
  const stress = Number(attrs.stress);
  applyStressDelta(stress, delta, STRESS_MIN, STRESS_MAX);
}

/**
 * Rolls a Death Save.
 *
 * A table read, not a check: the d10 just picks a row off the Death Table.
 */
export async function rollDeathSave(): Promise<void> {
  const template = deathSaveTemplate();
  const roll = await startRoll(template);
  const value = roll.results["roll"]?.result ?? 0;
  const effect = deathSaveEffect(value);
  const computed = deathSaveComputed(effect);
  finishRoll(roll.rollId, computed);
}
