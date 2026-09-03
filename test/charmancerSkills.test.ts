import {
  describe, it, expect,
} from "vitest";

import {
  classes, evaluateSkillBudget, totalSkillPoints,
} from "../src/game/data/classes";
import { SkillLevels, type SkillLevel } from "../src/game/enums";

/** No skills bought yet, at any tier. */
const NONE: Record<SkillLevel, number> = {
  [SkillLevels.Trained]: 0,
  [SkillLevels.Expert]: 0,
  [SkillLevels.Master]: 0,
};

describe("totalSkillPoints (#181)", () => {
  it("should read a class's free point budget directly", () => {
    expect(totalSkillPoints(classes.marine.skills)).toBe(2);
    expect(totalSkillPoints(classes.android.skills)).toBe(2);
    expect(totalSkillPoints(classes.scientist.skills)).toBe(1);
  });

  it("should total a fixed tier breakdown from the per-tier costs", () => {
    // 1 Trained (cost 1) + 1 Expert (cost 2).
    expect(totalSkillPoints(classes.teamster.skills)).toBe(3);
  });
});

describe("evaluateSkillBudget (#181)", () => {
  describe("Marine: 1 Expert, or 2 Trained", () => {
    it("should let 1 Expert alone exhaust the budget", () => {
      const { remaining, locked } = evaluateSkillBudget(classes.marine.skills, {
        ...NONE,
        [SkillLevels.Expert]: 1,
      });
      expect(remaining).toBe(0);
      expect(locked).toEqual({
        trained: true,
        expert: true,
        master: true,
      });
    });

    it("should let 2 Trained alone exhaust the budget", () => {
      const { remaining, locked } = evaluateSkillBudget(classes.marine.skills, {
        ...NONE,
        [SkillLevels.Trained]: 2,
      });
      expect(remaining).toBe(0);
      expect(locked).toEqual({
        trained: true,
        expert: true,
        master: true,
      });
    });

    it("should refuse a Master skill from the start: the budget cannot afford one", () => {
      const { locked } = evaluateSkillBudget(classes.marine.skills, NONE);
      expect(locked.master).toBe(true);
    });
  });

  describe("Android: 1 Expert, or 2 Trained", () => {
    it("should still allow either option before anything is bought", () => {
      const { locked } = evaluateSkillBudget(classes.android.skills, NONE);
      expect(locked).toEqual({
        trained: false,
        expert: false,
        master: true,
      });
    });

    it("should refuse a 2nd Expert once the 1st has spent the budget", () => {
      const { locked } = evaluateSkillBudget(classes.android.skills, {
        ...NONE,
        [SkillLevels.Expert]: 1,
      });
      expect(locked.expert).toBe(true);
    });
  });

  describe("Scientist: 1 Trained, on top of the Master chain", () => {
    it("should never afford an Expert or Master with its own point", () => {
      const { locked } = evaluateSkillBudget(classes.scientist.skills, NONE);
      expect(locked).toEqual({
        trained: false,
        expert: true,
        master: true,
      });
    });

    it("should refuse a 2nd Trained once the 1 point is spent", () => {
      const { locked } = evaluateSkillBudget(classes.scientist.skills, {
        ...NONE,
        [SkillLevels.Trained]: 1,
      });
      expect(locked.trained).toBe(true);
    });
  });

  describe("Teamster: 1 Trained and 1 Expert, never a substitute", () => {
    it("should allow the printed pair and nothing else, from the start", () => {
      const { locked } = evaluateSkillBudget(classes.teamster.skills, NONE);
      // Master is never listed, so it is refused even though 3 points remain.
      expect(locked).toEqual({
        trained: false,
        expert: false,
        master: true,
      });
    });

    it("should refuse a 2nd Trained even though a point remains unspent", () => {
      const { locked } = evaluateSkillBudget(classes.teamster.skills, {
        ...NONE,
        [SkillLevels.Trained]: 1,
      });
      expect(locked.trained).toBe(true);
      expect(locked.expert).toBe(false);
    });

    it("should refuse a 2nd Expert once the printed pair is complete", () => {
      const { remaining, locked } = evaluateSkillBudget(classes.teamster.skills, {
        [SkillLevels.Trained]: 1,
        [SkillLevels.Expert]: 1,
        [SkillLevels.Master]: 0,
      });
      expect(remaining).toBe(0);
      expect(locked).toEqual({
        trained: true,
        expert: true,
        master: true,
      });
    });
  });
});
