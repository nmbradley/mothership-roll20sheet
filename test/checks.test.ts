import {
  describe,
  it,
  expect,
  afterEach,
  vi,
} from "vitest";

import { Outcomes, SKILL_BONUS } from "../src/ts/rules/rolls";
import {
  applyStressDelta, rollCheck, skillQuery,
} from "../src/ts/rules/checks";

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

describe("rollCheck", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should return the resolved CheckResult so a caller can act on it", async () => {
    const mockStartRoll = vi.fn().mockResolvedValue({
      rollId: "id",
      results: {
        roll: { result: 30 },
        roll2: { result: 80 },
        edge: { result: 0 },
        target: { result: 45 },
      },
    });
    const mockFinishRoll = vi.fn();
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", mockFinishRoll);

    const check = await rollCheck({
      name: "Strength Check",
      target: "@{strength}",
    });

    expect(check.roll).toBe(30);
    expect(check.target).toBe(45);
    expect(check.outcome).toBe(Outcomes.Success);
    expect(mockFinishRoll).toHaveBeenCalled();
  });
});

describe("applyStressDelta", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should write back a plain in-bounds change", () => {
    const mockSetAttrs = vi.fn();
    vi.stubGlobal("setAttrs", mockSetAttrs);

    applyStressDelta(5, 1, 0, 10);

    expect(mockSetAttrs).toHaveBeenCalledWith({ stress: 6 });
  });

  it("should clamp a reduction at the given minimum", () => {
    const mockSetAttrs = vi.fn();
    vi.stubGlobal("setAttrs", mockSetAttrs);

    applyStressDelta(3, -5, 2, 10);

    expect(mockSetAttrs).toHaveBeenCalledWith({ stress: 2 });
  });

  it("should clamp a gain at the given maximum", () => {
    const mockSetAttrs = vi.fn();
    vi.stubGlobal("setAttrs", mockSetAttrs);

    applyStressDelta(9, 5, 0, 10);

    expect(mockSetAttrs).toHaveBeenCalledWith({ stress: 10 });
  });
});
