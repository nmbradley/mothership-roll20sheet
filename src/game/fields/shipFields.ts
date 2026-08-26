import { shipRangeBandOptions } from "#game/constants.js";

import {
  Controls,
  attribute,
  section,
  type RowAttributeName,
} from "./_factories";

// Header fields
export const ship_name = attribute({
  name: "ship_name",
  label: "Ship Name",
  control: Controls.Text,
  value: "",
});
export const ship_type = attribute({
  name: "ship_type",
  label: "Type",
  control: Controls.Text,
  value: "",
});
export const ship_class = attribute({
  name: "ship_class",
  label: "Class",
  control: Controls.Text,
  value: "",
});

// Core Stats (Mothership 1e)
export const ship_systems = attribute({
  name: "ship_systems",
  label: "Systems",
  control: Controls.Number,
  value: 0,
});
export const ship_thrusters = attribute({
  name: "ship_thrusters",
  label: "Thrusters",
  control: Controls.Number,
  value: 0,
});
export const ship_battle = attribute({
  name: "ship_battle",
  label: "Battle",
  control: Controls.Number,
  value: 0,
});

// Saves / Defenses
export const ship_armor = attribute({
  name: "ship_armor",
  label: "Armor",
  control: Controls.Number,
  value: 0,
});
export const ship_bankruptcy_save = attribute({
  name: "ship_bankruptcy_save",
  label: "Bankruptcy Save",
  control: Controls.Number,
  value: 21,
});

// Hull & Wounds
export const ship_hull = attribute({
  name: "ship_hull",
  label: "Hull",
  control: Controls.Number,
  value: 0,
  max: 0,
});
export const ship_hull_25 = attribute({
  name: "ship_hull_25",
  label: "25%",
  control: Controls.Number,
  value: 0,
});
export const ship_hull_50 = attribute({
  name: "ship_hull_50",
  label: "50%",
  control: Controls.Number,
  value: 0,
});
export const ship_hull_75 = attribute({
  name: "ship_hull_75",
  label: "75%",
  control: Controls.Number,
  value: 0,
});
export const ship_wounds = attribute({
  name: "ship_wounds",
  label: "Wounds",
  control: Controls.Number,
  value: 0,
  max: 0,
});

// Secondary Stats
export const ship_crew = attribute({
  name: "ship_crew",
  label: "Crew",
  control: Controls.Number,
  value: 0,
  max: 0,
});
export const ship_fuel = attribute({
  name: "ship_fuel",
  label: "Fuel",
  control: Controls.Number,
  value: 0,
  max: 0,
});
export const ship_max_cargo = attribute({
  name: "ship_max_cargo",
  label: "Max Cargo",
  control: Controls.Number,
  value: 0,
});

export const shipAttributes = {
  ship_name,
  ship_type,
  ship_class,
  ship_systems,
  ship_thrusters,
  ship_battle,
  ship_armor,
  ship_bankruptcy_save,
  ship_hull,
  ship_hull_25,
  ship_hull_50,
  ship_hull_75,
  ship_wounds,
  ship_crew,
  ship_fuel,
  ship_max_cargo,
} as const;

export type ShipAttributeNames = keyof typeof shipAttributes;

// Repeating section fields: Weapons
export const ship_weapon_name = attribute({
  name: "ship_weapon_name",
  label: "Weapon Name",
  control: Controls.Text,
  value: "",
});
export const ship_weapon_damage = attribute({
  name: "ship_weapon_damage",
  label: "Damage",
  control: Controls.Text,
  value: "",
});
export const ship_weapon_range = attribute({
  name: "ship_weapon_range",
  label: "Range",
  control: Controls.Select,
  options: shipRangeBandOptions,
  value: "firing",
});
export const ship_weapon_notes = attribute({
  name: "ship_weapon_notes",
  label: "Notes",
  control: Controls.Textarea,
  value: "",
});

export const shipWeapons = section({
  name: "shipweapons",
  attributes: {
    ship_weapon_name,
    ship_weapon_damage,
    ship_weapon_range,
    ship_weapon_notes,
  } as const,
});

// Repeating section fields: Crew
export const ship_crew_name = attribute({
  name: "ship_crew_name",
  label: "Name",
  control: Controls.Text,
  value: "",
});
export const ship_crew_rank = attribute({
  name: "ship_crew_rank",
  label: "Rank",
  control: Controls.Text,
  value: "",
});

export const shipCrew = section({
  name: "shipcrew",
  attributes: {
    ship_crew_name,
    ship_crew_rank,
  } as const,
});

// Repeating section fields: Loadout
export const ship_loadout_item = attribute({
  name: "ship_loadout_item",
  label: "Item",
  control: Controls.Text,
  value: "",
});
export const ship_loadout_number = attribute({
  name: "ship_loadout_number",
  label: "Amount",
  control: Controls.Text,
  value: "",
});

export const shipLoadout = section({
  name: "shiploadout",
  attributes: {
    ship_loadout_item,
    ship_loadout_number,
  } as const,
});

export type ShipWeaponFields = keyof typeof shipWeapons.attributes;
export type ShipWeaponAttributes = RowAttributeName<typeof shipWeapons>;

export type ShipCrewFields = keyof typeof shipCrew.attributes;
export type ShipCrewAttributes = RowAttributeName<typeof shipCrew>;

export type ShipLoadoutFields = keyof typeof shipLoadout.attributes;
export type ShipLoadoutAttributes = RowAttributeName<typeof shipLoadout>;

export type AllShipAttributes =
  | ShipAttributeNames
  | ShipWeaponAttributes
  | ShipCrewAttributes
  | ShipLoadoutAttributes;
