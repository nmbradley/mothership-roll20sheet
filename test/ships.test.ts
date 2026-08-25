import { describe, it, expect, vi } from "vitest";
import { maintenanceTable } from "../src/game/data/maintenance";
import {
  evaluateAnnualMaintenance,
  evaluateBankruptcySave,
  handleAnnualMaintenanceCheck,
  handleBankruptcySave,
  getMaintenanceIssue,
  getRandomUniqueIssues,
  formatStartingConditionMessage,
  evaluateStartingCondition,
  handleStartingCondition,
} from "../src/ts/rules/ships";

describe("Ship Rules & Mechanics", () => {
  describe("getMaintenanceIssue", () => {
    it("should return the first issue for roll 0", () => {
      const issue = getMaintenanceIssue(0);
      expect(issue.roll).toBe("00");
    });

    it("should return the last issue for roll 99", () => {
      const issue = getMaintenanceIssue(99);
      expect(issue.roll).toBe("99");
    });
  });

  describe("evaluateAnnualMaintenance", () => {
    it("should handle SUCCESS with no stress or panic", () => {
      const result = evaluateAnnualMaintenance(20, 40, 0, 0);
      expect(result.result).toBe("SUCCESS");
      expect(result.stressGain).toBe(0);
      expect(result.panicCheck).toBe(false);
      expect(result.issues.length).toBe(0);
    });
  });

  describe("evaluateBankruptcySave", () => {
    it("should evaluate SUCCESS and return matching consequence", () => {
      const result = evaluateBankruptcySave(25, 30);
      expect(result.result).toBe("SUCCESS");
    });
  });

  describe("getRandomUniqueIssues", () => {
    it("should return requested number of unique issues", () => {
      const issues = getRandomUniqueIssues(3);
      expect(issues).toHaveLength(3);
    });
  });

  describe("formatStartingConditionMessage", () => {
    it("should format issues", () => {
      const issues = [{ roll: "05", issue_type: "Minor", description: "test" }];
      expect(formatStartingConditionMessage(issues)).toContain("test");
    });
  });

  describe("evaluateStartingCondition", () => {
    it("should evaluate", () => {
      const evalRes = evaluateStartingCondition(2, maintenanceTable, () => 0);
      expect(evalRes.count).toBe(2);
      expect(evalRes.issues).toHaveLength(2);
    });
  });

  describe("Sheetworkers startRoll / finishRoll integration", () => {
    it("should execute handleStartingCondition", async () => {
      const mockStartRoll = vi.fn().mockResolvedValue({
        rollId: "id", results: {}
      });
      const mockFinishRoll = vi.fn();
      vi.stubGlobal("startRoll", mockStartRoll);
      vi.stubGlobal("finishRoll", mockFinishRoll);
      await handleStartingCondition();
      expect(mockFinishRoll).toHaveBeenCalled();
      vi.unstubAllGlobals();
    });

    it("should execute handleAnnualMaintenanceCheck", async () => {
      const mockStartRoll = vi.fn().mockResolvedValue({
        rollId: "id", results: {
          roll: { result: 45 }, target: { result: 30 },
          maint_roll1: { result: 5 }, maint_roll2: { result: 10 }
        }
      });
      const mockFinishRoll = vi.fn();
      vi.stubGlobal("startRoll", mockStartRoll);
      vi.stubGlobal("finishRoll", mockFinishRoll);
      await handleAnnualMaintenanceCheck();
      expect(mockFinishRoll).toHaveBeenCalled();
      vi.unstubAllGlobals();
    });
  });
});
