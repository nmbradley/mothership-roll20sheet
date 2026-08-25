import {
  Stats, Saves, SkillLevels, Skills, type Stat, type Save, type SkillLevel, type Skill,
} from "./enums";

export type StatDef = { attr: Stat;
  label: string; };

export type StatsMap = Record<Stat, StatDef>;

export const stats = {
  [Stats.Strength]: { attr: Stats.Strength,
    label: "Holding airlocks closed, carrying fallen comrades, climbing, pushing, jumping." },
  [Stats.Speed]: { attr: Stats.Speed,
    label: "Getting out of the cargo bay before the blast doors close, acting before someone (or something) else, running away." },
  [Stats.Intellect]: { attr: Stats.Intellect,
    label: "Recalling your training and experience under duress, thinking through difficult problems, inventing or fixing things." },
  [Stats.Combat]: { attr: Stats.Combat,
    label: "Fighting for your life." },
} as const satisfies StatsMap;

export type SaveDef = { name: Save;
  desc: string; };

export type SavesMap = Record<Save, SaveDef>;

export const saves = {
  [Saves.Sanity]: { name: Saves.Sanity,
    desc: "Rationalize logical inconsistencies in the universe, make sense out of chaos, detect illusions and mimicry, cope with Stress." },
  [Saves.Fear]: { name: Saves.Fear,
    desc: "Maintain a level head while struggling with fear, loneliness, depression, and other emotional surges." },
  [Saves.Body]: { name: Saves.Body,
    desc: "Employ quick reflexes and resist hunger, disease, or organisms that might try and invade your insides." },
} as const satisfies SavesMap;

export type SkillDef = {
  name: Skill;
  level: SkillLevel;
  desc: string;
  prereq?: readonly Skill[];
};

export type SkillsMap = Record<Skill, SkillDef>;

