import { createAttribute } from "./createAttribute";
import { createSection, createField } from "./createSection";

export const character_name = createAttribute({
  name: "character_name",
  label: "Name",
  type: "string",
  max: false,
});
export const strength = createAttribute({
  name: "strength",
  label: "Strength",
  type: "number",
  max: false,
});
export const speed = createAttribute({
  name: "speed",
  label: "Speed",
  type: "number",
  max: false,
});

export const pcAttributes = {
  character_name,
  strength,
  speed,
} as const;

export const weapon_name = createField({
  name: "weapon_name",
  label: "Weapon",
  section: "weapons",
  type: "string",
  max: false,
});
export const weapon_damage = createField({
  name: "weapon_damage",
  label: "Damage",
  section: "weapons",
  type: "string",
  max: false,
});

export const pcWeapons = createSection({
  name: "weapons",
  fields: {
    weapon_name,
    weapon_damage,
  } as const,
});

export type PCAttributeNames = keyof typeof pcAttributes;
export type PCWeaponFields = keyof typeof pcWeapons.fields;
export type PCWeaponAttributes = `repeating_weapons_${string}_${PCWeaponFields}`;

export type AllPCAttributes = PCAttributeNames | PCWeaponAttributes;
