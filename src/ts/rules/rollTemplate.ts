import type { PanicEffect } from "#game/data/panic.js";
import type { DeathEffect } from "#game/data/wounds.js";

import {
  NO_CONSEQUENCES,
  Outcomes,
  isFailure,
  type CheckGrade,
  type CheckResult,
  type Outcome,
} from "./rolls";
import { translateOr } from "./translation";

/** Builds the startRoll template and the finishRoll values for a custom-parsed roll. */

const TEMPLATE = "ms";

/** Placeholders filled by finishRoll once the dice are graded. */
export const COMPUTED = {
  Used: "used",
  HasNotes: "hasnotes",
  HasSkill: "hasskill",
  HasDamage: "hasdamage",
  Verdict: "verdict",
  VerdictClass: "verdictclass",
  Rank: "rank",
  Notes: "notes",
  Skill: "skill",
} as const;

/** The outcome as a number, so the template can style each one. */
const RANKS: Record<Outcome, number> = {
  [Outcomes.CriticalFailure]: 1,
  [Outcomes.Failure]: 2,
  [Outcomes.Success]: 3,
  [Outcomes.CriticalSuccess]: 4,
};

/** The outcome's class suffix, e.g. "critical-success". */
const VERDICT_CLASSES: Record<Outcome, string> = {
  [Outcomes.CriticalFailure]: "critical-failure",
  [Outcomes.Failure]: "failure",
  [Outcomes.Success]: "success",
  [Outcomes.CriticalSuccess]: "critical-success",
};

/** Marks text as a translation key Roll20 resolves inside a roll macro. */
export function translated(key: string): string {
  return `^{${key}}`;
}

/** Whether the notes box has anything to show, as 1 or 0. */
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

/** What a weapon row adds to its own check card. */
export type AttackDetail = {
  /** Dice expression for the weapon's Damage, shown only once the check reads as a hit. */
  damage: string;
  /** The weapon's type and what its magazine has left, printed under the character's name. */
  weapon: string;
  /** Whether the weapon ignores and destroys armor on a hit. */
  antiArmor: boolean;
};

export type CheckTemplateOptions = {
  /** Display name, used as-is. */
  name?: string;
  /** Translation key, preferred over `name` where the vocabulary is fixed. */
  i18nKey?: string;
  /** Dice expression for the target, e.g. "@{strength}+?{Modifier?|0}". */
  target: string;
  /** Dice expression rolled twice, so an edge has a second die to choose from. */
  die: string;
  /** Whether the first die is also sent to Roll20's Turn Tracker. */
  sendToTracker?: boolean;
  /** The weapon's own detail, for a check rolled off a weapon row. */
  attack?: AttackDetail;
};

/** The weapon's Damage as an inline roll, empty when the row names no Damage. */
function damageRoll(attack: AttackDetail | undefined): string {
  const expression = attack === undefined ? "" : attack.damage.trim();
  if (expression === "") return "";
  return `[[${expression}]]`;
}

/** The template sent to startRoll, showing both dice with the verdict left computed. */
export function checkTemplate(options: CheckTemplateOptions): string {
  const label = options.i18nKey === undefined
    ? options.name ?? ""
    : translated(options.i18nKey);
  const rollDie = options.sendToTracker ? `${options.die} &{tracker}` : options.die;
  const damage = damageRoll(options.attack);

  const template = render([
    ["title", label],
    ["subtitle", "@{character_name}"],
    ["weapon", options.attack?.weapon ?? ""],
    ["roll", `[[${rollDie}]]`],
    ["roll2", `[[${options.die}]]`],
    ["target", `[[${options.target}]]`],
    ["damage", damage],
    ["antiarmor", options.attack?.antiArmor ? "1" : ""],
    [COMPUTED.HasDamage, damage === "" ? "" : "[[0]]"],
    [COMPUTED.Used, "[[0]]"],
    [COMPUTED.Verdict, "[[0]]"],
    [COMPUTED.VerdictClass, "[[0]]"],
    [COMPUTED.Rank, "[[0]]"],
    [COMPUTED.Skill, "[[0]]"],
    [COMPUTED.HasSkill, "[[0]]"],
    [COMPUTED.Notes, "[[0]]"],
    [COMPUTED.HasNotes, "[[0]]"],
  ]);
  return template;
}

