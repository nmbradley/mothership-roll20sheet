import {
  describe, it, expect,
} from "vitest";

import { rolledAttrs } from "../src/ts/charactermancer/2-stats";

/** A minimal fake roll: only `result` matters to `rolledAttrs`. */
function roll(result: number): RollResult {
  return {
    dice: [],
    expression: "",
    result,
    rolls: [],
  };
}

// Strength, Speed, Intellect, Combat, then Sanity, Fear, Body: the order the
// Stats step's roll template rolls them in.
const FULL_ROLL = [30, 31, 32, 33, 20, 21, 22].map(roll);

describe("Charactermancer Stats Step (Mothership 1e)", () => {
  describe("rolledAttrs", () => {
    it("should map the 2d10+25 stat rolls onto their attributes, in order", () => {
      const attrs = rolledAttrs(FULL_ROLL);
      expect(attrs["strength"]).toBe(30);
      expect(attrs["speed"]).toBe(31);
      expect(attrs["intellect"]).toBe(32);
      expect(attrs["combat"]).toBe(33);
    });

    it("should map the 2d10+10 save rolls onto their attributes, after the stats", () => {
      const attrs = rolledAttrs(FULL_ROLL);
      expect(attrs["sanity"]).toBe(20);
      expect(attrs["fear"]).toBe(21);
      expect(attrs["body"]).toBe(22);
    });

    it("should leave an attribute unset when its roll is missing", () => {
      const attrs = rolledAttrs(FULL_ROLL.slice(0, 3));
      expect(attrs["combat"]).toBeUndefined();
      expect(attrs["sanity"]).toBeUndefined();
    });

    it("should seed health at twice the rolled Strength", () => {
      const attrs = rolledAttrs(FULL_ROLL);
      expect(attrs["health"]).toBe(60);
    });

    it("should seed starting stress, wounds and armor regardless of the roll", () => {
      const attrs = rolledAttrs(FULL_ROLL);
      expect(attrs["stress"]).toBe(2);
      expect(attrs["wounds"]).toBe(2);
      expect(attrs["armor_points"]).toBe(0);
    });
  });
});
