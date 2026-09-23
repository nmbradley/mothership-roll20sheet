/** Shapes for the data Roll20's charactermancer hands back. */

/** Charactermancer steps, in the order the player completes them. */
export const Steps = {
  Stats: "stats",
  Class: "class",
  Skills: "skills",
  Equipment: "equipment",
  Review: "review",
} as const;
export type Step = (typeof Steps)[keyof typeof Steps];

/** Attribute values captured on one step. Absent until the player fills them. */
export type StepValues = Record<string, string | undefined>;

export type StepData = {
  values?: StepValues;
  /** Row ids for any repeating section on the step. */
  repeating?: string[];
};

export type CharmancerData = Partial<Record<Step, StepData>>;

/** Stats carried across every step and shown on the topbar and review. */
export const TrackedStats = [
  "strength",
  "speed",
  "intellect",
  "combat",
  "health",
  "stress",
  "resolve",
  "sanity",
  "fear",
  "body",
  "armor",
] as const;
export type TrackedStat = (typeof TrackedStats)[number];

/** Every tracked stat resolved to a number, or null where not yet determined. */
export type StatTotals = Record<TrackedStat, number | null>;
