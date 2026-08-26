import { rangeBandOptions } from "#game/constants.js";

import {
  Controls,
  attribute,
  section,
  type RowAttributeName,
} from "./_factories";

// Every NPC attribute carries an `npc_` prefix so it never shares storage with
// the PC sheet. `character_name` is the deliberate exception: Roll20 links that
// name to the journal entry, so both sheets must write the same attribute.
export const character_name = attribute({
  name: "character_name",
  label: "Name",
  control: Controls.Text,
  value: "",
});
export const npc_combat = attribute({
  name: "npc_combat",
  label: "Combat",
  control: Controls.Number,
  value: 0,
});
export const npc_instinct = attribute({
  name: "npc_instinct",
  label: "Instinct",
  control: Controls.Number,
  value: 0,
});
export const npc_wounds = attribute({
  name: "npc_wounds",
  label: "Wounds",
  control: Controls.Number,
  value: 0,
  max: 0,
});
export const npc_health = attribute({
  name: "npc_health",
  label: "Health",
  control: Controls.Number,
  value: 0,
  max: 0,
});
export const npc_armor_points = attribute({
  name: "npc_armor_points",
  label: "Armor Points",
  control: Controls.Number,
  value: 0,
});
export const npc_description = attribute({
  name: "npc_description",
  label: "Description",
  control: Controls.Textarea,
  value: "",
});
export const npc_equipment = attribute({
  name: "npc_equipment",
  label: "Equipment",
  control: Controls.Textarea,
  value: "",
});

export const npcAttributes = {
  character_name,
  npc_combat,
  npc_instinct,
  npc_wounds,
  npc_health,
  npc_armor_points,
  npc_description,
  npc_equipment,
} as const;

export const npc_attack_name = attribute({
  name: "npc_attack_name",
  label: "Attack",
  control: Controls.Text,
  value: "",
});
export const npc_attack_type = attribute({
  name: "npc_attack_type",
  label: "Type",
  control: Controls.Select,
  options: ["Ranged", "Melee"],
  value: "Ranged",
});
export const npc_attack_damage = attribute({
  name: "npc_attack_damage",
  label: "Damage",
  control: Controls.Text,
  value: "",
});
export const npc_attack_range = attribute({
  name: "npc_attack_range",
  label: "Range",
  control: Controls.Select,
  options: rangeBandOptions,
  value: "adjacent",
});
export const npc_attack_crit_damage = attribute({
  name: "npc_attack_crit_damage",
  label: "Critical Damage",
  control: Controls.Text,
  value: "",
});
export const npc_attack_crit_effect = attribute({
  name: "npc_attack_crit_effect",
  label: "Critical Effect",
  control: Controls.Text,
  value: "",
});
export const npc_attack_shots = attribute({
  name: "npc_attack_shots",
  label: "Shots",
  control: Controls.Text,
  value: "",
});
export const npc_attack_ammunition = attribute({
  name: "npc_attack_ammunition",
  label: "Ammunition",
  control: Controls.Text,
  value: "",
});
export const npc_attack_settings = attribute({
  name: "npc_attack_settings",
  label: "Settings",
  control: Controls.Checkbox,
  checkedValue: "on",
  checked: true,
});
export const npc_attack_notes = attribute({
  name: "npc_attack_notes",
  label: "Notes",
  control: Controls.Textarea,
  value: "",
});

// Repeating section names cannot contain an underscore or Roll20 silently drops
// every row, so the segment after "repeating_" is concatenated.
export const npcAttacks = section({
  name: "npcattacks",
  attributes: {
    npc_attack_name,
    npc_attack_type,
    npc_attack_damage,
    npc_attack_range,
    npc_attack_crit_damage,
    npc_attack_crit_effect,
    npc_attack_shots,
    npc_attack_ammunition,
    npc_attack_notes,
    npc_attack_settings,
  } as const,
});

export const npc_trait_name = attribute({
  name: "npc_trait_name",
  label: "Trait Name",
  control: Controls.Text,
  value: "",
});
export const npc_trait_description = attribute({
  name: "npc_trait_description",
  label: "Description",
  control: Controls.Textarea,
  value: "",
});

export const npc_trait_settings = attribute({
  name: "npc_trait_settings",
  label: "Settings",
  control: Controls.Checkbox,
  checkedValue: "on",
  checked: true,
});

export const npcTraits = section({
  name: "npctraits",
  attributes: {
    npc_trait_name,
    npc_trait_description,
    npc_trait_settings,
  } as const,
});

export type NPCAttributeNames = keyof typeof npcAttributes;
export type NPCAttackFields = keyof typeof npcAttacks.attributes;
export type NPCAttackAttributes = RowAttributeName<typeof npcAttacks>;
export type NPCTraitFields = keyof typeof npcTraits.attributes;
export type NPCTraitAttributes = RowAttributeName<typeof npcTraits>;

export type AllNPCAttributes =
  | NPCAttributeNames
  | NPCAttackAttributes
  | NPCTraitAttributes;
