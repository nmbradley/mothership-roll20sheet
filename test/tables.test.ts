import {
  describe,
  it,
  expect,
} from "vitest";

import {
  PANIC_TABLE, WOUNDS_TABLE, deathSaveEffect, panicEffect, rollOnTable,
} from "../src/ts/rules/tables";

describe("Roll Tables (Mothership 1e)", () => {
  describe("rollOnTable", () => {
    it("should return the entry matching the roll", () => {
      const result = rollOnTable(WOUNDS_TABLE, 0);
      expect(result?.entry.severity).toBe("Flesh Wound");
      expect(result?.roll).toBe(0);
    });

    it("should return nothing for a roll the table does not cover", () => {
      expect(rollOnTable(WOUNDS_TABLE, -1)).toBeUndefined();
      expect(rollOnTable(WOUNDS_TABLE, 99)).toBeUndefined();
    });
  });

  describe("deathSaveEffect", () => {
    it("should return the row for the lowest possible roll", () => {
      const effect = deathSaveEffect(0);
      expect(effect?.result).toBe(
        "You are unconscious. You wake up in 2d10 minutes. Reduce your Maximum Health by 1d5.",
      );
    });

    it("should return the row for the highest possible roll", () => {
      const effect = deathSaveEffect(9);
      expect(effect?.result).toBe("You have died. Roll up a new character.");
    });

    it("should return the same row for every value a ranged row covers", () => {
      expect(deathSaveEffect(5)?.result).toBe(deathSaveEffect(9)?.result);
      expect(deathSaveEffect(1)?.result).toBe(deathSaveEffect(2)?.result);
    });

    it("should return nothing for a roll the table does not cover", () => {
      expect(deathSaveEffect(10)).toBeUndefined();
    });
  });

  describe("panicEffect (21.1)", () => {
    it("should answer every face of the Panic Die, 01 through 20", () => {
      expect(PANIC_TABLE.entries).toHaveLength(20);
      for (let roll = 1; roll <= 20; roll++) {
        expect(panicEffect(roll)?.roll).toBe(roll);
      }
    });

    it("should return nothing for a roll off either end of the table", () => {
      expect(panicEffect(0)).toBeUndefined();
      expect(panicEffect(21)).toBeUndefined();
    });

    it("should read the lowest and highest results the book prints", () => {
      expect(panicEffect(1)?.name).toBe("ADRENALINE RUSH");
      expect(panicEffect(20)?.name).toBe("RETIRE");
      expect(panicEffect(20)?.effect).toBe("Roll up a new character to play.");
    });

    it("should mark exactly the results the book gives a new Condition (21.3)", () => {
      const withCondition = PANIC_TABLE.entries
        .filter((entry) => entry.condition)
        .map((entry) => entry.roll);
      expect(withCondition).toEqual([5, 6, 7, 8, 9, 10, 12, 17]);
    });

    it("should mark a Condition on the entries whose own text grants one", () => {
      for (const entry of PANIC_TABLE.entries) {
        expect(entry.condition).toBe(entry.effect.startsWith("Gain a new Condition:"));
      }
    });

    it("should keep the results that raise Minimum Stress as plain text, not Conditions", () => {
      for (const roll of [4, 14, 18, 19]) {
        expect(panicEffect(roll)?.effect).toContain("Minimum Stress");
        expect(panicEffect(roll)?.condition).toBe(false);
      }
    });
  });
});
