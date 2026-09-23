import { rangeBandOptions } from "#game/constants.js";

import {
  Controls, attribute, cssMirror, section, type RowAttributeName,
} from "./_factories";

export const character_name = attribute({
  name: "character_name",
  label: "Name",
  control: Controls.Text,
  value: "",
});
export const player_name = attribute({
  name: "player_name",
  label: "Player Name",
  control: Controls.Text,
  value: "",
});
export const pronouns = attribute({
  name: "pronouns",
  label: "Pronouns",
  control: Controls.Text,
  value: "",
});
export const high_score = attribute({
  name: "high_score",
  label: "High Score",
  control: Controls.Text,
  value: "",
});
export const conditions = attribute({
  name: "conditions",
  label: "Conditions",
  control: Controls.Textarea,
  value: "",
});
export const skill_training = attribute({
  name: "skill_training",
  label: "In Progress",
  control: Controls.Text,
  value: "",
});
export const skill_training_time = attribute({
  name: "skill_training_time",
  label: "Time Remaining",
  control: Controls.Text,
  value: "",
});
export const class_ = attribute({
  name: "class",
  label: "Class",
  control: Controls.Text,
  value: "",
});
export const stress = attribute({
  name: "stress",
  label: "Stress",
  control: Controls.Number,
  value: 2,
});
export const stress_min = attribute({
  name: "stress_min",
  label: "Stress Minimum",
  control: Controls.Number,
  value: 2,
});
export const stress_panic = attribute({
  name: "stress_panic",
  label: "Stress & Panic",
  control: Controls.Text,
  value: "",
});
export const stress_effect = attribute({
  name: "stress_effect",
  label: "Trauma Response",
  control: Controls.Textarea,
  value: "",
});
export const health = attribute({
  name: "health",
  label: "Health",
  control: Controls.Number,
  value: 10,
  max: 10,
});
export const wounds = attribute({
  name: "wounds",
  label: "Wounds",
  control: Controls.Number,
  value: 0,
  max: 2,
});
export const armor_points = attribute({
  name: "armor_points",
  label: "Armor Points",
  control: Controls.Number,
  value: 0,
});
export const damage_reduction = attribute({
  name: "damage_reduction",
  label: "Damage Reduction",
  control: Controls.Number,
  value: 0,
});
export const strength = attribute({
  name: "strength",
  label: "Strength",
  control: Controls.Number,
  value: 0,
});
export const speed = attribute({
  name: "speed",
  label: "Speed",
  control: Controls.Number,
  value: 0,
});
export const intellect = attribute({
  name: "intellect",
  label: "Intellect",
  control: Controls.Number,
  value: 0,
});
export const combat = attribute({
  name: "combat",
  label: "Combat",
  control: Controls.Number,
  value: 0,
});
export const sanity = attribute({
  name: "sanity",
  label: "Sanity",
  control: Controls.Number,
  value: 0,
});
export const fear = attribute({
  name: "fear",
  label: "Fear",
  control: Controls.Number,
  value: 0,
});
export const body = attribute({
  name: "body",
  label: "Body",
  control: Controls.Number,
  value: 0,
});
export const worst_save = attribute({
  name: "worst_save",
  label: "Worst Save",
  control: Controls.Hidden,
  value: "0",
});
export const credits = attribute({
  name: "credits",
  label: "Credits",
  control: Controls.Text,
  value: "",
});
export const patch = attribute({
  name: "patch",
  label: "Patch",
  control: Controls.Text,
  value: "",
});
export const trinket = attribute({
  name: "trinket",
  label: "Trinket",
  control: Controls.Text,
  value: "",
});
export const skill_points = attribute({
  name: "skill_points",
  label: "Skill Points",
  control: Controls.Number,
  value: 0,
});
export const init = attribute({
  name: "init",
  label: "Initiative",
  control: Controls.Hidden,
  value: "0",
});
export const sheet_toggle_select = attribute({
  name: "sheet_toggle",
  label: "Sheet Type",
  control: Controls.Select,
  options: [
    {
      value: "pc",
      label: "PC",
    },
    {
      value: "npc",
      label: "NPC",
    },
    {
      value: "ship",
      label: "Ship",
    },
  ],
  value: "pc",
});
export const sheet_toggle = cssMirror(sheet_toggle_select);
export const settings_open = attribute({
  name: "settings_open",
  label: "Settings Open",
  control: Controls.Checkbox,
  checkedValue: "on",
});
export const speed_initiative = attribute({
  name: "speed_initiative",
  label: "Speed Check Initiative",
  control: Controls.Checkbox,
  checkedValue: "on",
});
export const save_skill_select = attribute({
  name: "save_skill_select",
  label: "Skill Select for Saves",
  control: Controls.Checkbox,
  checkedValue: "on",
  checked: true,
});
export const sheet_skill_toggles = attribute({
  name: "sheet_skill_toggles",
  label: "Skill Toggles",
  control: Controls.Hidden,
  value: "",
});
export const skill_query = attribute({
  name: "skill_query",
  label: "Skill Query",
  control: Controls.Hidden,
  value: "?{Apply Skill?|None,0|Trained (+10),10[Trained]|Expert (+15),15[Expert]|Master (+20),20[Master]}",
});
export const drop_category = attribute({
  name: "drop_category",
  label: "Drop Category",
  control: Controls.Hidden,
  value: "",
});
export const drop_name = attribute({
  name: "drop_name",
  label: "Drop Name",
  control: Controls.Hidden,
  value: "",
});
export const drop_data = attribute({
  name: "drop_data",
  label: "Drop Data",
  control: Controls.Hidden,
  value: "",
});
export const drop_content = attribute({
  name: "drop_content",
  label: "Drop Content",
  control: Controls.Hidden,
  value: "",
});

