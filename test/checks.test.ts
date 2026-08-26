import {
  describe,
  it,
  expect,
  afterEach,
  vi,
} from "vitest";

import { SKILL_BONUS } from "../src/ts/rules/rolls";
import { skillQuery } from "../src/ts/rules/checks";

/** Stands in for Roll20's translator with a fixed table. */
function translateWith(table: Record<string, string>): void {
  vi.stubGlobal("getTranslationByKey", (key: string) => table[key] ?? key);
}

describe("Skill query", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should offer the bonuses the rules give, untrained first", () => {
    translateWith({});
    expect(skillQuery()).toBe(
      "?{Apply Skill?|Untrained,0|Trained,10|Expert,15|Master,20}",
    );
  });

  it("should take its values from SKILL_BONUS rather than restating them", () => {
    translateWith({});
    const query = skillQuery();
    for (const [level, bonus] of Object.entries(SKILL_BONUS)) {
      const capitalised = level.charAt(0).toUpperCase() + level.slice(1);
      expect(query).toContain(`${capitalised},${String(bonus)}`);
    }
  });

  it("should translate the prompt and every option label", () => {
    translateWith({
      "Apply Skill?": "Compétence ?",
      "Untrained": "Non formé",
      "Trained": "Formé",
      "Master": "Maître",
    });
    expect(skillQuery()).toBe(
      "?{Compétence ?|Non formé,0|Formé,10|Expert,15|Maître,20}",
    );
  });

  it("should strip query syntax a translation carries", () => {
    // A pipe, comma or brace here would split the prompt, invent an option or
    // close the query early, and the roll would fail rather than misread.
    translateWith({
      "Apply Skill?": "Skill|Level}",
      "Untrained": "None, at all",
      "Trained": "{Formé}",
    });
    expect(skillQuery()).toBe(
      "?{SkillLevel|None at all,0|Formé,10|Expert,15|Master,20}",
    );
  });

  it("should keep the English when a translation is nothing but syntax", () => {
    translateWith({ Expert: "|,{}" });
    expect(skillQuery()).toContain("Expert,15");
  });
});
