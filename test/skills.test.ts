import {
  describe,
  it,
  expect,
  vi,
} from "vitest";

import {
  prerequisiteChain, skillsByLevel, skillKey, skills,
} from "../src/game/constants";
import { SkillLevels, Skills } from "../src/game/enums";
import { Outcomes } from "../src/ts/rules/rolls";
import {
  SKILL_TRAINING_COSTS,
  evaluateMilitaryTraining,
  handleMilitaryTraining,
} from "../src/ts/rules/skills";

describe("Skills grouped by level", () => {
  it("should cover every skill exactly once", () => {
    const grouped = Object.values(skillsByLevel).flat();
    const all = Object.values(skills);
    expect(grouped).toHaveLength(all.length);

    const names = new Set(grouped.map((skill) => skill.name));
    expect(names.size).toBe(all.length);
  });

  it("should place each skill in its own tier", () => {
    for (const [level, entries] of Object.entries(skillsByLevel)) {
      for (const entry of entries) {
        expect(entry.level).toBe(level);
      }
    }
  });

  it("should build attribute-safe keys from names", () => {
    expect(skillKey(Skills.IndustrialEquipment)).toBe("industrial_equipment");
    expect(skillKey(Skills.HandToHandCombat)).toBe("hand-to-hand_combat");
    expect(skillKey(Skills.ZeroG)).toBe("zero-g");
  });

  it("should invert prereq into unlocks", () => {
    const master = skillsByLevel[SkillLevels.Master];
    const hyperspace = master.find((skill) => skill.name === Skills.Hyperspace);
    expect(hyperspace?.prereq).toContain(Skills.Physics);

    const expert = skillsByLevel[SkillLevels.Expert];
    const physics = expert.find((skill) => skill.name === Skills.Physics);
    expect(physics?.unlocks).toContain(Skills.Hyperspace);
  });

  it("should leave a leaf skill with an empty unlocks list", () => {
    const master = skillsByLevel[SkillLevels.Master];
    const surgery = master.find((skill) => skill.name === Skills.Surgery);
    expect(surgery?.unlocks).toEqual([]);
  });

  it("should list every skill a prerequisite opens up", () => {
    const trained = skillsByLevel[SkillLevels.Trained];
    const botany = trained.find((skill) => skill.name === Skills.Botany);
    expect(botany?.unlocks).toEqual([
      Skills.Psychology,
      Skills.Pathology,
      Skills.FieldMedicine,
      Skills.Ecology,
      Skills.WildernessSurvival,
    ]);
  });
});

describe("prerequisiteChain (#180)", () => {
  it("should resolve a Master skill down to its Expert and Trained prerequisite", () => {
    // Sophontology <- Psychology <- (Linguistics, Zoology, Botany): the first
    // listed prerequisite at each tier is the one concrete path granted.
    expect(prerequisiteChain(Skills.Sophontology)).toEqual([
      Skills.Sophontology,
      Skills.Psychology,
      Skills.Linguistics,
    ]);
  });

  it("should follow the first prerequisite when a skill lists more than one", () => {
    // Surgery lists two Expert prerequisites, and Pathology (the first) lists
    // two Trained prerequisites of its own.
    expect(prerequisiteChain(Skills.Surgery)).toEqual([
      Skills.Surgery,
      Skills.Pathology,
      Skills.Zoology,
    ]);
  });

  it("should stop at a skill with no prerequisite", () => {
    expect(prerequisiteChain(Skills.Botany)).toEqual([Skills.Botany]);
  });
});

describe("Skill Training costs (#49)", () => {
  it("should match the 1e core rules", () => {
    expect(SKILL_TRAINING_COSTS[SkillLevels.Trained]).toEqual({
      years: 2,
      credits: "10kcr",
    });
    expect(SKILL_TRAINING_COSTS[SkillLevels.Expert]).toEqual({
      years: 4,
      credits: "50kcr",
      prereq: SkillLevels.Trained,
    });
    expect(SKILL_TRAINING_COSTS[SkillLevels.Master]).toEqual({
      years: 6,
      credits: "200kcr",
      prereq: SkillLevels.Expert,
    });
  });
});

