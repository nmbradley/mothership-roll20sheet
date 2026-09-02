import {
  describe, it, expect, vi,
} from "vitest";

import { armor } from "../src/game/data/armor";
import { DESTROYED_AP, handleDestroyArmor } from "../src/ts/rules/armor";

describe("Armor", () => {
  describe("armor data", () => {
    it("carries Advanced Battle Dress's Damage Reduction from its printed description", () => {
      const advancedBattleDress = armor.find((entry) => entry.name === "Advanced Battle Dress");
      expect(advancedBattleDress?.reduction).toBe("3");
    });

    it("leaves reduction unset for armor whose description names no Damage Reduction", () => {
      const withoutReduction = armor.filter((entry) => entry.name !== "Advanced Battle Dress");
      expect(withoutReduction.length).toBeGreaterThan(0);
      for (const entry of withoutReduction) {
        expect(entry.reduction).toBeUndefined();
      }
    });
  });

  describe("DESTROYED_AP", () => {
    it("is zero", () => {
      expect(DESTROYED_AP).toBe(0);
    });
  });

  describe("handleDestroyArmor", () => {
    it("zeroes the clicked row's own AP and DR and posts a chat notification", async () => {
      const mockSetAttrs = vi.fn();
      const mockStartRoll = vi.fn().mockResolvedValue({
        rollId: "id",
        results: {},
      });
      const mockFinishRoll = vi.fn();
      vi.stubGlobal("setAttrs", mockSetAttrs);
      vi.stubGlobal("startRoll", mockStartRoll);
      vi.stubGlobal("finishRoll", mockFinishRoll);

      await handleDestroyArmor("row1");

      expect(mockSetAttrs).toHaveBeenCalledWith({
        repeating_equipment_row1_equipment_armor_points: DESTROYED_AP,
        repeating_equipment_row1_equipment_damage_reduction: DESTROYED_AP,
      });
      expect(mockStartRoll).toHaveBeenCalledWith(expect.stringContaining("template:ms"));
      expect(mockFinishRoll).toHaveBeenCalledWith("id", expect.any(Object));

      vi.unstubAllGlobals();
    });
  });
});
