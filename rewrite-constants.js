import fs from "fs";

const content = `import { Stats, Saves, SkillLevels, Skills } from "./enums";

export type HeaderField = {
  label: string;
  attr: string;
  type: "text" | "number";
};

export const headerfields = [
  { label: "name", attr: "character_name", type: "text" },
  { label: "level", attr: "level", type: "number" },
  { label: "rank / title", attr: "rank_title", type: "text" },
  { label: "XP", attr: "xp", type: "text" },
  { label: "class", attr: "class", type: "text" }
] as const satisfies readonly HeaderField[];

export type TopRowField = {
  attr: string;
  subtext: string;
  placeholder: string;
};

export const toprowfields = [
  { attr: "stress", subtext: "starts at 2", placeholder: "2" },
  { attr: "resolve", subtext: "starts at 0", placeholder: "0" }
] as const satisfies readonly TopRowField[];

export type StatDef = {
  attr: typeof Stats[keyof typeof Stats];
  label: string;
};

export const stats = {
  [Stats.Strength]: {
    attr: Stats.Strength,
    label: "Holding airlocks closed, carrying fallen comrades, climbing, pushing, jumping.",
  },
  [Stats.Speed]: {
    attr: Stats.Speed,
    label: "Getting out of the cargo bay before the blast doors close, acting before someone (or something) else, running away.",
  },
  [Stats.Intellect]: {
    attr: Stats.Intellect,
    label: "Recalling your training and experience under duress, thinking through difficult problems, inventing or fixing things.",
  },
  [Stats.Combat]: {
    attr: Stats.Combat,
    label: "Fighting for your life.",
  },
} as const satisfies Record<typeof Stats[keyof typeof Stats], StatDef>;

export type SaveDef = {
  name: typeof Saves[keyof typeof Saves];
  desc: string;
};

export const saves = {
  [Saves.Sanity]: {
    name: Saves.Sanity,
    desc: "Rationalize logical inconsistencies in the universe, make sense out of chaos, detect illusions and mimicry, cope with Stress.",
  },
  [Saves.Fear]: {
    name: Saves.Fear,
    desc: "Maintain a level head while struggling with fear, loneliness, depression, and other emotional surges.",
  },
  [Saves.Body]: {
    name: Saves.Body,
    desc: "Employ quick reflexes and resist hunger, disease, or organisms that might try and invade your insides.",
  },
} as const satisfies Record<typeof Saves[keyof typeof Saves], SaveDef>;

export type SkillDef = {
  name: typeof Skills[keyof typeof Skills];
  level: typeof SkillLevels[keyof typeof SkillLevels];
  desc: string;
  prereq?: readonly typeof Skills[keyof typeof Skills][];
};

export const skills = {
  [Skills.Linguistics]: { name: Skills.Linguistics, level: SkillLevels.Trained, desc: "The study of languages (alive, dead, and undiscovered)." },
  [Skills.Zoology]: { name: Skills.Zoology, level: SkillLevels.Trained, desc: "The study of animal life." },
  [Skills.Botany]: { name: Skills.Botany, level: SkillLevels.Trained, desc: "The study of plant life." },
  [Skills.Geology]: { name: Skills.Geology, level: SkillLevels.Trained, desc: "The study of the solid features of any terrestrial planet or its satellites." },
  [Skills.IndustrialEquipment]: { name: Skills.IndustrialEquipment, level: SkillLevels.Trained, desc: "The safe and proper use of heavy machinery and tools (exosuits, forklifts, drills, breakers, laser cutters, etc.)." },
  [Skills.JuryRigging]: { name: Skills.JuryRigging, level: SkillLevels.Trained, desc: "Makeshift repair, using only the tools and materials at hand." },
  [Skills.Chemistry]: { name: Skills.Chemistry, level: SkillLevels.Trained, desc: "The study of matter and its chemical elements and compounds." },
  [Skills.Computers]: { name: Skills.Computers, level: SkillLevels.Trained, desc: "Fluent use of computers and their networks." },
  [Skills.ZeroG]: { name: Skills.ZeroG, level: SkillLevels.Trained, desc: "Practice and know-how of working in a vacuum, orientation, vaccsuit operation, etc." },
  [Skills.Mathematics]: { name: Skills.Mathematics, level: SkillLevels.Trained, desc: "The study of numbers, quantity, and space." },
  [Skills.Art]: { name: Skills.Art, level: SkillLevels.Trained, desc: "The expression or application of a species’ creative ability and imagination." },
  [Skills.Archaeology]: { name: Skills.Archaeology, level: SkillLevels.Trained, desc: "Ancient cultures and artifacts." },
  [Skills.Theology]: { name: Skills.Theology, level: SkillLevels.Trained, desc: "The study of the divine or devotion to a religion." },
  [Skills.MilitaryTraining]: { name: Skills.MilitaryTraining, level: SkillLevels.Trained, desc: "Basic training provided to all military personnel." },
  [Skills.Rimwise]: { name: Skills.Rimwise, level: SkillLevels.Trained, desc: "Practical knowledge and know-how regarding outer Rim colonies, their customs, and the seedier parts of the galaxy." },
  [Skills.Athletics]: { name: Skills.Athletics, level: SkillLevels.Trained, desc: "Physical fitness, sports, and games." },

  [Skills.Psychology]: { name: Skills.Psychology, level: SkillLevels.Expert, prereq: [Skills.Linguistics, Skills.Zoology, Skills.Botany], desc: "The study of behavior and the human mind." },
  [Skills.Pathology]: { name: Skills.Pathology, level: SkillLevels.Expert, prereq: [Skills.Zoology, Skills.Botany], desc: "Study of the causes and effects of diseases." },
  [Skills.FieldMedicine]: { name: Skills.FieldMedicine, level: SkillLevels.Expert, prereq: [Skills.Zoology, Skills.Botany], desc: "Emergency medical care and treatment." },
  [Skills.Ecology]: { name: Skills.Ecology, level: SkillLevels.Expert, prereq: [Skills.Botany, Skills.Geology], desc: "The study of organisms and how they relate to their environment." },
  [Skills.WildernessSurvival]: { name: Skills.WildernessSurvival, level: SkillLevels.Expert, prereq: [Skills.Botany], desc: "Applicable know-how regarding the basic necessities of life (food, water, shelter) in a natural environment." },
  [Skills.AsteroidMining]: { name: Skills.AsteroidMining, level: SkillLevels.Expert, prereq: [Skills.Geology, Skills.IndustrialEquipment], desc: "Training in the tools and procedures used for mining asteroids." },
  [Skills.MechanicalRepair]: { name: Skills.MechanicalRepair, level: SkillLevels.Expert, prereq: [Skills.IndustrialEquipment, Skills.JuryRigging], desc: "Fixing broken machines." },
  [Skills.Explosives]: { name: Skills.Explosives, level: SkillLevels.Expert, prereq: [Skills.JuryRigging, Skills.Chemistry, Skills.MilitaryTraining], desc: "Design and effective use of explosive devices (bombs, grenades, shells, land mines, etc.)." },
  [Skills.Pharmacology]: { name: Skills.Pharmacology, level: SkillLevels.Expert, prereq: [Skills.Chemistry], desc: "Study of drugs and medication." },
  [Skills.Hacking]: { name: Skills.Hacking, level: SkillLevels.Expert, prereq: [Skills.Computers], desc: "Unauthorized access to computer systems and networks." },
  [Skills.Piloting]: { name: Skills.Piloting, level: SkillLevels.Expert, prereq: [Skills.ZeroG], desc: "Operation and control of aircraft, spacecraft, and other vehicles." },
  [Skills.Physics]: { name: Skills.Physics, level: SkillLevels.Expert, prereq: [Skills.Mathematics], desc: "Study of matter, motion, energy, and their effects in space and time." },
  [Skills.Mysticism]: { name: Skills.Mysticism, level: SkillLevels.Expert, prereq: [Skills.Art, Skills.Archaeology, Skills.Theology], desc: "Spiritual apprehension of hidden knowledge." },
  [Skills.Firearms]: { name: Skills.Firearms, level: SkillLevels.Expert, prereq: [Skills.MilitaryTraining, Skills.Rimwise], desc: "Safe and effective use of guns." },
  [Skills.HandToHandCombat]: { name: Skills.HandToHandCombat, level: SkillLevels.Expert, prereq: [Skills.MilitaryTraining, Skills.Rimwise, Skills.Athletics], desc: "Melee fighting, brawling, martial arts, etc." },

  [Skills.Sophontology]: { name: Skills.Sophontology, level: SkillLevels.Master, prereq: [Skills.Psychology], desc: "The study of the behavior and mind of inhuman entities." },
  [Skills.Exobiology]: { name: Skills.Exobiology, level: SkillLevels.Master, prereq: [Skills.Pathology], desc: "The study of and search for intelligent alien life." },
  [Skills.Surgery]: { name: Skills.Surgery, level: SkillLevels.Master, prereq: [Skills.Pathology, Skills.FieldMedicine], desc: "Manually operating on living or dead biological subjects." },
  [Skills.Planetology]: { name: Skills.Planetology, level: SkillLevels.Master, prereq: [Skills.Ecology, Skills.AsteroidMining], desc: "Study of planets and other celestial bodies." },
  [Skills.Robotics]: { name: Skills.Robotics, level: SkillLevels.Master, prereq: [Skills.MechanicalRepair], desc: "Design, maintenance, and operation of robots, drones, and androids." },
  [Skills.Engineering]: { name: Skills.Engineering, level: SkillLevels.Master, prereq: [Skills.MechanicalRepair], desc: "The design, building, and use of engines, machines, and structures." },
  [Skills.Cybernetics]: { name: Skills.Cybernetics, level: SkillLevels.Master, prereq: [Skills.MechanicalRepair], desc: "The physical and neural interfaces between organisms and machines." },
  [Skills.ArtificialIntelligence]: { name: Skills.ArtificialIntelligence, level: SkillLevels.Master, prereq: [Skills.Hacking], desc: "The study of intelligence as demonstrated by machines." },
  [Skills.Hyperspace]: { name: Skills.Hyperspace, level: SkillLevels.Master, prereq: [Skills.Piloting, Skills.Physics, Skills.Mysticism], desc: "Faster-than-light travel." },
  [Skills.Xenoesotericism]: { name: Skills.Xenoesotericism, level: SkillLevels.Master, prereq: [Skills.Mysticism], desc: "Obscure beliefs, mysticism, and religion regarding non-human entities." },
  [Skills.Command]: { name: Skills.Command, level: SkillLevels.Master, prereq: [Skills.Piloting, Skills.Firearms], desc: "Leadership, management, and authority." },
} as const satisfies Record<typeof Skills[keyof typeof Skills], SkillDef>;
\n`;
fs.writeFileSync("src/game/constants.ts", content);
