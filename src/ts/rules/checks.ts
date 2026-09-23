import type { PanicEffect } from "#game/data/panic.js";
import { allSaves, allStats } from "#game/enums.js";
import { titleCase } from "#game/text.js";

import {
  checkComputed,
  usedDie,
  checkTemplate,
  COMPUTED,
  deathSaveComputed,
  deathSaveTemplate,
  notesFlag,
  panicComputed,
  panicTemplate,
  TEMPLATE_PHRASES,
  type AttackDetail,
} from "./rollTemplate";
import {
  Comparisons,
  Edges,
  gradeCheck,
  isFailure,
  makeCheck,
  NO_CONSEQUENCES,
  resolveEdge,
  SKILL_BONUS,
  type CheckGrade,
  type CheckRequest,
  type CheckResult,
  type Edge,
  type Outcome,
} from "./rolls";
import { deathSaveEffect, panicEffect } from "./tables";
import { translateOr } from "./translation";

/** Sheetworker entry points for rolling: the dice go out, the rules grade them. */

/** Attributes with a check button, each rolling under the same-named attribute. */
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

/** A translation with the characters a roll query treats as syntax removed. */
function queryText(key: string): string {
  const source = translateOr(key);
  const cleaned = source.replace(QUERY_SYNTAX, "").trim();
  if (cleaned !== "") return cleaned;

  const fallback = key.replace(QUERY_SYNTAX, "").trim();
  return fallback;
}

/** Prompt and option labels the skill query asks through. */
export const SKILL_PROMPT = "Apply Skill?";
export const NONE_LABEL = "None";
/** Shown where a Skill prompt was offered and the player took none. */
export const UNSKILLED_LABEL = "Unskilled";

/** One Skill the character currently has, at whichever tier grants its bonus. */
export type SkillCatalogEntry = {
  name: string;
  bonus: number;
  /** The tier the Skill sits in, e.g. "trained". Titled and translated for display. */
  level: string;
};

/** Every Skill named on the Trained, Expert or Master rows, in tier order. */
export function buildSkillCatalog(
  trained: readonly string[],
  expert: readonly string[],
  master: readonly string[],
): SkillCatalogEntry[] {
  const tiers: readonly [readonly string[], number, string][] = [
    [trained, SKILL_BONUS.trained, "trained"],
    [expert, SKILL_BONUS.expert, "expert"],
    [master, SKILL_BONUS.master, "master"],
  ];

  const catalog: SkillCatalogEntry[] = [];
  for (const [names, bonus, level] of tiers) {
    for (const name of names) {
      const trimmed = name.trim();
      if (trimmed === "") continue;
      catalog.push({
        name: trimmed,
        bonus,
        level,
      });
    }
  }
  return catalog;
}

/** How one option reads in the dropdown: "Expert: Hyperdrives (+15)". */
function skillOptionLabel(level: string, name: string, bonus: number): string {
  const titled = titleCase(level);
  const tier = queryText(titled);
  const label = `${tier}: ${name} (+${String(bonus)})`;
  return label;
}

/** A Skill's name, safe both as query syntax and as an inline-roll annotation. */
function sanitizeSkillName(name: string): string {
  const stripped = name.replace(/[|,{}[\]]/g, "").trim();
  return stripped;
}

/** The Skill dropdown built from the character's own Skills, with `(none)` first. */
export function buildSkillQuery(catalog: readonly SkillCatalogEntry[]): string {
  const noneLabel = queryText(NONE_LABEL);
  const options: string[] = [`${noneLabel},0`];

  for (const entry of catalog) {
    const safeName = sanitizeSkillName(entry.name);
    if (safeName === "") continue;
    const label = skillOptionLabel(entry.level, safeName, entry.bonus);
    options.push(`${label},${String(entry.bonus)}[${safeName}]`);
  }

  options.push(...tierOptions());

  const choices = options.join("|");
  const prompt = queryText(SKILL_PROMPT);
  return `?{${prompt}|${choices}}`;
}

/** The plain tier bonuses, offered below a character's own named Skills. */
function tierOptions(): string[] {
  const options: string[] = [];
  for (const [level, bonus] of Object.entries(SKILL_BONUS)) {
    const name = titleCase(level);
    const translated = queryText(name);
    const tier = sanitizeSkillName(translated);
    if (tier === "") continue;
    const label = `${tier} (+${String(bonus)})`;
    options.push(`${label},${String(bonus)}[${tier}]`);
  }
  return options;
}

