import {
  describe, it, expect,
} from "vitest";

import { creditsMultiplier } from "../src/ts/charactermancer/5-equipment";

describe("Charactermancer Equipment Step (Mothership 1e)", () => {
  describe("creditsMultiplier", () => {
    it("should use the 2d10x10 loadout rate for an unchosen package", () => {
      expect(creditsMultiplier("choose")).toBe(10);
    });

    it("should use the 2d10x10 loadout rate for a class loadout roll", () => {
      expect(creditsMultiplier("0")).toBe(10);
    });

    it("should use the 2d10x10 loadout rate for a custom package", () => {
      expect(creditsMultiplier("custom")).toBe(10);
    });

    it("should use the 2d10x100 no-loadout rate when the player forgoes a package", () => {
      expect(creditsMultiplier("no loadout")).toBe(100);
    });
  });
});
