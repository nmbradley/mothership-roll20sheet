import {
  maintenanceTable,
  type MaintenanceIssue,
} from "#data/maintenance";

export type StartingConditionResult = {
  count: number;
  issues: MaintenanceIssue[];
  message: string;
};

/**
 * Retrieves a maintenance issue from the Maintenance Issues Table by roll index (0-99).
 *
 * @param roll - The 0-99 roll value.
 * @returns The corresponding MaintenanceIssue object.
 */
export function getMaintenanceIssue(roll: number): MaintenanceIssue {
  const floored = Math.floor(roll);
  const minClamped = Math.max(0, floored);
  const clamped = Math.min(99, minClamped);
  const issue = maintenanceTable[clamped];
  return issue;
}

/**
 * Randomly selects unique maintenance issues from the table.
 *
 * @param count - The number of unique issues to select.
 * @param table - The table of maintenance issues to select from.
 * @param randomFn - The random number generator function.
 * @returns An array of uniquely selected MaintenanceIssue objects.
 */
export function getRandomUniqueIssues(
  count: number,
  table: MaintenanceIssue[] = maintenanceTable,
  randomFn: () => number = Math.random,
): MaintenanceIssue[] {
  if (count <= 0) {
    return [];
  }
  const pool = [...table];
  const targetCount = Math.min(count, pool.length);
  const selected: MaintenanceIssue[] = [];

  for (let i = 0; i < targetCount; i++) {
    const remaining = pool.length - i;
    const rand = randomFn();
    const offset = Math.floor(rand * remaining);
    const targetIndex = i + offset;
    const temp = pool[i];
    pool[i] = pool[targetIndex];
    pool[targetIndex] = temp;
    selected.push(pool[i]);
  }

  return selected;
}

/**
 * Formats a list of maintenance issues into a chat message string.
 *
 * @param issues - The list of maintenance issues.
 * @returns The formatted message string.
 */
export function formatStartingConditionMessage(
  issues: MaintenanceIssue[],
): string {
  const lines = issues.map((issue) => {
    const line = `[${issue.roll} - ${issue.issue_type}]: ${issue.description}`;
    return line;
  });
  const formatted = lines.join("\n");
  return formatted;
}

/**
 * Evaluates the starting condition repairs for a new ship.
 *
 * @param count - The evaluated 1d5+1 repairs count.
 * @param table - The table of maintenance issues.
 * @param randomFn - The random number generator function.
 * @returns The evaluation result including count, selected issues, and formatted message.
 */
export function evaluateStartingCondition(
  count: number,
  table: MaintenanceIssue[] = maintenanceTable,
  randomFn: () => number = Math.random,
): StartingConditionResult {
  const issues = getRandomUniqueIssues(count, table, randomFn);
  const message = formatStartingConditionMessage(issues);
  const result: StartingConditionResult = {
    count,
    issues,
    message,
  };
  return result;
}

/**
 * Roll20 Sheetworker action handler for the Ship Starting Condition button.
 * Evaluates 1d5+1 repairs and broadcasts randomly selected unique maintenance issues to chat.
 */
export async function handleStartingCondition(): Promise<void> {
  const rollFormula =
    "&{template:ms} {{name=Starting Condition}} {{character_name=@{character_name}}} {{roll=[[1d5+1]]}} {{notes=placeholder}}";
  const rollData = await startRoll(rollFormula);
  const rollResult = rollData.results.roll as RollResult | undefined;
  const count = rollResult ? rollResult.result : 2;
  const evaluation = evaluateStartingCondition(count);

  finishRoll(rollData.rollId, {
    notes: evaluation.message,
  });
}
