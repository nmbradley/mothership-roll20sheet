import {
  describe, it, expect,
} from "vitest";

import { addBleeding, bleedingIncrease } from "../src/ts/rules/bleeding";

describe("addBleeding", () => {
  it("is cumulative: Bleeding +1 on top of an existing rate adds to it (32.2)", () => {
    expect(addBleeding(1, 1)).toBe(2);
  });

  it("never drops the rate below zero", () => {
    expect(addBleeding(1, -5)).toBe(0);
  });

  it("clears cleanly from zero", () => {
    expect(addBleeding(0, 0)).toBe(0);
  });
});

describe("bleedingIncrease", () => {
  it("reads the amount off a Wounds Table result naming Bleeding", () => {
    expect(bleedingIncrease("Laceration. Bleeding +1.")).toBe(1);
    expect(bleedingIncrease("Limb severed. Bleeding +5.")).toBe(5);
  });

  it("reads zero where the result names no Bleeding at all", () => {
    expect(bleedingIncrease("Digit mangled.")).toBe(0);
  });
});