export const attack_modifier = attribute({
  name: "attack_modifier",
  label: "Global Attack Modifier",
  control: Controls.Number,
  value: 0,
});

export const bleeding = attribute({
  name: "bleeding",
  label: "Bleeding",
  control: Controls.Number,
  value: 0,
});
export const radiation_level = attribute({
  name: "radiation_level",
  label: "Radiation Level",
  control: Controls.Select,
  options: [
    {
      value: "trace",
      label: "1 - Trace",
    },
    {
      value: "acute",
      label: "2 - Acute",
    },
    {
      value: "lethal",
      label: "3 - Lethal",
    },
  ],
  value: "trace",
});
export const radiation_penalty_rounds = attribute({
  name: "radiation_penalty_rounds",
  label: "Radiation Penalty Rounds",
  control: Controls.Hidden,
  value: "0",
});
export const cryosick = attribute({
  name: "cryosick",
  label: "Cryosick",
  control: Controls.Checkbox,
  checkedValue: 1,
});

export const pcAttributes = {
  character_name,
  class: class_,
  stress,
  stress_min,
  stress_panic,
  stress_effect,
  health,
  wounds,
  armor_points,
  damage_reduction,
  strength,
  speed,
  intellect,
  combat,
  sanity,
  fear,
  body,
  worst_save,
  credits,
  patch,
  trinket,
  skill_points,
  player_name,
  pronouns,
  high_score,
  conditions,
  skill_training,
  skill_training_time,
  init,
  sheet_toggle,
  sheet_toggle_select,
  settings_open,
  speed_initiative,
  save_skill_select,
  sheet_skill_toggles,
  skill_query,
  drop_category,
  drop_name,
  drop_data,
  drop_content,
  attack_modifier,
  bleeding,
  radiation_level,
  radiation_penalty_rounds,
  cryosick,
} as const;

export const attack_name = attribute({
  name: "attack_name",
  label: "Weapon",
  control: Controls.Text,
  value: "",
});
export const attack_type = attribute({
  name: "attack_type",
  label: "Type",
  control: Controls.Select,
  options: ["", "Melee", "Ranged", "Skill"],
  value: "",
});
export const attack_range = attribute({
  name: "attack_range",
  label: "Range",
  control: Controls.Select,
  options: rangeBandOptions,
  value: "adjacent",
});
export const attack_damage = attribute({
  name: "attack_damage",
  label: "Damage",
  control: Controls.Text,
  value: "",
});
export const attack_ammunition = attribute({
  name: "attack_ammunition",
  label: "Ammo",
  control: Controls.Text,
  value: "",
});
export const attack_bonus = attribute({
  name: "attack_bonus",
  label: "Bonus",
  control: Controls.Number,
  value: 0,
});
export const attack_shots = attribute({
  name: "attack_shots",
  label: "Shots",
  control: Controls.Number,
  value: 0,
  max: 0,
});
export const attack_shots_mirror = cssMirror(attack_shots);
const attack_shots_max = attribute({
  name: "attack_shots_max",
  label: "Max Shots",
  control: Controls.Number,
  value: 0,
});
export const attack_shots_max_mirror = cssMirror(attack_shots_max);
export const attack_notes = attribute({
  name: "attack_notes",
  label: "Notes",
  control: Controls.Textarea,
  value: "",
});
export const attack_crit_damage = attribute({
  name: "attack_crit_damage",
  label: "Crit Damage",
  control: Controls.Text,
  value: "",
});
export const attack_crit_effect = attribute({
  name: "attack_crit_effect",
  label: "Crit Effect",
  control: Controls.Textarea,
  value: "",
});
export const attack_settings = attribute({
  name: "attack_settings",
  label: "Settings",
  control: Controls.Hidden,
  value: "on",
});
export const attack_linkedid = attribute({
  name: "attack_linkedid",
  label: "Linked ID",
  control: Controls.Hidden,
  value: "",
});
export const attack_anti_armor = attribute({
  name: "attack_anti_armor",
  label: "Anti-Armor",
  control: Controls.Checkbox,
  checkedValue: "1",
  checked: false,
});

