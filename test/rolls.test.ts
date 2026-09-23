import {
  describe,
  it,
  expect,
} from "vitest";

import {
  Comparisons,
  Edges,
  NO_CONSEQUENCES,
  Outcomes,
  gradeCheck,
  isDoubles,
  makeCheck,
  outcomeOf,
  resolveEdge,
  selectRoll,
  type CheckResult,
} from "../src/ts/rules/rolls";

describe("Roll Rules (Mothership 1e)", () => {
  describe("isDoubles", () => {
    it("should identify every double on a d100", () => {
      for (const roll of [0, 11, 22, 33, 44, 55, 66, 77, 88, 99]) {
        expect(isDoubles(roll)).toBe(true);
      }
    });

    it("should reject rolls whose digits differ", () => {
      for (const roll of [1, 10, 12, 45, 98]) {
        expect(isDoubles(roll)).toBe(false);
      }
    });
  });

  describe("resolveEdge", () => {
    it("should cancel advantage against disadvantage", () => {
      expect(resolveEdge(true, true)).toBe(Edges.None);
      expect(resolveEdge(false, false)).toBe(Edges.None);
    });

    it("should keep an uncontested edge", () => {
      expect(resolveEdge(true, false)).toBe(Edges.Advantage);
      expect(resolveEdge(false, true)).toBe(Edges.Disadvantage);
    });
  });

  describe("selectRoll", () => {
    it("should take the lower die with advantage when rolling under", () => {
      expect(selectRoll([80, 20], Edges.Advantage, Comparisons.RollUnder)).toBe(20);
      expect(selectRoll([80, 20], Edges.Disadvantage, Comparisons.RollUnder)).toBe(80);
    });

    it("should take the higher die with advantage when rolling over", () => {
      expect(selectRoll([18, 4], Edges.Advantage, Comparisons.RollOver)).toBe(18);
      expect(selectRoll([18, 4], Edges.Disadvantage, Comparisons.RollOver)).toBe(4);
    });

    it("should use the first die when there is no edge", () => {
      expect(selectRoll([80, 20], Edges.None, Comparisons.RollUnder)).toBe(80);
    });
  });

  describe("outcomeOf", () => {
    it("should grade a plain roll-under check", () => {
      expect(outcomeOf(30, 45, Comparisons.RollUnder)).toBe(Outcomes.Success);
      expect(outcomeOf(50, 45, Comparisons.RollUnder)).toBe(Outcomes.Failure);
    });

    it("should promote doubles to a critical in whichever direction it went", () => {
      expect(outcomeOf(22, 45, Comparisons.RollUnder)).toBe(Outcomes.CriticalSuccess);
      expect(outcomeOf(55, 45, Comparisons.RollUnder)).toBe(Outcomes.CriticalFailure);
    });

    it("should treat 00 as a critical success and 99 as a critical failure", () => {
      expect(outcomeOf(0, 0, Comparisons.RollUnder)).toBe(Outcomes.CriticalSuccess);
      expect(outcomeOf(99, 99, Comparisons.RollUnder)).toBe(Outcomes.CriticalFailure);
    });

    it("should grade a roll-over check the other way", () => {
      expect(outcomeOf(15, 10, Comparisons.RollOver)).toBe(Outcomes.Success);
      expect(outcomeOf(5, 10, Comparisons.RollOver)).toBe(Outcomes.Failure);
    });

    it("should still succeed one roll below the 90s auto-fail band", () => {
      expect(outcomeOf(89, 95, Comparisons.RollUnder)).toBe(Outcomes.Success);
    });

    it("should auto-fail 90-98 rolling under even when the target is met", () => {
      for (const roll of [90, 91, 95, 98]) {
        expect(outcomeOf(roll, 99, Comparisons.RollUnder)).toBe(Outcomes.Failure);
      }
    });

    it("should still read 99 as a Critical Failure rather than a plain auto-fail", () => {
      expect(outcomeOf(99, 99, Comparisons.RollUnder)).toBe(Outcomes.CriticalFailure);
    });

    it("should not auto-fail the 90s rolling over", () => {
      expect(outcomeOf(95, 10, Comparisons.RollOver)).toBe(Outcomes.Success);
    });
  });

  describe("makeCheck", () => {
    it("should add the skill bonus and modifier to the target", () => {
      const check = makeCheck({
        name: "Strength Check",
        target: 30,
        rolls: [42],
        skillBonus: 10,
        modifier: 5,
      });
      expect(check.target).toBe(45);
      expect(check.outcome).toBe(Outcomes.Success);
    });

    it("should report the discarded die when an edge threw one away", () => {
      const check = makeCheck({
        name: "Body Save",
        target: 40,
        rolls: [70, 20],
        edge: Edges.Advantage,
      });
      expect(check.roll).toBe(20);
      expect(check.discarded).toBe(70);
    });

    it("should leave the discarded die unset without an edge", () => {
      const check = makeCheck({
        name: "Body Save",
        target: 40,
        rolls: [20],
      });
      expect(check).not.toHaveProperty("discarded");
    });

    it("should force a Panic Check on a critical failure", () => {
      const check = makeCheck({
        name: "Fear Save",
        target: 30,
        rolls: [55],
      });
      expect(check.outcome).toBe(Outcomes.CriticalFailure);
      expect(check.triggersPanic).toBe(true);
    });

    it("should not cascade a failed roll-over check into a Panic Check", () => {
      const check = makeCheck({
        name: "Panic Check",
        target: 10,
        rolls: [5],
        comparison: Comparisons.RollOver,
      });
      expect(check.triggersPanic).toBe(false);
    });
  });

  describe("gradeCheck (18.1, 18.2, 21.2)", () => {
    /** A Fear Save against 30, graded from the single die it rolled. */
    function fearSave(roll: number): CheckResult {
      return makeCheck({
        name: "Fear Save",
        target: 30,
        rolls: [roll],
      });
    }

    it("should cost 1 Stress for a failed Stat Check or Save", () => {
      expect(gradeCheck(fearSave(64))).toEqual({
        stressDelta: 1,
        panics: false,
      });
    });

    it("should cost nothing for a Stat Check or Save that succeeded", () => {
      expect(gradeCheck(fearSave(20))).toEqual({
        stressDelta: 0,
        panics: false,
      });
      expect(gradeCheck(fearSave(22))).toEqual({
        stressDelta: 0,
        panics: false,
      });
    });

    it("should cost 1 Stress and force Panic on a Critical Failure, which is still a failure", () => {
      expect(gradeCheck(fearSave(55))).toEqual({
        stressDelta: 1,
        panics: true,
      });
    });

    it("should let a check with its own Stress rule replace the flat 1", () => {
      const relieves = (check: CheckResult): number => -(check.roll % 10);
      expect(gradeCheck(fearSave(24), relieves)).toEqual({
        stressDelta: -4,
        panics: false,
      });
    });

    it("should still force the Panic Check where a check supplies its own Stress", () => {
      const noStress = (): number => 0;
      expect(gradeCheck(fearSave(55), noStress)).toEqual({
        stressDelta: 0,
        panics: true,
      });
    });

    it("should charge nothing to a roller who bears no consequences of its own", () => {
      expect(NO_CONSEQUENCES).toEqual({
        stressDelta: 0,
        panics: false,
      });
    });
  });
});