export const skills = {
  [Skills.Linguistics]: {
    name: Skills.Linguistics,
    level: SkillLevels.Trained,
    desc: "The study of languages (alive, dead, and undiscovered).",
  },
  [Skills.Zoology]: {
    name: Skills.Zoology,
    level: SkillLevels.Trained,
    desc: "The study of animal life.",
  },
  [Skills.Botany]: {
    name: Skills.Botany,
    level: SkillLevels.Trained,
    desc: "The study of plant life.",
  },
  [Skills.Geology]: {
    name: Skills.Geology,
    level: SkillLevels.Trained,
    desc: "The study of the solid features of any terrestrial planet or its satellites.",
  },
  [Skills.IndustrialEquipment]: {
    name: Skills.IndustrialEquipment,
    level: SkillLevels.Trained,
    desc: "The safe and proper use of heavy machinery and tools (exosuits, forklifts, drills, breakers, laser cutters, etc.).",
  },
  [Skills.JuryRigging]: {
    name: Skills.JuryRigging,
    level: SkillLevels.Trained,
    desc: "Makeshift repair, using only the tools and materials at hand.",
  },
  [Skills.Chemistry]: {
    name: Skills.Chemistry,
    level: SkillLevels.Trained,
    desc: "The study of matter and its chemical elements and compounds.",
  },
  [Skills.Computers]: {
    name: Skills.Computers,
    level: SkillLevels.Trained,
    desc: "Fluent use of computers and their networks.",
  },
  [Skills.ZeroG]: {
    name: Skills.ZeroG,
    level: SkillLevels.Trained,
    desc: "Practice and know-how of working in a vacuum, orientation, vaccsuit operation, etc.",
  },
  [Skills.Mathematics]: {
    name: Skills.Mathematics,
    level: SkillLevels.Trained,
    desc: "The study of numbers, quantity, and space.",
  },
  [Skills.Art]: {
    name: Skills.Art,
    level: SkillLevels.Trained,
    desc: "The expression or application of a species’ creative ability and imagination.",
  },
  [Skills.Archaeology]: {
    name: Skills.Archaeology,
    level: SkillLevels.Trained,
    desc: "Ancient cultures and artifacts.",
  },
  [Skills.Theology]: {
    name: Skills.Theology,
    level: SkillLevels.Trained,
    desc: "The study of the divine or devotion to a religion.",
  },
  [Skills.MilitaryTraining]: {
    name: Skills.MilitaryTraining,
    level: SkillLevels.Trained,
    desc: "Basic training provided to all military personnel.",
  },
  [Skills.Rimwise]: {
    name: Skills.Rimwise,
    level: SkillLevels.Trained,
    desc: "Practical knowledge and know-how regarding outer Rim colonies, their customs, and the seedier parts of the galaxy.",
  },
  [Skills.Athletics]: {
    name: Skills.Athletics,
    level: SkillLevels.Trained,
    desc: "Physical fitness, sports, and games.",
  },

  [Skills.Psychology]: {
    name: Skills.Psychology,
    level: SkillLevels.Expert,
    prereq: [Skills.Linguistics, Skills.Zoology, Skills.Botany],
    desc: "The study of behavior and the human mind.",
  },
  [Skills.Pathology]: {
    name: Skills.Pathology,
    level: SkillLevels.Expert,
    prereq: [Skills.Zoology, Skills.Botany],
    desc: "Study of the causes and effects of diseases.",
  },
  [Skills.FieldMedicine]: {
    name: Skills.FieldMedicine,
    level: SkillLevels.Expert,
    prereq: [Skills.Zoology, Skills.Botany],
    desc: "Emergency medical care and treatment.",
  },
  [Skills.Ecology]: {
    name: Skills.Ecology,
    level: SkillLevels.Expert,
    prereq: [Skills.Botany, Skills.Geology],
    desc: "The study of organisms and how they relate to their environment.",
  },
  [Skills.WildernessSurvival]: {
    name: Skills.WildernessSurvival,
    level: SkillLevels.Expert,
    prereq: [Skills.Botany],
    desc: "Applicable know-how regarding the basic necessities of life (food, water, shelter) in a natural environment.",
  },
  [Skills.AsteroidMining]: {
    name: Skills.AsteroidMining,
    level: SkillLevels.Expert,
    prereq: [Skills.Geology, Skills.IndustrialEquipment],
    desc: "Training in the tools and procedures used for mining asteroids.",
  },
  [Skills.MechanicalRepair]: {
    name: Skills.MechanicalRepair,
    level: SkillLevels.Expert,
    prereq: [Skills.IndustrialEquipment, Skills.JuryRigging],
    desc: "Fixing broken machines.",
  },
  [Skills.Explosives]: {
    name: Skills.Explosives,
    level: SkillLevels.Expert,
    prereq: [Skills.JuryRigging, Skills.Chemistry, Skills.MilitaryTraining],
    desc: "Design and effective use of explosive devices (bombs, grenades, shells, land mines, etc.).",
  },
  [Skills.Pharmacology]: {
    name: Skills.Pharmacology,
    level: SkillLevels.Expert,
    prereq: [Skills.Chemistry],
    desc: "Study of drugs and medication.",
  },
  [Skills.Hacking]: {
    name: Skills.Hacking,
    level: SkillLevels.Expert,
    prereq: [Skills.Computers],
    desc: "Unauthorized access to computer systems and networks.",
  },
  [Skills.Piloting]: {
    name: Skills.Piloting,
    level: SkillLevels.Expert,
    prereq: [Skills.ZeroG],
    desc: "Operation and control of aircraft, spacecraft, and other vehicles.",
  },
  [Skills.Physics]: {
    name: Skills.Physics,
    level: SkillLevels.Expert,
    prereq: [Skills.Mathematics],
    desc: "Study of matter, motion, energy, and their effects in space and time.",
  },
  [Skills.Mysticism]: {
    name: Skills.Mysticism,
    level: SkillLevels.Expert,
    prereq: [Skills.Art, Skills.Archaeology, Skills.Theology],
    desc: "Spiritual apprehension of hidden knowledge.",
  },
  [Skills.Firearms]: {
    name: Skills.Firearms,
    level: SkillLevels.Expert,
    prereq: [Skills.MilitaryTraining, Skills.Rimwise],
    desc: "Safe and effective use of guns.",
  },
  [Skills.HandToHandCombat]: {
    name: Skills.HandToHandCombat,
    level: SkillLevels.Expert,
    prereq: [Skills.MilitaryTraining, Skills.Rimwise, Skills.Athletics],
    desc: "Melee fighting, brawling, martial arts, etc.",
  },

  [Skills.Sophontology]: {
    name: Skills.Sophontology,
    level: SkillLevels.Master,
    prereq: [Skills.Psychology],
    desc: "The study of the behavior and mind of inhuman entities.",
  },
  [Skills.Exobiology]: {
    name: Skills.Exobiology,
    level: SkillLevels.Master,
    prereq: [Skills.Pathology],
    desc: "The study of and search for intelligent alien life.",
  },
  [Skills.Surgery]: {
    name: Skills.Surgery,
    level: SkillLevels.Master,
    prereq: [Skills.Pathology, Skills.FieldMedicine],
    desc: "Manually operating on living or dead biological subjects.",
  },
  [Skills.Planetology]: {
    name: Skills.Planetology,
    level: SkillLevels.Master,
    prereq: [Skills.Ecology, Skills.AsteroidMining],
    desc: "Study of planets and other celestial bodies.",
  },
  [Skills.Robotics]: {
    name: Skills.Robotics,
    level: SkillLevels.Master,
    prereq: [Skills.MechanicalRepair],
    desc: "Design, maintenance, and operation of robots, drones, and androids.",
  },
  [Skills.Engineering]: {
    name: Skills.Engineering,
    level: SkillLevels.Master,
    prereq: [Skills.MechanicalRepair],
    desc: "The design, building, and use of engines, machines, and structures.",
  },
  [Skills.Cybernetics]: {
    name: Skills.Cybernetics,
    level: SkillLevels.Master,
    prereq: [Skills.MechanicalRepair],
    desc: "The physical and neural interfaces between organisms and machines.",
  },
  [Skills.ArtificialIntelligence]: {
    name: Skills.ArtificialIntelligence,
    level: SkillLevels.Master,
    prereq: [Skills.Hacking],
    desc: "The study of intelligence as demonstrated by machines.",
  },
  [Skills.Hyperspace]: {
    name: Skills.Hyperspace,
    level: SkillLevels.Master,
    prereq: [Skills.Piloting, Skills.Physics, Skills.Mysticism],
    desc: "Faster-than-light travel.",
  },
  [Skills.Xenoesotericism]: {
    name: Skills.Xenoesotericism,
    level: SkillLevels.Master,
    prereq: [Skills.Mysticism],
    desc: "Obscure beliefs, mysticism, and religion regarding non-human entities.",
  },
  [Skills.Command]: {
    name: Skills.Command,
    level: SkillLevels.Master,
    prereq: [Skills.Piloting, Skills.Firearms],
    desc: "Leadership, management, and authority.",
  },
} as const satisfies SkillsMap;

