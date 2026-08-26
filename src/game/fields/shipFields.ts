import { shipRangeBandOptions } from "#game/constants.js";

import {
  Controls,
  attribute,
  section,
  type RowAttributeName,
} from "./_factories";

// Transponder
// `ship_name` keeps its prefix: an attribute literally named "name" would
// collide with Roll20's built-in `@{name}` (the character/token name), the
// same reason pcFields/npcFields use `character_name` instead of `name`.
export const ship_name = attribute({
  name: "ship_name",
  label: "Ship Name",
  control: Controls.Text,
  value: "",
});
export const captain = attribute({
  name: "captain",
  label: "Captain",
  control: Controls.Text,
  value: "",
});
// Make, Model, Jump, Class & Type merged into one field per #58; replaces the
// old standalone ship_type/ship_class attributes.
export const transponder = attribute({
  name: "transponder",
  label: "Make, Model, Jump, Class, & Type",
  control: Controls.Textarea,
  value: "",
});

// Stats & Saves
export const systems = attribute({
  name: "systems",
  label: "Systems",
  control: Controls.Number,
  value: 0,
});
export const thrusters = attribute({
  name: "thrusters",
  label: "Thrusters",
  control: Controls.Number,
  value: 0,
});
export const battle = attribute({
  name: "battle",
  label: "Battle",
  control: Controls.Number,
  value: 0,
});
export const bankruptcy_save = attribute({
  name: "bankruptcy_save",
  label: "Bankruptcy Save",
  control: Controls.Number,
  value: 21,
});

// Engines
export const fuel = attribute({
  name: "fuel",
  label: "Fuel",
  control: Controls.Number,
  value: 0,
  max: 0,
});
// Movement-phase bid, named to match the #60 macro/sheetworker (act_reveal_bid
// reads and resets attr_fuel_bid directly).
export const fuel_bid = attribute({
  name: "fuel_bid",
  label: "Fuel Bid",
  control: Controls.Number,
  value: 0,
});
export const warp_cores = attribute({
  name: "warp_cores",
  label: "Warp Cores",
  control: Controls.Number,
  value: 0,
});

// Survival
export const o2 = attribute({
  name: "o2",
  label: "O2 Remaining",
  control: Controls.Number,
  value: 0,
});
export const cryopods = attribute({
  name: "cryopods",
  label: "Cryopods",
  control: Controls.Number,
  value: 0,
});
export const escape_pods = attribute({
  name: "escape_pods",
  label: "Escape Pods",
  control: Controls.Number,
  value: 0,
});

// Weapons
export const weapons_base = attribute({
  name: "weapons_base",
  label: "Weapons Base",
  control: Controls.Number,
  value: 0,
});
export const weapons_total = attribute({
  name: "weapons_total",
  label: "Weapons Total",
  control: Controls.Number,
  value: 0,
});
export const mdmg_base = attribute({
  name: "mdmg_base",
  label: "MDMG Base",
  control: Controls.Number,
  value: 0,
});
export const mdmg_total = attribute({
  name: "mdmg_total",
  label: "MDMG Total",
  control: Controls.Number,
  value: 0,
});
export const hardpoints = attribute({
  name: "hardpoints",
  label: "Hardpoints",
  control: Controls.Number,
  value: 0,
  max: 0,
});

// MegaDamage & Hull
// The 0-9 MDMG track has no dedicated radio control yet (`Controls` in
// _factories.ts only backs plain inputs). #61/#86 can render this number as a
// bubble track in CSS/Svelte without a new control; adding a real `radio`
// control plus AttributeRadio.svelte is only worth it if that later turns out
// not to be enough.
export const mdmg = attribute({
  name: "mdmg",
  label: "MDMG",
  control: Controls.Number,
  value: 0,
});
export const hull = attribute({
  name: "hull",
  label: "Hull",
  control: Controls.Number,
  value: 0,
});

// Crew
export const crew = attribute({
  name: "crew",
  label: "Crew",
  control: Controls.Number,
  value: 0,
  max: 0,
});

// Status / Manifest
export const upgrades = attribute({
  name: "upgrades",
  label: "Upgrades",
  control: Controls.Number,
  value: 0,
  max: 0,
});
export const cargo = attribute({
  name: "cargo",
  label: "Cargo",
  control: Controls.Number,
  value: 0,
  max: 0,
});
export const minor_repairs = attribute({
  name: "minor_repairs",
  label: "Minor Repairs",
  control: Controls.Number,
  value: 0,
  max: 0,
});
export const major_repairs = attribute({
  name: "major_repairs",
  label: "Major Repairs",
  control: Controls.Number,
  value: 0,
  max: 0,
});

// Settings
export const npc_ship = attribute({
  name: "npc_ship",
  label: "NPC Ship",
  control: Controls.Checkbox,
  checkedValue: "on",
});

export const shipAttributes = {
  ship_name,
  captain,
  transponder,
  systems,
  thrusters,
  battle,
  bankruptcy_save,
  fuel,
  fuel_bid,
  warp_cores,
  o2,
  cryopods,
  escape_pods,
  weapons_base,
  weapons_total,
  mdmg_base,
  mdmg_total,
  hardpoints,
  mdmg,
  hull,
  crew,
  upgrades,
  cargo,
  minor_repairs,
  major_repairs,
  npc_ship,
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

// Repeating section fields: Upgrades
export const upgrade_name = attribute({
  name: "upgrade_name",
  label: "Upgrade",
  control: Controls.Text,
  value: "",
});

export const shipUpgrades = section({
  name: "shipupgrades",
  attributes: {
    upgrade_name,
  } as const,
});

export type ShipWeaponFields = keyof typeof shipWeapons.attributes;
export type ShipWeaponAttributes = RowAttributeName<typeof shipWeapons>;

export type ShipCrewFields = keyof typeof shipCrew.attributes;
export type ShipCrewAttributes = RowAttributeName<typeof shipCrew>;

export type ShipLoadoutFields = keyof typeof shipLoadout.attributes;
export type ShipLoadoutAttributes = RowAttributeName<typeof shipLoadout>;

export type ShipUpgradeFields = keyof typeof shipUpgrades.attributes;
export type ShipUpgradeAttributes = RowAttributeName<typeof shipUpgrades>;

export type AllShipAttributes =
  | ShipAttributeNames
  | ShipWeaponAttributes
  | ShipCrewAttributes
  | ShipLoadoutAttributes
  | ShipUpgradeAttributes;
