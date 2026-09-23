import { bankruptcyTable } from "#game/data/bankruptcy";
import {
  maintenanceTable,
  type MaintenanceIssue,
} from "#game/data/maintenance";
import { megadamageTable, type MegaDamageEffect } from "#game/data/megadamage";

import {
  checkKey, rollCheck, skillQuery,
} from "./checks";
import { notesFlag } from "./rollTemplate";
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

export type AfterBattleReportResult = {
  result: Outcome;
  issues: MaintenanceIssue[];
  message: string;
};

export type BankruptcySaveResult = {
  result: Outcome;
  consequence: string;
  message: string;
};

/** Retrieves a maintenance issue from the Maintenance Issues Table by roll index (0-99). */
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

/** Renders one maintenance issue as a chat line, numbered when a check draws two. */
function formatMaintenanceIssue(issue: MaintenanceIssue, index?: number): string {
  const label = index === undefined ? "Maintenance Issue" : `Maintenance Issue ${index}`;
  return `${label} [${issue.roll} - ${issue.issue_type}]: ${issue.description}`;
}

/** Chat framing an outcome tier maps to -- everything a maintenance-table check's callers vary. */
type MaintenanceCheckFraming = {
  criticalSuccess: string;
  success: string;
  failure: (issue: MaintenanceIssue) => string;
  criticalFailure: (issue1: MaintenanceIssue, issue2: MaintenanceIssue) => string;
};

/** Grades a Systems Check into the maintenance-table rolls its outcome costs. */
function resolveMaintenanceCheck(
  roll: number,
  target: number,
  maintRoll1: number,
  maintRoll2: number,
  framing: MaintenanceCheckFraming,
): {
  result: Outcome;
  issues: MaintenanceIssue[];
  message: string;
} {
  const result = evaluateRoll(roll, target);

  if (result === Outcomes.CriticalSuccess) {
    return {
      result,
      issues: [],
      message: framing.criticalSuccess,
    };
  }
  if (result === Outcomes.Success) {
    return {
      result,
      issues: [],
      message: framing.success,
    };
  }
  if (result === Outcomes.Failure) {
    const issue = getMaintenanceIssue(maintRoll1);
    return {
      result,
      issues: [issue],
      message: framing.failure(issue),
    };
  }

  const issue1 = getMaintenanceIssue(maintRoll1);
  const issue2 = getMaintenanceIssue(maintRoll2);
  return {
    result,
    issues: [issue1, issue2],
    message: framing.criticalFailure(issue1, issue2),
  };
}

/** Evaluates an Annual Maintenance Check into its issues, Stress and Panic consequences. */
export function evaluateAnnualMaintenance(
  roll: number,
  target: number,
  maintRoll1: number,
  maintRoll2: number,
): AnnualMaintenanceResult {
  const outcome = resolveMaintenanceCheck(roll, target, maintRoll1, maintRoll2, {
    criticalSuccess:
      "CRITICAL SUCCESS: Systems operating at peak efficiency. No maintenance issues encountered.",
    success: "SUCCESS: Systems check passed. Maintenance in order with no issues.",
    failure: (issue) => `FAILURE: Everyone gains 1 Stress.\n${formatMaintenanceIssue(issue)}`,
    criticalFailure: (issue1, issue2) => `CRITICAL FAILURE: Everyone makes a Panic Check!\n${formatMaintenanceIssue(issue1, 1)}\n${formatMaintenanceIssue(issue2, 2)}`,
  });

  return {
    result: outcome.result,
    stressGain: outcome.result === Outcomes.Failure ? 1 : 0,
    panicCheck: outcome.result === Outcomes.CriticalFailure,
    issues: outcome.issues,
    message: outcome.message,
  };
}