export const shipfields = [
  {
    label: "ship name",
    attr: "character_name",
    type: "text",
  },
  {
    label: "type",
    attr: "type",
    type: "text",
  },
  {
    label: "class",
    attr: "ship_class",
    type: "text",
  },
];

export const shipminmaxfields = [

];

export const shipstats = [
  { attr: "armor",
    label: "The value the ship must roll under to avoid taking Damage. Generally the captain or acting captain of the ship rolls the Armor Save." },
  { attr: "combat",
    label: "Used during Combat Checks. You can use whichever is higher: your own Combat Stat or the ship's." },
  { attr: "intellect",
    label: "Used as both a stat and a Sanity Save, should the need arise." },
  { attr: "speed",
    label: "Often used to see if the ship can dodge asteroids or escape explosions from collapsing stars." },
];

export const primary_modules = {
  life_support: { desc: "Life support keeps the human crew alive. Each point of life support can support up to 10 humans. For every point below the required minimum, anyone not wearing a vaccsuit must make a <strong>Body Save</strong> every hour or take 1d10 damage. This includes those in cryochambers as well, but does not include androids. Many ships include 2-3 times the required amount of life support in case of extra passengers or damage to the system.",
    fields: [
      {
        name: "human passengers",
        attr: "ship_passengers",
        after: "/10",
      },
      {
        name: "life support",
        attr: "ship_lifesupport_modules",
        display: true,
        after: "equals",
      },
    ] },
  command: { desc: "The command module is the cockpit, command center, or bridge of a ship. For every 4 officer positions, one command module is required. Officers can be captains, first mates, navigation officers, communications officers, and is largely up to the Warden and the players to decide.",
    fields: [
      {
        name: "officers",
        attr: "ship_officers",
        after: "/4",
      },
      {
        name: "command modules",
        attr: "ship_command_modules",
        display: true,
        after: "equals",
      },
    ] },
  armor: { desc: "Armor plating protects the ship fromsmall metoerites, space dust and debris, as well as, if need be, attacks from other vessels. Every point of armor costs 3 hull, and grants the ship +10% Armor Save (Max 80).",
    fields: [
      {
        name: "armor",
        attr: "ship_armor_modules",
        after: "x10",
      },
      {
        name: "armor save",
        attr: "armor",
        display: true,
      },
    ] },
};

