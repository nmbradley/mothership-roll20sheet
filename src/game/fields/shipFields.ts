import { createAttribute } from "./createAttribute";

export const shipAttributes = [
  createAttribute({
    name: "ship_name",
    label: "Ship Name",
    type: "string",
    max: false,
  }),
  createAttribute({
    name: "ship_hull",
    label: "Hull",
    type: "number",
    max: true,
  }),
  createAttribute({
    name: "ship_armor",
    label: "Armor",
    type: "number",
    max: false,
  }),
] as const;

export type ShipAttributeNames = typeof shipAttributes[number]["name"];
