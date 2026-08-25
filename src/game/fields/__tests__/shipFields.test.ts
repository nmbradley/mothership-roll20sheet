import { describe, it, expect } from "vitest";
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
  shipAttributes,
  shipWeapons,
  shipCrew,
  shipLoadout,
} from "../shipFields";

describe("Ship Fields Architecture (Mothership 1e)", () => {
  describe("Core Ship Stats", () => {
    it("should define systems check attribute", () => {
      expect(systems.name).toBe("systems");
      expect(systems.label).toBe("Systems");
      expect(systems.type).toBe("number");
      expect(systems.uiType).toBe("number");
      expect(systems.seed).toBe(0);
    });

    it("should define thrusters check attribute", () => {
      expect(thrusters.name).toBe("thrusters");
      expect(thrusters.label).toBe("Thrusters");
      expect(thrusters.type).toBe("number");
      expect(thrusters.uiType).toBe("number");
    });

    it("should define battle check attribute", () => {
      expect(battle.name).toBe("battle");
      expect(battle.label).toBe("Battle");
      expect(battle.type).toBe("number");
      expect(battle.uiType).toBe("number");
    });
  });

  describe("Saves and Defenses", () => {
    it("should define bankruptcy save attribute with default seed", () => {
      expect(bankruptcy_save.name).toBe("bankruptcy_save");
      expect(bankruptcy_save.label).toBe("Bankruptcy Save");
      expect(bankruptcy_save.type).toBe("number");
      expect(bankruptcy_save.seed).toBe(21);
      expect(bankruptcy_save.i18nlabel).toBe("label-bankruptcy_save");
    });

    it("should define ship armor attribute", () => {
      expect(ship_armor.name).toBe("ship_armor");
      expect(ship_armor.label).toBe("Armor");
      expect(ship_armor.type).toBe("number");
    });
  });

  describe("Ship Hull and Wounds", () => {
    it("should define ship hull attribute with max support", () => {
      expect(ship_hull.name).toBe("ship_hull");
      expect(ship_hull.label).toBe("Hull");
      expect(ship_hull.type).toBe("number");
      expect(ship_hull.max).toBe(true);
      expect(ship_hull.uiType).toBe("number-max");
    });

    it("should define ship wounds attribute with max support", () => {
      expect(ship_wounds.name).toBe("ship_wounds");
      expect(ship_wounds.label).toBe("Wounds");
      expect(ship_wounds.type).toBe("number");
      expect(ship_wounds.max).toBe(true);
      expect(ship_wounds.uiType).toBe("number-max");
    });
  });

  describe("Secondary Stats and Info", () => {
    it("should define ship header attributes", () => {
      expect(ship_name.name).toBe("ship_name");
      expect(ship_type.name).toBe("ship_type");
      expect(ship_class.name).toBe("ship_class");
    });

    it("should define crew and fuel with max support", () => {
      expect(crew.max).toBe(true);
      expect(fuel.max).toBe(true);
      expect(loadout_max.name).toBe("loadout_max");
    });

    it("should export shipAttributes registry map", () => {
      expect(shipAttributes.systems).toBe(systems);
      expect(shipAttributes.bankruptcy_save).toBe(bankruptcy_save);
      expect(shipAttributes.ship_hull).toBe(ship_hull);
      expect(shipAttributes.thrusters).toBe(thrusters);
      expect(shipAttributes.battle).toBe(battle);
    });
  });

  describe("Repeating Sections", () => {
    it("should define repeating_shipweapons section", () => {
      expect(shipWeapons.name).toBe("repeating_shipweapons");
      expect(shipWeapons.fields.shipweapon_name.name).toBe("shipweapon_name");
      expect(shipWeapons.fields.shipweapon_damage.name).toBe("shipweapon_damage");
      expect(shipWeapons.fields.shipweapon_notes.uiType).toBe("textarea");
    });

    it("should define repeating_shipcrew section", () => {
      expect(shipCrew.name).toBe("repeating_shipcrew");
      expect(shipCrew.fields.shipcrew_name.name).toBe("shipcrew_name");
      expect(shipCrew.fields.shipcrew_rank.name).toBe("shipcrew_rank");
    });

    it("should define repeating_shiploadout section", () => {
      expect(shipLoadout.name).toBe("repeating_shiploadout");
      expect(shipLoadout.fields.shiploadout_item.name).toBe("shiploadout_item");
      expect(shipLoadout.fields.shiploadout_number.name).toBe("shiploadout_number");
    });
  });
});