/** The values finishRoll substitutes into a check's placeholders. */
export function checkComputed(
  check: CheckResult,
  skillName = "",
  used = 1,
  grade: CheckGrade = NO_CONSEQUENCES,
): Record<string, string | number> {
  const computed: Record<string, string | number> = {
    [COMPUTED.Verdict]: translateOr(check.outcome),
    [COMPUTED.VerdictClass]: VERDICT_CLASSES[check.outcome],
    [COMPUTED.Rank]: RANKS[check.outcome],
    [COMPUTED.Skill]: skillName,
    [COMPUTED.HasSkill]: notesFlag(skillName),
    [COMPUTED.Used]: used,
    [COMPUTED.Notes]: consequenceNotes(grade),
  };
  const flagged = withNotesFlag(computed);
  return flagged;
}

/** Which of the two dice decided the check: 1 for the first, 2 for the second. */
export function usedDie(rolls: readonly number[], counted: number): number {
  const [first] = rolls;
  return first === counted ? 1 : 2;
}

/** Fixed phrases the templates translate through `^{...}`. */
export const TEMPLATE_PHRASES = {
  PanicCheck: "Panic Check",
  KeptItTogether: "Kept It Together",
  RestSave: "Rest Save",
  DeathSave: "Death Save",
  ArmorDestroyed: "Armor Destroyed",
  Initiative: "Initiative",
  TakeDamage: "Take Damage",
  TakeAWound: "Take a Wound",
  ArmorAbsorbed: "Absorbed by Armor",
  MilitaryTraining: "Military Training",
  TraumaResponse: "Trauma Response",
  OutOfAmmo: "Out of Ammo",
  StressOverflow: "Stress Overflow: Reduces Most Relevant Stat or Save by",
  StressGained: "Stress Gained",
  PanicForced: "Critical Failure: Panic Check",
} as const;

/** What the check cost its roller, said on the card rather than left to happen quietly. */
function consequenceNotes(grade: CheckGrade): string {
  const lines: string[] = [];
  if (grade.stressDelta > 0) {
    const label = translateOr(TEMPLATE_PHRASES.StressGained);
    lines.push(`${label}: ${String(grade.stressDelta)}`);
  }
  if (grade.panics) {
    const forced = translateOr(TEMPLATE_PHRASES.PanicForced);
    lines.push(forced);
  }
  const notes = lines.join("\n");
  return notes;
}

/** The template sent to startRoll for a Panic Check, against a Stress already counted. */
export function panicTemplate(stress?: number): string {
  const target = stress === undefined ? "@{stress}" : String(stress);
  const template = render([
    ["title", translated(TEMPLATE_PHRASES.PanicCheck)],
    ["subtitle", "@{character_name}"],
    ["roll", "[[1d20]]"],
    ["roll2", "[[1d20]]"],
    ["target", `[[${target}]]`],
    [COMPUTED.Used, "[[0]]"],
    [COMPUTED.Verdict, "[[0]]"],
    [COMPUTED.VerdictClass, "[[0]]"],
    [COMPUTED.Rank, "[[0]]"],
    [COMPUTED.Notes, "[[0]]"],
    [COMPUTED.HasNotes, "[[0]]"],
  ]);
  return template;
}

/** The Trauma Response line, which fires alongside the Panic Table result rather than instead. */
function traumaResponseLine(): string {
  return `${translateOr(TEMPLATE_PHRASES.TraumaResponse)}: @{stress_effect}`;
}

/** The values finishRoll substitutes into a Panic Check, read off the Panic Table. */
export function panicComputed(
  check: CheckResult,
  used = 1,
  effect?: PanicEffect,
): Record<string, string | number> {
  const hasPanicked = isFailure(check.outcome);

  const survived = translateOr(TEMPLATE_PHRASES.KeptItTogether);
  const panicked = effect?.name ?? translateOr(TEMPLATE_PHRASES.TraumaResponse);
  const notes = effect === undefined
    ? traumaResponseLine()
    : `${effect.effect}\n${traumaResponseLine()}`;

  const computed: Record<string, string | number> = {
    [COMPUTED.Used]: used,
    [COMPUTED.Verdict]: hasPanicked ? panicked : survived,
    [COMPUTED.VerdictClass]: VERDICT_CLASSES[check.outcome],
    [COMPUTED.Rank]: RANKS[check.outcome],
    [COMPUTED.Notes]: hasPanicked ? notes : "",
  };
  const flagged = withNotesFlag(computed);
  return flagged;
}

/** The template sent to startRoll for a Death Save. */
export function deathSaveTemplate(): string {
  const template = render([
    ["title", translated(TEMPLATE_PHRASES.DeathSave)],
    ["subtitle", "@{character_name}"],
    ["roll", "[[1d10-1]]"],
    ["edge", "[[0]]"],
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
