import {
  describe, it, expect, vi,
} from "vitest";

import { DESTROYED_AP, handleDestroyArmor } from "../src/ts/rules/armor";

describe("Armor", () => {
  describe("DESTROYED_AP", () => {
    it("is zero", () => {
      expect(DESTROYED_AP).toBe(0);
    });
  });

  describe("handleDestroyArmor", () => {
    it("zeroes armor_points and posts a chat notification", async () => {
      const mockSetAttrs = vi.fn();
      const mockStartRoll = vi.fn().mockResolvedValue({
        rollId: "id",
        results: {},
      });
      const mockFinishRoll = vi.fn();
      vi.stubGlobal("setAttrs", mockSetAttrs);
      vi.stubGlobal("startRoll", mockStartRoll);
      vi.stubGlobal("finishRoll", mockFinishRoll);

      await handleDestroyArmor();

      expect(mockSetAttrs).toHaveBeenCalledWith({ armor_points: DESTROYED_AP });
      expect(mockStartRoll).toHaveBeenCalledWith(expect.stringContaining("template:ms"));
      expect(mockFinishRoll).toHaveBeenCalledWith("id", expect.any(Object));

      vi.unstubAllGlobals();
    });
  });
});
