import { createAttribute } from "./createAttribute";
import { createSection, createField } from "./createSection";

export const npc_name = createAttribute({
  name: "npc_name",
  label: "Name",
  type: "string",
  max: false,
});
export const npc_combat = createAttribute({
  name: "npc_combat",
  label: "Combat",
  type: "number",
  max: false,
});
export const npc_instinct = createAttribute({
  name: "npc_instinct",
  label: "Instinct",
  type: "number",
  max: false,
});

export const npcAttributes = {
  npc_name,
  npc_combat,
  npc_instinct,
} as const;

export const attack_name = createField({
  name: "attack_name",
  label: "Attack",
  section: "npc_attacks",
  type: "string",
  max: false,
});
export const attack_damage = createField({
  name: "attack_damage",
  label: "Damage",
  section: "npc_attacks",
  type: "string",
  max: false,
});

export const npcAttacks = createSection({
  name: "npc_attacks",
  fields: {
    attack_name,
    attack_damage,
  } as const,
});

export type NPCAttributeNames = keyof typeof npcAttributes;
export type NPCAttackFields = keyof typeof npcAttacks.fields;
export type NPCAttackAttributes = `repeating_npc_attacks_${string}_${NPCAttackFields}`;

export type AllNPCAttributes = NPCAttributeNames | NPCAttackAttributes;
