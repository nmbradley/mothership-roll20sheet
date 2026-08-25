import { describe, it, expect } from "vitest";
import { isDoubles, evaluateRoll, formatRollSummary } from "../rolls";

describe("Mothership 1e Dice Mechanics", () => {
  describe("isDoubles", () => {
    it("should identify 0 and 100 as doubles / crits", () => {
      expect(isDoubles(0)).toBe(true);
      expect(isDoubles(100)).toBe(true);
      expect(isDoubles(-1)).toBe(true);
    });

    it("should identify matching digits 11, 22, 33, 44, 55, 66, 77, 88, 99 as doubles", () => {
      const doublesList = [11, 22, 33, 44, 55, 66, 77, 88, 99];
      for (const val of doublesList) {
        expect(isDoubles(val)).toBe(true);
      }
    });

    it("should identify non-matching numbers as false", () => {
      const nonDoubles = [1, 2, 9, 10, 12, 23, 34, 45, 56, 67, 78, 89, 90, 98];
      for (const val of nonDoubles) {
        expect(isDoubles(val)).toBe(false);
      }
    });
  });

  describe("evaluateRoll", () => {
    it("should return SUCCESS when roll <= target and not doubles", () => {
      expect(evaluateRoll(25, 40)).toBe("SUCCESS");
      expect(evaluateRoll(40, 40)).toBe("SUCCESS");
      expect(evaluateRoll(1, 30)).toBe("SUCCESS");
    });

    it("should return FAILURE when roll > target and not doubles", () => {
      expect(evaluateRoll(41, 40)).toBe("FAILURE");
      expect(evaluateRoll(75, 50)).toBe("FAILURE");
      expect(evaluateRoll(98, 30)).toBe("FAILURE");
    });

    it("should return CRITICAL SUCCESS when roll <= target and is doubles", () => {
      expect(evaluateRoll(11, 40)).toBe("CRITICAL SUCCESS");
      expect(evaluateRoll(22, 30)).toBe("CRITICAL SUCCESS");
      expect(evaluateRoll(33, 33)).toBe("CRITICAL SUCCESS");
      expect(evaluateRoll(0, 30)).toBe("CRITICAL SUCCESS");
    });

    it("should return CRITICAL FAILURE when roll > target and is doubles", () => {
      expect(evaluateRoll(55, 40)).toBe("CRITICAL FAILURE");
      expect(evaluateRoll(77, 50)).toBe("CRITICAL FAILURE");
      expect(evaluateRoll(99, 30)).toBe("CRITICAL FAILURE");
      expect(evaluateRoll(100, 30)).toBe("CRITICAL FAILURE");
    });
  });

  describe("formatRollSummary", () => {
    it("should format string with roll, target and result", () => {
      const summary = formatRollSummary("Systems Check", 25, 40, "SUCCESS");
      expect(summary).toBe("Systems Check: Rolled 25 vs Target 40 [SUCCESS]");
    });
  });
});
