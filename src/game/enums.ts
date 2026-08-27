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
/** Every stat in the order the sheet presents them. */
export const allStats: readonly Stat[] = Object.values(Stats);

export const Saves = {
  Sanity: "sanity",
  Fear: "fear",
  Body: "body",
} as const;
export type Save = EntryOf<typeof Saves>;
export type SavesKey = KeyOf<typeof Saves>;
/** Every save in the order the sheet presents them. */
export const allSaves: readonly Save[] = Object.values(Saves);

// The Wounds Table (#52) reads a different column per damage type; a weapon
// or hazard picks the column, the d10 picks the row.
export const DamageTypes = {
  Blunt: "blunt",
  Bleeding: "bleeding",
  Gunshot: "gunshot",
  Fire: "fire",
  Gore: "gore",
} as const;
export type DamageType = EntryOf<typeof DamageTypes>;
export type DamageTypesKey = KeyOf<typeof DamageTypes>;
/** Every damage type, in the order the Wounds Table's columns and its query present them. */
export const allDamageTypes: readonly DamageType[] = Object.values(DamageTypes);

// Range, distance and movement are tracked abstractly in Range Bands.
// Named RangeBand rather than Range so it does not shadow the DOM's Range type.
export const RangeBands = {
  Adjacent: "adjacent",
  Close: "close",
  Long: "long",
  Extreme: "extreme",
} as const;
export type RangeBand = EntryOf<typeof RangeBands>;
export type RangeBandsKey = KeyOf<typeof RangeBands>;

// Ship-to-ship combat uses its own bands, listed closest first. A ship at
// Contact range can be boarded; only the longest weapons reach Detection.
export const ShipRangeBands = {
  Contact: "contact",
  Firing: "firing",
  Detection: "detection",
} as const;
export type ShipRangeBand = EntryOf<typeof ShipRangeBands>;
export type ShipRangeBandsKey = KeyOf<typeof ShipRangeBands>;

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
