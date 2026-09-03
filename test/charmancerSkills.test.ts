import {
  describe, it, expect, vi,
} from "vitest";

import { skillKey } from "../src/game/constants";
import {
  classes, evaluateSkillBudget, totalSkillPoints,
} from "../src/game/data/classes";
import {
  Skills, SkillLevels, type SkillLevel,
} from "../src/game/enums";
import { onLoadSkills } from "../src/ts/charactermancer/4-skills";

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

/**
 * Runs `onLoadSkills` as if the player had already completed the Scientist's
 * picker chain on the Class step: one repeating row per choice made, named
 * `row1`, `row2`, ... in the order the player picked them.
 *
 * Returns every `setAttrs` call, so a test can find the one that grants the
 * class skills among the budget/text bookkeeping calls `onLoadSkills` also makes.
 */
function loadSkillsWithChosenChain(picks: readonly string[]): Record<string, string | number>[] {
  const values: Record<string, string> = {
    skill_points: "1",
    skills: "[]",
    required_tiers: "{}",
  };
  const repeating = picks.map((_pick, index) => `row${String(index + 1)}`);
  for (const [index, rowId] of repeating.entries()) {
    values[`${rowId}_skill`] = picks[index] ?? "";
  }

  vi.stubGlobal("getCharmancerData", () => ({
    class: {
      values,
      repeating,
    },
    skills: { values: {} },
  }));
  const calls: Record<string, string | number>[] = [];
  vi.stubGlobal("setAttrs", (attrs: Record<string, string | number>, callback?: () => void) => {
    calls.push(attrs);
    callback?.();
  });
  vi.stubGlobal("setCharmancerText", vi.fn());

  onLoadSkills();
  vi.unstubAllGlobals();
  return calls;
}

describe("Scientist Master chain grant (#187)", () => {
  it("Surgery: choosing Pathology, then Zoology, grants all three as CLASS_SKILL", () => {
    const calls = loadSkillsWithChosenChain([Skills.Surgery, Skills.Pathology, Skills.Zoology]);
    expect(calls).toContainEqual(expect.objectContaining({
      [skillKey(Skills.Surgery)]: "on",
      [`${skillKey(Skills.Surgery)}_type`]: "class",
      [skillKey(Skills.Pathology)]: "on",
      [`${skillKey(Skills.Pathology)}_type`]: "class",
      [skillKey(Skills.Zoology)]: "on",
      [`${skillKey(Skills.Zoology)}_type`]: "class",
    }));
  });

  it("Planetology: choosing Asteroid Mining, then Industrial Equipment, grants all three", () => {
    const calls = loadSkillsWithChosenChain([
      Skills.Planetology, Skills.AsteroidMining, Skills.IndustrialEquipment,
    ]);
    expect(calls).toContainEqual(expect.objectContaining({
      [skillKey(Skills.Planetology)]: "on",
      [skillKey(Skills.AsteroidMining)]: "on",
      [skillKey(Skills.IndustrialEquipment)]: "on",
    }));
  });

  it("Hyperspace: choosing Piloting grants Zero-G automatically, with no Trained row needed", () => {
    // Piloting has only one Trained prerequisite, so the player's chain stops
    // at two rows -- Zero-G is granted without a picker for it.
    const calls = loadSkillsWithChosenChain([Skills.Hyperspace, Skills.Piloting]);
    expect(calls).toContainEqual(expect.objectContaining({
      [skillKey(Skills.Hyperspace)]: "on",
      [skillKey(Skills.Piloting)]: "on",
      [skillKey(Skills.ZeroG)]: "on",
      [`${skillKey(Skills.ZeroG)}_type`]: "class",
    }));
  });

  it("Hyperspace: choosing Mysticism instead needs a further Trained choice", () => {
    const calls = loadSkillsWithChosenChain([Skills.Hyperspace, Skills.Mysticism, Skills.Theology]);
    expect(calls).toContainEqual(expect.objectContaining({
      [skillKey(Skills.Hyperspace)]: "on",
      [skillKey(Skills.Mysticism)]: "on",
      [skillKey(Skills.Theology)]: "on",
    }));
  });

  it("Command: choosing Firearms, then Rimwise, grants all three", () => {
    const calls = loadSkillsWithChosenChain([Skills.Command, Skills.Firearms, Skills.Rimwise]);
    expect(calls).toContainEqual(expect.objectContaining({
      [skillKey(Skills.Command)]: "on",
      [skillKey(Skills.Firearms)]: "on",
      [skillKey(Skills.Rimwise)]: "on",
    }));
  });

  it("Command: choosing Piloting grants Zero-G automatically, with no Trained row needed", () => {
    const calls = loadSkillsWithChosenChain([Skills.Command, Skills.Piloting]);
    expect(calls).toContainEqual(expect.objectContaining({
      [skillKey(Skills.Command)]: "on",
      [skillKey(Skills.Piloting)]: "on",
      [skillKey(Skills.ZeroG)]: "on",
    }));
  });
});
