import { bankruptcyTable } from "#game/data/bankruptcy";
import {
  maintenanceTable,
  type MaintenanceIssue,
} from "#game/data/maintenance";
import { megadamageTable, type MegaDamageEffect } from "#game/data/megadamage";

import {
  checkKey, rollCheck, skillQuery,
} from "./checks";
import {
  Outcomes, evaluateRoll, type Outcome,
} from "./rolls";

export type AnnualMaintenanceResult = {
  result: Outcome;
  stressGain: number;
  panicCheck: boolean;
  issues: MaintenanceIssue[];
  message: string;
};

export type BankruptcySaveResult = {
  result: Outcome;
  consequence: string;
  message: string;
};

/**
 * Retrieves a maintenance issue from the Maintenance Issues Table by roll index (0-99).
 */
export function getMaintenanceIssue(roll: number): MaintenanceIssue {
  const roundedRoll = Math.floor(roll);
  const clampedMax = Math.min(99, roundedRoll);
  const index = Math.max(0, clampedMax);
  const issue = maintenanceTable[index];
  if (issue === undefined) {
    throw new Error(`No maintenance issue at index ${index}`);
  }
  return issue;
}

/**
 * Evaluates an Annual Maintenance Check (Systems Check) according to Mothership 1e rules:
 * - Success: No issues.
 * - Critical Success: Peak efficiency, no issues.
 * - Failure: 1 roll on Maintenance Issues Table (everyone gains 1 Stress).
 * - Critical Failure: 2 rolls on Maintenance Issues Table (everyone makes a Panic Check).
 */
export function evaluateAnnualMaintenance(
  roll: number,
  target: number,
  maintRoll1: number,
  maintRoll2: number,
): AnnualMaintenanceResult {
  const result = evaluateRoll(roll, target);

  if (result === Outcomes.CriticalSuccess) {
    return {
      result,
      stressGain: 0,
      panicCheck: false,
      issues: [],
      message:
        "CRITICAL SUCCESS: Systems operating at peak efficiency. No maintenance issues encountered.",
    };
  }

  if (result === Outcomes.Success) {
    return {
      result,
      stressGain: 0,
      panicCheck: false,
      issues: [],
      message:
        "SUCCESS: Systems check passed. Maintenance in order with no issues.",
    };
  }

  if (result === Outcomes.Failure) {
    const issue = getMaintenanceIssue(maintRoll1);
    return {
      result,
      stressGain: 1,
      panicCheck: false,
      issues: [issue],
      message: `FAILURE: Everyone gains 1 Stress.\nMaintenance Issue [${issue.roll} - ${issue.issue_type}]: ${issue.description}`,
    };
  }

  // CRITICAL FAILURE
  const issue1 = getMaintenanceIssue(maintRoll1);
  const issue2 = getMaintenanceIssue(maintRoll2);
  return {
    result,
    stressGain: 0,
    panicCheck: true,
    issues: [issue1, issue2],
    message: `CRITICAL FAILURE: Everyone makes a Panic Check!\nMaintenance Issue 1 [${issue1.roll} - ${issue1.issue_type}]: ${issue1.description}\nMaintenance Issue 2 [${issue2.roll} - ${issue2.issue_type}]: ${issue2.description}`,
  };
}

/**
 * Evaluates a Bankruptcy Save roll (1d100 under Bankruptcy Save) and returns consequence.
 */
export function evaluateBankruptcySave(
  roll: number,
  target: number,
): BankruptcySaveResult {
  const result = evaluateRoll(roll, target);
  const effect = bankruptcyTable.find((entry) => entry.result === result);
  const consequence = effect ? effect.consequence : "";

  return {
    result,
    consequence,
    message: `${result}: ${consequence}`,
  };
}

/**
 * The advantage query for the Annual Maintenance Check.
 *
 * Same prompt and option order as EDGE_QUERY in checks.ts, so the two read as
 * one convention to a player, but the options here pick a dice formula
 * directly rather than a code for makeCheck to grade: this check rolls one
 * kept-or-dropped d100 server-side instead of two dice for the rules to
 * choose between.
 */
export const MAINTENANCE_EDGE_QUERY =
  "?{Advantage/Disadvantage|Normal,1d100-1|Advantage,2d100kl1-1|Disadvantage,2d100kh1-1}";

/**
 * Roll20 Sheetworker: Annual Maintenance Check
 *
 * Does not go through rollCheck(): that helper is tied to checkTemplate's
 * fixed fields (counted/result/rank), and this check needs two extra
 * maintenance-table rolls plus a multi-line notes message that combines
 * Stress, Panic and the drawn issues, none of which checkTemplate carries.
 */
