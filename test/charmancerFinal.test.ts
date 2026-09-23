import {
  describe, it, expect,
} from "vitest";

import { magazine } from "../src/ts/charactermancer/7-final";

describe("Charactermancer Final Step (Mothership 1e)", () => {
  describe("magazine (#226)", () => {
    it("should load a numeric weapon's magazine full, current matching max", () => {
      expect(magazine("5")).toEqual({
        current: "5",
        max: "5",
      });
      expect(magazine("3")).toEqual({
        current: "3",
        max: "3",
      });
    });

    it("should land an N/A weapon as a blank max, never as 0 rounds remaining", () => {
      expect(magazine("N/A")).toEqual({
        current: "",
        max: "",
      });
    });

    it("should land an infinite weapon as a blank max too", () => {
      expect(magazine("∞")).toEqual({
        current: "",
        max: "",
      });
    });
  });
});
