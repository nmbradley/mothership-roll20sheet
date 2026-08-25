import { createAttribute } from "./createAttribute";
import { createField, createSection } from "./createSection";

export const character_name = createAttribute({
  name: "character_name",
  label: "Name",
  type: "string",
});
export const npc_name = createAttribute({
  name: "npc_name",
  label: "NPC Name",
  type: "string",
});
export const combat = createAttribute({
  name: "combat",
  label: "Combat",
  type: "number",
});
export const instinct = createAttribute({
  name: "instinct",
  label: "Instinct",
  type: "number",
});
export const wounds = createAttribute({
  name: "wounds",
  label: "Wounds",
  type: "number",
  max: true,
});
export const health = createAttribute({
  name: "health",
  label: "Health",
  type: "number",
  max: true,
});
export const armor_points = createAttribute({
  name: "armor_points",
  label: "Armor Points",
  type: "number",
});
export const description = createAttribute({
  name: "description",
  label: "Description",
  uiType: "textarea",
});
export const equipment = createAttribute({
  name: "equipment",
  label: "Equipment",
  uiType: "textarea",
});

export const npcAttributes = {
  character_name,
  npc_name,
  combat,
  instinct,
  wounds,
  health,
  armor_points,
  description,
  equipment,
} as const;

export const attack_name = createField({
  name: "attack_name",
  label: "Attack",
  section: "attacks",
  type: "string",
});
export const attack_type = createField({
  name: "attack_type",
  label: "Type",
  section: "attacks",
  uiType: "select",
  options: ["Ranged", "Melee"],
});
export const attack_damage = createField({
  name: "attack_damage",
  label: "Damage",
  section: "attacks",
  type: "string",
});
export const attack_range_s = createField({
  name: "attack_range_s",
  label: "Short Range",
  section: "attacks",
  type: "string",
});
export const attack_range_m = createField({
  name: "attack_range_m",
  label: "Medium Range",
  section: "attacks",
  type: "string",
});
export const attack_range_l = createField({
  name: "attack_range_l",
  label: "Long Range",
  section: "attacks",
  type: "string",
});
export const attack_crit_damage = createField({
  name: "attack_crit_damage",
  label: "Critical Damage",
  section: "attacks",
  type: "string",
});
export const attack_crit_effect = createField({
  name: "attack_crit_effect",
  label: "Critical Effect",
  section: "attacks",
  type: "string",
});
export const attack_shots = createField({
  name: "attack_shots",
  label: "Shots",
  section: "attacks",
  type: "string",
});
export const attack_ammunition = createField({
  name: "attack_ammunition",
  label: "Ammunition",
  section: "attacks",
  type: "string",
});
export const attack_notes = createField({
  name: "attack_notes",
  label: "Notes",
  section: "attacks",
  uiType: "textarea",
});

export const npcAttacks = createSection({
  name: "attacks",
  fields: {
    attack_name,
    attack_type,
    attack_damage,
    attack_range_s,
    attack_range_m,
    attack_range_l,
    attack_crit_damage,
    attack_crit_effect,
    attack_shots,
    attack_ammunition,
    attack_notes,
  } as const,
});

export const trait_name = createField({
  name: "trait_name",
  label: "Trait Name",
  section: "traits",
  type: "string",
});
export const trait_description = createField({
  name: "trait_description",
  label: "Description",
  section: "traits",
  uiType: "textarea",
});

export const npcTraits = createSection({
  name: "traits",
  fields: {
    trait_name,
    trait_description,
  } as const,
});

export type NPCAttributeNames = keyof typeof npcAttributes;
export type NPCAttackFields = keyof typeof npcAttacks.fields;
export type NPCAttackAttributes = `repeating_attacks_${string}_${NPCAttackFields}`;
export type NPCTraitFields = keyof typeof npcTraits.fields;
export type NPCTraitAttributes = `repeating_traits_${string}_${NPCTraitFields}`;

export type AllNPCAttributes =
  | NPCAttributeNames
  | NPCAttackAttributes
  | NPCTraitAttributes;
