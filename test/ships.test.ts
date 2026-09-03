import {
  describe, it, expect, vi, afterEach,
} from "vitest";

import { Outcomes } from "../src/ts/rules/rolls";
import { EDGE_QUERY } from "../src/ts/rules/checks";
import { maintenanceTable } from "../src/game/data/maintenance";
import { megadamageTable } from "../src/game/data/megadamage";
import {
  evaluateAfterBattleReport,
  evaluateAnnualMaintenance,
  evaluateBankruptcySave,
  evaluateMoraleCheck,
  handleAfterBattleReport,
  handleAnnualMaintenanceCheck,
  handleBankruptcySave,
  handleMoraleCheck,
  handleSystemsCheck,
  handleThrustersCheck,
  handleBattleCheck,
  handleMdmgChange,
  getMaintenanceIssue,
  getRandomUniqueIssues,
  formatStartingConditionMessage,
  evaluateStartingCondition,
  handleStartingCondition,
  MAINTENANCE_EDGE_QUERY,
  MORALE_BROKEN_MESSAGE,
  shipFailureAlert,
  SHIP_STRESS_MESSAGE,
  SHIP_PANIC_MESSAGE,
  battleCheckDamageDealt,
  battleCheckSelfDamage,
  applyHullDamage,
  getMegadamageEffect,
  mdmgChangeMessage,
  evaluateFuelBid,
  handleRevealFuelBid,
} from "../src/ts/rules/ships";

/**
 * Lets a fire-and-forget follow-up card settle.
 *
 * handleBattleCheck posts its alert from inside the getSectionIDs/getAttrs
 * callback that reads the ship's Hull and MDMG, so it is still in flight when
 * the handler itself resolves -- without this the roll lands after the test
 * has unstubbed finishRoll, and surfaces as an unhandled rejection.
 */