/** Points a roll at the persisted skill_query attribute rather than building it here. */
export function skillQuery(): string {
  return "@{skill_query}";
}

/** The Skill name a check's target expression carries back, blank when none was picked. */
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

/** Every Skill the character currently has, read fresh off the three tier sections. */
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

/** Roll20 Sheetworker: keeps skill_query in step with the Trained, Expert and Master rows. */
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

/** Rolls a Save check, offering the Skill prompt only when the Keeper toggle is on. */
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

/** Reads the two dice and the edge back off a started roll. */
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
  /** Dice expression for the target, e.g. "@{strength}", with the bonus query appended. */
  target: string;
  /** Query asked for the bonus; a plain modifier unless a skill can apply. */
  bonus?: string;
  /** Also sends the roll to Roll20's Turn Tracker (#50's Initiative rolls). */
  sendToTracker?: boolean;
  /** The weapon row's own detail, for an attack rolled off a repeating row. */
  attack?: AttackDetail;
  /** Rolled by the Ship, whose crew bear the Stress and Panic the card announces for them. */
  ship?: boolean;
  /** The check's own Stress rule, where a failure does not simply cost the flat 1 (20.2). */
  stress?: (check: CheckResult) => number;
};

/** Rolls a stat check, save or attack and returns the graded result. */
export async function rollCheck(options: CheckOptions): Promise<CheckResult> {
  const templateOptions = {
    target: `${options.target}+${options.bonus ?? MODIFIER_QUERY}`,
    die: D100,
    ...(options.name === undefined ? {} : { name: options.name }),
    ...(options.i18nKey === undefined ? {} : { i18nKey: options.i18nKey }),
    ...(options.sendToTracker ? { sendToTracker: true } : {}),
    ...(options.attack === undefined ? {} : { attack: options.attack }),
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

  const named = readSkillName(roll.results["target"]?.expression);
  const wasOffered = options.bonus !== undefined;
  const skillName = named !== "" ? named : (wasOffered ? translateOr(UNSKILLED_LABEL) : "");

  const used = usedDie(dice.rolls, check.roll);
  const grade = options.ship === true ? NO_CONSEQUENCES : gradeCheck(check, options.stress);
  const computed = checkComputed(check, skillName, used, grade);
  if (options.attack !== undefined) {
    computed[COMPUTED.HasDamage] = gradeAttack(check.outcome).showDamage ? 1 : 0;
  }
  finishRoll(roll.rollId, computed);
  applyCheckGrade(grade);
  return check;
}

/** What an attack's outcome costs beyond the card: a Damage roll only where it hit. */
export type AttackGrade = {
  showDamage: boolean;
};

/** Grades an attack's outcome into what its follow-up card owes the table. */
export function gradeAttack(outcome: Outcome): AttackGrade {
  return { showDamage: !isFailure(outcome) };
}

/** Whether the active sheet is the NPC sheet, which has no Stress of its own. */
export function isNpcSheet(sheetToggle: string | undefined): boolean {
  return sheetToggle === "npc";
}

/** The weapon's magazine count when it is a plain non-negative integer, else undefined. */
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

/** #14: a second, loud card once a tracked weapon's magazine runs dry. */
async function postOutOfAmmoAlert(name: string): Promise<void> {
  const template = `&{template:ms} {{title=${name}}} {{subtitle=@{character_name}}} `
    + "{{alert=[[0]]}} {{hasalert=[[0]]}}";
  const rollData = await startRoll(template);
  const alert = translateOr(TEMPLATE_PHRASES.OutOfAmmo);
  finishRoll(rollData.rollId, {
    alert,
    hasalert: notesFlag(alert),
  });
}

/** The fields one weapon row hands its attack, read off the row rather than guessed. */
export type AttackRow = {
  name: string;
  bonus: string;
  damage: string;
  type: string;
  shots: string;
  antiArmor: boolean;
};

const BLANK_ROW: AttackRow = {
  name: "",
  bonus: "",
  damage: "",
  type: "",
  shots: "",
  antiArmor: false,
};

const ATTACK_ROW_FIELDS = ["name", "bonus", "damage", "type", "shots", "anti_armor"] as const;

/** What every attribute on one weapon row is named after. */
function attackRowPrefix(rowId: string): string {
  return `repeating_attacks_${rowId}_attack_`;
}

/** The row id a repeating click came from, off `sourceSection` or the trigger name. */
export function clickedRowId(eventInfo: EventInfo): string | undefined {
  const section = eventInfo.sourceSection ?? "";
  if (section !== "") return section;

  for (const source of [eventInfo.triggerName, eventInfo.sourceAttribute]) {
    const match = /_(-[-A-Za-z0-9]+|\d+)_/.exec(source);
    if (match?.[1] !== undefined) return match[1];
  }
  return undefined;
}

/** Reads one weapon row, so its macro carries literals rather than unscoped `@{...}`. */
export function readAttackRow(rowId: string, done: (row: AttackRow) => void): void {
  const prefix = attackRowPrefix(rowId);
  const keys = ATTACK_ROW_FIELDS.map((field) => `${prefix}${field}`);

  getAttrs(keys, (attrs) => {
    done({
      name: attrs[`${prefix}name`] ?? "",
      bonus: attrs[`${prefix}bonus`] ?? "",
      damage: attrs[`${prefix}damage`] ?? "",
      type: attrs[`${prefix}type`] ?? "",
      shots: attrs[`${prefix}shots`] ?? "",
      antiArmor: attrs[`${prefix}anti_armor`] === "1",
    });
  });
}

/** A weapon's own bonus as a term the target expression can add, 0 when it reads as nothing. */
export function attackBonus(raw: string): string {
  const trimmed = raw.trim();
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) return "0";
  const term = String(parsed);
  return term;
}