export const pcAttacks = section({
  name: "attacks",
  attributes: {
    attack_name,
    attack_type,
    attack_range,
    attack_damage,
    attack_ammunition,
    attack_shots,
    attack_shots_mirror,
    attack_shots_max_mirror,
    attack_bonus,
    attack_notes,
    attack_crit_damage,
    attack_crit_effect,
    attack_settings,
    attack_linkedid,
    attack_anti_armor,
  } as const,
});

export const equipment_name = attribute({
  name: "equipment_name",
  label: "Name",
  control: Controls.Text,
  value: "",
});
export const equipment_type = attribute({
  name: "equipment_type",
  label: "Type",
  control: Controls.Select,
  options: ["Gear", "Weapon", "Ammunition", "Armor"],
  value: "Gear",
});
export const equipment_type_mirror = cssMirror(equipment_type);
export const equipment_armor_points = attribute({
  name: "equipment_armor_points",
  label: "Armor Points",
  control: Controls.Number,
  value: 0,
});
export const equipment_damage_reduction = attribute({
  name: "equipment_damage_reduction",
  label: "Damage Reduction",
  control: Controls.Number,
  value: 0,
});
export const equipment_notes = attribute({
  name: "equipment_notes",
  label: "Notes",
  control: Controls.Textarea,
  value: "",
});
export const equipment_settings = attribute({
  name: "equipment_settings",
  label: "Settings",
  control: Controls.Hidden,
  value: "on",
});
export const equipment_linkedid = attribute({
  name: "equipment_linkedid",
  label: "Linked ID",
  control: Controls.Hidden,
  value: "",
});
export const equipment_equipped = attribute({
  name: "equipment_equipped",
  label: "Equipped",
  control: Controls.Checkbox,
  checkedValue: "1",
  checked: true,
});
export const equipment_destroyed = attribute({
  name: "equipment_destroyed",
  label: "Destroyed",
  control: Controls.Hidden,
  value: "",
});

export const pcEquipment = section({
  name: "equipment",
  attributes: {
    equipment_name,
    equipment_type,
    equipment_type_mirror,
    equipment_armor_points,
    equipment_damage_reduction,
    equipment_notes,
    equipment_settings,
    equipment_linkedid,
    equipment_equipped,
    equipment_destroyed,
  } as const,
});

export const affliction_name = attribute({
  name: "affliction_name",
  label: "Name",
  control: Controls.Text,
  value: "",
});
export const affliction_effect = attribute({
  name: "affliction_effect",
  label: "Effect",
  control: Controls.Textarea,
  value: "",
});
export const affliction_treated = attribute({
  name: "affliction_treated",
  label: "Treated",
  control: Controls.Checkbox,
  checkedValue: "on",
});
export const affliction_settings = attribute({
  name: "affliction_settings",
  label: "Settings",
  control: Controls.Hidden,
  value: "on",
});

export const pcAfflictions = section({
  name: "afflictions",
  attributes: {
    affliction_name,
    affliction_effect,
    affliction_treated,
    affliction_settings,
  } as const,
});

export const skill_name = attribute({
  name: "skill_name",
  label: "Name",
  control: Controls.Text,
  value: "",
});

export const pcTrainedSkills = section({
  name: "trained",
  attributes: {
    skill_name,
  } as const,
});
export const pcExpertSkills = section({
  name: "expert",
  attributes: {
    skill_name,
  } as const,
});
export const pcMasterSkills = section({
  name: "master",
  attributes: {
    skill_name,
  } as const,
});

export type PCAttributeNames = keyof typeof pcAttributes;
export type PCAttacksFields = keyof typeof pcAttacks.attributes;
export type PCAttacksAttributes = RowAttributeName<typeof pcAttacks>;
export type PCEquipmentAttributes = RowAttributeName<typeof pcEquipment>;
export type PCAfflictionsAttributes = RowAttributeName<typeof pcAfflictions>;
export type PCTrainedSkillsAttributes = RowAttributeName<typeof pcTrainedSkills>;
export type PCExpertSkillsAttributes = RowAttributeName<typeof pcExpertSkills>;
export type PCMasterSkillsAttributes = RowAttributeName<typeof pcMasterSkills>;

export type AllPCAttributes =
  | PCAttributeNames
  | PCAttacksAttributes
  | PCEquipmentAttributes
  | PCAfflictionsAttributes
  | PCTrainedSkillsAttributes
  | PCExpertSkillsAttributes
  | PCMasterSkillsAttributes;
