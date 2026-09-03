import {
  describe,
  it,
  expect,
} from "vitest";

import {
  checkComputed,
  usedDie,
  checkTemplate,
  panicComputed,
  panicTemplate,
} from "../src/ts/rules/rollTemplate";
import { Edges, makeCheck } from "../src/ts/rules/rolls";
import { makePanicCheck } from "../src/ts/rules/checks";

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

    it("should send only the first die to the Turn Tracker (#50)", () => {
      const template = checkTemplate({
        i18nKey: "Initiative",
        target: "@{instinct}",
        die: "1d100-1",
        sendToTracker: true,
      });
      expect(template).toContain("{{roll=[[1d100-1 &{tracker}]]}}");
      expect(template).toContain("{{roll2=[[1d100-1]]}}");
    });

    it("should leave the tracker out of an ordinary check", () => {
      const template = checkTemplate({
        i18nKey: "Strength Check",
        target: "@{strength}",
        die: "1d100-1",
      });
      expect(template).not.toContain("&{tracker}");
    });

    it("should translate a name given a key", () => {
      const template = checkTemplate({
        i18nKey: "Strength Check",
        target: "@{strength}",
        die: "1d100-1",
      });
      expect(template).toContain("{{title=^{Strength Check}}}");
    });

    it("should leave a name from player data untranslated", () => {
      const template = checkTemplate({
        name: "Pulse Rifle",
        target: "@{combat}",
        die: "1d100-1",
      });
      expect(template).toContain("{{title=Pulse Rifle}}");
    });

    it("should leave computed fields as placeholders for finishRoll", () => {
      const template = checkTemplate({
        i18nKey: "body save",
        target: "@{body}",
        die: "1d100-1",
      });
      expect(template).toContain("{{verdict=[[0]]}}");
      expect(template).toContain("{{verdictclass=[[0]]}}");
      expect(template).toContain("{{used=[[0]]}}");
      expect(template).toContain("{{notes=[[0]]}}");
      expect(template).toContain("{{skill=[[0]]}}");
    });
  });

  describe("checkComputed", () => {
    it("should translate the outcome", () => {
      const check = makeCheck({
        name: "Strength Check",
        target: 45,
        rolls: [30],
      });
      expect(checkComputed(check).verdict).toBe("Success");
    });

    it("should give the outcome a class suffix", () => {
      const check = makeCheck({
        name: "Strength Check",
        target: 45,
        rolls: [30],
      });
      expect(checkComputed(check).verdictclass).toBe("success");
    });

    it("should report which of the two dice the template should highlight", () => {
      // Advantage on a roll-under check keeps the lower die, which here is the
      // second one -- so the card highlights that and fades the first.
      const check = makeCheck({
        name: "Body Save",
        target: 40,
        rolls: [70, 20],
        edge: Edges.Advantage,
      });
      expect(usedDie([70, 20], check.roll)).toBe(2);
      expect(checkComputed(check, "", usedDie([70, 20], check.roll)).used).toBe(2);
    });

    it("should highlight the first die where it is the one that counted", () => {
      const check = makeCheck({
        name: "Body Save",
        target: 40,
        rolls: [20, 70],
        edge: Edges.Advantage,
      });
      expect(usedDie([20, 70], check.roll)).toBe(1);
    });

    it("should warn that a critical failure forces a Panic Check", () => {
      const check = makeCheck({
        name: "Fear Save",
        target: 30,
        rolls: [55],
      });
      expect(checkComputed(check).notes).toBe("Critical Failure: Make a Panic Check");
    });

    it("should leave the note empty on an ordinary failure", () => {
      const check = makeCheck({
        name: "Fear Save",
        target: 30,
        rolls: [45],
      });
      expect(checkComputed(check).notes).toBe("");
    });

    it("should leave the Skill field blank by default", () => {
      const check = makeCheck({
        name: "Strength Check",
        target: 45,
        rolls: [30],
      });
      expect(checkComputed(check).skill).toBe("");
    });

    it("should carry the Skill name a caller decoded off the roll", () => {
      const check = makeCheck({
        name: "Strength Check",
        target: 55,
        rolls: [30],
      });
      expect(checkComputed(check, "Genetics").skill).toBe("Genetics");
    });
  });

  describe("panic", () => {
    it("should measure against Stress", () => {
      expect(panicTemplate()).toContain("{{target=[[@{stress}]]}}");
    });

    it("should report keeping it together when the check passes", () => {
      const check = makePanicCheck(5, [12]);
      const computed = panicComputed(check);
      expect(computed.verdict).toBe("Kept It Together");
      expect(computed.notes).toBe("");
    });

    it("should point a failure at Trauma Response, not a rolled table entry", () => {
      const check = makePanicCheck(10, [3]);
      const computed = panicComputed(check);
      expect(computed.verdict).toBe("Trauma Response");
      expect(computed.notes).toBe("@{stress_effect}");
    });
  });
});
