import {
  describe,
  it,
  expect,
} from "vitest";

import {
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
  shipAttributes,
  shipWeapons,
  shipCrew,
  shipLoadout,
  shipUpgrades,
} from "../src/game/fields/shipFields";

describe("Ship Fields (Mothership 1e)", () => {
  describe("Transponder", () => {
    it("should define ship_name correctly", () => {
      expect(ship_name.name).toBe("ship_name");
      expect(ship_name.control).toBe("text");
    });

    it("should define captain correctly", () => {
      expect(captain.name).toBe("captain");
      expect(captain.control).toBe("text");
    });

    it("should merge make/model/jump/class/type into one field", () => {
      expect(transponder.name).toBe("transponder");
      expect(transponder.control).toBe("textarea");
    });
  });

  describe("Stats & Saves", () => {
    it("should define systems, thrusters, and battle", () => {
      expect(systems.name).toBe("systems");
      expect(systems.control).toBe("number");
      expect(thrusters.name).toBe("thrusters");
      expect(thrusters.control).toBe("number");
      expect(battle.name).toBe("battle");
      expect(battle.control).toBe("number");
    });

    it("should define bankruptcy_save with default value 21", () => {
      expect(bankruptcy_save.name).toBe("bankruptcy_save");
      expect(bankruptcy_save.control).toBe("number");
      expect(bankruptcy_save.value).toBe(21);
      expect(bankruptcy_save.label).toBe("Bankruptcy Save");
    });
  });

  describe("Engines", () => {
    it("should define fuel with a companion _max seed", () => {
      expect(fuel.name).toBe("fuel");
      expect(fuel.control).toBe("number");
      expect(fuel.max).toBe(0);
    });

    it("should define fuel_bid for the movement-phase bid", () => {
      expect(fuel_bid.name).toBe("fuel_bid");
      expect(fuel_bid.control).toBe("number");
    });

    it("should define warp_cores", () => {
      expect(warp_cores.name).toBe("warp_cores");
      expect(warp_cores.control).toBe("number");
    });
  });

  describe("Survival", () => {
    it("should define o2, cryopods, and escape_pods", () => {
      expect(o2.name).toBe("o2");
      expect(cryopods.name).toBe("cryopods");
      expect(escape_pods.name).toBe("escape_pods");
    });
  });

  describe("Weapons", () => {
    it("should define linked weapons base/total fields", () => {
      expect(weapons_base.name).toBe("weapons_base");
      expect(weapons_total.name).toBe("weapons_total");
    });

    it("should define linked mdmg base/total fields", () => {
      expect(mdmg_base.name).toBe("mdmg_base");
      expect(mdmg_total.name).toBe("mdmg_total");
    });

    it("should define hardpoints with a companion _max seed", () => {
      expect(hardpoints.name).toBe("hardpoints");
      expect(hardpoints.max).toBe(0);
    });
  });

  describe("MegaDamage & Hull", () => {
    it("should define the 0-9 mdmg track as a number field", () => {
      expect(mdmg.name).toBe("mdmg");
      expect(mdmg.control).toBe("number");
    });

    it("should define hull as a plain numeric field", () => {
      expect(hull.name).toBe("hull");
      expect(hull.control).toBe("number");
      expect(hull.max).toBeUndefined();
    });
  });

  describe("Crew", () => {
    it("should define crew with a companion _max seed", () => {
      expect(crew.name).toBe("crew");
      expect(crew.max).toBe(0);
    });
  });

  describe("Status / Manifest", () => {
    it("should define upgrades, cargo, minor_repairs, and major_repairs with a max", () => {
      expect(upgrades.max).toBe(0);
      expect(cargo.max).toBe(0);
      expect(minor_repairs.max).toBe(0);
      expect(major_repairs.max).toBe(0);
    });
  });

  describe("Settings", () => {
    it("should define the npc_ship toggle", () => {
      expect(npc_ship.name).toBe("npc_ship");
      expect(npc_ship.control).toBe("checkbox");
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

    it("should construct repeating_shipupgrades section", () => {
      expect(shipUpgrades.name).toBe("repeating_shipupgrades");
      expect(shipUpgrades.attributes.upgrade_name.name).toBe("upgrade_name");
    });
  });

  describe("0e leftovers are gone", () => {
    it("should not export ship_armor, ship_wounds, or the hull thresholds", () => {
      expect((shipAttributes as Record<string, unknown>).ship_armor).toBeUndefined();
      expect((shipAttributes as Record<string, unknown>).ship_wounds).toBeUndefined();
      expect((shipAttributes as Record<string, unknown>).ship_hull_25).toBeUndefined();
      expect((shipAttributes as Record<string, unknown>).ship_hull_50).toBeUndefined();
      expect((shipAttributes as Record<string, unknown>).ship_hull_75).toBeUndefined();
    });
  });
});
