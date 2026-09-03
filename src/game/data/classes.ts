import { SKILL_COST } from "#game/constants.js";
import {
  allSkillLevels,
  Classes,
  Saves,
  Skills,
  SkillLevels,
  Stats,
  type Class,
  type Save,
  type Skill,
  type SkillLevel,
  type Stat,
} from "#game/enums.js";

/**
 * A bonus the player applies to a stat or save of their choice, rather than to
 * a named one. The Android's -10 and the Scientist's +5 both work this way.
 */
export type FloatingBonus = {
  amount: number;
  /** How many stats the player may spread it across. */
  count: number;
};

/**
 * Skills a class grants outright, plus the budget it gives for choosing more.
 *
 * Most classes choose freely across tiers: the book writes the bonus as tiers
 * ("1 Expert Skill OR 2 Trained Skills"), which `skillPoints` already
 * expresses -- a Trained skill costs 1, an Expert 2 and a Master 3, so the
 * Marine's 2 points buy either option. Storing points rather than the printed
 * wording keeps the either/or working without the data having to enumerate
 * every combination.
 *
 * The Teamster's "1 Trained AND 1 Expert" is not a budget -- it is a fixed
 * pair, and a shared point total would also buy illegal combinations like 3
 * Trained or 1 Master. `requiredTiers` states the exact count owed at each
 * tier instead, with every unlisted tier off limits.
 *
 * The Scientist is the odd one out in a different way: instead of named
 * skills it takes a Master skill together with the Expert and Trained skills
 * that unlock it.
 */
export type ClassSkills = {
  granted: readonly Skill[];
  /** A budget to spend freely across tiers, e.g. the Marine's "1 Expert, or 2 Trained". */
  skillPoints?: number;
  /** An exact count owed at each tier, e.g. the Teamster's "1 Trained and 1 Expert". */
  requiredTiers?: Partial<Record<SkillLevel, number>>;
  /** Set where the class picks a Master skill and its whole prerequisite chain. */
  grantsMasterChain?: boolean;
};

/** The skill-point cost a class's grant represents, for display and budgeting. */
export function totalSkillPoints(skills: ClassSkills): number {
  if (skills.skillPoints !== undefined) return skills.skillPoints;

  let total = 0;
  for (const [level, count] of Object.entries(skills.requiredTiers ?? {})) {
    total += SKILL_COST[level as SkillLevel] * count;
  }
  return total;
}

/**
 * Which skill tiers remain purchasable, and how many points are left, given a
 * class's skill budget and how many non-granted skills the player has bought
 * at each tier so far.
 *
 * A free budget (`skillPoints`) locks a tier once there are not enough points
 * left to afford it. A fixed budget (`requiredTiers`) locks a tier once its
 * own count is met regardless of points spent elsewhere, and locks a tier the
 * class does not list from the start.
 */
export function evaluateSkillBudget(
  skills: ClassSkills,
  purchasedByLevel: Readonly<Record<SkillLevel, number>>,
): {
  remaining: number;
  locked: Record<SkillLevel, boolean>;
} {
  let spent = 0;
  for (const level of allSkillLevels) {
    spent += SKILL_COST[level] * purchasedByLevel[level];
  }
  const remaining = totalSkillPoints(skills) - spent;

  if (skills.requiredTiers !== undefined) {
    const requiredTiers = skills.requiredTiers;
    const locked = {} as Record<SkillLevel, boolean>;
    for (const level of allSkillLevels) {
      locked[level] = purchasedByLevel[level] >= (requiredTiers[level] ?? 0);
    }
    return {
      remaining,
      locked,
    };
  }

  return {
    remaining,
    locked: {
      [SkillLevels.Trained]: remaining <= 0,
      [SkillLevels.Expert]: remaining <= 1,
      [SkillLevels.Master]: remaining <= 2,
    },
  };
}

export type ClassDef = {
  name: Class;
  desc: string;
  /** Bonuses applied to named stats. */
  statBonus: Partial<Record<Stat, number>>;
  /** Bonuses applied to named saves. */
  saveBonus: Partial<Record<Save, number>>;
  /** A bonus the player assigns themselves, where the class has one. */
  floating?: FloatingBonus;
  maxWoundsBonus: number;
  skills: ClassSkills;
  /** The class's trauma response, triggered on Panic. */
  traumaResponse: string;
};

export type ClassesMap = Record<Class, ClassDef>;

/** Every class, as printed in the Player's Survival Guide. */
export const classes = {
  [Classes.Marine]: {
    name: Classes.Marine,
    desc: "Handy in a fight, but whenever they Panic it may cause problems for "
      + "the rest of the crew.",
    statBonus: { [Stats.Combat]: 10 },
    saveBonus: {
      [Saves.Body]: 10,
      [Saves.Fear]: 20,
    },
    maxWoundsBonus: 1,
    skills: {
      granted: [Skills.MilitaryTraining, Skills.Athletics],
      // 1 Expert, or 2 Trained.
      skillPoints: 2,
    },
    traumaResponse: "Whenever you Panic, every Close friendly player must make "
      + "a Fear Save.",
  },
  [Classes.Android]: {
    name: Classes.Android,
    desc: "A terrifying and exciting addition to any crew. They tend to unnerve "
      + "other crewmembers with their cold inhumanity.",
    statBonus: { [Stats.Intellect]: 20 },
    saveBonus: { [Saves.Fear]: 60 },
    floating: {
      amount: -10,
      count: 1,
    },
    maxWoundsBonus: 1,
    skills: {
      granted: [Skills.Linguistics, Skills.Computers, Skills.Mathematics],
      // 1 Expert, or 2 Trained.
      skillPoints: 2,
    },
    traumaResponse: "Fear Saves made by Close friendly players are at Disadvantage.",
  },
  [Classes.Scientist]: {
    name: Classes.Scientist,
    desc: "Doctors, researchers, or anyone who wants to slice open creatures "
      + "(or infected crewmembers) with a scalpel.",
    statBonus: { [Stats.Intellect]: 10 },
    saveBonus: { [Saves.Sanity]: 30 },
    floating: {
      amount: 5,
      count: 1,
    },
    maxWoundsBonus: 0,
    skills: {
      granted: [],
      // 1 Trained, on top of the Master chain.
      skillPoints: 1,
      grantsMasterChain: true,
    },
    traumaResponse: "Whenever you fail a Sanity Save, all Close friendly players "
      + "gain 1 Stress.",
  },
  [Classes.Teamster]: {
    name: Classes.Teamster,
    desc: "Rough and tumble blue-collar space workers, mechanics, engineers, "
      + "miners, and pilots.",
    statBonus: {
      [Stats.Strength]: 5,
      [Stats.Speed]: 5,
      [Stats.Intellect]: 5,
      [Stats.Combat]: 5,
    },
    saveBonus: {
      [Saves.Sanity]: 10,
      [Saves.Fear]: 10,
      [Saves.Body]: 10,
    },
    maxWoundsBonus: 0,
    skills: {
      granted: [Skills.IndustrialEquipment, Skills.ZeroG],
      requiredTiers: {
        [SkillLevels.Trained]: 1,
        [SkillLevels.Expert]: 1,
      },
    },
    traumaResponse: "Once per session, you may take Advantage on a Panic Check.",
  },
} as const satisfies ClassesMap;