/** Evaluates an After Battle Report into the maintenance-table rolls its outcome costs. */
export function evaluateAfterBattleReport(
  roll: number,
  target: number,
  maintRoll1: number,
  maintRoll2: number,
): AfterBattleReportResult {
  const outcome = resolveMaintenanceCheck(roll, target, maintRoll1, maintRoll2, {
    criticalSuccess: "CRITICAL SUCCESS: The ship comes through the confrontation without a scratch.",
    success: "SUCCESS: Systems check passed. No maintenance issues.",
    failure: (issue) => `FAILURE: ${formatMaintenanceIssue(issue)}`,
    criticalFailure: (issue1, issue2) => `CRITICAL FAILURE: Roll twice on the Maintenance Issues Table.\n${formatMaintenanceIssue(issue1, 1)}\n${formatMaintenanceIssue(issue2, 2)}`,
  });
  return outcome;
}

/** Evaluates a Bankruptcy Save roll (1d100 under Bankruptcy Save) and returns consequence. */
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

/** The advantage query for a maintenance-table check, picking the dice formula directly. */
export const MAINTENANCE_EDGE_QUERY =
  "?{Advantage/Disadvantage|Normal,1d100-1|Advantage,2d100kl1-1|Disadvantage,2d100kh1-1}";

/** Roll20 Sheetworker: rolls an Annual Maintenance Check and posts its consequences. */
export async function handleAnnualMaintenanceCheck(): Promise<void> {
  const rollFormula =
    `&{template:ms} {{title=Annual Maintenance Check}} {{subtitle=@{character_name}}} {{roll=[[${MAINTENANCE_EDGE_QUERY}]]}} {{edge=[[0]]}} {{target=[[@{ship_systems}+?{Skill Bonus|0}]]}} {{maint_roll1=[[1d100-1]]}} {{maint_roll2=[[1d100-1]]}} {{notes=[[0]]}} {{hasnotes=[[0]]}}`;
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
    hasnotes: notesFlag(evaluation.message),
  });
}

/** Roll20 Sheetworker: rolls an After Battle Report and posts its maintenance issues. */
export async function handleAfterBattleReport(): Promise<void> {
  const rollFormula =
    `&{template:ms} {{title=After Battle Report}} {{subtitle=@{character_name}}} {{roll=[[${MAINTENANCE_EDGE_QUERY}]]}} {{edge=[[0]]}} {{target=[[@{ship_systems}+?{Skill Bonus|0}]]}} {{maint_roll1=[[1d100-1]]}} {{maint_roll2=[[1d100-1]]}} {{notes=[[0]]}} {{hasnotes=[[0]]}}`;
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

  const evaluation = evaluateAfterBattleReport(
    rollEntry.result,
    targetEntry.result,
    maint1Entry.result,
    maint2Entry.result,
  );

  finishRoll(rollData.rollId, {
    notes: evaluation.message,
    hasnotes: notesFlag(evaluation.message),
  });
}

/** Roll20 Sheetworker: rolls a Bankruptcy Save. */
export async function handleBankruptcySave(): Promise<void> {
  const rollFormula =
    "&{template:ms} {{title=Bankruptcy Save}} {{subtitle=@{character_name}}} {{roll=[[1d100-1]]}} {{edge=[[0]]}} {{target=[[@{ship_bankruptcy_save}+0]]}} {{notes=[[0]]}} {{hasnotes=[[0]]}}";
  const rollData = await startRoll(rollFormula);

  const rollEntry = rollData.results.roll;
  const targetEntry = rollData.results.target;

  if (rollEntry === undefined || targetEntry === undefined) return;

  const roll = rollEntry.result;
  const target = targetEntry.result;

  const evaluation = evaluateBankruptcySave(roll, target);

  finishRoll(rollData.rollId, {
    notes: evaluation.message,
    hasnotes: notesFlag(evaluation.message),
  });
}

/** Chat text telling everyone aboard to take 1 Stress after a failed ship check. */
export const SHIP_STRESS_MESSAGE = "EVERYONE ON BOARD GAINS 1 STRESS";
export const SHIP_PANIC_MESSAGE = "CRITICAL FAILURE: EVERYONE ABOARD MUST MAKE A PANIC CHECK";