async function flush(): Promise<void> {
  for (let i = 0; i < 5; i += 1) await Promise.resolve();
}

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

  describe("evaluateAfterBattleReport", () => {
    it("should draw no issues on a Success", () => {
      const result = evaluateAfterBattleReport(20, 40, 0, 0);
      expect(result.result).toBe(Outcomes.Success);
      expect(result.issues).toHaveLength(0);
    });

    it("should draw no issues on a Critical Success", () => {
      const result = evaluateAfterBattleReport(11, 40, 0, 0);
      expect(result.result).toBe(Outcomes.CriticalSuccess);
      expect(result.issues).toHaveLength(0);
    });

    it("should draw one issue on a Failure", () => {
      const result = evaluateAfterBattleReport(50, 40, 5, 10);
      expect(result.result).toBe(Outcomes.Failure);
      expect(result.issues).toHaveLength(1);
      expect(result.issues[0]).toEqual(getMaintenanceIssue(5));
    });

    it("should draw two issues on a Critical Failure", () => {
      const result = evaluateAfterBattleReport(99, 40, 5, 10);
      expect(result.result).toBe(Outcomes.CriticalFailure);
      expect(result.issues).toHaveLength(2);
      expect(result.issues[0]).toEqual(getMaintenanceIssue(5));
      expect(result.issues[1]).toEqual(getMaintenanceIssue(10));
    });

    it("should carry no Stress/Panic fields, unlike Annual Maintenance", () => {
      const result = evaluateAfterBattleReport(50, 40, 5, 10);
      expect(result).not.toHaveProperty("stressGain");
      expect(result).not.toHaveProperty("panicCheck");
    });
  });

  describe("evaluateMoraleCheck", () => {
    it("should break morale when the roll is under the ship's current MDMG", () => {
      const result = evaluateMoraleCheck(3, 5);
      expect(result.broken).toBe(true);
      expect(result.message).toBe(MORALE_BROKEN_MESSAGE);
    });

    it("should not break morale when the roll equals MDMG -- under is strict", () => {
      const result = evaluateMoraleCheck(5, 5);
      expect(result.broken).toBe(false);
    });

    it("should not break morale when the roll is over MDMG", () => {
      const result = evaluateMoraleCheck(7, 5);
      expect(result.broken).toBe(false);
    });

    it("should never break morale against an undamaged ship", () => {
      const result = evaluateMoraleCheck(1, 0);
      expect(result.broken).toBe(false);
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

    it("should execute handleAfterBattleReport", async () => {
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
      await handleAfterBattleReport();
      expect(mockFinishRoll).toHaveBeenCalled();
      vi.unstubAllGlobals();
    });

    it("should execute handleMoraleCheck", async () => {
      const mockStartRoll = vi.fn().mockResolvedValue({
        rollId: "id",
        results: {
          roll: { result: 3 },
          target: { result: 5 },
        },
      });
      const mockFinishRoll = vi.fn();
      vi.stubGlobal("startRoll", mockStartRoll);
      vi.stubGlobal("finishRoll", mockFinishRoll);
      await handleMoraleCheck();
      expect(mockFinishRoll).toHaveBeenCalledWith("id", expect.objectContaining({
        notes: MORALE_BROKEN_MESSAGE,
      }));
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
      vi.stubGlobal("getAttrs", (_request: string[], callback: (response: Record<string, string>) => void) => {
        callback({
          ship_hull: "0",
          ship_mdmg: "0",
          ship_mdmg_total: "0",
        });
      });
      vi.stubGlobal("setAttrs", vi.fn());

      await handleAnnualMaintenanceCheck();
      await handleAfterBattleReport();
      await handleBankruptcySave();
      await handleSystemsCheck();
      await handleThrustersCheck();
      await handleBattleCheck();
      await flush();

      const formulas = mockStartRoll.mock.calls.map((call) => call[0] as string);
      const expressions = formulas.flatMap((formula) => formula.match(D100_EXPRESSION) ?? []);
      expect(expressions.length).toBeGreaterThan(0);
      for (const expression of expressions) {
        expect(isZeroIndexed(expression)).toBe(true);
      }

      vi.unstubAllGlobals();
    });

    it("should apply the Hull rule and write MDMG on a failed Battle Check", async () => {
      const mockStartRoll = vi.fn()
        // The Battle Check roll itself: 90 auto-fails regardless of target.
        .mockResolvedValueOnce({
          rollId: "check",
          results: {
            roll: { result: 90 },
            roll2: { result: 90 },
            target: { result: 50 },
          },
        })
        // The follow-up alert/notes broadcast.
        .mockResolvedValueOnce({
          rollId: "alert",
          results: {},
        });
      const mockSetAttrs = vi.fn();
      vi.stubGlobal("startRoll", mockStartRoll);
      vi.stubGlobal("finishRoll", vi.fn());
      stubTranslation();
      vi.stubGlobal("getAttrs", (_request: string[], callback: (response: Record<string, string>) => void) => {
        callback({
          ship_hull: "0",
          ship_mdmg: "1",
          ship_mdmg_total: "3",
        });
      });
      vi.stubGlobal("setAttrs", mockSetAttrs);

      await handleBattleCheck();
      await flush();

      // Hull is already 0, so the 1 self-inflicted MDMG carries straight onto the track.
      expect(mockSetAttrs).toHaveBeenCalledWith({
        ship_hull: 0,
        ship_mdmg: 2,
      });

      vi.unstubAllGlobals();
    });

    // Mirrors the #110/#152 regression coverage on rollRestSave/rollAttack:
    // the Battle Check's own startRoll must be reached synchronously off the
    // click, before the getAttrs that reads Hull/MDMG for the follow-up.
    it("should reach the Battle Check's startRoll before making any getAttrs call", async () => {
      const calls: string[] = [];
      type GetAttrsCallback = (response: Record<string, string>) => void;
      const mockGetAttrs = vi.fn((_request: string[], callback: GetAttrsCallback) => {
        calls.push("getAttrs");
        callback({
          ship_hull: "0",
          ship_mdmg: "1",
          ship_mdmg_total: "3",
        });
      });
      const mockStartRoll = vi.fn()
        .mockImplementationOnce(() => {
          calls.push("startRoll");
          return Promise.resolve({
            rollId: "check",
            results: {
              roll: { result: 90 },
              roll2: { result: 90 },
              target: { result: 50 },
            },
          });
        })
        .mockImplementationOnce(() => {
          calls.push("startRoll");
          return Promise.resolve({
            rollId: "alert",
            results: {},
          });
        });
      vi.stubGlobal("getAttrs", mockGetAttrs);
      vi.stubGlobal("startRoll", mockStartRoll);
      vi.stubGlobal("finishRoll", vi.fn());
      vi.stubGlobal("setAttrs", vi.fn());
      stubTranslation();

      await handleBattleCheck();
      await flush();

      expect(calls).toEqual(["startRoll", "getAttrs", "startRoll"]);

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

  describe("battleCheckDamageDealt", () => {
    it("should deal the ship's own MDMG on a Success", () => {
      expect(battleCheckDamageDealt(Outcomes.Success, 4)).toBe(4);
    });

    it("should double it on a Critical Success", () => {
      expect(battleCheckDamageDealt(Outcomes.CriticalSuccess, 4)).toBe(8);
    });

    it("should deal nothing on a Failure or Critical Failure", () => {
      expect(battleCheckDamageDealt(Outcomes.Failure, 4)).toBe(0);
      expect(battleCheckDamageDealt(Outcomes.CriticalFailure, 4)).toBe(0);
    });
  });

  describe("battleCheckSelfDamage", () => {
    it("should deal the ship 1 MDMG on a Failure", () => {
      expect(battleCheckSelfDamage(Outcomes.Failure)).toBe(1);
    });

    it("should deal the ship 2 MDMG on a Critical Failure", () => {
      expect(battleCheckSelfDamage(Outcomes.CriticalFailure)).toBe(2);
    });

    it("should deal the ship itself nothing on a Success or Critical Success", () => {
      expect(battleCheckSelfDamage(Outcomes.Success)).toBe(0);
      expect(battleCheckSelfDamage(Outcomes.CriticalSuccess)).toBe(0);
    });
  });

  describe("applyHullDamage", () => {
    it("should absorb a hit smaller than Hull without touching MDMG", () => {
      expect(applyHullDamage(3, 10, 0)).toEqual({
        hull: 7,
        mdmg: 0,
      });
    });

    it("should zero Hull and carry the overflow onto MDMG when the hit meets it", () => {
      expect(applyHullDamage(5, 5, 0)).toEqual({
        hull: 0,
        mdmg: 0,
      });
    });

    it("should zero Hull and carry the overflow onto MDMG when the hit exceeds it", () => {
      expect(applyHullDamage(7, 5, 0)).toEqual({
        hull: 0,
        mdmg: 2,
      });
    });

    it("should clamp MDMG at the top of the 0-9 track", () => {
      expect(applyHullDamage(5, 0, 8)).toEqual({
        hull: 0,
        mdmg: 9,
      });
    });
  });

  describe("getMegadamageEffect", () => {
    it("should return the table's first entry at level 0", () => {
      expect(getMegadamageEffect(0)).toEqual(megadamageTable[0]);
    });

    it("should return the table's last entry at level 9", () => {
      expect(getMegadamageEffect(9)).toEqual(megadamageTable[9]);
    });

    it("should clamp out-of-range levels to 0-9", () => {
      expect(getMegadamageEffect(-1)).toEqual(megadamageTable[0]);
      expect(getMegadamageEffect(20)).toEqual(megadamageTable[9]);
    });
  });

  describe("mdmgChangeMessage", () => {
    it("should say nothing when MDMG decreases or stays the same", () => {
      expect(mdmgChangeMessage(3, 2)).toBeUndefined();
      expect(mdmgChangeMessage(3, 3)).toBeUndefined();
    });

    it("should broadcast the table's effect when MDMG increases", () => {
      expect(mdmgChangeMessage(1, 2)).toBe("WEAPONS OFFLINE. Automatically fail Battle Checks.");
    });
  });

  describe("handleMdmgChange", () => {
    it("should post the new level's effect when ship_mdmg increases", async () => {
      const mockStartRoll = vi.fn().mockResolvedValue({
        rollId: "id",
        results: {},
      });
      const mockFinishRoll = vi.fn();
      vi.stubGlobal("startRoll", mockStartRoll);
      vi.stubGlobal("finishRoll", mockFinishRoll);

      handleMdmgChange({
        sourceAttribute: "ship_mdmg",
        newValue: "2",
        previousValue: "1",
        sourceType: "player",
        triggerName: "change:ship_mdmg",
      });
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });

      expect(mockFinishRoll).toHaveBeenCalledWith("id", expect.objectContaining({
        notes: "WEAPONS OFFLINE. Automatically fail Battle Checks.",
      }));

      vi.unstubAllGlobals();
    });

    it("should stay silent when ship_mdmg decreases", () => {
      const mockStartRoll = vi.fn();
      vi.stubGlobal("startRoll", mockStartRoll);
      vi.stubGlobal("finishRoll", vi.fn());

      handleMdmgChange({
        sourceAttribute: "ship_mdmg",
        newValue: "1",
        previousValue: "2",
        sourceType: "player",
        triggerName: "change:ship_mdmg",
      });

      expect(mockStartRoll).not.toHaveBeenCalled();
      vi.unstubAllGlobals();
    });
  });

  describe("evaluateFuelBid", () => {
    it("should spend the bid off Fuel and reset it", () => {
      const result = evaluateFuelBid(10, 4);
      expect(result.valid).toBe(true);
      expect(result.fuel).toBe(6);
    });

    it("should reject a bid larger than current Fuel, leaving Fuel untouched", () => {
      const result = evaluateFuelBid(3, 4);
      expect(result.valid).toBe(false);
      expect(result.fuel).toBe(3);
    });

    it("should reject a negative bid", () => {
      const result = evaluateFuelBid(10, -1);
      expect(result.valid).toBe(false);
      expect(result.fuel).toBe(10);
    });

    it("should allow bidding every last drop of Fuel", () => {
      const result = evaluateFuelBid(5, 5);
      expect(result.valid).toBe(true);
      expect(result.fuel).toBe(0);
    });
  });

  describe("handleRevealFuelBid", () => {
    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it("should deduct a valid bid from Fuel and reset the bid to 0", async () => {
      const mockStartRoll = vi.fn().mockResolvedValue({
        rollId: "id",
        results: {
          bid: { result: 4 },
          fuel: { result: 10 },
        },
      });
      const mockFinishRoll = vi.fn();
      const mockSetAttrs = vi.fn();
      vi.stubGlobal("startRoll", mockStartRoll);
      vi.stubGlobal("finishRoll", mockFinishRoll);
      vi.stubGlobal("setAttrs", mockSetAttrs);

      await handleRevealFuelBid();

      expect(mockSetAttrs).toHaveBeenCalledWith({
        ship_fuel: 6,
        ship_fuel_bid: 0,
      });
      expect(mockFinishRoll).toHaveBeenCalledWith("id", {
        notes: "Fuel Bid Revealed: 4",
        hasnotes: 1,
      });
    });

    it("should not touch Fuel or the bid when the bid exceeds current Fuel", async () => {
      const mockStartRoll = vi.fn().mockResolvedValue({
        rollId: "id",
        results: {
          bid: { result: 8 },
          fuel: { result: 3 },
        },
      });
      const mockFinishRoll = vi.fn();
      const mockSetAttrs = vi.fn();
      vi.stubGlobal("startRoll", mockStartRoll);
      vi.stubGlobal("finishRoll", mockFinishRoll);
      vi.stubGlobal("setAttrs", mockSetAttrs);

      await handleRevealFuelBid();

      expect(mockSetAttrs).not.toHaveBeenCalled();
      expect(mockFinishRoll).toHaveBeenCalledWith("id", expect.objectContaining({
        notes: expect.stringContaining("INVALID FUEL BID"),
      }));
    });

    it("should not touch Fuel or the bid when the bid is negative", async () => {
      const mockStartRoll = vi.fn().mockResolvedValue({
        rollId: "id",
        results: {
          bid: { result: -2 },
          fuel: { result: 10 },
        },
      });
      const mockFinishRoll = vi.fn();
      const mockSetAttrs = vi.fn();
      vi.stubGlobal("startRoll", mockStartRoll);
      vi.stubGlobal("finishRoll", mockFinishRoll);
      vi.stubGlobal("setAttrs", mockSetAttrs);

      await handleRevealFuelBid();

      expect(mockSetAttrs).not.toHaveBeenCalled();
      expect(mockFinishRoll).toHaveBeenCalledWith("id", expect.objectContaining({
        notes: expect.stringContaining("INVALID FUEL BID"),
      }));
    });
  });
});
