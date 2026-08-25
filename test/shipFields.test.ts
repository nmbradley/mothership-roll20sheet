import {
  describe,
  it,
  expect,
} from "vitest";

import {
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
  shipWeapons,
  shipCrew,
  shipLoadout,
} from "../src/game/fields/shipFields";

describe("Ship Fields (Mothership 1e)", () => {
  describe("Header attributes", () => {
    it("should define ship_name correctly", () => {
      expect(ship_name.name).toBe("ship_name");
      expect(ship_name.type).toBe("string");
      expect(ship_name.uiType).toBe("text");
    });

    it("should define ship_type correctly", () => {
      expect(ship_type.name).toBe("ship_type");
      expect(ship_type.type).toBe("string");
    });

    it("should define ship_class correctly", () => {
      expect(ship_class.name).toBe("ship_class");
      expect(ship_class.type).toBe("string");
    });
  });

  describe("Core 1e Stats", () => {
    it("should define systems stat", () => {
      expect(systems.name).toBe("systems");
      expect(systems.type).toBe("number");
      expect(systems.uiType).toBe("number");
    });

    it("should define thrusters stat", () => {
      expect(thrusters.name).toBe("thrusters");
      expect(thrusters.type).toBe("number");
      expect(thrusters.uiType).toBe("number");
    });

    it("should define battle stat", () => {
      expect(battle.name).toBe("battle");
      expect(battle.type).toBe("number");
      expect(battle.uiType).toBe("number");
    });
  });

  describe("Saves & Defenses", () => {
    it("should define ship_armor stat", () => {
      expect(ship_armor.name).toBe("ship_armor");
      expect(ship_armor.type).toBe("number");
    });

    it("should define bankruptcy_save with default seed 21", () => {
      expect(bankruptcy_save.name).toBe("bankruptcy_save");
      expect(bankruptcy_save.type).toBe("number");
      expect(bankruptcy_save.seed).toBe(21);
      expect(bankruptcy_save.label).toBe("Bankruptcy Save");
    });
  });

  describe("Hull & Wounds", () => {
    it("should define ship_hull with max = true", () => {
      expect(ship_hull.name).toBe("ship_hull");
      expect(ship_hull.type).toBe("number");
      expect(ship_hull.max).toBe(true);
      expect(ship_hull.uiType).toBe("number-max");
    });

    it("should define ship_wounds with max = true", () => {
      expect(ship_wounds.name).toBe("ship_wounds");
      expect(ship_wounds.type).toBe("number");
      expect(ship_wounds.max).toBe(true);
      expect(ship_wounds.uiType).toBe("number-max");
    });
  });

  describe("Secondary Stats", () => {
    it("should define crew and fuel with max", () => {
      expect(crew.max).toBe(true);
      expect(fuel.max).toBe(true);
      expect(loadout_max.type).toBe("number");
    });
  });

  describe("Repeating Sections", () => {
    it("should construct repeating_shipweapons section with fields", () => {
      expect(shipWeapons.name).toBe("repeating_shipweapons");
      expect(shipWeapons.fields.shipweapon_name.name).toBe("shipweapon_name");
      expect(shipWeapons.fields.shipweapon_damage.name).toBe("shipweapon_damage");
      expect(shipWeapons.fields.shipweapon_notes.uiType).toBe("textarea");
    });

    it("should construct repeating_shipcrew and repeating_shiploadout sections", () => {
      expect(shipCrew.name).toBe("repeating_shipcrew");
      expect(shipCrew.fields.shipcrew_name.name).toBe("shipcrew_name");
      expect(shipCrew.fields.shipcrew_rank.name).toBe("shipcrew_rank");

      expect(shipLoadout.name).toBe("repeating_shiploadout");
      expect(shipLoadout.fields.shiploadout_item.name).toBe("shiploadout_item");
      expect(shipLoadout.fields.shiploadout_number.name).toBe("shiploadout_number");
    });
  });
});