export async function handleAnnualMaintenanceCheck(): Promise<void> {
  const rollFormula =
    `&{template:ms} {{name=Annual Maintenance Check}} {{character_name=@{character_name}}} {{roll=[[${MAINTENANCE_EDGE_QUERY}]]}} {{target=[[@{ship_systems}+?{Skill Bonus|0}]]}} {{maint_roll1=[[1d100-1]]}} {{maint_roll2=[[1d100-1]]}} {{notes=[[0]]}}`;
  const rollData = await startRoll(rollFormula);

  const rollEntry = rollData.results.roll;
  const targetEntry = rollData.results.target;
  const maint1Entry = rollData.results.maint_roll1;
  const maint2Entry = rollData.results.maint_roll2;

  if (
    rollEntry === undefined
    || targetEntry === undefined
    || maint1Entry === undefined
    || maint2Entry === undefined
  ) {
    return;
  }

  const roll = rollEntry.result;
  const target = targetEntry.result;
  const maintRoll1 = maint1Entry.result;
  const maintRoll2 = maint2Entry.result;

  const evaluation = evaluateAnnualMaintenance(
    roll,
    target,
    maintRoll1,
    maintRoll2,
  );

  finishRoll(rollData.rollId, {
    notes: evaluation.message,
  });
}

/**
 * Roll20 Sheetworker: Bankruptcy Save
 */
export async function handleBankruptcySave(): Promise<void> {
  const rollFormula =
    "&{template:ms} {{name=Bankruptcy Save}} {{character_name=@{character_name}}} {{roll=[[1d100-1]]}} {{target=[[@{ship_bankruptcy_save}+0]]}} {{notes=[[0]]}}";
  const rollData = await startRoll(rollFormula);

  const rollEntry = rollData.results.roll;
  const targetEntry = rollData.results.target;

  if (rollEntry === undefined || targetEntry === undefined) return;

  const roll = rollEntry.result;
  const target = targetEntry.result;

  const evaluation = evaluateBankruptcySave(roll, target);

  finishRoll(rollData.rollId, {
    notes: evaluation.message,
  });
}

/**
 * Loud chat text a failed ship stat check owes the table (#59).
 *
 * Roll20 sheetworkers cannot write another character's Stress, and a ship has
 * no player of its own to grant it to -- everyone aboard has to apply this by
 * hand once they see it, hence "loud" rather than automated.
 */
export const SHIP_STRESS_MESSAGE = "EVERYONE ON BOARD GAINS 1 STRESS";
export const SHIP_PANIC_MESSAGE = "CRITICAL FAILURE: EVERYONE ABOARD MUST MAKE A PANIC CHECK";

/**
 * The Stress/Panic warning for a graded ship stat check, or "" on a success.
 * A Critical Failure carries both lines: it is still a failure (Stress)
 * on top of forcing the Panic Check.
 */
export function shipFailureAlert(outcome: Outcome): string {
  if (outcome === Outcomes.CriticalFailure) return `${SHIP_STRESS_MESSAGE}\n${SHIP_PANIC_MESSAGE}`;
  if (outcome === Outcomes.Failure) return SHIP_STRESS_MESSAGE;
  return "";
}

/**
 * Posts a follow-up chat card for what a graded rollCheck() result can't say
 * itself: the Stress/Panic warning, and for Battle Checks, the MDMG dealt or
 * taken. A second roll rather than extra fields on the first, since
 * checkTemplate()'s fields are fixed and shared with PC checks (#48/#54).
 */
async function postShipAlert(fields: {
  alert?: string;
  notes?: string;
}): Promise<void> {
  const alert = fields.alert ?? "";
  const notes = fields.notes ?? "";
  if (alert === "" && notes === "") return;

  const rollData = await startRoll(
    "&{template:ms} {{character_name=@{character_name}}} {{alert=[[0]]}} {{notes=[[0]]}}",
  );
  finishRoll(rollData.rollId, {
    alert,
    notes,
  });
}

/**
 * Roll20 Sheetworker: Systems Check
 */
export async function handleSystemsCheck(): Promise<void> {
  const result = await rollCheck({
    i18nKey: checkKey("systems"),
    target: "@{ship_systems}",
    bonus: skillQuery(),
  });
  await postShipAlert({ alert: shipFailureAlert(result.outcome) });
}

/**
 * Roll20 Sheetworker: Thrusters Check
 */
export async function handleThrustersCheck(): Promise<void> {
  const result = await rollCheck({
    i18nKey: checkKey("thrusters"),
    target: "@{ship_thrusters}",
    bonus: skillQuery(),
  });
  await postShipAlert({ alert: shipFailureAlert(result.outcome) });
}

