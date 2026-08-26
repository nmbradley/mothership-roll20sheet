import {
  describe,
  it,
  expect,
} from "vitest";

import {
  ship_name,
  ship_type,
  ship_class,
  ship_systems,
  ship_thrusters,
  ship_battle,
  ship_armor,
  ship_bankruptcy_save,
  ship_hull,
  ship_wounds,
  ship_crew,
  ship_fuel,
  ship_max_cargo,
  shipWeapons,
  shipCrew,
  shipLoadout,
} from "../src/game/fields/shipFields";

describe("Ship Fields (Mothership 1e)", () => {
  describe("Header attributes", () => {
    it("should define ship_name correctly", () => {
      expect(ship_name.name).toBe("ship_name");
      expect(ship_name.control).toBe("text");
    });

    it("should define ship_type correctly", () => {
      expect(ship_type.name).toBe("ship_type");
      expect(ship_type.control).toBe("text");
    });

    it("should define ship_class correctly", () => {
      expect(ship_class.name).toBe("ship_class");
      expect(ship_class.control).toBe("text");
    });
  });

  describe("Core 1e Stats", () => {
    it("should define ship_systems stat", () => {
      expect(ship_systems.name).toBe("ship_systems");
      expect(ship_systems.control).toBe("number");
    });

    it("should define ship_thrusters stat", () => {
      expect(ship_thrusters.name).toBe("ship_thrusters");
      expect(ship_thrusters.control).toBe("number");
    });

    it("should define ship_battle stat", () => {
      expect(ship_battle.name).toBe("ship_battle");
      expect(ship_battle.control).toBe("number");
    });
  });

  describe("Saves & Defenses", () => {
    it("should define ship_armor stat", () => {
      expect(ship_armor.name).toBe("ship_armor");
      expect(ship_armor.control).toBe("number");
    });

    it("should define ship_bankruptcy_save with default value 21", () => {
      expect(ship_bankruptcy_save.name).toBe("ship_bankruptcy_save");
      expect(ship_bankruptcy_save.control).toBe("number");
      expect(ship_bankruptcy_save.value).toBe(21);
      expect(ship_bankruptcy_save.label).toBe("Bankruptcy Save");
    });
  });

  describe("Hull & Wounds", () => {
    it("should define ship_hull with a companion _max seed", () => {
      expect(ship_hull.name).toBe("ship_hull");
      expect(ship_hull.control).toBe("number");
      expect(ship_hull.max).toBe(0);
    });

    it("should define ship_wounds with a companion _max seed", () => {
      expect(ship_wounds.name).toBe("ship_wounds");
      expect(ship_wounds.control).toBe("number");
      expect(ship_wounds.max).toBe(0);
    });
  });

  describe("Secondary Stats", () => {
    it("should define ship_crew and ship_fuel with max", () => {
      expect(ship_crew.max).toBe(0);
      expect(ship_fuel.max).toBe(0);
      expect(ship_max_cargo.control).toBe("number");
    });
  });

  describe("Repeating Sections", () => {
    it("should construct repeating_shipweapons section with fields", () => {
      expect(shipWeapons.name).toBe("repeating_shipweapons");
      expect(shipWeapons.attributes.ship_weapon_name.name).toBe("ship_weapon_name");
      expect(shipWeapons.attributes.ship_weapon_damage.name).toBe("ship_weapon_damage");
      expect(shipWeapons.attributes.ship_weapon_notes.control).toBe("textarea");
    });

    it("should construct repeating_shipcrew and repeating_shiploadout sections", () => {
      expect(shipCrew.name).toBe("repeating_shipcrew");
      expect(shipCrew.attributes.ship_crew_name.name).toBe("ship_crew_name");
      expect(shipCrew.attributes.ship_crew_rank.name).toBe("ship_crew_rank");

      expect(shipLoadout.name).toBe("repeating_shiploadout");
      expect(shipLoadout.attributes.ship_loadout_item.name).toBe("ship_loadout_item");
      expect(shipLoadout.attributes.ship_loadout_number.name).toBe("ship_loadout_number");
    });
  });
});
