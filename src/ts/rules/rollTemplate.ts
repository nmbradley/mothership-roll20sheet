import type { DeathEffect } from "#game/data/wounds.js";

import {
  Outcomes,
  isFailure,
  type CheckResult,
  type Outcome,
} from "./rolls";
import { translateOr } from "./translation";

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
  Used: "used",
  HasNotes: "hasnotes",
  Verdict: "verdict",
  VerdictClass: "verdictclass",
  Rank: "rank",
  Notes: "notes",
  Skill: "skill",
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
 * The outcome's class suffix, e.g. "critical-success".
 *
 * Carried in the payload for the new field vocabulary, but the template
 * itself still styles the verdict off the proven `{{#rollTotal() computed::rank
 * N}}` blocks rather than interpolating this into a class name -- see
 * `sheet-ms-verdict--{{verdictclass}}` in ms.html's history for why.
 */
const VERDICT_CLASSES: Record<Outcome, string> = {
  [Outcomes.CriticalFailure]: "critical-failure",
  [Outcomes.Failure]: "failure",
  [Outcomes.Success]: "success",
  [Outcomes.CriticalSuccess]: "critical-success",
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

/**
 * Whether the notes box has anything to show, as 1 or 0.
 *
 * A roll template section tests the *original* roll, not the computed value,
 * and every computed field is declared as the placeholder `[[0]]` -- so
 * `{{#computed::notes}}` is true even when the note is empty, and the box
 * renders blank on every card. The template tests this flag with rollTotal()
 * instead, which does read the computed value.
 */
export function notesFlag(notes: string | number | undefined): number {
  return String(notes ?? "").trim() === "" ? 0 : 1;
}

/** Adds the notes flag to whatever a caller is about to hand finishRoll. */
export function withNotesFlag(
  computed: Record<string, string | number>,
): Record<string, string | number> {
  return {
    ...computed,
    [COMPUTED.HasNotes]: notesFlag(computed[COMPUTED.Notes]),
  };
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
    ["title", label],
    ["subtitle", "@{character_name}"],
    ["roll", `[[${rollDie}]]`],
    ["roll2", `[[${options.die}]]`],
    ["target", `[[${options.target}]]`],
    [COMPUTED.Used, "[[0]]"],
    [COMPUTED.Verdict, "[[0]]"],
    [COMPUTED.VerdictClass, "[[0]]"],
    [COMPUTED.Rank, "[[0]]"],
    [COMPUTED.Skill, "[[0]]"],
    [COMPUTED.Notes, "[[0]]"],
    [COMPUTED.HasNotes, "[[0]]"],
  ]);
  return template;
}

/**
 * The values finishRoll substitutes into the placeholders above.
 *
 * skillName is the Skill a check's target expression carried back (#5), read
 * by checks.ts's readSkillName() off the resolved roll -- left blank for a
 * check that offered no Skill prompt, or where the player picked `(none)`.
 */
export function checkComputed(
  check: CheckResult,
  skillName = "",
  used = 1,
): Record<string, string | number> {
  const computed: Record<string, string | number> = {
    // translateOr, not translated(): `^{...}` is resolved by Roll20 while it
    // parses the roll macro, and a finishRoll value never goes through that
    // pass -- sent as `^{Success}` the card printed the macro verbatim.
    [COMPUTED.Verdict]: translateOr(check.outcome),
    [COMPUTED.VerdictClass]: VERDICT_CLASSES[check.outcome],
    [COMPUTED.Rank]: RANKS[check.outcome],
    [COMPUTED.Skill]: skillName,
    [COMPUTED.Used]: used,
    [COMPUTED.Notes]: panicWarning(check),
  };
  const flagged = withNotesFlag(computed);
  return flagged;
}

/**
 * Which of the two dice decided the check: 1 for the first, 2 for the second.
 *
 * Both are always rolled, because Advantage and Disadvantage need the pair,
 * and the template shows them in the order they were rolled. It highlights
 * whichever counted and fades the other, so it has to know the position --
 * which CheckResult does not carry, only the two values. A tie resolves to
 * the first, since either answer prints the same number.
 */
export function usedDie(rolls: readonly number[], counted: number): number {
  const [first] = rolls;
  return first === counted ? 1 : 2;
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
  MilitaryTraining: "Military Training",
  TraumaResponse: "Trauma Response",
  AttackFailed: "Attack Failed: Gain 1 Stress",
  OutOfAmmo: "Out of Ammo",
  StressOverflow: "Stress Overflow: Reduces Most Relevant Stat or Save by",
} as const;

/** A Critical Failure on a check forces a Panic Check; say so in chat. */
function panicWarning(check: CheckResult): string {
  if (!check.triggersPanic) return "";
  const warning = translateOr(TEMPLATE_PHRASES.PanicWarning);
  return warning;
}

/** The template sent to startRoll for a Panic Check. */
export function panicTemplate(): string {
  const template = render([
    ["title", translated(TEMPLATE_PHRASES.PanicCheck)],
    ["subtitle", "@{character_name}"],
    ["roll", "[[1d20]]"],
    ["roll2", "[[1d20]]"],
    ["target", "[[@{stress}]]"],
    [COMPUTED.Used, "[[0]]"],
    [COMPUTED.Verdict, "[[0]]"],
    [COMPUTED.VerdictClass, "[[0]]"],
    [COMPUTED.Rank, "[[0]]"],
    [COMPUTED.Notes, "[[0]]"],
    [COMPUTED.HasNotes, "[[0]]"],
  ]);
  return template;
}

/**
 * The values finishRoll substitutes into a Panic Check.
 *
 * 1e has no generic effects table: a failure names Trauma Response and points
 * at it with `@{stress_effect}`, left in the template text for Roll20 itself
 * to resolve against the character rather than read here via getAttrs.
 */
export function panicComputed(
  check: CheckResult,
  used = 1,
): Record<string, string | number> {
  const hasPanicked = isFailure(check.outcome);

  const survived = translateOr(TEMPLATE_PHRASES.KeptItTogether);
  const panicked = translateOr(TEMPLATE_PHRASES.TraumaResponse);

  const computed: Record<string, string | number> = {
    [COMPUTED.Used]: used,
    [COMPUTED.Verdict]: hasPanicked ? panicked : survived,
    [COMPUTED.VerdictClass]: VERDICT_CLASSES[check.outcome],
    [COMPUTED.Rank]: RANKS[check.outcome],
    [COMPUTED.Notes]: hasPanicked ? "@{stress_effect}" : "",
  };
  const flagged = withNotesFlag(computed);
  return flagged;
}

/**
 * The template sent to startRoll for a Death Save.
 *
 * Zero-indexed for the same reason D100 is (see rolls.ts): the Death Table's
 * rows read 0-9, so a physical 1-10 d10 is read back down by one.
 */
export function deathSaveTemplate(): string {
  const template = render([
    ["title", translated(TEMPLATE_PHRASES.DeathSave)],
    ["subtitle", "@{character_name}"],
    ["roll", "[[1d10-1]]"],
    [COMPUTED.Notes, "[[0]]"],
    [COMPUTED.HasNotes, "[[0]]"],
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
  const flagged = withNotesFlag(computed);
  return flagged;
}
