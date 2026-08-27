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
  translated,
} from "./rollTemplate";
import {
  Comparisons,
  Edges,
  isFailure,
  makeCheck,
  resolveEdge,
  SKILL_BONUS,
  type CheckRequest,
  type CheckResult,
  type Edge,
  type Outcome,
} from "./rolls";
import { deathSaveEffect } from "./tables";

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
export const NONE_LABEL = "None";

/** One Skill the character currently has, at whichever tier grants its bonus. */
export type SkillCatalogEntry = {
  name: string;
  bonus: number;
};

/**
 * Every Skill named on the Trained, Expert or Master rows, tier order, blank
 * rows left out -- an added-but-unnamed row offers nothing to pick.
 */
export function buildSkillCatalog(
  trained: readonly string[],
  expert: readonly string[],
  master: readonly string[],
): SkillCatalogEntry[] {
  const tiers: readonly [readonly string[], number][] = [
    [trained, SKILL_BONUS.trained],
    [expert, SKILL_BONUS.expert],
    [master, SKILL_BONUS.master],
  ];

  const catalog: SkillCatalogEntry[] = [];
  for (const [names, bonus] of tiers) {
    for (const name of names) {
      const trimmed = name.trim();
      if (trimmed === "") continue;
      catalog.push({
        name: trimmed,
        bonus,
      });
    }
  }
  return catalog;
}

/**
 * A Skill's name, safe both as query syntax and as a Roll20 inline-roll
 * annotation -- a Skill row is free text a player typed, so unlike the fixed
 * vocabulary queryText() cleans, it can carry any of `| , { } [ ]` and needs
 * the same treatment plus the two more of those an annotation reserves.
 */
function sanitizeSkillName(name: string): string {
  const stripped = name.replace(/[|,{}[\]]/g, "").trim();
  return stripped;
}

/**
 * The Skill dropdown built from the character's own current Skills (#5),
 * offered by name with `(none)` always first.
 *
 * Each option's value carries the tier bonus with the Skill's own name
 * riding along as a Roll20 inline-roll annotation -- `10[Genetics]` rather
 * than a bare `10` -- so the answer both totals correctly inside a check's
 * target expression and can be read back out of the resolved roll afterward
 * with readSkillName(). A Roll20 query answers with one value and several
 * Skills can share a tier's bonus, so neither an index nor the bonus alone
 * could be mapped back to a name; riding it inside the same value sidesteps
 * that rather than working around it.
 */
export function buildSkillQuery(catalog: readonly SkillCatalogEntry[]): string {
  const noneLabel = queryText(NONE_LABEL);
  const options: string[] = [`${noneLabel},0`];

  for (const entry of catalog) {
    const safeName = sanitizeSkillName(entry.name);
    if (safeName === "") continue;
    options.push(`${safeName},${String(entry.bonus)}[${safeName}]`);
  }

  options.push(...tierOptions());

  const choices = options.join("|");
  const prompt = queryText(SKILL_PROMPT);
  return `?{${prompt}|${choices}}`;
}

/**
 * The plain tier bonuses, appended below a character's own named Skills.
 *
 * Kept for two reasons. An NPC has no Trained/Expert/Master rows at all, so
 * without these its checks would offer nothing but `(none)` -- the Warden
 * could no longer apply an ad hoc bonus, which is a regression on what every
 * check did before #5. And a PC can legitimately claim a bonus for something
 * not written on their sheet, which the named list alone cannot express.
 *
 * These carry the tier's own name as their annotation -- `10[Trained]` --
 * exactly as a named Skill carries its own, so a check taken on one still
 * names what was claimed in the roll template rather than reading blank.
 *
 * The label is sanitized as well as cleaned: queryText() strips the four
 * characters a query reserves, but an annotation also reserves `[` and `]`,
 * and these labels are translatable.
 */
function tierOptions(): string[] {
  const options: string[] = [];
  for (const [level, bonus] of Object.entries(SKILL_BONUS)) {
    const name = titleCase(level);
    const translated = queryText(name);
    const label = sanitizeSkillName(translated);
    if (label === "") continue;
    options.push(`${label},${String(bonus)}[${label}]`);
  }
  return options;
}

/**
 * Points a roll at the Skill dropdown persisted attribute (#5), rather than
 * building the query here.
 *
 * Roll20 expands an `@{...}` attribute reference before it parses a `?{...}`
 * query sitting inside it, so this reference alone reaches the roll with the
 * full query text recomputeSkillQuery already kept in step with the
 * character's own Trained/Expert/Master rows -- the same shape as
 * worst_save (#110). Building that query needs the async
 * getSectionIDs/getAttrs a click handler cannot wait on and still reach
 * startRoll synchronously, so it happens ahead of time instead, whenever
 * those rows change.
 */