const AMMO_LABEL = "Ammo";

/** The line naming what the weapon is and what its magazine has left. */
export function weaponLine(type: string, ammo: string): string {
  const parts: string[] = [];

  const weaponType = type.trim();
  if (weaponType !== "") parts.push(weaponType);

  const remaining = ammo.trim();
  if (remaining !== "") parts.push(`${translateOr(AMMO_LABEL)}: ${remaining}`);

  const line = parts.join(" · ");
  return line;
}

/** Writes the magazine back, and says so loudly once it reads empty (#14). */
function spendRowAmmo(rowId: string, remaining: string, name: string): void {
  const shotsKey = `${attackRowPrefix(rowId)}shots`;
  setAttrs({ [shotsKey]: remaining });

  const isEmpty = isOutOfAmmo(remaining);
  if (isEmpty) void postOutOfAmmoAlert(name);
}

/** Charges what a check cost: the Stress lands first, so the Panic Check reads the new total. */
function applyCheckGrade(grade: CheckGrade): void {
  if (grade.stressDelta === 0 && !grade.panics) return;

  getAttrs(["stress", "stress_min", "sheet_toggle"], (attrs) => {
    const isNpc = isNpcSheet(attrs.sheet_toggle);
    if (isNpc) return;

    const current = Number(attrs.stress);
    const min = Number(attrs.stress_min);
    const stress = grade.stressDelta === 0
      ? current
      : applyStressDelta(current, grade.stressDelta, min);

    if (grade.panics) void rollPanicCheck(stress);
  });
}

/** Rolls a weapon attack: a Combat Check carrying its Damage, its Stress, and the ammo spend. */
export async function rollAttack(row: AttackRow, rowId?: string): Promise<CheckResult> {
  const remaining = spendAmmo(row.shots);

  const check = await rollCheck({
    name: row.name,
    target: `@{combat}+${attackBonus(row.bonus)}+@{attack_modifier}`,
    bonus: skillQuery(),
    attack: {
      damage: row.damage,
      weapon: weaponLine(row.type, remaining),
      antiArmor: row.antiArmor,
    },
  });

  if (rowId !== undefined) spendRowAmmo(rowId, remaining, row.name);

  return check;
}

/** Roll20 Sheetworker: rolls the attack of whichever weapon row was clicked. */
export function handleAttackClick(eventInfo: EventInfo): void {
  const rowId = clickedRowId(eventInfo);
  if (rowId === undefined) {
    void rollAttack(BLANK_ROW);
    return;
  }

  readAttackRow(rowId, (row) => {
    void rollAttack(row, rowId);
  });
}

/** Rolls Initiative for a PC: a Speed Check that also lands in the Turn Tracker. */
export async function rollPCInitiative(): Promise<CheckResult> {
  const check = await rollCheck({
    i18nKey: TEMPLATE_PHRASES.Initiative,
    target: "@{speed}",
    bonus: skillQuery(),
    sendToTracker: true,
  });
  return check;
}

/** Rolls Initiative for an NPC: an Instinct Check that also lands in the Turn Tracker. */
export async function rollNPCInitiative(): Promise<CheckResult> {
  const check = await rollCheck({
    i18nKey: TEMPLATE_PHRASES.Initiative,
    target: "@{instinct}",
    sendToTracker: true,
  });
  return check;
}

