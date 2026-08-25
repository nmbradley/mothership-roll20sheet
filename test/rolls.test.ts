import {
  describe,
  it,
  expect,
} from "vitest";

import {
  isDoubles,
  evaluateRoll,
  formatRollSummary,
} from "../src/ts/rules/rolls";

describe("Roll Rules (Mothership 1e)", () => {
  describe("isDoubles", () => {
    it("should identify doubles correctly", () => {
      expect(isDoubles(0)).toBe(true);
      expect(isDoubles(11)).toBe(true);
      expect(isDoubles(22)).toBe(true);
      expect(isDoubles(33)).toBe(true);
      expect(isDoubles(44)).toBe(true);
      expect(isDoubles(55)).toBe(true);
      expect(isDoubles(66)).toBe(true);
      expect(isDoubles(77)).toBe(true);
      expect(isDoubles(88)).toBe(true);
      expect(isDoubles(99)).toBe(true);
      expect(isDoubles(100)).toBe(true);
    });

    it("should return false for non-doubles", () => {
      expect(isDoubles(10)).toBe(false);
      expect(isDoubles(25)).toBe(false);
      expect(isDoubles(42)).toBe(false);
      expect(isDoubles(78)).toBe(false);
    });
  });

  describe("evaluateRoll", () => {
    it("should return CRITICAL SUCCESS on doubles rolling <= target", () => {
      expect(evaluateRoll(11, 30)).toBe("CRITICAL SUCCESS");
      expect(evaluateRoll(22, 22)).toBe("CRITICAL SUCCESS");
      expect(evaluateRoll(0, 30)).toBe("CRITICAL SUCCESS");
    });

    it("should return SUCCESS on non-doubles rolling <= target", () => {
      expect(evaluateRoll(15, 30)).toBe("SUCCESS");
      expect(evaluateRoll(29, 30)).toBe("SUCCESS");
      expect(evaluateRoll(1, 30)).toBe("SUCCESS");
    });

    it("should return FAILURE on non-doubles rolling > target", () => {
      expect(evaluateRoll(31, 30)).toBe("FAILURE");
      expect(evaluateRoll(75, 30)).toBe("FAILURE");
      expect(evaluateRoll(98, 30)).toBe("FAILURE");
    });

    it("should return CRITICAL FAILURE on doubles rolling > target", () => {
      expect(evaluateRoll(33, 30)).toBe("CRITICAL FAILURE");
      expect(evaluateRoll(55, 30)).toBe("CRITICAL FAILURE");
      expect(evaluateRoll(99, 30)).toBe("CRITICAL FAILURE");
      expect(evaluateRoll(100, 30)).toBe("CRITICAL FAILURE");
    });
  });

  describe("formatRollSummary", () => {
    it("should format roll summary string", () => {
      const summary = formatRollSummary("Systems Check", 25, 30, "SUCCESS");
      expect(summary).toBe("Systems Check: Rolled 25 vs Target 30 [SUCCESS]");
    });
  });
});
