import {
  SkillLevels, Skills, Stats, type SkillLevel, type Stat,
} from "#game/enums.js";
import { titleCase } from "#game/text.js";

import {
  D100, EDGE_QUERY, readDice, readTarget, skillQuery,
} from "./checks";
import {
  COMPUTED, TEMPLATE_PHRASES, checkComputed, checkTemplate,
} from "./rollTemplate";
import {
  Outcomes, makeCheck, type Outcome,
} from "./rolls";

export const skillList = {
  "linguistics": { unlocks: ["sophontology"] },
  "biology": { unlocks: ["genetics", "psychology"] },
  "first_aid": { unlocks: ["pathology"] },
  "hydroponics": { unlocks: ["botany"] },
  "geology": { unlocks: ["planetology", "asteroid_mining"] },
  "zero-g": { unlocks: ["asteroid_mining"] },
  "scavenging": { unlocks: ["asteroid_mining", "jury_rigging"] },
  "heavy_machinery": { unlocks: ["asteroid_mining", "engineering"] },
  "computers": { unlocks: ["engineering", "hacking"] },
  "mechanical_repair": { unlocks: ["engineering", "jury_rigging", "vehicle_specialization"] },
  "driving": { unlocks: ["vehicle_specialization"] },
  "piloting": { unlocks: ["vehicle_specialization", "astrogation"] },
  "mathematics": { unlocks: ["physics"] },
  "art": { unlocks: ["mysticism"] },
  "archaeology": { unlocks: ["mysticism"] },
  "theology": { unlocks: ["mysticism"] },
  "military_training": { unlocks: ["tactics", "gunnery", "firearms", "explosives", "close-quarters_combat"] },
  "rimwise": { unlocks: ["firearms", "close-quarters_combat"] },
  "athletics": { unlocks: ["close-quarters_combat"] },
  "chemistry": { unlocks: ["explosives"] },
  "psychology": { unlocks: ["sophontology"] },
  "genetics": { unlocks: ["xenobiology"] },
  "pathology": { unlocks: ["xenobiology", "surgery"] },
  "botany": { unlocks: ["xenobiology"] },
  "planetology": { unlocks: [] },
  "asteroid_mining": { unlocks: [] },
  "jury_rigging": { unlocks: ["cybernetics"] },
  "engineering": { unlocks: ["cybernetics", "robotics", "artificial_intelligence"] },
  "hacking": { unlocks: ["artificial_intelligence"] },
  "vehicle_specialization": { unlocks: ["command"] },
  "astrogation": { unlocks: ["hyperspace"] },
  "physics": { unlocks: ["hyperspace"] },
  "mysticism": { unlocks: ["xenoesotericism", "hyperspace"] },
  "tactics": { unlocks: ["command"] },
  "gunnery": { unlocks: ["weapon_specialization"] },
  "firearms": { unlocks: ["weapon_specialization"] },
  "close-quarters_combat": { unlocks: ["weapon_specialization"] },
  "explosives": { unlocks: ["weapon_specialization"] },
  "sophontology": {},
  "xenobiology": {},
  "surgery": {},
  "cybernetics": {},
  "robotics": {},
  "artificial_intelligence": {},
  "command": {},
  "hyperspace": {},
  "xenoesotericism": {},
  "weapon_specialization": {},
};

/**
 * In-game Skill Training (#49): the years and credits it costs to advance a
 * Skill outside character creation. Trained has no prerequisite; Expert and
 * Master each require that same Skill already sitting one tier down -- the
 * sheet has no way to check a player's own free-text Skill rows for that, so
 * this is a reference the player and Warden apply by hand, the same way the
 * printed sheet's Skill list already works.
 */
export type SkillTrainingCost = {
  years: number;
  credits: string;
  prereq?: SkillLevel;
};

export const SKILL_TRAINING_COSTS: Record<SkillLevel, SkillTrainingCost> = {
  [SkillLevels.Trained]: {
    years: 2,
    credits: "10kcr",
  },
  [SkillLevels.Expert]: {
    years: 4,
    credits: "50kcr",
    prereq: SkillLevels.Trained,
  },
  [SkillLevels.Master]: {
    years: 6,
    credits: "200kcr",
    prereq: SkillLevels.Expert,
  },
};

/** A Skill an outcome grants outright, alongside however many the player picks. */
export type SkillGrant = {
  name: string;
  level: SkillLevel;
};

export type MilitaryTrainingResult = {
  outcome: Outcome;
  killed: boolean;
  namedSkills: readonly SkillGrant[];
  bonusSkillCount: number;
  bonusSkillLevel: SkillLevel;
  combatBonus: number;
  statReduction: number;
  marineTraumaResponse: boolean;
  message: string;
};

const MILITARY_TRAINING_SKILLS: readonly SkillGrant[] = [
  {
    name: titleCase(Skills.MilitaryTraining),
    level: SkillLevels.Trained,
  },
  {
    name: titleCase(Skills.Athletics),
    level: SkillLevels.Trained,
  },
];

