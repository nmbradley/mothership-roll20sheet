import {
  describe, it, expect, vi,
} from "vitest";

import { Outcomes } from "../src/ts/rules/rolls";
import { EDGE_QUERY } from "../src/ts/rules/checks";
import { maintenanceTable } from "../src/game/data/maintenance";
import {
  evaluateAnnualMaintenance,
  evaluateBankruptcySave,
  handleAnnualMaintenanceCheck,
  handleBankruptcySave,
  handleSystemsCheck,
  handleThrustersCheck,
  handleBattleCheck,
  getMaintenanceIssue,
  getRandomUniqueIssues,
  formatStartingConditionMessage,
  evaluateStartingCondition,
  handleStartingCondition,
  MAINTENANCE_EDGE_QUERY,
  shipFailureAlert,
  SHIP_STRESS_MESSAGE,
  SHIP_PANIC_MESSAGE,
} from "../src/ts/rules/ships";

/** Stands in for Roll20's translator, echoing every key untranslated. */
function stubTranslation(): void {
  vi.stubGlobal("getTranslationByKey", (key: string) => key);
}

/** Every `NdN`-style d100 expression a formula rolls, e.g. "2d100kl1-1". */
const D100_EXPRESSION = /\d*d100(?:k[lh]1)?(-1)?/g;

/** True where a d100 expression reads 0-99 rather than 1-100. */
function isZeroIndexed(expression: string): boolean {
  return expression.endsWith("-1");
}

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
      expect(result.result).toBe(Outcomes.Success);
      expect(result.stressGain).toBe(0);
      expect(result.panicCheck).toBe(false);
      expect(result.issues.length).toBe(0);
    });

    it("should auto-fail a roll of 90-98 even under the target, per the corrected 0-99 boundary", () => {
      const result = evaluateAnnualMaintenance(95, 99, 5, 10);
      expect(result.result).toBe(Outcomes.Failure);
      expect(result.stressGain).toBe(1);
    });
  });

  describe("MAINTENANCE_EDGE_QUERY", () => {
    it("should roll every option 0-99, matching the rest of the codebase's d100 convention", () => {
      expect(MAINTENANCE_EDGE_QUERY).toContain("Normal,1d100-1");
      expect(MAINTENANCE_EDGE_QUERY).toContain("Advantage,2d100kl1-1");
      expect(MAINTENANCE_EDGE_QUERY).toContain("Disadvantage,2d100kh1-1");
    });

    it("should share EDGE_QUERY's prompt and option wording", () => {
      const wording = (query: string) => query.replace(/,[^|}]+/g, "");
      expect(wording(MAINTENANCE_EDGE_QUERY)).toBe(wording(EDGE_QUERY));
    });
  });

  describe("evaluateBankruptcySave", () => {
    it("should evaluate SUCCESS and return matching consequence", () => {
      const result = evaluateBankruptcySave(25, 30);
      expect(result.result).toBe(Outcomes.Success);
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
      const issues = [{
        roll: "05",
        issue_type: "Minor",
        description: "test",
      }];
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
        rollId: "id",
        results: {},
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
        rollId: "id",
        results: {
          roll: { result: 45 },
          target: { result: 30 },
          maint_roll1: { result: 5 },
          maint_roll2: { result: 10 },
        },
      });
      const mockFinishRoll = vi.fn();
      vi.stubGlobal("startRoll", mockStartRoll);
      vi.stubGlobal("finishRoll", mockFinishRoll);
      await handleAnnualMaintenanceCheck();
      expect(mockFinishRoll).toHaveBeenCalled();
      vi.unstubAllGlobals();
    });

    it("should emit only 0-99 d100 expressions from every ship roll", async () => {
      const mockStartRoll = vi.fn().mockResolvedValue({
        rollId: "id",
        results: {},
      });
      vi.stubGlobal("startRoll", mockStartRoll);
      vi.stubGlobal("finishRoll", vi.fn());
      stubTranslation();

      await handleAnnualMaintenanceCheck();
      await handleBankruptcySave();
      await handleSystemsCheck();
      await handleThrustersCheck();
      await handleBattleCheck();

      const formulas = mockStartRoll.mock.calls.map((call) => call[0] as string);
      const expressions = formulas.flatMap((formula) => formula.match(D100_EXPRESSION) ?? []);
      expect(expressions.length).toBeGreaterThan(0);
      for (const expression of expressions) {
        expect(isZeroIndexed(expression)).toBe(true);
      }

      vi.unstubAllGlobals();
    });
  });

  describe("shipFailureAlert", () => {
    it("should say nothing on a Success or Critical Success", () => {
      expect(shipFailureAlert(Outcomes.Success)).toBe("");
      expect(shipFailureAlert(Outcomes.CriticalSuccess)).toBe("");
    });

    it("should gain everyone 1 Stress on a Failure", () => {
      expect(shipFailureAlert(Outcomes.Failure)).toBe(SHIP_STRESS_MESSAGE);
    });

    it("should also demand a Panic Check on a Critical Failure", () => {
      const alert = shipFailureAlert(Outcomes.CriticalFailure);
      expect(alert).toContain(SHIP_STRESS_MESSAGE);
      expect(alert).toContain(SHIP_PANIC_MESSAGE);
    });
  });
});
