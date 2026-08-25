import {
  describe,
  it,
  expect,
  vi,
} from "vitest";
import { maintenanceTable } from "../src/game/data/maintenance";
import {
  getMaintenanceIssue,
  getRandomUniqueIssues,
  formatStartingConditionMessage,
  evaluateStartingCondition,
  handleStartingCondition,
} from "../src/ts/rules/ships";

describe("Ship Starting Condition Mechanics", () => {
  describe("getMaintenanceIssue", () => {
    it("should return the first issue for roll 0", () => {
      const issue = getMaintenanceIssue(0);
      expect(issue.roll).toBe("00");
      expect(issue.issue_type).toBe("Minor");
      expect(issue.description).toBe("Rancid smell permeates cabins.");
    });

    it("should return the last issue for roll 99", () => {
      const issue = getMaintenanceIssue(99);
      expect(issue.roll).toBe("99");
      expect(issue.issue_type).toBe("Major");
      expect(issue.description).toContain("Rust bucket");
    });

    it("should clamp values below 0 to 0", () => {
      const issue = getMaintenanceIssue(-5);
      expect(issue.roll).toBe("00");
    });

    it("should clamp values above 99 to 99", () => {
      const issue = getMaintenanceIssue(150);
      expect(issue.roll).toBe("99");
    });

    it("should floor floating point rolls", () => {
      const issue = getMaintenanceIssue(23.7);
      expect(issue.roll).toBe("23");
    });
  });

  describe("getRandomUniqueIssues", () => {
    it("should return an empty array when count is <= 0", () => {
      expect(getRandomUniqueIssues(0)).toEqual([]);
      expect(getRandomUniqueIssues(-2)).toEqual([]);
    });

    it("should return the requested number of unique issues for 1d5+1 range (2 to 6)", () => {
      for (let count = 2; count <= 6; count++) {
        const issues = getRandomUniqueIssues(count);
        expect(issues).toHaveLength(count);

        const rolls = issues.map((i) => i.roll);
        const uniqueRolls = new Set(rolls);
        expect(uniqueRolls.size).toBe(count);
      }
    });

    it("should return all issues when count exceeds table length", () => {
      const issues = getRandomUniqueIssues(150);
      expect(issues).toHaveLength(maintenanceTable.length);

      const rolls = issues.map((i) => i.roll);
      const uniqueRolls = new Set(rolls);
      expect(uniqueRolls.size).toBe(maintenanceTable.length);
    });

    it("should select deterministically with a custom random function", () => {
      // Mock RNG that always returns 0 (picks the first available element)
      const mockRng = () => 0;
      const issues = getRandomUniqueIssues(3, maintenanceTable, mockRng);
      expect(issues).toHaveLength(3);
      expect(issues[0].roll).toBe("00");
      expect(issues[1].roll).toBe("01");
      expect(issues[2].roll).toBe("02");
    });
  });

  describe("formatStartingConditionMessage", () => {
    it("should format an empty list as empty string", () => {
      const message = formatStartingConditionMessage([]);
      expect(message).toBe("");
    });

    it("should format issues with roll, type, and description", () => {
      const issues = [
        {
          roll: "05",
          issue_type: "Minor",
          description: "Hidden (highly illegal) contraband.",
        },
        {
          roll: "57",
          issue_type: "Major",
          description: "Fuel leak. Burn +1 Fuel every time you spend fuel.",
        },
      ];

      const message = formatStartingConditionMessage(issues);
      expect(message).toBe(
        "[05 - Minor]: Hidden (highly illegal) contraband.\n[57 - Major]: Fuel leak. Burn +1 Fuel every time you spend fuel.",
      );
    });
  });

  describe("evaluateStartingCondition", () => {
    it("should evaluate starting condition with count, issues, and message", () => {
      const mockRng = () => 0;
      const evaluation = evaluateStartingCondition(2, maintenanceTable, mockRng);

      expect(evaluation.count).toBe(2);
      expect(evaluation.issues).toHaveLength(2);
      expect(evaluation.issues[0].roll).toBe("00");
      expect(evaluation.issues[1].roll).toBe("01");
      expect(evaluation.message).toContain("[00 - Minor]: Rancid smell permeates cabins.");
      expect(evaluation.message).toContain("[01 - Minor]: Huge mess everywhere.");
    });
  });

  describe("handleStartingCondition", () => {
    it("should execute startRoll and finishRoll with evaluation results", async () => {
      const mockStartRoll = vi.fn().mockResolvedValue({
        rollId: "test-roll-id",
        results: {
          roll: {
            result: 4,
            dice: [3],
            expression: "1d5+1",
            rolls: [],
          },
        },
      });
      const mockFinishRoll = vi.fn();

      // Assign globals for Roll20 environment
      vi.stubGlobal("startRoll", mockStartRoll);
      vi.stubGlobal("finishRoll", mockFinishRoll);

      await handleStartingCondition();

      expect(mockStartRoll).toHaveBeenCalledWith(
        expect.stringContaining("&{template:ms} {{name=Starting Condition}} {{character_name=@{character_name}}} {{roll=[[1d5+1]]}}"),
      );

      expect(mockFinishRoll).toHaveBeenCalledWith(
        "test-roll-id",
        expect.objectContaining({
          notes: expect.stringMatching(/\[\d{2} - (Minor|Major)\]:/),
        }),
      );

      vi.unstubAllGlobals();
    });

    it("should default count to 2 if roll result is undefined", async () => {
      const mockStartRoll = vi.fn().mockResolvedValue({
        rollId: "test-roll-id-2",
        results: {},
      });
      const mockFinishRoll = vi.fn();

      vi.stubGlobal("startRoll", mockStartRoll);
      vi.stubGlobal("finishRoll", mockFinishRoll);

      await handleStartingCondition();

      expect(mockFinishRoll).toHaveBeenCalledWith(
        "test-roll-id-2",
        expect.objectContaining({
          notes: expect.any(String),
        }),
      );

      vi.unstubAllGlobals();
    });
  });
});