/** The Stress/Panic warning for a graded ship stat check, or "" on a success. */
export function shipFailureAlert(outcome: Outcome): string {
  if (outcome === Outcomes.CriticalFailure) return `${SHIP_STRESS_MESSAGE}\n${SHIP_PANIC_MESSAGE}`;
  if (outcome === Outcomes.Failure) return SHIP_STRESS_MESSAGE;
  return "";
}

/** Posts a follow-up chat card for the alert and MDMG a graded check cannot carry. */
async function postShipAlert(fields: {
  alert?: string;
  notes?: string;
  hasnotes?: number;
}): Promise<void> {
  const alert = fields.alert ?? "";
  const notes = fields.notes ?? "";
  if (alert === "" && notes === "") return;

  const rollData = await startRoll(
    "&{template:ms} {{subtitle=@{character_name}}} {{alert=[[0]]}} {{hasalert=[[0]]}} "
    + "{{notes=[[0]]}} {{hasnotes=[[0]]}}",
  );
  finishRoll(rollData.rollId, {
    alert,
    hasalert: notesFlag(alert),
    notes,
    hasnotes: fields.hasnotes ?? 0,
  });
}

/** Roll20 Sheetworker: rolls a Systems Check. */
export async function handleSystemsCheck(): Promise<void> {
  const result = await rollCheck({
    i18nKey: checkKey("systems"),
    target: "@{ship_systems}",
    bonus: skillQuery(),
  });
  await postShipAlert({ alert: shipFailureAlert(result.outcome) });
}

/** Roll20 Sheetworker: rolls a Thrusters Check. */
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

/** Applies an incoming hit to Hull, carrying the remainder onto the MegaDamage track. */
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

/** Reads the ship's own Hull, MDMG and MDMG output. */
function readShipCombat(done: (combat: {
  hull: number;
  mdmg: number;
  mdmgOutput: number;
}) => void): void {
  getAttrs(["ship_hull", "ship_mdmg", "ship_mdmg_total"], (response) => {
    done({
      hull: Number(response.ship_hull) || 0,
      mdmg: Number(response.ship_mdmg) || 0,
      mdmgOutput: Number(response.ship_mdmg_total) || 0,
    });
  });
}

/** Roll20 Sheetworker: rolls a Battle Check and applies the MegaDamage it deals or takes. */
export async function handleBattleCheck(): Promise<void> {
  const result = await rollCheck({
    i18nKey: checkKey("battle"),
    target: "@{ship_battle}",
    bonus: skillQuery(),
  });

  readShipCombat((combat) => {
    const notes: string[] = [];

    const dealt = battleCheckDamageDealt(result.outcome, combat.mdmgOutput);
    if (dealt > 0) notes.push(`Deals ${dealt} MDMG.`);

    const selfHit = battleCheckSelfDamage(result.outcome);
    if (selfHit > 0) {
      const next = applyHullDamage(selfHit, combat.hull, combat.mdmg);
      setAttrs({
        ship_hull: next.hull,
        ship_mdmg: next.mdmg,
      });
      notes.push(`Ship takes ${selfHit} MDMG.`);
    }

    const noteText = notes.join("\n");

    void postShipAlert({
      alert: shipFailureAlert(result.outcome),
      notes: noteText,
      hasnotes: notesFlag(noteText),
    });
  });
}

/** Looks up the MegaDamage Table's effect at a given track level (0-9), clamping the input. */
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

/** The MegaDamage Table's effect text for an increase, or undefined for a repair. */
export function mdmgChangeMessage(previous: number, next: number): string | undefined {
  if (next <= previous) return undefined;
  return getMegadamageEffect(next).effect;
}

