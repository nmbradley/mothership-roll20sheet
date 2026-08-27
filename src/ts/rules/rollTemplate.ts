import type { DeathEffect } from "#game/data/wounds.js";

import {
  Edges,
  Outcomes,
  isFailure,
  type CheckResult,
  type Outcome,
} from "./rolls";
import type { PanicCheck } from "./tables";

/**
 * Builds the two halves of a custom-parsed roll.
 *
 * `startRoll` needs the complete template up front, so anything the rules work
 * out afterwards has to be a `[[0]]` placeholder that `finishRoll` fills in by
 * name. This module owns both halves so the field names cannot drift apart.
 */

const TEMPLATE = "ms";

/** Placeholders filled by finishRoll once the dice are graded. */
export const COMPUTED = {
  Counted: "counted",
  Result: "result",
  Rank: "rank",
  Notes: "notes",
} as const;

/**
 * The outcome as a number, so the template can style each one.
 *
 * Roll templates cannot compare text, but `rollTotal()` compares a roll to a
 * number, which is how a critical gets its own treatment in chat.
 */
const RANKS: Record<Outcome, number> = {
  [Outcomes.CriticalFailure]: 0,
  [Outcomes.Failure]: 1,
  [Outcomes.Success]: 2,
  [Outcomes.CriticalSuccess]: 3,
};

/**
 * Marks text as a translation key.
 *
 * Roll20 resolves `^{key}` inside a roll macro against translation.json, which
 * is the only way to translate text that reaches chat.
 */
export function translated(key: string): string {
  return `^{${key}}`;
}

type Field = [key: string, value: string];

function render(fields: readonly Field[]): string {
  const parts = [`&{template:${TEMPLATE}}`];
  for (const [key, value] of fields) {
    if (value === "") continue;
    parts.push(`{{${key}=${value}}}`);
  }
  const rendered = parts.join(" ");
  return rendered;
}

export type CheckTemplateOptions = {
  /** Display name, used as-is. */
  name?: string;
  /** Translation key, preferred over `name` where the vocabulary is fixed. */
  i18nKey?: string;
  /** Dice expression for the target, e.g. "@{strength}+?{Modifier?|0}". */
  target: string;
  /** Dice expression rolled twice, so an edge has a second die to choose from. */
  die: string;
  /**
   * Also drops the roll into Roll20's Turn Tracker via `&{tracker}` (#50's
   * Initiative rolls). Only the first die carries it: both dice are always
   * rolled here regardless of the edge answer, and Roll20 applies each
   * `&{tracker}` in the message as it evaluates -- putting it on both would
   * let the second, possibly-discarded die silently overwrite the tracker
   * value the first one just set. A static macro cannot know ahead of the
   * roll which die an edge will end up choosing, so this favours the plain,
   * no-edge case, which is what Initiative is rolled for almost always.
   */
  sendToTracker?: boolean;
};

/**
 * The template sent to startRoll.
 *
 * Both dice are always rolled and both are shown; which one counted is filled
 * in afterwards, since only the rules know what the edge chose.
 */
export function checkTemplate(options: CheckTemplateOptions): string {
  const label = options.i18nKey === undefined
    ? options.name ?? ""
    : translated(options.i18nKey);
  const rollDie = options.sendToTracker ? `${options.die} &{tracker}` : options.die;

  const template = render([
    ["name", label],
    ["character_name", "@{character_name}"],
    ["roll", `[[${rollDie}]]`],
    ["roll2", `[[${options.die}]]`],
    ["target", `[[${options.target}]]`],
    [COMPUTED.Counted, "[[0]]"],
    [COMPUTED.Result, "[[0]]"],
    [COMPUTED.Rank, "[[0]]"],
    [COMPUTED.Notes, "[[0]]"],
  ]);
  return template;
}

/** The values finishRoll substitutes into the placeholders above. */
export function checkComputed(check: CheckResult): Record<string, string | number> {
  const computed: Record<string, string | number> = {
    [COMPUTED.Counted]: describeCounted(check),
    [COMPUTED.Result]: translated(check.outcome),
    [COMPUTED.Rank]: RANKS[check.outcome],
    [COMPUTED.Notes]: panicWarning(check),
  };
  return computed;
}

/** The die that counted, annotated with the edge that chose it. */
function describeCounted(check: CheckResult): string {
  if (check.edge === Edges.Advantage) return `${check.roll} [+]`;
  if (check.edge === Edges.Disadvantage) return `${check.roll} [-]`;
  const plain = String(check.roll);
  return plain;
}

/**
 * Fixed phrases the templates translate through `^{...}`.
 *
 * They live here, where they are used, so the translation key list can import
 * them rather than restate them -- a second copy is a second thing to keep in
 * step, and it did not stay in step.
 */
export const TEMPLATE_PHRASES = {
  PanicCheck: "Panic Check",
  KeptItTogether: "Kept It Together",
  PanicWarning: "Critical Failure: Make a Panic Check",
  RestSave: "Rest Save",
  DeathSave: "Death Save",
  ArmorDestroyed: "Armor Destroyed",
  Initiative: "Initiative",
  TakeDamage: "Take Damage",
  TakeAWound: "Take a Wound",
  ArmorAbsorbed: "Absorbed by Armor",
} as const;

/** A Critical Failure on a check forces a Panic Check; say so in chat. */
function panicWarning(check: CheckResult): string {
  if (!check.triggersPanic) return "";
  const warning = translated(TEMPLATE_PHRASES.PanicWarning);
  return warning;
}

/** The template sent to startRoll for a Panic Check. */
export function panicTemplate(): string {
  const template = render([
    ["name", translated(TEMPLATE_PHRASES.PanicCheck)],
    ["character_name", "@{character_name}"],
    ["roll", "[[1d20]]"],
    ["roll2", "[[1d20]]"],
    ["target", "[[@{stress}]]"],
    [COMPUTED.Counted, "[[0]]"],
    [COMPUTED.Result, "[[0]]"],
    [COMPUTED.Rank, "[[0]]"],
    [COMPUTED.Notes, "[[0]]"],
  ]);
  return template;
}

/** The values finishRoll substitutes into a Panic Check. */
export function panicComputed(panic: PanicCheck): Record<string, string | number> {
  const { check, effect } = panic;
  const hasPanicked = isFailure(check.outcome);

  const survived = translated(TEMPLATE_PHRASES.KeptItTogether);

  const computed: Record<string, string | number> = {
    [COMPUTED.Counted]: describeCounted(check),
    [COMPUTED.Result]: effect === undefined ? survived : effect.name,
    [COMPUTED.Rank]: RANKS[check.outcome],
    [COMPUTED.Notes]: hasPanicked && effect !== undefined ? effect.effect : "",
  };
  return computed;
}

/**
 * The template sent to startRoll for a Death Save.
 *
 * Zero-indexed for the same reason D100 is (see rolls.ts): the Death Table's
 * rows read 0-9, so a physical 1-10 d10 is read back down by one.
 */
export function deathSaveTemplate(): string {
  const template = render([
    ["name", translated(TEMPLATE_PHRASES.DeathSave)],
    ["character_name", "@{character_name}"],
    ["roll", "[[1d10-1]]"],
    [COMPUTED.Notes, "[[0]]"],
  ]);
  return template;
}

/** The values finishRoll substitutes into a Death Save. */
export function deathSaveComputed(
  effect: DeathEffect | undefined,
): Record<string, string | number> {
  const computed: Record<string, string | number> = {
    [COMPUTED.Notes]: effect?.result ?? "",
  };
  return computed;
}
