import { createAttribute } from "./createAttribute";
import { createSection, createField } from "./createSection";

export const pcAttributes = [
  createAttribute({
    name: "character_name",
    label: "Name",
    type: "string",
    max: false,
  }),
  createAttribute({
    name: "strength",
    label: "Strength",
    type: "number",
    max: false,
  }),
  createAttribute({
    name: "speed",
    label: "Speed",
    type: "number",
    max: false,
  }),
] as const;

export const pcWeapons = createSection({
  name: "weapons",
  fields: [
    createField({
      name: "weapon_name",
      label: "Weapon",
      section: "weapons",
      type: "string",
      max: false,
    }),
    createField({
      name: "weapon_damage",
      label: "Damage",
      section: "weapons",
      type: "string",
      max: false,
    }),
  ] as const,
});

export type PCAttributeNames = typeof pcAttributes[number]["name"];
export type PCWeaponFields = typeof pcWeapons.fields[number]["name"];
export type PCWeaponAttributes = `repeating_weapons_${string}_${PCWeaponFields}`;

export type AllPCAttributes = PCAttributeNames | PCWeaponAttributes;
