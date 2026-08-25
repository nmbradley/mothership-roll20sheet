export type KeyOf<T> = keyof T;
export type EntryOf<T> = T[keyof T];

export const Stats = {
  Strength: "strength",
  Speed: "speed",
  Intellect: "intellect",
  Combat: "combat",
} as const;
export type Stat = EntryOf<typeof Stats>;
export type StatsKey = KeyOf<typeof Stats>;

export const Saves = {
  Sanity: "sanity",
  Fear: "fear",
  Body: "body",
} as const;
export type Save = EntryOf<typeof Saves>;
export type SavesKey = KeyOf<typeof Saves>;

export const Classes = {
  Marine: "marine",
  Android: "android",
  Scientist: "scientist",
  Teamster: "teamster",
} as const;
export type Class = EntryOf<typeof Classes>;
export type ClassesKey = KeyOf<typeof Classes>;

export const SkillLevels = {
  Trained: "trained",
  Expert: "expert",
  Master: "master",
} as const;
export type SkillLevel = EntryOf<typeof SkillLevels>;
export type SkillLevelsKey = KeyOf<typeof SkillLevels>;

export const Skills = {
  Linguistics: "linguistics",
  Zoology: "zoology",
  Botany: "botany",
  Geology: "geology",
  IndustrialEquipment: "industrial equipment",
  JuryRigging: "jury-rigging",
  Chemistry: "chemistry",
  Computers: "computers",
  ZeroG: "zero-g",
  Mathematics: "mathematics",
  Art: "art",
  Archaeology: "archaeology",
  Theology: "theology",
  MilitaryTraining: "military training",
  Rimwise: "rimwise",
  Athletics: "athletics",
  Psychology: "psychology",
  Pathology: "pathology",
  FieldMedicine: "field medicine",
  Ecology: "ecology",
  WildernessSurvival: "wilderness survival",
  AsteroidMining: "asteroid mining",
  MechanicalRepair: "mechanical repair",
  Explosives: "explosives",
  Pharmacology: "pharmacology",
  Hacking: "hacking",
  Piloting: "piloting",
  Physics: "physics",
  Mysticism: "mysticism",
  Firearms: "firearms",
  HandToHandCombat: "hand-to-hand combat",
  Sophontology: "sophontology",
  Exobiology: "exobiology",
  Surgery: "surgery",
  Planetology: "planetology",
  Robotics: "robotics",
  Engineering: "engineering",
  Cybernetics: "cybernetics",
  ArtificialIntelligence: "artificial intelligence",
  Hyperspace: "hyperspace",
  Xenoesotericism: "xenoesotericism",
  Command: "command",
} as const;
export type Skill = EntryOf<typeof Skills>;
export type SkillsKey = KeyOf<typeof Skills>;
