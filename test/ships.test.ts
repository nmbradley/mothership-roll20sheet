import {
  describe,
  it,
  expect,
  vi,
} from "vitest";

import {
  getMaintenanceIssue,
  evaluateAnnualMaintenance,
  evaluateBankruptcySave,
  handleAnnualMaintenanceCheck,
  handleBankruptcySave,
} from "../src/ts/rules/ships";

describe("Ship Rules (Mothership 1e)", () => {
  describe("getMaintenanceIssue", () => {
    it("should retrieve the issue corresponding to the roll index", () => {
      const issue0 = getMaintenanceIssue(0);
      expect(issue0.roll).toBe("00");
      expect(issue0.issue_type).toBe("Minor");
      expect(issue0.description).toBe("Rancid smell permeates cabins.");

      const issue23 = getMaintenanceIssue(23);
      expect(issue23.roll).toBe("23");
      expect(issue23.issue_type).toBe("Major");
      expect(issue23.description).toContain("Oxygen leak");

      const issue99 = getMaintenanceIssue(99);
      expect(issue99.roll).toBe("99");
      expect(issue99.issue_type).toBe("Major");
      expect(issue99.description).toContain("Rust bucket");
    });

    it("should clamp values outside 0-99", () => {
      const negativeIssue = getMaintenanceIssue(-5);
      expect(negativeIssue.roll).toBe("00");

      const highIssue = getMaintenanceIssue(150);
      expect(highIssue.roll).toBe("99");
    });
  });

  describe("evaluateAnnualMaintenance", () => {
    it("should handle CRITICAL SUCCESS with no stress, no panic, no issues", () => {
      const result = evaluateAnnualMaintenance(22, 40, 10, 20);
      expect(result.result).toBe("CRITICAL SUCCESS");
      expect(result.stressGain).toBe(0);
      expect(result.panicCheck).toBe(false);
      expect(result.issues).toEqual([]);
      expect(result.message).toContain("CRITICAL SUCCESS");
      expect(result.message).toContain("No maintenance issues");
    });

    it("should handle SUCCESS with no stress, no panic, no issues", () => {
      const result = evaluateAnnualMaintenance(25, 40, 10, 20);
      expect(result.result).toBe("SUCCESS");
      expect(result.stressGain).toBe(0);
      expect(result.panicCheck).toBe(false);
      expect(result.issues).toEqual([]);
      expect(result.message).toContain("SUCCESS");
      expect(result.message).toContain("passed");
    });

    it("should handle FAILURE with 1 stress and 1 maintenance roll", () => {
      const result = evaluateAnnualMaintenance(45, 40, 23, 50);
      expect(result.result).toBe("FAILURE");
      expect(result.stressGain).toBe(1);
      expect(result.panicCheck).toBe(false);
      expect(result.issues.length).toBe(1);
      expect(result.issues[0].roll).toBe("23");
      expect(result.message).toContain("Everyone gains 1 Stress");
      expect(result.message).toContain("Oxygen leak");
    });

    it("should handle CRITICAL FAILURE with panic check and 2 maintenance rolls", () => {
      const result = evaluateAnnualMaintenance(55, 40, 23, 99);
      expect(result.result).toBe("CRITICAL FAILURE");
      expect(result.stressGain).toBe(0);
      expect(result.panicCheck).toBe(true);
      expect(result.issues.length).toBe(2);
      expect(result.issues[0].roll).toBe("23");
      expect(result.issues[1].roll).toBe("99");
      expect(result.message).toContain("CRITICAL FAILURE: Everyone makes a Panic Check!");
      expect(result.message).toContain("Oxygen leak");
      expect(result.message).toContain("Rust bucket");
    });
  });

  describe("evaluateBankruptcySave", () => {
    it("should evaluate CRITICAL SUCCESS and return matching consequence", () => {
      const result = evaluateBankruptcySave(11, 30);
      expect(result.result).toBe("CRITICAL SUCCESS");
      expect(result.consequence).toContain("You turn a small profit");
      expect(result.message).toContain("CRITICAL SUCCESS");
    });

    it("should evaluate SUCCESS and return matching consequence", () => {
      const result = evaluateBankruptcySave(25, 30);
      expect(result.result).toBe("SUCCESS");
      expect(result.consequence).toContain("You scrape by");
      expect(result.message).toContain("SUCCESS");
    });

    it("should evaluate FAILURE and return matching consequence", () => {
      const result = evaluateBankruptcySave(45, 30);
      expect(result.result).toBe("FAILURE");
      expect(result.consequence).toContain("1d10mcr in debt to ruthless lenders");
      expect(result.message).toContain("FAILURE");
    });

    it("should evaluate CRITICAL FAILURE and return matching consequence", () => {
      const result = evaluateBankruptcySave(66, 30);
      expect(result.result).toBe("CRITICAL FAILURE");
      expect(result.consequence).toContain("The company goes bankrupt");
      expect(result.message).toContain("CRITICAL FAILURE");
    });
  });

  describe("Sheetworkers startRoll / finishRoll integration", () => {
    it("should execute handleAnnualMaintenanceCheck using startRoll and finishRoll", async () => {
      const mockStartRoll = vi.fn().mockResolvedValue({
        rollId: "test-roll-1",
        results: {
          roll: { result: 45 },
          target: { result: 30 },
          maint_roll1: { result: 5 },
          maint_roll2: { result: 10 },
        },
      });
      const mockFinishRoll = vi.fn();

      // @ts-expect-error Mocking global sheetworker functions
      global.startRoll = mockStartRoll;
      // @ts-expect-error Mocking global sheetworker functions
      global.finishRoll = mockFinishRoll;

      await handleAnnualMaintenanceCheck();

      expect(mockStartRoll).toHaveBeenCalled();
      const expectedMessagePart = "FAILURE: Everyone gains 1 Stress.";
      expect(mockFinishRoll).toHaveBeenCalledWith("test-roll-1", {
        notes: expect.stringContaining(expectedMessagePart),
      });
    });

    it("should execute handleBankruptcySave using startRoll and finishRoll", async () => {
      const mockStartRoll = vi.fn().mockResolvedValue({
        rollId: "test-roll-2",
        results: {
          roll: { result: 15 },
          target: { result: 30 },
        },
      });
      const mockFinishRoll = vi.fn();

      // @ts-expect-error Mocking global sheetworker functions
      global.startRoll = mockStartRoll;
      // @ts-expect-error Mocking global sheetworker functions
      global.finishRoll = mockFinishRoll;

      await handleBankruptcySave();

      expect(mockStartRoll).toHaveBeenCalled();
      const expectedSuccessPart = "SUCCESS: You scrape by";
      expect(mockFinishRoll).toHaveBeenCalledWith("test-roll-2", {
        notes: expect.stringContaining(expectedSuccessPart),
      });
    });
  });
});