/** MDMG a Battle Check deals to the target: the ship's own MDMG, doubled on a Critical Success. */
export function battleCheckDamageDealt(outcome: Outcome, mdmgOutput: number): number {
  if (outcome === Outcomes.CriticalSuccess) return mdmgOutput * 2;
  if (outcome === Outcomes.Success) return mdmgOutput;
  return 0;
}

/** MDMG a failed Battle Check deals to the ship itself, on top of whatever the enemy deals. */
export function battleCheckSelfDamage(outcome: Outcome): number {
  if (outcome === Outcomes.CriticalFailure) return 2;
  if (outcome === Outcomes.Failure) return 1;
  return 0;
}

/** The 0-9 MDMG track has no level past 9. */
const MDMG_TRACK_MAX = 9;

export type HullDamageResult = {
  hull: number;
  mdmg: number;
};

/**
 * Applies an incoming hit to Hull before MegaDamage: Hull absorbs up to its
 * own value, and only a hit that meets or exceeds it zeroes Hull and carries
 * the remainder onto the MDMG track (#61's Hull rule).
 */
export function applyHullDamage(hit: number, hull: number, mdmg: number): HullDamageResult {
  if (hit < hull) return {
    hull: hull - hit,
    mdmg,
  };
  const overflow = hit - hull;
  return {
    hull: 0,
    mdmg: Math.min(MDMG_TRACK_MAX, mdmg + overflow),
  };
}

/**
 * Reads the ship's own Hull, MDMG and MDMG output -- the only attributes a
 * Battle Check's own sheetworker is allowed to touch.
 */
function readShipCombat(): Promise<{
  hull: number;
  mdmg: number;
  mdmgOutput: number;
}> {
  return new Promise((resolve) => {
    getAttrs(["ship_hull", "ship_mdmg", "ship_mdmg_total"], (response) => {
      resolve({
        hull: Number(response.ship_hull) || 0,
        mdmg: Number(response.ship_mdmg) || 0,
        mdmgOutput: Number(response.ship_mdmg_total) || 0,
      });
    });
  });
}

/**
 * Roll20 Sheetworker: Battle Check
 *
 * A success deals the ship's own MDMG to the target; a failure deals the ship
 * itself 1 MDMG (2 on a Critical Failure) through the Hull rule above. #61
 * notes that at 2 MDMG "WEAPONS OFFLINE" makes every further Battle Check an
 * automatic failure -- that text reaches chat from handleMdmgChange below,
 * but this handler still rolls the dice rather than silently failing the
 * check itself. Every other check on this sheet always rolls and shows a
 * verdict; a hidden no-roll here would be the one check that doesn't, and the
 * effect text already told the table to treat the roll as failed by eye.
 */
export async function handleBattleCheck(): Promise<void> {
  const result = await rollCheck({
    i18nKey: checkKey("battle"),
    target: "@{ship_battle}",
    bonus: skillQuery(),
  });

  const {
    hull, mdmg, mdmgOutput,
  } = await readShipCombat();
  const notes: string[] = [];

  const dealt = battleCheckDamageDealt(result.outcome, mdmgOutput);
  if (dealt > 0) notes.push(`Deals ${dealt} MDMG.`);

  const selfHit = battleCheckSelfDamage(result.outcome);
  if (selfHit > 0) {
    const next = applyHullDamage(selfHit, hull, mdmg);
    setAttrs({
      ship_hull: next.hull,
      ship_mdmg: next.mdmg,
    });
    notes.push(`Ship takes ${selfHit} MDMG.`);
  }

  await postShipAlert({
    alert: shipFailureAlert(result.outcome),
    notes: notes.join("\n"),
  });
}

/**
 * Looks up the MegaDamage Table's effect at a given track level (0-9),
 * clamping out-of-range input the same way getMaintenanceIssue does.
 */
export function getMegadamageEffect(level: number): MegaDamageEffect {
  const rounded = Math.floor(level);
  const clampedMax = Math.min(MDMG_TRACK_MAX, rounded);
  const clamped = Math.max(0, clampedMax);
  const effect = megadamageTable[clamped];
  if (effect === undefined) {
    throw new Error(`No MegaDamage effect at level ${clamped}`);
  }
  return effect;
}

/**
 * The MegaDamage Table's effect text for a tracker increase, or undefined for
 * a decrease/no-op -- there is no "less broken" flavour text for a repair,
 * and the crew already knows the ship got fixed.
 */
export function mdmgChangeMessage(previous: number, next: number): string | undefined {
  if (next <= previous) return undefined;
  return getMegadamageEffect(next).effect;
}

