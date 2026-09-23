import { shipRangeBandOptions } from "#game/constants.js";

import {
  Controls,
  attribute,
  section,
  type RowAttributeName,
} from "./_factories";

export const ship_name = attribute({
  name: "ship_name",
  label: "Ship Name",
  control: Controls.Text,
  value: "",
});
export const ship_captain = attribute({
  name: "ship_captain",
  label: "Captain",
  control: Controls.Text,
  value: "",
});
export const ship_transponder = attribute({
  name: "ship_transponder",
  label: "Make, Model, Jump, Class, & Type",
  control: Controls.Textarea,
  value: "",
});

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
export const ship_bankruptcy_save = attribute({
  name: "ship_bankruptcy_save",
  label: "Bankruptcy Save",
  control: Controls.Number,
  value: 21,
});

export const ship_fuel = attribute({
  name: "ship_fuel",
  label: "Fuel",
  control: Controls.Number,
  value: 0,
  max: 0,
});
export const ship_fuel_bid = attribute({
  name: "ship_fuel_bid",
  label: "Fuel Bid",
  control: Controls.Number,
  value: 0,
});
export const ship_warp_cores = attribute({
  name: "ship_warp_cores",
  label: "Warp Cores",
  control: Controls.Number,
  value: 0,
});

export const ship_o2 = attribute({
  name: "ship_o2",
  label: "O2 Remaining",
  control: Controls.Number,
  value: 0,
});
export const ship_cryopods = attribute({
  name: "ship_cryopods",
  label: "Cryopods",
  control: Controls.Number,
  value: 0,
});
export const ship_escape_pods = attribute({
  name: "ship_escape_pods",
  label: "Escape Pods",
  control: Controls.Number,
  value: 0,
});

export const ship_weapons_base = attribute({
  name: "ship_weapons_base",
  label: "Weapons Base",
  control: Controls.Number,
  value: 0,
});
export const ship_weapons_total = attribute({
  name: "ship_weapons_total",
  label: "Weapons Total",
  control: Controls.Number,
  value: 0,
});
export const ship_mdmg_base = attribute({
  name: "ship_mdmg_base",
  label: "MDMG Base",
  control: Controls.Number,
  value: 0,
});
export const ship_mdmg_total = attribute({
  name: "ship_mdmg_total",
  label: "MDMG Total",
  control: Controls.Number,
  value: 0,
});
export const ship_hardpoints = attribute({
  name: "ship_hardpoints",
  label: "Hardpoints",
  control: Controls.Number,
  value: 0,
  max: 0,
});

export const ship_mdmg = attribute({
  name: "ship_mdmg",
  label: "MDMG",
  control: Controls.Number,
  value: 0,
});
export const ship_hull = attribute({
  name: "ship_hull",
  label: "Hull",
  control: Controls.Number,
  value: 0,
});

export const ship_crew = attribute({
  name: "ship_crew",
  label: "Crew",
  control: Controls.Number,
  value: 0,
  max: 0,
});

export const ship_upgrades = attribute({
  name: "ship_upgrades",
  label: "Upgrades",
  control: Controls.Number,
  value: 0,
  max: 0,
});
export const ship_cargo = attribute({
  name: "ship_cargo",
  label: "Cargo",
  control: Controls.Number,
  value: 0,
  max: 0,
});
export const ship_minor_repairs = attribute({
  name: "ship_minor_repairs",
  label: "Minor Repairs",
  control: Controls.Number,
  value: 0,
  max: 0,
});
export const ship_major_repairs = attribute({
  name: "ship_major_repairs",
  label: "Major Repairs",
  control: Controls.Number,
  value: 0,
  max: 0,
});

export const ship_npc = attribute({
  name: "ship_npc",
  label: "NPC Ship",
  control: Controls.Checkbox,
  checkedValue: "on",
});

export const shipAttributes = {
  ship_name,
  ship_captain,
  ship_transponder,
  ship_systems,
  ship_thrusters,
  ship_battle,
  ship_bankruptcy_save,
  ship_fuel,
  ship_fuel_bid,
  ship_warp_cores,
  ship_o2,
  ship_cryopods,
  ship_escape_pods,
  ship_weapons_base,
  ship_weapons_total,
  ship_mdmg_base,
  ship_mdmg_total,
  ship_hardpoints,
  ship_mdmg,
  ship_hull,
  ship_crew,
  ship_upgrades,
  ship_cargo,
  ship_minor_repairs,
  ship_major_repairs,
  ship_npc,
} as const;

export type ShipAttributeNames = keyof typeof shipAttributes;

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

export const ship_upgrade_name = attribute({
  name: "ship_upgrade_name",
  label: "Upgrade",
  control: Controls.Text,
  value: "",
});

export const shipUpgrades = section({
  name: "shipupgrades",
  attributes: {
    ship_upgrade_name,
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