export const secondary_modules = {
  jump_drives: { desc: "Jump drives enable the ship to travel through hyperspace. Every point of Jump Drive increasesthe ship’s jump capability by 1 (Max 9). The first drive costs 1 hull, the second costs 2, the third costs 3, etc.",
    fields: [
      {
        name: "jump drives",
        attr: "ship_jumpdrive_modules",
        after: "...",
      },
    ] },
  computer: { desc: "The ship’s computer is a powerful artificial intelligence that helps with astrogation, combat, and anumber of other autonomous tasks. A ship’s Intellect is equal to the number of computer modules x10 +30%. It’s Combat is equal to the number of computer modules x10 +10%. A computer module is required for each jumpdrive. Additionally, each computer module equipped allows the computer to take more actions during combat.",
    fields: [
      {
        name: "computer modules",
        attr: "ship_computer_modules",
        after: "equals",
      },
    ] },
  galley: { desc: "Galleys contain a kitchen, restrooms, and a common area on a ship. Any ships making trips longer than 1 day must have 1 galley for every 2 life support modules or else the crew must take <strong>Body Saves</strong> once/day. Failure means 2d10 damage and 1d10 Stress. Galleys must be re-stocked once a month and extra stores take up 1 Cargo.",
    fields: [
      {
        name: "galleys",
        attr: "ship_galleys",
        after: "equals",
      },
    ] },
  weapon_mount: { desc: "For every weapon your ship has you must have 1 mount for it. You can find the list of ship weapons in <em>The Player's Survival Guide</em>",
    fields: [
      {
        name: "weapons",
        attr: "ship_weapons",
        after: "arrow",
      },
      {
        name: "weapon mounts",
        attr: "ship_weapon_mounts",
        display: true,
        after: "equals",
      },
    ] },
  medical_bay: { desc: "Medical bays allow scientists, doctors, and other researchers to heal crew members and perform various procedures (biopsies, autopsies, surgery). Each connected medbay on the ship grants +5% to the Intellect of the Scientists or Androids using them. Medical bays also grant advantage on <strong>Body Saves</strong> made for healing.",
    fields: [
      {
        name: "medbays",
        attr: "ship_medbays",
        after: "x5",
      },
      {
        name: "medical intellect bonus",
        attr: "ship_medint_bonus",
        display: true,
      },
    ] },
  cryochamber: { desc: "Cryochambers allow humans to sleep during long trips, particularly through hyperspace.  Androids do not require them. Each point of hull spent on cryochambers accomodates up to 4 cryosleep pods.  Individuals who don’t go into cryosleep during hyperspace jumps often have strange and terrifying experiences.",
    fields: [
      {
        name: "cryo-sleep pods",
        attr: "ship_cryopods",
        after: "/4",
      },
      {
        name: "cryo-chambers",
        attr: "ship_cryochambers",
        display: true,
        after: "equals",
      },
    ] },
  living_quarters: { desc: "Generally, if a ship is to travel through normal space for at least a week, then living quarters or “staterooms” are provided for each of the ship’s officers, or other important crew members.",
    fields: [
      {
        name: "officers",
        attr: "ship_officers",
        after: "arrow",
        display: true,
      },
      {
        name: "living quarters",
        attr: "ship_livingquarters",
        after: "equals",
      },
    ] },
  barracks: { desc: "The same as living quarters, except they are non-private and house up to twelve crew members.  Like living quarters, they are not-essential rooms, but ships that need them, but don’t have them, give their crew +1 Stress per journey or month of travel.",
    fields: [
      {
        name: "crew",
        attr: "ship_crew",
        after: "/12",
      },
      {
        name: "barracks",
        attr: "ship_barracks",
        display: true,
        after: "equals",
      },
    ] },
  cargo_hold: { desc: "Cargo holds are essentially 20x20m rooms used for storage. Each cargo hold can hold up to 10 cargo units (each cargo is roughly the size of a large pallet). Cargo holds can also be used for any other basic room not provided for on this list (brigs, secret compartments, mining equipment, training facilities, hangars, armories, etc.).",
    fields: [
      {
        name: "cargo",
        attr: "ship_cargo",
        after: "/10",
      },
      {
        name: "cargo holds",
        attr: "ship_cargoholds",
        display: true,
        after: "equals",
      },
    ] },
  science_lab: { desc: "Similar to the medical bay, the science lab allows for detailed research. Each connected sciencelab grants +5% Intellect to Scientists and Androids using them to conduct research or experiments. Additionally, they can be designated as repair shops and used by Teamsters to repair electronics, machines, or even Androids.",
    fields: [
      {
        name: "science labs",
        attr: "ship_sciencelabs",
        after: "x5",
      },
      {
        name: "research intellect bonus",
        attr: "ship_resint_bonus",
        display: true,
      },
    ] },
};

