import {
  describe,
  it,
  expect,
} from "vitest";

import {
  WOUNDS_TABLE, deathSaveEffect, rollOnTable,
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
});