/**
 * Grades the Military Training exception's Combat Check (#49):
 * - Critical Failure: killed in action -- nothing else is granted.
 * - Failure: Military Training, Athletics and 1 Trained Skill of choice.
 * - Success: the above, plus +10 Combat, -10 to a chosen Stat and 2 Trained
 *   Skills of choice.
 * - Critical Success: as Success, but 1 Expert Skill of choice rather than 2
 *   Trained.
 * Every outcome but a Critical Failure also grants Marine Trauma Response.
 */
export function evaluateMilitaryTraining(outcome: Outcome): MilitaryTrainingResult {
  if (outcome === Outcomes.CriticalFailure) {
    return {
      outcome,
      killed: true,
      namedSkills: [],
      bonusSkillCount: 0,
      bonusSkillLevel: SkillLevels.Trained,
      combatBonus: 0,
      statReduction: 0,
      marineTraumaResponse: false,
      message: "CRITICAL FAILURE: Killed in action.",
    };
  }

  if (outcome === Outcomes.Failure) {
    return {
      outcome,
      killed: false,
      namedSkills: MILITARY_TRAINING_SKILLS,
      bonusSkillCount: 1,
      bonusSkillLevel: SkillLevels.Trained,
      combatBonus: 0,
      statReduction: 0,
      marineTraumaResponse: true,
      message: "FAILURE: Gain Military Training, Athletics, 1 Trained Skill of your choice, and Marine Trauma Response.",
    };
  }

  const isCritical = outcome === Outcomes.CriticalSuccess;
  return {
    outcome,
    killed: false,
    namedSkills: MILITARY_TRAINING_SKILLS,
    bonusSkillCount: isCritical ? 1 : 2,
    bonusSkillLevel: isCritical ? SkillLevels.Expert : SkillLevels.Trained,
    combatBonus: 10,
    statReduction: 10,
    marineTraumaResponse: true,
    message: isCritical
      ? "CRITICAL SUCCESS: Gain Military Training, Athletics, 1 Expert Skill of your choice, +10 Combat, -10 to a chosen Stat, and Marine Trauma Response."
      : "SUCCESS: Gain Military Training, Athletics, 2 Trained Skills of your choice, +10 Combat, -10 to a chosen Stat, and Marine Trauma Response.",
  };
}

/** Combat is what this exception raises, not a Stat it can spend, so it is left out. */
const REDUCIBLE_STATS: readonly Stat[] = [Stats.Strength, Stats.Speed, Stats.Intellect];

/**
 * The Stat-to-reduce query, coded numerically like damage.ts's damage-type
 * query so it can sit inside an inline roll and be read back from `results`
 * -- a `?{}` outside `[[...]]` only ever reaches chat as text, never the
 * sheetworker.
 */
function statReductionQuery(): string {
  const options = REDUCIBLE_STATS
    .map((stat, index) => `${titleCase(stat)},${index}`)
    .join("|");
  return `?{Stat to Reduce|${options}}`;
}

function readReducedStat(index: number): Stat {
  return REDUCIBLE_STATS[index] ?? Stats.Strength;
}

/**
 * Roll20 Sheetworker: Military Training (#49)
 *
 * Rolls the same Combat Check as the sheet's own Combat button, but grades
 * its own consequences afterwards rather than through checkComputed(): which
 * Skills, Stat and Affliction to grant vary by outcome in a way no other
 * check needs, so the Notes placeholder is filled in here instead.
 */
export async function handleMilitaryTraining(): Promise<void> {
  const template = `${checkTemplate({
    i18nKey: TEMPLATE_PHRASES.MilitaryTraining,
    target: `@{combat}+${skillQuery()}`,
    die: D100,
  })} {{edge=[[${EDGE_QUERY}]]}} {{stat_choice=[[${statReductionQuery()}]]}}`;

  const rollData = await startRoll(template);
  const statEntry = rollData.results["stat_choice"];
  if (statEntry === undefined) return;

  const dice = readDice(rollData.results);
  const check = makeCheck({
    name: "",
    i18nKey: TEMPLATE_PHRASES.MilitaryTraining,
    target: readTarget(rollData.results),
    rolls: dice.rolls,
    edge: dice.edge,
  });

  const evaluation = evaluateMilitaryTraining(check.outcome);

  finishRoll(rollData.rollId, {
    ...checkComputed(check),
    [COMPUTED.Notes]: evaluation.message,
  });

  if (evaluation.killed) return;

  const reducedStat = readReducedStat(statEntry.result);
  getAttrs(["combat", reducedStat], (attrs) => {
    const updates: Record<string, string | number> = {};

    for (const skill of evaluation.namedSkills) {
      const rowId = generateRowID();
      updates[`repeating_trained_${rowId}_skill_name`] = skill.name;
    }

    if (evaluation.marineTraumaResponse) {
      const afflictionId = generateRowID();
      updates[`repeating_afflictions_${afflictionId}_affliction_name`] = "Marine Trauma Response";
      updates[`repeating_afflictions_${afflictionId}_affliction_settings`] = "0";
    }

    if (evaluation.combatBonus > 0) {
      updates["combat"] = (Number(attrs.combat) || 0) + evaluation.combatBonus;
    }

    if (evaluation.statReduction > 0) {
      updates[reducedStat] = (Number(attrs[reducedStat]) || 0) - evaluation.statReduction;
    }

    setAttrs(updates);
  });
}