export const required_modules = {
  thrusters: { desc: "Without thrusters, the ship cannot move. Every thruster module equipped increases the speed ofthe ship by +10% (to a maximum of 80). Additionally, thrusters cost an extra 1 hull for every 10 base hull.",
    fields: [
      {
        name: "hull req.",
        attr: "ship_thruster_hullreq",
        display: true,
        after: "+",
      },
      {
        name: "thrusters",
        attr: "ship_thrusters",
        after: "equals",
      },
    ] },
  engine: { desc: "Without the engine, the entire ship ceases to operate and becomes a ruin. You must have 1 engine module for every jump drive, plus 1 for every 4 thrusters, plus 1 for every 20 points of base hull.",
    fields: [
      {
        name: "hull req.",
        attr: "ship_engine_hullreq",
        display: true,
        after: "+",
      },
      {
        name: "thruster req.",
        attr: "ship_engine_thrusterreq",
        display: true,
        after: "+",
      },
      {
        name: "jump drives",
        attr: "ship_jumpdrive_modules",
        display: true,
        after: "=",
      },
      {
        name: "engine",
        attr: "ship_engine",
        display: true,
        after: "equals",
      },
    ] },
  fuel: { desc: "The engine needs fuel to run on. Every jump requires double the fuel of the jump (Jump 2 = 4 fuel) and thrusters burn 1 unit of fuel per day. The engine requires at least 3 fuel for every point of engine plus any extra fuel capacity you want to add. More fuel can be stored in Cargo Holds at 1 Fuel per 10 Cargo.",
    fields: [
      {
        name: "min. fuel",
        attr: "ship_fuel_min",
        display: true,
        after: "+",
      },
      {
        name: "extra fuel",
        attr: "ship_fuel_extra",
        after: "equals",
      },
    ] },
  frame: { desc: "Frame covers the miscellaneous parts of a ship, docking gear, airlocks, ventillation, corridors, comms relays, everything else a ship generally uses. Frame is 1 point per 10 points of base hull.",
    fields: [
      {
        name: "frame",
        attr: "ship_frame",
        display: true,
        after: "equals",
      },
    ] },
};

