import { bankruptcyTable } from "#game/data/bankruptcy";
import {
  maintenanceTable,
  type MaintenanceIssue,
} from "#game/data/maintenance";

import { checkKey, rollCheck } from "./checks";
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
 * Roll20 Sheetworker: Annual Maintenance Check
 */
export async function handleAnnualMaintenanceCheck(): Promise<void> {
  const rollFormula =
    "&{template:ms} {{name=Annual Maintenance Check}} {{character_name=@{character_name}}} {{roll=[[?{Advantage/Disadvantage|Normal,1d100|Advantage [+],2d100kl1|Disadvantage [-],2d100kh1}]]}} {{target=[[@{ship_systems}+?{Skill Bonus|0}]]}} {{maint_roll1=[[1d100-1]]}} {{maint_roll2=[[1d100-1]]}} {{notes=[[0]]}}";
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
 * Roll20 Sheetworker: Systems Check
 */
export async function handleSystemsCheck(): Promise<void> {
  await rollCheck({
    i18nKey: checkKey("systems"),
    target: "@{ship_systems}",
  });
}

/**
 * Roll20 Sheetworker: Thrusters Check
 */
export async function handleThrustersCheck(): Promise<void> {
  await rollCheck({
    i18nKey: checkKey("thrusters"),
    target: "@{ship_thrusters}",
  });
}

/**
 * Roll20 Sheetworker: Battle Check
 */
export async function handleBattleCheck(): Promise<void> {
  await rollCheck({
    i18nKey: checkKey("battle"),
    target: "@{ship_battle}",
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
