import {
  Steps,
  TrackedStats,
  type CharmancerData,
  type StatTotals,
  type Step,
  type StepValues,
} from "./types";

/**
 * Steps that can carry a stat value, earliest first. A later step overrides an
 * earlier one, so the class's Strength beats the rolled Strength.
 */
const VALUE_STEPS: readonly Step[] = [Steps.Stats, Steps.Class, Steps.Skills, Steps.Equipment];

/** The charactermancer's data, narrowed to the shape the slides expect. */
export function charmancerData(): CharmancerData {
  const data = getCharmancerData();
  return data;
}

/** Values captured on one step; empty when the player has not reached it. */
export function stepValues(data: CharmancerData, step: Step): StepValues {
  const values = data[step]?.values;
  return values ?? {};
}

/** Repeating row ids on one step; empty when the step has none. */
export function stepRows(data: CharmancerData, step: Step): readonly string[] {
  const rows = data[step]?.repeating;
  return rows ?? [];
}

/**
 * The value for a key from the latest step that set it.
 *
 * This replaces the nested conditionals the slides used to repeat: rather than
 * probing each step in turn at every call site, the precedence lives here once.
 */
export function resolveValue(data: CharmancerData, key: string): string | undefined {
  let found: string | undefined;
  for (const step of VALUE_STEPS) {
    const value = stepValues(data, step)[key];
    if (value) found = value;
  }
  return found;
}

/** A resolved value as a number, or `fallback` when unset or unparseable. */
export function resolveNumber(data: CharmancerData, key: string, fallback = 0): number {
  const raw = resolveValue(data, key);
  if (raw === undefined) return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

/**
 * Every tracked stat resolved to its base plus modifier.
 *
 * Returns a fully populated record so callers can render it directly: a stat the
 * player has not reached yet is null rather than missing.
 */
export function statTotals(data: CharmancerData): StatTotals {
  const totals = {} as StatTotals;
  for (const stat of TrackedStats) {
    const base = resolveValue(data, stat);
    if (base === undefined) {
      totals[stat] = null;
    } else {
      const value = resolveNumber(data, stat);
      const mod = resolveNumber(data, `${stat}_mod`);
      totals[stat] = value + mod;
    }
  }
  return totals;
}

/** Renders a total for display, showing an unreached stat as a dash. */
export function displayTotal(total: number | null): string {
  return total === null ? "-" : String(total);
}

/** Parses JSON that the compendium may have already given us as a plain value. */
export function parseJSON(raw: string | undefined): unknown {
  if (raw === undefined || raw === "") return undefined;
  try {
    const parsed: unknown = JSON.parse(raw);
    return parsed;
  } catch {
    return undefined;
  }
}

/** Parsed JSON as an array of strings, or [] when it is neither. */
export function parseStringList(raw: string | undefined): readonly string[] {
  const parsed = parseJSON(raw);
  if (!Array.isArray(parsed)) return [];
  const strings = parsed.filter((item): item is string => typeof item === "string");
  return strings;
}

/**
 * Renders an equipment list, where an entry is either a bare name or a
 * [name, quantity] pair.
 */
export function describeItems(items: readonly (string | [string, string])[]): string {
  const described = items.map((item) => (Array.isArray(item) ? `${item[0]} (${item[1]})` : item));
  const joined = described.join(", ");
  return joined;
}

/** An attribute-safe key: the compendium writes skill names with spaces. */
export function attributeKey(name: string): string {
  const lower = name.toLowerCase();
  const key = lower.replaceAll(" ", "_");
  return key;
}
