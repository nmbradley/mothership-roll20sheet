import {
  describe, it, expect, vi,
} from "vitest";

import { armor } from "../src/game/data/armor";
import {
  DESTROYED, destroyedArmorRowId, handleDestroyArmor,
} from "../src/ts/rules/armor";

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

  describe("handleDestroyArmor", () => {
    it("sets the clicked row's destroyed toggle and posts a chat notification", async () => {
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
        repeating_equipment_row1_equipment_destroyed: DESTROYED,
      });
      expect(mockStartRoll).toHaveBeenCalledWith(expect.stringContaining("template:ms"));
      expect(mockFinishRoll).toHaveBeenCalledWith("id", expect.any(Object));

      vi.unstubAllGlobals();
    });
  });

  describe("destroyedArmorRowId", () => {
    it("prefers sourceSection when Roll20 supplies it", () => {
      const eventInfo = {
        sourceAttribute: "",
        sourceType: "",
        triggerName: "clicked:repeating_equipment_-N1a2B3c_destroy_armor",
        sourceSection: "-N1a2B3c",
      };
      expect(destroyedArmorRowId(eventInfo)).toBe("-N1a2B3c");
    });

    it("parses the row id out of triggerName when sourceSection is absent", () => {
      const eventInfo = {
        sourceAttribute: "",
        sourceType: "",
        triggerName: "clicked:repeating_equipment_-N1a2B3c_destroy_armor",
      };
      expect(destroyedArmorRowId(eventInfo)).toBe("-N1a2B3c");
    });

    it("parses a row id that itself contains an underscore", () => {
      const eventInfo = {
        sourceAttribute: "",
        sourceType: "",
        triggerName: "clicked:repeating_equipment_-N1a_2B3c_destroy_armor",
      };
      expect(destroyedArmorRowId(eventInfo)).toBe("-N1a_2B3c");
    });

    it("returns undefined when triggerName doesn't match the destroy_armor click", () => {
      const eventInfo = {
        sourceAttribute: "",
        sourceType: "",
        triggerName: "change:repeating_equipment:equipment_armor_points",
      };
      expect(destroyedArmorRowId(eventInfo)).toBeUndefined();
    });
  });
});
