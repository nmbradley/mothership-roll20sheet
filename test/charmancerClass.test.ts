import {
  describe, it, expect,
} from "vitest";

import { classes } from "../src/game/data/classes";
import { maxWounds, statModifiers } from "../src/ts/charactermancer/3-class";

describe("Charactermancer Class Step (Mothership 1e)", () => {
  describe("statModifiers", () => {
    it("should apply only the flat stat bonus when nothing is chosen", () => {
      const mods = statModifiers(classes.marine);
      expect(mods).toEqual({
        strength: 0,
        speed: 0,
        intellect: 0,
        combat: 10,
      });
    });

    it("should leave a class without a floating bonus unaffected by a choice", () => {
      const mods = statModifiers(classes.marine, "speed");
      expect(mods["speed"]).toBe(0);
    });

    it("should apply the Android's -10 to the stat the player chose", () => {
      const mods = statModifiers(classes.android, "strength");
      expect(mods["strength"]).toBe(-10);
      expect(mods["intellect"]).toBe(20);
    });

    it("should leave the Android's floating bonus unapplied until a stat is chosen", () => {
      const mods = statModifiers(classes.android);
      expect(mods).toEqual({
        strength: 0,
        speed: 0,
        intellect: 20,
        combat: 0,
      });
    });

    it("should apply the Scientist's +5 on top of an already-bonused stat", () => {
      const mods = statModifiers(classes.scientist, "intellect");
      expect(mods["intellect"]).toBe(15);
    });

    it("should apply the Scientist's +5 to an unrelated stat", () => {
      const mods = statModifiers(classes.scientist, "speed");
      expect(mods["speed"]).toBe(5);
      expect(mods["intellect"]).toBe(10);
    });

    it("should give the Teamster a uniform bonus regardless of any choice", () => {
      const mods = statModifiers(classes.teamster, "combat");
      expect(mods).toEqual({
        strength: 5,
        speed: 5,
        intellect: 5,
        combat: 5,
      });
    });
  });

  describe("maxWounds", () => {
    it("should be the printed base of 2 for a class with no wound bonus", () => {
      expect(maxWounds(classes.teamster)).toBe(2);
      expect(maxWounds(classes.scientist)).toBe(2);
    });

    it("should add the Marine's +1 wound bonus", () => {
      expect(maxWounds(classes.marine)).toBe(3);
    });

    it("should add the Android's +1 wound bonus", () => {
      expect(maxWounds(classes.android)).toBe(3);
    });
  });
});