export const shipsecondaries = [
  {
    name: "life support",
    attr: "ship_lifesupport_modules",
    placeholder: "2",
    label: "Life support keeps the human crew alive. Each point of life support can support up to 10 humans. For every point below the required minimum, anyone not wearing a vaccsuit must make a <strong>Body Save</strong> every hour or take 1d10 damage. This includes those in cryochambers as well, but does not include androids. Many ships include 2-3 times the required amount of life support in case of extra passengers or damage to the system.",
  },
  {
    name: "command modules",
    attr: "ship_command_modules",
    placeholder: "2",
    label: "The command module is the cockpit, command center, or bridge of a ship. For every 4 officer positions, one command module is required. Officers can be captains, first mates, navigation officers, communications officers, and is largely up to the Warden and the players to decide.",
  },
  {
    name: "jump drives",
    attr: "ship_jumpdrive_modules",
    placeholder: "2",
    label: "Jump drives enable the ship to travel through hyperspace. Every point of Jump Drive increasesthe ship’s jump capability by 1 (Max 9). The first drive costs 1 hull, the second costs 2, the third costs 3, etc.",
  },
  {
    name: "computer modules",
    attr: "ship_computer_modules",
    placeholder: "2",
    label: "The ship’s computer is a powerful artificial intelligence that helps with astrogation, combat, and anumber of other autonomous tasks. A ship’s Intellect is equal to the number of computer modules x10 +30%. It’s Combat is equal to the number of computer modules x10 +10%. A computer module is required for each jumpdrive. Additionally, each computer module equipped allows the computer to take more actions during combat.",
  },
  {
    name: "galleys",
    attr: "ship_galleys",
    placeholder: "2",
    label: "Galleys contain a kitchen, restrooms, and a common area on a ship. Any ships making trips longer than 1 day must have 1 galley for every 2 life support modules or else the crew must take <strong>Body Saves</strong> once/day. Failure means 2d10 damage and 1d10 Stress. Galleys must be re-stocked once a month and extra stores take up 1 Cargo.",
  },
  {
    name: "weapon mounts",
    attr: "ship_weapon_mounts",
    placeholder: "2",
    label: "For every weapon your ship has you must have 1 mount for it. You can find the list of ship weapons in <em>The Player's Survival Guide</em>",
  },
  {
    name: "medbays",
    attr: "ship_medbays",
    placeholder: "2",
    label: "Medical bays allow scientists, doctors, and other researchers to heal crew members and perform various procedures (biopsies, autopsies, surgery). Each connected medbay on the ship grants +5% to the Intellect of the Scientists or Androids using them. Medical bays also grant advantage on <strong>Body Saves</strong> made for healing.",
  },
  {
    name: "cryo-chambers",
    attr: "ship_cryochambers",
    placeholder: "2",
    label: "Cryochambers allow humans to sleep during long trips, particularly through hyperspace.  Androids do not require them. Each point of hull spent on cryochambers accomodates up to 4 cryosleep pods.  Individuals who don’t go into cryosleep during hyperspace jumps often have strange and terrifying experiences.",
  },
  {
    name: "living quarters",
    attr: "ship_livingquarters",
    placeholder: "2",
    label: "Generally, if a ship is to travel through normal space for at least a week, then living quarters or “staterooms” are provided for each of the ship’s officers, or other important crew members.",
  },
  {
    name: "barracks",
    attr: "ship_barracks",
    placeholder: "2",
    label: "The same as living quarters, except they are non-private and house up to twelve crew members.  Like living quarters, they are not-essential rooms, but ships that need them, but don’t have them, give their crew +1 Stress per journey or month of travel.",
  },
  {
    name: "cargo holds",
    attr: "ship_cargoholds",
    placeholder: "2",
    label: "Cargo holds are essentially 20x20m rooms used for storage. Each cargo hold can hold up to 10 cargo units (each cargo is roughly the size of a large pallet). Cargo holds can also be used for any other basic room not provided for on this list (brigs, secret compartments, mining equipment, training facilities, hangars, armories, etc.).",
  },
  {
    name: "science labs",
    attr: "ship_sciencelabs",
    placeholder: "2",
    label: "Similar to the medical bay, the science lab allows for detailed research. Each connected sciencelab grants +5% Intellect to Scientists and Androids using them to conduct research or experiments. Additionally, they can be designated as repair shops and used by Teamsters to repair electronics, machines, or even Androids.",
  },
];

export const cmpages = ["intro", "stats", "class", "skills", "equipment", "review"];