export function skillQuery(): string {
  return "@{skill_query}";
}

/**
 * The Skill name a check's target expression carries back, if any, decoded
 * from the trailing `[Name]` annotation buildSkillQuery() rode the answer
 * in on. Absent when `(none)` was picked, or the check offered no Skill
 * prompt at all.
 */
export function readSkillName(expression: string | undefined): string {
  if (expression === undefined) return "";
  const match = /\[([^[\]]+)\]/.exec(expression);
  return match?.[1] ?? "";
}

/** One repeating section's own Skill names, row order. */
function readSkillNames(section: string, done: (names: string[]) => void): void {
  getSectionIDs(section, (ids) => {
    if (ids.length === 0) {
      done([]);
      return;
    }

    const keys = ids.map((id) => `${section}_${id}_skill_name`);
    getAttrs(keys, (attrs) => {
      const names = keys.map((key) => attrs[key] ?? "");
      done(names);
    });
  });
}

/**
 * Every Skill the character currently has, read fresh off the three rows.
 *
 * Read one tier at a time through Roll20's own callbacks rather than a
 * Promise.all. Roll20 binds the active character only for the synchronous
 * duration of an event handler, so a promise continuation resumes after that
 * binding is gone and the setAttrs at the end of this chain fails with
 * "Trying to do setAttrs when no character is active in sandbox" -- silently,
 * and invisibly to a test suite that resolves the mocked APIs synchronously.
 */
function readSkillCatalog(done: (catalog: SkillCatalogEntry[]) => void): void {
  readSkillNames("repeating_trained", (trained) => {
    readSkillNames("repeating_expert", (expert) => {
      readSkillNames("repeating_master", (master) => {
        const catalog = buildSkillCatalog(trained, expert, master);
        done(catalog);
      });
    });
  });
}

/**
 * Roll20 Sheetworker: keeps skill_query in step with the Trained, Expert and
 * Master rows (#5).
 *
 * Bound to those sections' change/remove events and to sheet:opened -- the
 * same shape as recomputeWorstSave (#110), seeding a character saved before
 * this attribute existed.
 */
export function recomputeSkillQuery(): void {
  readSkillCatalog((catalog) => {
    const query = buildSkillQuery(catalog);
    setAttrs({ skill_query: query });
  });
}

/** Roll20 stores "0" for an unchecked box; anything else reads as on. */
export function isSaveSkillSelectEnabled(raw: string | undefined): boolean {
  return raw !== "0";
}

/**
 * Rolls a Save check, honouring #9's Keeper toggle on the Skill prompt.
 *
 * Every other skilled check bakes skillQuery() into its click handler at
 * registration in index.ts, since the bonus query never changes. A Save's
 * only knows whether the Keeper wants it once the button is actually
 * clicked, so this reads save_skill_select fresh with getAttrs instead --
 * one extra attribute read per Save click. getAttrs answers from the sheet's
 * own cached data rather than a network round trip, so the cost is trivial.
 */
export function rollSaveCheck(attribute: string): void {
  getAttrs(["save_skill_select"], (attrs) => {
    const bonus = isSaveSkillSelectEnabled(attrs.save_skill_select) ? skillQuery() : undefined;
    void rollCheck({
      i18nKey: checkKey(attribute),
      target: `@{${attribute}}`,
      ...(bonus === undefined ? {} : { bonus }),
    });
  });
}

const EDGE_NORMAL = 0;
const EDGE_ADVANTAGE = 1;

/** Checks and saves roll a d100 reading 00-99. */
export const D100 = "1d100-1";

export type RolledDice = {
  rolls: readonly number[];
  edge: Edge;
};

/**
 * Reads the dice back off a started roll.
 *
 * Both dice are always rolled; the edge decides whether the second one counts,
 * which is why the query travels with them.
 */
