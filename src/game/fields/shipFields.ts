import { createAttribute } from "./createAttribute";

export const ship_name = createAttribute({
  name: "ship_name",
  label: "Ship Name",
  type: "string",
  max: false,
});
export const ship_hull = createAttribute({
  name: "ship_hull",
  label: "Hull",
  type: "number",
  max: true,
});
export const ship_armor = createAttribute({
  name: "ship_armor",
  label: "Armor",
  type: "number",
  max: false,
});

export const shipAttributes = {
  ship_name,
  ship_hull,
  ship_armor,
} as const;

export type ShipAttributeNames = keyof typeof shipAttributes;