describe("Military Training exception (#49)", () => {
  it("should kill the character on a Critical Failure and grant nothing else", () => {
    const result = evaluateMilitaryTraining(Outcomes.CriticalFailure);
    expect(result.killed).toBe(true);
    expect(result.namedSkills).toEqual([]);
    expect(result.marineTraumaResponse).toBe(false);
    expect(result.combatBonus).toBe(0);
    expect(result.statReduction).toBe(0);
  });

  it("should grant Military Training, Athletics and 1 Trained Skill on a Failure", () => {
    const result = evaluateMilitaryTraining(Outcomes.Failure);
    expect(result.killed).toBe(false);
    expect(result.namedSkills).toEqual([
      {
        name: "Military Training",
        level: SkillLevels.Trained,
      },
      {
        name: "Athletics",
        level: SkillLevels.Trained,
      },
    ]);
    expect(result.bonusSkillCount).toBe(1);
    expect(result.bonusSkillLevel).toBe(SkillLevels.Trained);
    expect(result.combatBonus).toBe(0);
    expect(result.statReduction).toBe(0);
    expect(result.marineTraumaResponse).toBe(true);
  });

  it("should grant 2 Trained Skills, +10 Combat and -10 to a Stat on a Success", () => {
    const result = evaluateMilitaryTraining(Outcomes.Success);
    expect(result.bonusSkillCount).toBe(2);
    expect(result.bonusSkillLevel).toBe(SkillLevels.Trained);
    expect(result.combatBonus).toBe(10);
    expect(result.statReduction).toBe(10);
    expect(result.marineTraumaResponse).toBe(true);
  });

  it("should grant 1 Expert Skill instead of 2 Trained on a Critical Success", () => {
    const result = evaluateMilitaryTraining(Outcomes.CriticalSuccess);
    expect(result.bonusSkillCount).toBe(1);
    expect(result.bonusSkillLevel).toBe(SkillLevels.Expert);
    expect(result.combatBonus).toBe(10);
    expect(result.statReduction).toBe(10);
  });

  describe("Sheetworker startRoll / finishRoll integration", () => {
    it("should apply a Success's Skills, Combat bonus and Stat reduction", async () => {
      let rowCount = 0;
      vi.stubGlobal("generateRowID", () => {
        rowCount += 1;
        return `row${String(rowCount)}`;
      });
      vi.stubGlobal("getTranslationByKey", (key: string) => key);
      const mockStartRoll = vi.fn().mockResolvedValue({
        rollId: "id",
        results: {
          roll: { result: 25 },
          roll2: { result: 25 },
          edge: { result: 0 },
          target: { result: 50 },
          stat_choice: { result: 0 },
        },
      });
      const mockFinishRoll = vi.fn();
      const mockSetAttrs = vi.fn();
      vi.stubGlobal("startRoll", mockStartRoll);
      vi.stubGlobal("finishRoll", mockFinishRoll);
      vi.stubGlobal("getAttrs", (_request: string[], callback: (response: Record<string, string>) => void) => {
        callback({
          combat: "40",
          strength: "50",
        });
      });
      vi.stubGlobal("setAttrs", mockSetAttrs);

      await handleMilitaryTraining();

      expect(mockFinishRoll).toHaveBeenCalledWith("id", expect.objectContaining({
        notes: evaluateMilitaryTraining(Outcomes.Success).message,
      }));
      expect(mockSetAttrs).toHaveBeenCalledWith({
        repeating_trained_row1_skill_name: "Military Training",
        repeating_trained_row2_skill_name: "Athletics",
        repeating_afflictions_row3_affliction_name: "Marine Trauma Response",
        repeating_afflictions_row3_affliction_settings: "0",
        combat: 50,
        strength: 40,
      });
      vi.unstubAllGlobals();
    });

    it("should not touch the sheet on a Critical Failure", async () => {
      vi.stubGlobal("getTranslationByKey", (key: string) => key);
      const mockStartRoll = vi.fn().mockResolvedValue({
        rollId: "id",
        results: {
          roll: { result: 99 },
          roll2: { result: 99 },
          edge: { result: 0 },
          target: { result: 50 },
          stat_choice: { result: 1 },
        },
      });
      const mockFinishRoll = vi.fn();
      const mockSetAttrs = vi.fn();
      vi.stubGlobal("startRoll", mockStartRoll);
      vi.stubGlobal("finishRoll", mockFinishRoll);
      vi.stubGlobal("setAttrs", mockSetAttrs);

      await handleMilitaryTraining();

      expect(mockFinishRoll).toHaveBeenCalledWith("id", expect.objectContaining({
        notes: "CRITICAL FAILURE: Killed in action.",
      }));
      expect(mockSetAttrs).not.toHaveBeenCalled();
      vi.unstubAllGlobals();
    });

    // Mirrors the #110/#152 regression coverage elsewhere: the Combat
    // Check's own startRoll must be reached synchronously off the click,
    // before the getAttrs the Combat/Stat bonus follow-up makes.
    it("should reach startRoll before making any getAttrs call", async () => {
      const calls: string[] = [];
      vi.stubGlobal("generateRowID", () => "row1");
      vi.stubGlobal("getTranslationByKey", (key: string) => key);
      const mockStartRoll = vi.fn(() => {
        calls.push("startRoll");
        return Promise.resolve({
          rollId: "id",
          results: {
            roll: { result: 25 },
            roll2: { result: 25 },
            edge: { result: 0 },
            target: { result: 50 },
            stat_choice: { result: 0 },
          },
        });
      });
      type GetAttrsCallback = (response: Record<string, string>) => void;
      const mockGetAttrs = vi.fn((_request: string[], callback: GetAttrsCallback) => {
        calls.push("getAttrs");
        callback({
          combat: "40",
          strength: "50",
        });
      });
      vi.stubGlobal("startRoll", mockStartRoll);
      vi.stubGlobal("finishRoll", vi.fn());
      vi.stubGlobal("getAttrs", mockGetAttrs);
      vi.stubGlobal("setAttrs", vi.fn());

      await handleMilitaryTraining();

      expect(calls).toEqual(["startRoll", "getAttrs"]);
      vi.unstubAllGlobals();
    });
  });
});
