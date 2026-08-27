import {
  describe,
  it,
  expect,
  afterEach,
  vi,
} from "vitest";

import {
  Comparisons, Outcomes, SKILL_BONUS, makeCheck,
} from "../src/ts/rules/rolls";
import {
  adjustStress,
  applyStressDelta,
  restSaveStressDelta,
  rollCheck,
  rollDeathSave,
  rollRestSave,
  skillQuery,
  worstSave,
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

describe("adjustStress", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should tick Stress up by 1, reading the current value fresh", () => {
    type GetAttrsCallback = (response: Record<string, string>) => void;
    const mockGetAttrs = vi.fn((_request: string[], callback: GetAttrsCallback) => {
      callback({ stress: "5" });
    });
    const mockSetAttrs = vi.fn();
    vi.stubGlobal("getAttrs", mockGetAttrs);
    vi.stubGlobal("setAttrs", mockSetAttrs);

    adjustStress(1);

    expect(mockGetAttrs).toHaveBeenCalledWith(["stress"], expect.any(Function));
    expect(mockSetAttrs).toHaveBeenCalledWith({ stress: 6 });
  });

  it("should tick Stress down by 1", () => {
    type GetAttrsCallback = (response: Record<string, string>) => void;
    const mockGetAttrs = vi.fn((_request: string[], callback: GetAttrsCallback) => {
      callback({ stress: "5" });
    });
    const mockSetAttrs = vi.fn();
    vi.stubGlobal("getAttrs", mockGetAttrs);
    vi.stubGlobal("setAttrs", mockSetAttrs);

    adjustStress(-1);

    expect(mockSetAttrs).toHaveBeenCalledWith({ stress: 4 });
  });

  it("should clamp at the 1e Stress bounds a button tick cannot cross", () => {
    type GetAttrsCallback = (response: Record<string, string>) => void;
    const mockGetAttrs = vi.fn((_request: string[], callback: GetAttrsCallback) => {
      callback({ stress: "2" });
    });
    const mockSetAttrs = vi.fn();
    vi.stubGlobal("getAttrs", mockGetAttrs);
    vi.stubGlobal("setAttrs", mockSetAttrs);

    adjustStress(-1);

    expect(mockSetAttrs).toHaveBeenCalledWith({ stress: 2 });
  });
});

describe("worstSave", () => {
  it("should pick the lowest of the three Saves", () => {
    expect(worstSave(40, 25, 55)).toBe(25);
  });

  it("should resolve a tie to the shared value", () => {
    expect(worstSave(30, 30, 55)).toBe(30);
    expect(worstSave(10, 10, 10)).toBe(10);
  });
});

describe("restSaveStressDelta", () => {
  it("should reduce Stress by the ones digit of a successful roll", () => {
    const check = makeCheck({
      name: "Rest Save",
      target: 50,
      rolls: [24],
      comparison: Comparisons.RollUnder,
    });

    expect(check.outcome).toBe(Outcomes.Success);
    expect(restSaveStressDelta(check)).toBe(-4);
  });

  it("should grant 1 Stress on a failure", () => {
    const check = makeCheck({
      name: "Rest Save",
      target: 10,
      rolls: [57],
    });

    expect(check.outcome).toBe(Outcomes.Failure);
    expect(restSaveStressDelta(check)).toBe(1);
  });

  it("should floor the reduction at the given minimum once applied", () => {
    const check = makeCheck({
      name: "Rest Save",
      target: 99,
      rolls: [38],
    });
    expect(check.outcome).toBe(Outcomes.Success);

    const delta = restSaveStressDelta(check);
    expect(delta).toBe(-8);

    const mockSetAttrs = vi.fn();
    vi.stubGlobal("setAttrs", mockSetAttrs);
    applyStressDelta(3, delta, 2, 20);
    expect(mockSetAttrs).toHaveBeenCalledWith({ stress: 2 });
  });
});

describe("rollRestSave", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should target the worst Save, read fresh via getAttrs, and adjust Stress on the outcome", async () => {
    type GetAttrsCallback = (response: Record<string, string>) => void;
    const mockGetAttrs = vi.fn((_request: string[], callback: GetAttrsCallback) => {
      callback({
        sanity: "60",
        fear: "35",
        body: "50",
        stress: "10",
      });
    });
    const mockStartRoll = vi.fn().mockResolvedValue({
      rollId: "id",
      results: {
        roll: { result: 24 },
        roll2: { result: 80 },
        edge: { result: 0 },
        target: { result: 35 },
      },
    });
    const mockFinishRoll = vi.fn();
    const mockSetAttrs = vi.fn();
    vi.stubGlobal("getAttrs", mockGetAttrs);
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", mockFinishRoll);
    vi.stubGlobal("setAttrs", mockSetAttrs);

    await rollRestSave();

    const formula = mockStartRoll.mock.calls[0][0] as string;
    expect(formula).toContain("target=[[35+");
    expect(mockSetAttrs).toHaveBeenCalledWith({ stress: 6 });
  });
});

describe("rollDeathSave", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should look the d10 result up on the Death Table and post it to chat", async () => {
    const mockStartRoll = vi.fn().mockResolvedValue({
      rollId: "id",
      results: {
        roll: { result: 9 },
      },
    });
    const mockFinishRoll = vi.fn();
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", mockFinishRoll);

    await rollDeathSave();

    expect(mockFinishRoll).toHaveBeenCalledWith("id", {
      notes: "You have died. Roll up a new character.",
    });
  });
});