/** 1e caps Stress at 20 (#42). A fixed rule constant, not per-character. */
export const STRESS_MAX = 20;

/** How much a Stress gain overflows past the maximum, 0 when it does not. */
export function stressOverflow(current: number, delta: number): number {
  const next = current + delta;
  if (next <= STRESS_MAX) return 0;
  return next - STRESS_MAX;
}

/** Posts the chat card announcing a Stress overflow for the table to adjudicate. */
async function postStressOverflowAlert(amount: number): Promise<void> {
  const rollData = await startRoll(
    "&{template:ms} {{subtitle=@{character_name}}} {{alert=[[0]]}} {{hasalert=[[0]]}}",
  );
  const alert = `${translateOr(TEMPLATE_PHRASES.StressOverflow)} ${amount}`;
  finishRoll(rollData.rollId, {
    alert,
    hasalert: notesFlag(alert),
  });
}

/** Applies a Stress change and writes it back, clamped to the bounds, returning the new total. */
export function applyStressDelta(current: number, delta: number, min: number): number {
  const floored = Math.max(min, current + delta);
  const next = Math.min(STRESS_MAX, floored);
  setAttrs({ stress: next });

  const overflow = stressOverflow(current, delta);
  if (overflow > 0) void postStressOverflowAlert(overflow);
  return next;
}

/** Grades a Panic Check: a d20 rolled over current Stress. */
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

/** 21.3: a Panic result severe enough to last is recorded as an Affliction row. */
export function panicConditionRow(effect: PanicEffect): Record<string, string> {
  if (!effect.condition) return {};

  const row = `repeating_afflictions_${generateRowID()}_affliction`;
  return {
    [`${row}_name`]: effect.name,
    [`${row}_effect`]: effect.effect,
    [`${row}_settings`]: "0",
  };
}

/** Rolls a Panic Check, reading a failure off the Panic Table alongside the Trauma Response. */
export async function rollPanicCheck(stress?: number): Promise<void> {
  const template = `${panicTemplate(stress)} {{edge=[[${EDGE_QUERY}]]}}`;
  const roll = await startRoll(template);
  const dice = readDice(roll.results);

  const target = readTarget(roll.results);
  const check = makePanicCheck(target, dice.rolls, dice.edge);
  const used = usedDie(dice.rolls, check.roll);
  const hasPanicked = isFailure(check.outcome);
  const effect = hasPanicked ? panicEffect(check.roll) : undefined;

  const computed = panicComputed(check, used, effect);
  finishRoll(roll.rollId, computed);

  if (effect === undefined) return;
  const condition = panicConditionRow(effect);
  const fields = Object.keys(condition);
  if (fields.length > 0) setAttrs(condition);
}

/** A Rest Save targets whichever Save reads lowest -- the player has no say in it. */
export function worstSave(sanity: number, fear: number, body: number): number {
  const lowest = Math.min(sanity, fear, body);
  return lowest;
}

/** Roll20 Sheetworker: keeps worst_save in step with Sanity, Fear and Body. */
export function recomputeWorstSave(): void {
  getAttrs(["sanity", "fear", "body"], (attrs) => {
    const sanity = Number(attrs.sanity);
    const fear = Number(attrs.fear);
    const body = Number(attrs.body);
    setAttrs({ worst_save: worstSave(sanity, fear, body) });
  });
}

/** How a Rest Save changes Stress: heals by the roll's ones digit, or costs a flat 1. */
export function restSaveStressDelta(check: CheckResult): number {
  const hasFailed = isFailure(check.outcome);
  if (hasFailed) return 1;

  const onesDigit = check.roll % 10;
  return -onesDigit;
}

/** Rolls a Rest Save against worst_save, whose own Stress rule replaces a Save's flat 1. */
export async function rollRestSave(): Promise<void> {
  await rollCheck({
    i18nKey: TEMPLATE_PHRASES.RestSave,
    target: "@{worst_save}",
    stress: restSaveStressDelta,
  });
}

/** Rolls a Death Save: a d10 read straight off the Death Table. */
export async function rollDeathSave(): Promise<void> {
  const template = deathSaveTemplate();
  const roll = await startRoll(template);
  const value = roll.results["roll"]?.result ?? 0;
  const effect = deathSaveEffect(value);
  const computed = deathSaveComputed(effect);
  finishRoll(roll.rollId, computed);
}
