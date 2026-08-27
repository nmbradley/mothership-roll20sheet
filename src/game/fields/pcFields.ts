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
// Written by incrementHighScore in rules/stats.ts, which had no field to match.
export const high_score = attribute({
  name: "high_score",
  label: "High Score",
  control: Controls.Text,
  value: "",
});
// #55: superseded by the pcAfflictions repeating section below, kept declared
// rather than removed so a character saved before the change still legally
// stores this value, as shiploadout was kept on the ship sheet.
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
// 1e's Stress bounds (#42): fixed rule constants rather than a per-character
// current/max pair, so these are hidden rather than rendered like Health and
// Wounds -- checks.ts (rollRestSave) reads them via getAttrs instead of
// hardcoding STRESS_MIN/STRESS_MAX.
export const stress_min = attribute({
  name: "stress_min",
  label: "Stress Minimum",
  control: Controls.Hidden,
  value: "2",
});
export const stress_max = attribute({
  name: "stress_max",
  label: "Stress Maximum",
  control: Controls.Hidden,
  value: "20",
});
export const stress_panic = attribute({
  name: "stress_panic",
  label: "Stress & Panic",
  control: Controls.Text,
  value: "",
});
// health, wounds and armor_points model an NPC exactly the same way -- a
// Contractor promoted to a PC keeps its stats -- so the NPC sheet reads and
// writes these attributes too rather than declaring its own.
export const health = attribute({
  name: "health",
  label: "Health",
  control: Controls.Number,
  value: 78,
  max: 78,
});
export const wounds = attribute({
  name: "wounds",
  label: "Wounds",
  control: Controls.Number,
  value: 2,
  max: 2,
});
export const armor_points = attribute({
  name: "armor_points",
  label: "Armor Points",
  control: Controls.Number,
  value: 0,
});
// 1e heavy armor (e.g. Advanced Battle Dress) also grants flat Damage
// Reduction, subtracted from a hit before AP is checked against it.
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
// Also the NPC sheet's Combat stat -- see the note by health above.
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
// #110: the lowest (worst) of the three Saves, maintained by
// recomputeWorstSave in checks.ts rather than computed inline, so
// rollRestSave can target it with a plain @{...} reference and reach
// startRoll synchronously.
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
// The settings page offers the picker above; this hidden twin is what
// Sheet.svelte's CSS actually switches the views on.
export const sheet_toggle = cssMirror(sheet_toggle_select);
// Layered on top of sheet_toggle rather than a fourth value of it: sheet_toggle
// records which sheet the character is, and overwriting it to open Settings
// would destroy the state the back button needs to restore.
export const settings_open = attribute({
  name: "settings_open",
  label: "Settings Open",
  control: Controls.Checkbox,
  checkedValue: "on",
});
// #50: gates the NPC sheet's Initiative button as well as the PC one, since
// both live in the same settings drawer pattern and share this attribute.
export const speed_initiative = attribute({
  name: "speed_initiative",
  label: "Speed Check Initiative",
  control: Controls.Checkbox,
  checkedValue: "on",
});
// #9: on by default, matching the Skill prompt's existing behaviour on Saves;
// a Keeper who wants it gone unchecks this rather than opting in to lose it.
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

export const pcAttributes = {
  character_name,
  class: class_,
  stress,
  stress_min,
  stress_max,
  stress_panic,
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
  drop_category,
  drop_name,
  drop_data,
  drop_content,
} as const;

// This section and its fields are shared verbatim with the NPC sheet: an
// NPC's attack row has no field the PC row lacks except attack_linkedid,
// which an NPC row simply never populates.
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
export const attack_shots = attribute({
  name: "attack_shots",
  label: "Shots",
  control: Controls.Text,
  value: "",
});
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

export const pcAttacks = section({
  name: "attacks",
  attributes: {
    attack_name,
    attack_type,
    attack_range,
    attack_damage,
    attack_ammunition,
    attack_shots,
    attack_notes,
    attack_crit_damage,
    attack_crit_effect,
    attack_settings,
    attack_linkedid,
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
// Lets PCEquipmentPanel gate its Armor-only fields on the row's own type.
export const equipment_type_mirror = cssMirror(equipment_type);
// Per-item Armor Points and Damage Reduction (#112): AP and DR are a
// function of the armor worn, not a value the character owns independently,
// so these live on the row and a sheetworker sums Armor-type rows into the
// panel's totals. Reintroduces #53's equipment_armor_bonus properly typed
// and split into AP/DR, rather than reverting to it.
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
  } as const,
});

// Lasting Conditions from a failed Panic Check and lingering Injuries from
// Wounds, tracked as rows rather than the flat conditions textarea above:
// each one needs its own mechanical penalty on record, not just a name.
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
// Marks a Condition or Injury as currently being treated, e.g. by a Doctor,
// rather than still an open penalty.
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
