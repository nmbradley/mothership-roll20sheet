import fs from "node:fs";

import {
  describe,
  it,
  expect,
} from "vitest";

import {
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

    it("should define ship_captain correctly", () => {
      expect(ship_captain.name).toBe("ship_captain");
      expect(ship_captain.control).toBe("text");
    });

    it("should merge make/model/jump/class/type into one field", () => {
      expect(ship_transponder.name).toBe("ship_transponder");
      expect(ship_transponder.control).toBe("textarea");
    });
  });

  describe("Stats & Saves", () => {
    it("should define ship_systems, ship_thrusters, and ship_battle", () => {
      expect(ship_systems.name).toBe("ship_systems");
      expect(ship_systems.control).toBe("number");
      expect(ship_thrusters.name).toBe("ship_thrusters");
      expect(ship_thrusters.control).toBe("number");
      expect(ship_battle.name).toBe("ship_battle");
      expect(ship_battle.control).toBe("number");
    });

    it("should define ship_bankruptcy_save with default value 21", () => {
      expect(ship_bankruptcy_save.name).toBe("ship_bankruptcy_save");
      expect(ship_bankruptcy_save.control).toBe("number");
      expect(ship_bankruptcy_save.value).toBe(21);
      expect(ship_bankruptcy_save.label).toBe("Bankruptcy Save");
    });
  });

  describe("Engines", () => {
    it("should define ship_fuel with a companion _max seed", () => {
      expect(ship_fuel.name).toBe("ship_fuel");
      expect(ship_fuel.control).toBe("number");
      expect(ship_fuel.max).toBe(0);
    });

    it("should define ship_fuel_bid for the movement-phase bid", () => {
      expect(ship_fuel_bid.name).toBe("ship_fuel_bid");
      expect(ship_fuel_bid.control).toBe("number");
    });

    it("should define ship_warp_cores", () => {
      expect(ship_warp_cores.name).toBe("ship_warp_cores");
      expect(ship_warp_cores.control).toBe("number");
    });
  });

  describe("Survival", () => {
    it("should define ship_o2, ship_cryopods, and ship_escape_pods", () => {
      expect(ship_o2.name).toBe("ship_o2");
      expect(ship_cryopods.name).toBe("ship_cryopods");
      expect(ship_escape_pods.name).toBe("ship_escape_pods");
    });
  });

  describe("Weapons", () => {
    it("should define linked weapons base/total fields", () => {
      expect(ship_weapons_base.name).toBe("ship_weapons_base");
      expect(ship_weapons_total.name).toBe("ship_weapons_total");
    });

    it("should define linked mdmg base/total fields", () => {
      expect(ship_mdmg_base.name).toBe("ship_mdmg_base");
      expect(ship_mdmg_total.name).toBe("ship_mdmg_total");
    });

    it("should define ship_hardpoints with a companion _max seed", () => {
      expect(ship_hardpoints.name).toBe("ship_hardpoints");
      expect(ship_hardpoints.max).toBe(0);
    });
  });

  describe("MegaDamage & Hull", () => {
    it("should define the 0-9 mdmg track as a number field", () => {
      expect(ship_mdmg.name).toBe("ship_mdmg");
      expect(ship_mdmg.control).toBe("number");
    });

    it("should define ship_hull as a plain numeric field", () => {
      expect(ship_hull.name).toBe("ship_hull");
      expect(ship_hull.control).toBe("number");
      expect(ship_hull.max).toBeUndefined();
    });
  });

  describe("Crew", () => {
    it("should define ship_crew with a companion _max seed", () => {
      expect(ship_crew.name).toBe("ship_crew");
      expect(ship_crew.max).toBe(0);
    });
  });

  describe("Status / Manifest", () => {
    it("should define upgrades, cargo, minor_repairs, and major_repairs with a max", () => {
      expect(ship_upgrades.max).toBe(0);
      expect(ship_cargo.max).toBe(0);
      expect(ship_minor_repairs.max).toBe(0);
      expect(ship_major_repairs.max).toBe(0);
    });
  });

  describe("Settings", () => {
    it("should define the ship_npc toggle", () => {
      expect(ship_npc.name).toBe("ship_npc");
      expect(ship_npc.control).toBe("checkbox");
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
      expect(shipUpgrades.attributes.ship_upgrade_name.name).toBe("ship_upgrade_name");
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

  describe("ships.ts attribute references", () => {
    // ships.ts embeds attribute names as plain strings inside roll formulas,
    // so nothing type-checks them against shipFields.ts. A rename here that
    // isn't mirrored there silently rolls every ship check against target 0.
    it("every @{ship_...} reference resolves to an exported ship attribute", () => {
      const source = fs.readFileSync("src/ts/rules/ships.ts", "utf8");
      const references = [...source.matchAll(/@\{(ship_[a-z0-9_]+)\}/g)]
        .map((match) => match[1]);
      const validNames = new Set([
        ...Object.keys(shipAttributes),
        ...Object.keys(shipWeapons.attributes),
        ...Object.keys(shipCrew.attributes),
        ...Object.keys(shipLoadout.attributes),
        ...Object.keys(shipUpgrades.attributes),
      ]);

      expect(references.length).toBeGreaterThan(0);
      for (const name of references) {
        expect(validNames.has(name)).toBe(true);
      }
    });
  });
});
