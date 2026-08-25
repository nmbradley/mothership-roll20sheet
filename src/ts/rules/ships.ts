import {
  maintenanceTable,
  type MaintenanceIssue,
} from "../../game/data/maintenance";
import {
  bankruptcyTable,
  type BankruptcyEffect,
} from "../../game/data/bankruptcy";
import { evaluateRoll, type RollResultType } from "./rolls";

export type AnnualMaintenanceResult = {
  result: RollResultType;
  stressGain: number;
  panicCheck: boolean;
  issues: MaintenanceIssue[];
  message: string;
};

export type BankruptcySaveResult = {
  result: RollResultType;
  consequence: string;
  message: string;
};

/**
 * Retrieves a maintenance issue from the Maintenance Issues Table by roll index (0-99).
 */
export function getMaintenanceIssue(roll: number): MaintenanceIssue {
  const index = Math.max(0, Math.min(99, Math.floor(roll)));
  return maintenanceTable[index];
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

  if (result === "CRITICAL SUCCESS") {
    return {
      result,
      stressGain: 0,
      panicCheck: false,
      issues: [],
      message:
        "CRITICAL SUCCESS: Systems operating at peak efficiency. No maintenance issues encountered.",
    };
  }

  if (result === "SUCCESS") {
    return {
      result,
      stressGain: 0,
      panicCheck: false,
      issues: [],
      message:
        "SUCCESS: Systems check passed. Maintenance in order with no issues.",
    };
  }

  if (result === "FAILURE") {
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
export async function handleAnnualMaintenanceCheck() {
  const rollFormula =
    "&{template:ms} {{name=Annual Maintenance Check}} {{character_name=@{character_name}}} {{roll=[[1d100]]}} {{target=[[@{systems}+0]]}} {{maint_roll1=[[1d100-1]]}} {{maint_roll2=[[1d100-1]]}} {{notes=placeholder}}";
  const rollData = await startRoll(rollFormula);

  const roll = rollData.results.roll?.result ?? 0;
  const target = rollData.results.target?.result ?? 0;
  const maintRoll1 = rollData.results.maint_roll1?.result ?? 0;
  const maintRoll2 = rollData.results.maint_roll2?.result ?? 0;

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
export async function handleBankruptcySave() {
  const rollFormula =
    "&{template:ms} {{name=Bankruptcy Save}} {{character_name=@{character_name}}} {{roll=[[1d100]]}} {{target=[[@{bankruptcy_save}+0]]}} {{notes=placeholder}}";
  const rollData = await startRoll(rollFormula);

  const roll = rollData.results.roll?.result ?? 0;
  const target = rollData.results.target?.result ?? 0;

  const evaluation = evaluateBankruptcySave(roll, target);

  finishRoll(rollData.rollId, {
    notes: evaluation.message,
  });
}

/**
 * Roll20 Sheetworker: Systems Check
 */
export async function handleSystemsCheck() {
  const rollFormula =
    "&{template:ms} {{name=Systems Check}} {{character_name=@{character_name}}} {{roll=[[1d100]]}} {{target=[[@{systems}+0]]}} {{notes=placeholder}}";
  const rollData = await startRoll(rollFormula);
  const roll = rollData.results.roll?.result ?? 0;
  const target = rollData.results.target?.result ?? 0;
  const result = evaluateRoll(roll, target);

  finishRoll(rollData.rollId, {
    notes: `Systems Check: ${result}`,
  });
}

/**
 * Roll20 Sheetworker: Thrusters Check
 */
export async function handleThrustersCheck() {
  const rollFormula =
    "&{template:ms} {{name=Thrusters Check}} {{character_name=@{character_name}}} {{roll=[[1d100]]}} {{target=[[@{thrusters}+0]]}} {{notes=placeholder}}";
  const rollData = await startRoll(rollFormula);
  const roll = rollData.results.roll?.result ?? 0;
  const target = rollData.results.target?.result ?? 0;
  const result = evaluateRoll(roll, target);

  finishRoll(rollData.rollId, {
    notes: `Thrusters Check: ${result}`,
  });
}

/**
 * Roll20 Sheetworker: Battle Check
 */
export async function handleBattleCheck() {
  const rollFormula =
    "&{template:ms} {{name=Battle Check}} {{character_name=@{character_name}}} {{roll=[[1d100]]}} {{target=[[@{battle}+0]]}} {{notes=placeholder}}";
  const rollData = await startRoll(rollFormula);
  const roll = rollData.results.roll?.result ?? 0;
  const target = rollData.results.target?.result ?? 0;
  const result = evaluateRoll(roll, target);

  finishRoll(rollData.rollId, {
    notes: `Battle Check: ${result}`,
  });
}