/**
 * Roll20 Sheetworker: broadcasts the MegaDamage Table's effect when
 * ship_mdmg increases, e.g. reaching 2 posts "WEAPONS OFFLINE. Automatically
 * fail Battle Checks."
 */
export function handleMdmgChange(eventInfo: EventInfo): void {
  const previous = Number.parseInt(eventInfo.previousValue, 10);
  const next = Number.parseInt(eventInfo.newValue, 10);
  const message = mdmgChangeMessage(
    Number.isNaN(previous) ? 0 : previous,
    Number.isNaN(next) ? 0 : next,
  );
  if (message === undefined) return;
  void postShipAlert({ notes: message });
}

export type MoraleCheckResult = {
  broken: boolean;
  message: string;
};

/** The chat line announcing an NPC ship's crew wants out. */
export const MORALE_BROKEN_MESSAGE =
  "MORALE BROKEN: The enemy ship signals for a ceasefire and opens negotiations.";

/**
 * Evaluates a Morale Check (#62): a 1d10 roll under the ship's current MDMG
 * breaks morale. A roll equal to MDMG does not count -- "under" is strict,
 * as with every other roll-under check in these rules.
 */
export function evaluateMoraleCheck(roll: number, mdmg: number): MoraleCheckResult {
  const isBroken = roll < mdmg;
  return {
    broken: isBroken,
    message: isBroken ? MORALE_BROKEN_MESSAGE : "Morale holds.",
  };
}

/**
 * Roll20 Sheetworker: Morale Check (#62)
 *
 * Only meaningful for an NPC ship -- the button itself is gated off ship_npc
 * in CSS (ShipMegadamagePanel.svelte), since a sheet cannot run JS outside
 * its sheetworkers to hide it any other way.
 */
export async function handleMoraleCheck(): Promise<void> {
  const rollFormula =
    "&{template:ms} {{name=Morale Check}} {{character_name=@{character_name}}} {{roll=[[1d10]]}} {{target=[[@{ship_mdmg}]]}} {{notes=[[0]]}}";
  const rollData = await startRoll(rollFormula);

  const rollEntry = rollData.results.roll;
  const targetEntry = rollData.results.target;
  if (rollEntry === undefined || targetEntry === undefined) return;

  const evaluation = evaluateMoraleCheck(rollEntry.result, targetEntry.result);

  finishRoll(rollData.rollId, {
    notes: evaluation.message,
  });
}

export type StartingConditionResult = {
  count: number;
  issues: MaintenanceIssue[];
  message: string;
};

/**
 * Draws `count` distinct maintenance issues from the table by partial
 * Fisher-Yates shuffle, capped at the table size.
 */
export function getRandomUniqueIssues(
  count: number,
  table: MaintenanceIssue[] = maintenanceTable,
  randomFn: () => number = Math.random,
): MaintenanceIssue[] {
  if (count <= 0) return [];
  const pool = [...table];
  const targetCount = Math.min(count, pool.length);
  const selected: MaintenanceIssue[] = [];

  for (let i = 0; i < targetCount; i++) {
    const remaining = pool.length - i;
    const offset = Math.floor(randomFn() * remaining);
    const targetIndex = i + offset;
    const current = pool[i];
    const target = pool[targetIndex];
    if (current === undefined || target === undefined) continue;

    pool[i] = target;
    pool[targetIndex] = current;
    selected.push(target);
  }
  return selected;
}

/**
 * Renders drawn issues as one chat line each: `[roll - type]: description`.
 */
export function formatStartingConditionMessage(issues: MaintenanceIssue[]): string {
  const lines = issues.map((issue) => `[${issue.roll} - ${issue.issue_type}]: ${issue.description}`);
  const message = lines.join("\n");
  return message;
}

/**
 * Draws the starting-condition issues for a ship and formats them for chat.
 */
export function evaluateStartingCondition(
  count: number,
  table: MaintenanceIssue[] = maintenanceTable,
  randomFn: () => number = Math.random,
): StartingConditionResult {
  const issues = getRandomUniqueIssues(count, table, randomFn);
  const message = formatStartingConditionMessage(issues);
  return {
    count,
    issues,
    message,
  };
}

/**
 * Rolls the starting condition on the sheet and posts the resulting issues.
 */
export async function handleStartingCondition(): Promise<void> {
  const rollFormula = "&{template:ms} {{name=Starting Condition}} {{character_name=@{character_name}}} {{roll=[[1d5+1]]}} {{notes=[[0]]}}";
  const rollData = await startRoll(rollFormula);
  const rollResult = rollData.results.roll;
  const count = rollResult ? rollResult.result : 2;
  const evaluation = evaluateStartingCondition(count);

  finishRoll(rollData.rollId, {
    notes: evaluation.message,
  });
}
