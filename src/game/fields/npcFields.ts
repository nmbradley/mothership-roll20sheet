import { createAttribute } from "./createAttribute";
import { createSection, createField } from "./createSection";

export const npcAttributes = [
  createAttribute({
    name: "npc_name",
    label: "Name",
    type: "string",
    max: false,
  }),
  createAttribute({
    name: "npc_combat",
    label: "Combat",
    type: "number",
    max: false,
  }),
  createAttribute({
    name: "npc_instinct",
    label: "Instinct",
    type: "number",
    max: false,
  }),
] as const;

export const npcAttacks = createSection({
  name: "npc_attacks",
  fields: [
    createField({
      name: "attack_name",
      label: "Attack",
      section: "npc_attacks",
      type: "string",
      max: false,
    }),
    createField({
      name: "attack_damage",
      label: "Damage",
      section: "npc_attacks",
      type: "string",
      max: false,
    }),
  ] as const,
});

export type NPCAttributeNames = typeof npcAttributes[number]["name"];
export type NPCAttackFields = typeof npcAttacks.fields[number]["name"];
export type NPCAttackAttributes = `repeating_npc_attacks_${string}_${NPCAttackFields}`;

export type AllNPCAttributes = NPCAttributeNames | NPCAttackAttributes;
