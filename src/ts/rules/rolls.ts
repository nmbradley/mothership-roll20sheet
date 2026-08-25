export type RollResultType =
  | "CRITICAL SUCCESS"
  | "SUCCESS"
  | "FAILURE"
  | "CRITICAL FAILURE";

/**
 * Checks if a 1d100 roll is "doubles" (matching digits) in Mothership 1e.
 * Doubles occur when digits match: 00 (0), 11, 22, 33, 44, 55, 66, 77, 88, 99, 100.
 */
export function isDoubles(roll: number): boolean {
  if (roll <= 0 || roll >= 100) return true;
  const tens = Math.floor(roll / 10);
  const ones = roll % 10;
  return tens === ones;
}

/**
 * Evaluates a 1d100 roll against a target stat in Mothership 1e.
 * - Rolling <= target: SUCCESS (or CRITICAL SUCCESS if doubles)
 * - Rolling > target: FAILURE (or CRITICAL FAILURE if doubles)
 */
export function evaluateRoll(roll: number, target: number): RollResultType {
  const isSuccess = roll <= target;
  const critical = isDoubles(roll);

  if (critical) {
    return isSuccess ? "CRITICAL SUCCESS" : "CRITICAL FAILURE";
  }
  return isSuccess ? "SUCCESS" : "FAILURE";
}

/**
 * Formats a clean summary string for roll templates.
 */
export function formatRollSummary(
  name: string,
  roll: number,
  target: number,
  result: RollResultType,
): string {
  return `${name}: Rolled ${roll} vs Target ${target} [${result}]`;
}
