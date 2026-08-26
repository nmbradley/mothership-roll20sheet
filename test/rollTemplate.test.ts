import {
  describe,
  it,
  expect,
} from "vitest";

import {
  checkComputed,
  checkTemplate,
  panicComputed,
  panicTemplate,
} from "../src/ts/rules/rollTemplate";
import { Edges, makeCheck } from "../src/ts/rules/rolls";
import { makePanicCheck } from "../src/ts/rules/tables";

describe("Roll Templates", () => {
  describe("checkTemplate", () => {
    it("should roll two dice so an edge has a second to choose from", () => {
      const template = checkTemplate({
        i18nKey: "Strength Check",
        target: "@{strength}",
        die: "1d100-1",
      });
      expect(template).toContain("{{roll=[[1d100-1]]}}");
      expect(template).toContain("{{roll2=[[1d100-1]]}}");
      expect(template).toContain("{{target=[[@{strength}]]}}");
    });

    it("should translate a name given a key", () => {
      const template = checkTemplate({
        i18nKey: "Strength Check",
        target: "@{strength}",
        die: "1d100-1",
      });
      expect(template).toContain("{{name=^{Strength Check}}}");
    });

    it("should leave a name from player data untranslated", () => {
      const template = checkTemplate({
        name: "Pulse Rifle",
        target: "@{combat}",
        die: "1d100-1",
      });
      expect(template).toContain("{{name=Pulse Rifle}}");
    });

    it("should leave computed fields as placeholders for finishRoll", () => {
      const template = checkTemplate({
        i18nKey: "body save",
        target: "@{body}",
        die: "1d100-1",
      });
      expect(template).toContain("{{result=[[0]]}}");
      expect(template).toContain("{{counted=[[0]]}}");
      expect(template).toContain("{{notes=[[0]]}}");
    });
  });

  describe("checkComputed", () => {
    it("should translate the outcome", () => {
      const check = makeCheck({
        name: "Strength Check",
        target: 45,
        rolls: [30],
      });
      expect(checkComputed(check).result).toBe("^{Success}");
    });

    it("should note the edge beside the die that counted", () => {
      const check = makeCheck({
        name: "Body Save",
        target: 40,
        rolls: [70, 20],
        edge: Edges.Advantage,
      });
      expect(checkComputed(check).counted).toBe("20 [+]");
    });

    it("should warn that a critical failure forces a Panic Check", () => {
      const check = makeCheck({
        name: "Fear Save",
        target: 30,
        rolls: [55],
      });
      expect(checkComputed(check).notes).toBe("^{Critical Failure: Make a Panic Check}");
    });

    it("should leave the note empty on an ordinary failure", () => {
      const check = makeCheck({
        name: "Fear Save",
        target: 30,
        rolls: [45],
      });
      expect(checkComputed(check).notes).toBe("");
    });
  });

  describe("panic", () => {
    it("should measure against Stress", () => {
      expect(panicTemplate()).toContain("{{target=[[@{stress}]]}}");
    });

    it("should report keeping it together when the check passes", () => {
      const panic = makePanicCheck(5, [12]);
      const computed = panicComputed(panic);
      expect(computed.result).toBe("^{Kept It Together}");
      expect(computed.notes).toBe("");
    });

    it("should report the table entry when the check fails", () => {
      const panic = makePanicCheck(10, [3]);
      const computed = panicComputed(panic);
      expect(computed.result).toBe("JUMPY");
      expect(computed.notes).toContain("All Close crewmembers");
    });
  });
});