export function readDice(results: RollResults): RolledDice {
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
export function readTarget(results: RollResults): number {
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
  const skillName = readSkillName(roll.results["target"]?.expression);
  const computed = checkComputed(check, skillName);
  finishRoll(roll.rollId, computed);
  return check;
}

/**
 * What an attack's outcome means beyond the Combat Check card itself (#51):
 * a hit rolls the weapon's own Damage, a miss shows none and instead costs 1
 * Stress automatically. Unlike a plain Stat/Save Check, a miss in combat is
 * not free -- and unlike ships.ts's shipFailureAlert (which can only announce
 * Stress loudly, since a ship has no Stress attribute of its own), the
 * attacking character has one, so this is applied rather than only spoken.
 * A Critical Failure's Panic warning needs nothing extra here: checkComputed
 * already renders it for every rollCheck alike, attacks included.
 */
export type AttackGrade = {
  showDamage: boolean;
  stressDelta: number;
};

/** Grades an attack's outcome into what its follow-up card owes the table. */
export function gradeAttack(outcome: Outcome): AttackGrade {
  const hasFailed = isFailure(outcome);
  return {
    showDamage: !hasFailed,
    stressDelta: hasFailed ? 1 : 0,
  };
}

/**
 * #147: repeating_attacks is shared with the NPC sheet (#90), but a missed
 * attack's Stress cost is a PC-only rule -- NPCs have no Stress of their own
 * to spend. sheet_toggle carries which sheet is active ("pc"/"npc"/"ship").
 */
export function isNpcSheet(sheetToggle: string | undefined): boolean {
  return sheetToggle === "npc";
}

/**
 * #14: attack_shots holds the weapon's current magazine count as plain text.
 * Only a plain non-negative integer is spent -- "∞", blank, or freeform
 * notes (an untracked weapon) are left exactly as written.
 */
function parseShots(shots: string): number | undefined {
  const trimmed = shots.trim();
  if (!/^\d+$/.test(trimmed)) return undefined;
  const parsed = Number(trimmed);
  return parsed;
}

/** Firing a weapon spends one shot from its magazine, floored at 0. */
export function spendAmmo(shots: string): string {
  const current = parseShots(shots);
  if (current === undefined) return shots;
  const remaining = Math.max(0, current - 1);
  const spent = String(remaining);
  return spent;
}

/** Whether a tracked weapon's magazine now reads empty. */
export function isOutOfAmmo(shots: string): boolean {
  return parseShots(shots) === 0;
}

/**
 * Posts the second half of an attack: the row's own Damage on a hit, or a
 * loud note that the attack failed on a miss. A second card rather than
 * extra fields on the Check's own template, the same way ships.ts's
 * postShipAlert follows up its own Checks -- checkTemplate()'s fields are
 * fixed and shared with every other check.
 */
async function postAttackResult(showDamage: boolean): Promise<void> {
  const fields = [
    "&{template:ms}",
    "{{character_name=@{character_name}}}",
    showDamage ? "{{damage=[[@{attack_damage}]]}}" : "",
    "{{alert=[[0]]}}",
  ].filter((field) => field !== "");

  const template = fields.join(" ");
  const rollData = await startRoll(template);
  finishRoll(rollData.rollId, {
    alert: showDamage ? "" : translated(TEMPLATE_PHRASES.AttackFailed),
  });
}

/** #14: a third, loud card once a tracked weapon's magazine runs dry. */
async function postOutOfAmmoAlert(name: string): Promise<void> {
  const template =
    `&{template:ms} {{name=${name}}} {{character_name=@{character_name}}} {{alert=[[0]]}}`;
  const rollData = await startRoll(template);
  finishRoll(rollData.rollId, { alert: translated(TEMPLATE_PHRASES.OutOfAmmo) });
}

/**
 * Rolls a weapon attack (#51, #13, #6, #14): a Combat Check like any other
 * skilled check -- the bonus query, and the per-weapon/global attack bonuses,
 * are baked in by the caller at index.ts registration, same as every other
 * skilled check -- plus what a plain Stat/Save Check doesn't do: Damage on a
 * hit, 1 automatic Stress on a miss (skipped for an NPC, #147), and spending
 * the row's own ammo. All of that is read and applied only after the Check
 * resolves, exactly as rollRestSave does, since the Check's own startRoll
 * already fired synchronously off the click.
 *
 * `rowId` (the triggering row, from `eventInfo.sourceSection`) is how the
 * row's own attack_shots is addressed for reading and writing -- unlike
 * `@{attack_shots}` inside a roll formula, a getAttrs/setAttrs call outside
 * the row's own click context needs the fully-qualified attribute name.
 * Omitted, ammo tracking is simply skipped.
 */
export async function rollAttack(options: CheckOptions, rowId?: string): Promise<CheckResult> {
  const check = await rollCheck(options);
  const grade = gradeAttack(check.outcome);

  await postAttackResult(grade.showDamage);

  const shotsKey = rowId === undefined ? undefined : `repeating_attacks_${rowId}_attack_shots`;
  const shouldReadAttrs = grade.stressDelta !== 0 || shotsKey !== undefined;

  if (shouldReadAttrs) {
    const keys = [
      "stress", "stress_min", "stress_max", "sheet_toggle",
      ...(shotsKey === undefined ? [] : [shotsKey]),
    ];

    // Roll20's own callback, not an awaited Promise wrapper: a promise
    // continuation resumes after the handler has returned, once the sandbox
    // has unbound the character, and the setAttrs below then fails with
    // "Trying to do setAttrs when no character is active in sandbox".
    getAttrs(keys, (attrs) => {
      if (grade.stressDelta !== 0 && !isNpcSheet(attrs.sheet_toggle)) {
        const stress = Number(attrs.stress);
        const min = Number(attrs.stress_min);
        const max = Number(attrs.stress_max);
        applyStressDelta(stress, grade.stressDelta, min, max);
      }

      if (shotsKey === undefined) return;

      const spent = spendAmmo(attrs[shotsKey] ?? "");
      setAttrs({ [shotsKey]: spent });
      const isEmpty = isOutOfAmmo(spent);
      if (isEmpty) void postOutOfAmmoAlert(options.name ?? "");
    });
  }

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
 * stress_min and stress_max are declared attributes (#42); the bounds still
 * travel with the call rather than being read here, since a caller already
 * has them fresh from its own getAttrs and this is the one place that writes
 * Stress, so the several checks that grant or reduce it (#47, #48, #51) agree
 * on how the clamp works.
 */
export function applyStressDelta(current: number, delta: number, min: number, max: number): void {
  const floored = Math.max(min, current + delta);
  const next = Math.min(max, floored);
  setAttrs({ stress: next });
}

/**
 * Grades a Panic Check: a d20 rolled *over* current Stress.
 *
 * 1e has no generic panic effects table -- a failure triggers the character's
 * own Trauma Response (their class ability), so grading this is nothing more
 * than a check against a different comparison.
 */
export function makePanicCheck(
  stress: number,
  rolls: readonly number[],
  edge: Edge = Edges.None,
): CheckResult {
  const check = makeCheck({
    name: "Panic Check",
    target: stress,
    rolls,
    edge,
    comparison: Comparisons.RollOver,
  });
  return check;
}

/**
 * Rolls a Panic Check.
 *
 * A failure points at the character's Trauma Response rather than a table:
 * panicComputed reads it straight off the sheet via `@{stress_effect}` inside
 * the template text, so no getAttrs round trip is needed here at all.
 */
export async function rollPanicCheck(): Promise<void> {
  const template = `${panicTemplate()} {{edge=[[${EDGE_QUERY}]]}}`;
  const roll = await startRoll(template);
  const dice = readDice(roll.results);

  const stress = readTarget(roll.results);
  const check = makePanicCheck(stress, dice.rolls, dice.edge);
  const computed = panicComputed(check);
  finishRoll(roll.rollId, computed);
}

/** A Rest Save targets whichever Save reads lowest -- the player has no say in it. */
export function worstSave(sanity: number, fear: number, body: number): number {
  const lowest = Math.min(sanity, fear, body);
  return lowest;
}

/**
 * Roll20 Sheetworker: keeps worst_save in step with Sanity, Fear and Body.
 *
 * rollRestSave targets worst_save directly with a plain @{...} reference
 * rather than reading the three Saves itself, so its startRoll fires
 * synchronously (#110). Bound to change:sanity/fear/body and to sheet:opened,
 * so a character saved before this attribute existed gets a value as soon as
 * the sheet is opened rather than reading 0 until a Save next changes.
 */
export function recomputeWorstSave(): void {
  getAttrs(["sanity", "fear", "body"], (attrs) => {
    const sanity = Number(attrs.sanity);
    const fear = Number(attrs.fear);
    const body = Number(attrs.body);
    setAttrs({ worst_save: worstSave(sanity, fear, body) });
  });
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
 * The target is not player-chosen: it is worst_save, a hidden attribute
 * recomputeWorstSave keeps in step with Sanity, Fear and Body. Targeting it
 * directly, rather than reading the three Saves here first, means startRoll
 * (inside rollCheck) fires synchronously off the click like every other
 * handler -- awaiting a getAttrs round trip before it, as this used to,
 * silently broke the roll (#110). Stress is read after the roll resolves
 * instead, exactly as the ship handlers do.
 */
export async function rollRestSave(): Promise<void> {
  const check = await rollCheck({
    i18nKey: TEMPLATE_PHRASES.RestSave,
    target: "@{worst_save}",
  });

  const delta = restSaveStressDelta(check);
  getAttrs(["stress", "stress_min", "stress_max"], (attrs) => {
    const stress = Number(attrs.stress);
    const min = Number(attrs.stress_min);
    const max = Number(attrs.stress_max);
    applyStressDelta(stress, delta, min, max);
  });
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
