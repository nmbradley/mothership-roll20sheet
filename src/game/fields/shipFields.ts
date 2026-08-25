import { createAttribute } from "./createAttribute";
import { createField, createSection } from "./createSection";

// Header fields
export const ship_name = createAttribute({
  name: "ship_name",
  label: "Ship Name",
  type: "string",
});
export const ship_type = createAttribute({
  name: "ship_type",
  label: "Type",
  type: "string",
});
export const ship_class = createAttribute({
  name: "ship_class",
  label: "Class",
  type: "string",
});

// Core Stats (Mothership 1e)
export const systems = createAttribute({
  name: "systems",
  label: "Systems",
  type: "number",
});
export const thrusters = createAttribute({
  name: "thrusters",
  label: "Thrusters",
  type: "number",
});
export const battle = createAttribute({
  name: "battle",
  label: "Battle",
  type: "number",
});

// Saves / Defenses
export const ship_armor = createAttribute({
  name: "ship_armor",
  label: "Armor",
  type: "number",
});
export const bankruptcy_save = createAttribute({
  name: "bankruptcy_save",
  label: "Bankruptcy Save",
  type: "number",
  seed: 21,
});

// Hull & Wounds
export const ship_hull = createAttribute({
  name: "ship_hull",
  label: "Hull",
  type: "number",
  max: true,
});
export const ship_wounds = createAttribute({
  name: "ship_wounds",
  label: "Wounds",
  type: "number",
  max: true,
});

// Secondary Stats
export const crew = createAttribute({
  name: "crew",
  label: "Crew",
  type: "number",
  max: true,
});
export const fuel = createAttribute({
  name: "fuel",
  label: "Fuel",
  type: "number",
  max: true,
});
export const loadout_max = createAttribute({
  name: "loadout_max",
  label: "Max Cargo",
  type: "number",
});

export const shipAttributes = {
  ship_name,
  ship_type,
  ship_class,
  systems,
  thrusters,
  battle,
  ship_armor,
  bankruptcy_save,
  ship_hull,
  ship_wounds,
  crew,
  fuel,
  loadout_max,
} as const;

export type ShipAttributeNames = keyof typeof shipAttributes;

// Repeating section fields: Weapons
export const shipweapon_name = createField({
  name: "shipweapon_name",
  label: "Weapon Name",
  section: "shipweapons",
  type: "string",
});
export const shipweapon_damage = createField({
  name: "shipweapon_damage",
  label: "Damage",
  section: "shipweapons",
  type: "string",
});
export const shipweapon_notes = createField({
  name: "shipweapon_notes",
  label: "Notes",
  section: "shipweapons",
  type: "string",
  uiType: "textarea",
});

export const shipWeapons = createSection({
  name: "shipweapons",
  fields: {
    shipweapon_name,
    shipweapon_damage,
    shipweapon_notes,
  } as const,
});

// Repeating section fields: Crew
export const shipcrew_name = createField({
  name: "shipcrew_name",
  label: "Name",
  section: "shipcrew",
  type: "string",
});
export const shipcrew_rank = createField({
  name: "shipcrew_rank",
  label: "Rank",
  section: "shipcrew",
  type: "string",
});

export const shipCrew = createSection({
  name: "shipcrew",
  fields: {
    shipcrew_name,
    shipcrew_rank,
  } as const,
});

// Repeating section fields: Loadout
export const shiploadout_item = createField({
  name: "shiploadout_item",
  label: "Item",
  section: "shiploadout",
  type: "string",
});
export const shiploadout_number = createField({
  name: "shiploadout_number",
  label: "Amount",
  section: "shiploadout",
  type: "string",
});

export const shipLoadout = createSection({
  name: "shiploadout",
  fields: {
    shiploadout_item,
    shiploadout_number,
  } as const,
});

export type ShipWeaponFields = keyof typeof shipWeapons.fields;
export type ShipWeaponAttributes = `repeating_shipweapons_${string}_${ShipWeaponFields}`;

export type ShipCrewFields = keyof typeof shipCrew.fields;
export type ShipCrewAttributes = `repeating_shipcrew_${string}_${ShipCrewFields}`;

export type ShipLoadoutFields = keyof typeof shipLoadout.fields;
export type ShipLoadoutAttributes = `repeating_shiploadout_${string}_${ShipLoadoutFields}`;

export type AllShipAttributes =
  | ShipAttributeNames
  | ShipWeaponAttributes
  | ShipCrewAttributes
  | ShipLoadoutAttributes;