/** Roll20 Sheetworker: announces the MegaDamage Table's effect when ship_mdmg increases. */
export function handleMdmgChange(eventInfo: EventInfo): void {
  const previous = Number.parseInt(eventInfo.previousValue ?? "", 10);
  const next = Number.parseInt(eventInfo.newValue ?? "", 10);
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

/** Evaluates a Morale Check: a 1d10 strictly under the ship's current MDMG breaks morale. */
export function evaluateMoraleCheck(roll: number, mdmg: number): MoraleCheckResult {
  const isBroken = roll < mdmg;
  return {
    broken: isBroken,
    message: isBroken ? MORALE_BROKEN_MESSAGE : "Morale holds.",
  };
}

/** Roll20 Sheetworker: rolls an NPC ship's Morale Check. */
export async function handleMoraleCheck(): Promise<void> {
  const rollFormula =
    "&{template:ms} {{title=Morale Check}} {{subtitle=@{character_name}}} {{roll=[[1d10]]}} {{edge=[[0]]}} {{target=[[@{ship_mdmg}]]}} {{notes=[[0]]}} {{hasnotes=[[0]]}}";
  const rollData = await startRoll(rollFormula);

  const rollEntry = rollData.results.roll;
  const targetEntry = rollData.results.target;
  if (rollEntry === undefined || targetEntry === undefined) return;

  const evaluation = evaluateMoraleCheck(rollEntry.result, targetEntry.result);

  finishRoll(rollData.rollId, {
    notes: evaluation.message,
    hasnotes: notesFlag(evaluation.message),
  });
}

export type StartingConditionResult = {
  count: number;
  issues: MaintenanceIssue[];
  message: string;
};

/** Draws `count` distinct maintenance issues from the table, capped at the table size. */
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

/** Renders drawn issues as one chat line each: `[roll - type]: description`. */
export function formatStartingConditionMessage(issues: MaintenanceIssue[]): string {
  const lines = issues.map((issue) => `[${issue.roll} - ${issue.issue_type}]: ${issue.description}`);
  const message = lines.join("\n");
  return message;
}

/** Draws the starting-condition issues for a ship and formats them for chat. */
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

/** Rolls the starting condition on the sheet and posts the resulting issues. */
export async function handleStartingCondition(): Promise<void> {
  const rollFormula = "&{template:ms} {{title=Starting Condition}} {{subtitle=@{character_name}}} {{roll=[[1d5+1]]}} {{edge=[[0]]}} {{notes=[[0]]}} {{hasnotes=[[0]]}}";
  const rollData = await startRoll(rollFormula);
  const rollResult = rollData.results.roll;
  const count = rollResult ? rollResult.result : 2;
  const evaluation = evaluateStartingCondition(count);

  finishRoll(rollData.rollId, {
    notes: evaluation.message,
    hasnotes: notesFlag(evaluation.message),
  });
}

export type FuelBidResult = {
  valid: boolean;
  fuel: number;
  message: string;
};

/** Evaluates a Movement Phase fuel bid, rejecting one that is negative or exceeds Fuel. */
export function evaluateFuelBid(fuel: number, bid: number): FuelBidResult {
  if (bid < 0 || bid > fuel) {
    return {
      valid: false,
      fuel,
      message: `INVALID FUEL BID: ${bid} (Fuel available: ${fuel}). No fuel spent.`,
    };
  }
  return {
    valid: true,
    fuel: fuel - bid,
    message: `Fuel Bid Revealed: ${bid}`,
  };
}

/** Roll20 Sheetworker: reveals the secret fuel bid, spends it and resets it to 0. */
export async function handleRevealFuelBid(): Promise<void> {
  const rollFormula =
    "&{template:ms} {{title=Fuel Bid}} {{subtitle=@{character_name}}} {{bid=[[@{ship_fuel_bid}]]}} {{fuel=[[@{ship_fuel}]]}} {{notes=[[0]]}} {{hasnotes=[[0]]}}";
  const rollData = await startRoll(rollFormula);

  const bidEntry = rollData.results.bid;
  const fuelEntry = rollData.results.fuel;
  if (bidEntry === undefined || fuelEntry === undefined) return;

  const evaluation = evaluateFuelBid(fuelEntry.result, bidEntry.result);
  if (evaluation.valid) {
    setAttrs({
      ship_fuel: evaluation.fuel,
      ship_fuel_bid: 0,
    });
  }

  finishRoll(rollData.rollId, {
    notes: evaluation.message,
    hasnotes: notesFlag(evaluation.message),
  });
}
