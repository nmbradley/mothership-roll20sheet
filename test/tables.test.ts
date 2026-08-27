import {
  describe,
  it,
  expect,
} from "vitest";

import { Edges, Outcomes } from "../src/ts/rules/rolls";
import {
  PANIC_TABLE, deathSaveEffect, makePanicCheck, rollOnTable,
} from "../src/ts/rules/tables";

describe("Roll Tables (Mothership 1e)", () => {
  describe("rollOnTable", () => {
    it("should return the entry matching the roll", () => {
      const result = rollOnTable(PANIC_TABLE, 1);
      expect(result?.entry.name).toBe("ADRENALINE RUSH");
      expect(result?.roll).toBe(1);
    });

    it("should return nothing for a roll the table does not cover", () => {
      expect(rollOnTable(PANIC_TABLE, 0)).toBeUndefined();
      expect(rollOnTable(PANIC_TABLE, 99)).toBeUndefined();
    });
  });

  describe("makePanicCheck", () => {
    it("should pass when the die beats current Stress", () => {
      const panic = makePanicCheck(5, [12]);
      expect(panic.check.outcome).toBe(Outcomes.Success);
      expect(panic).not.toHaveProperty("effect");
    });

    it("should look the result up on the table when it fails", () => {
      const panic = makePanicCheck(10, [3]);
      expect(panic.check.outcome).toBe(Outcomes.Failure);
      expect(panic.effect?.name).toBe("JUMPY");
    });

    it("should fail on a tie, since the die must beat Stress outright", () => {
      const panic = makePanicCheck(7, [7]);
      expect(panic.check.outcome).toBe(Outcomes.Failure);
      expect(panic.effect?.roll).toBe(7);
    });

    it("should take the higher die with advantage", () => {
      const panic = makePanicCheck(10, [4, 15], Edges.Advantage);
      expect(panic.check.roll).toBe(15);
      expect(panic.check.outcome).toBe(Outcomes.Success);
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
