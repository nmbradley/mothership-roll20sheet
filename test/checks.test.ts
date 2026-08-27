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
  isSaveSkillSelectEnabled,
  recomputeWorstSave,
  restSaveStressDelta,
  rollCheck,
  rollDeathSave,
  rollNPCInitiative,
  rollPCInitiative,
  rollRestSave,
  rollSaveCheck,
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

describe("isSaveSkillSelectEnabled", () => {
  it("should read the checkbox on by default", () => {
    expect(isSaveSkillSelectEnabled(undefined)).toBe(true);
    expect(isSaveSkillSelectEnabled("on")).toBe(true);
  });

  it("should read Roll20's unchecked sentinel as off", () => {
    expect(isSaveSkillSelectEnabled("0")).toBe(false);
  });
});

describe("rollSaveCheck", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should offer the Skill prompt while the Keeper toggle is on", () => {
    translateWith({});
    type GetAttrsCallback = (response: Record<string, string>) => void;
    const mockGetAttrs = vi.fn((_request: string[], callback: GetAttrsCallback) => {
      callback({ save_skill_select: "on" });
    });
    const mockStartRoll = vi.fn().mockResolvedValue({
      rollId: "id",
      results: {
        roll: { result: 30 },
        roll2: { result: 80 },
        edge: { result: 0 },
        target: { result: 45 },
      },
    });
    vi.stubGlobal("getAttrs", mockGetAttrs);
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", vi.fn());

    rollSaveCheck("sanity");

    expect(mockGetAttrs).toHaveBeenCalledWith(["save_skill_select"], expect.any(Function));
    const formula = mockStartRoll.mock.calls[0][0] as string;
    expect(formula).toContain("target=[[@{sanity}+?{Apply Skill?");
  });

  it("should fall back to a plain modifier once the Keeper turns it off", () => {
    type GetAttrsCallback = (response: Record<string, string>) => void;
    const mockGetAttrs = vi.fn((_request: string[], callback: GetAttrsCallback) => {
      callback({ save_skill_select: "0" });
    });
    const mockStartRoll = vi.fn().mockResolvedValue({
      rollId: "id",
      results: {
        roll: { result: 30 },
        roll2: { result: 80 },
        edge: { result: 0 },
        target: { result: 45 },
      },
    });
    vi.stubGlobal("getAttrs", mockGetAttrs);
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", vi.fn());

    rollSaveCheck("sanity");

    const formula = mockStartRoll.mock.calls[0][0] as string;
    expect(formula).toContain("target=[[@{sanity}+?{Modifier?|0}]]");
    expect(formula).not.toContain("Apply Skill?");
  });
});

describe("Initiative (#50)", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should roll a PC's Speed into the Turn Tracker, Skill prompt included", async () => {
    translateWith({});
    const mockStartRoll = vi.fn().mockResolvedValue({
      rollId: "id",
      results: {
        roll: { result: 30 },
        roll2: { result: 80 },
        edge: { result: 0 },
        target: { result: 45 },
      },
    });
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", vi.fn());

    await rollPCInitiative();

    const formula = mockStartRoll.mock.calls[0][0] as string;
    expect(formula).toContain("target=[[@{speed}+?{Apply Skill?");
    expect(formula).toContain("&{tracker}");
  });

  it("should roll an NPC's Instinct into the Turn Tracker, without a Skill prompt", async () => {
    const mockStartRoll = vi.fn().mockResolvedValue({
      rollId: "id",
      results: {
        roll: { result: 30 },
        roll2: { result: 80 },
        edge: { result: 0 },
        target: { result: 45 },
      },
    });
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", vi.fn());

    await rollNPCInitiative();

    const formula = mockStartRoll.mock.calls[0][0] as string;
    expect(formula).toContain("target=[[@{instinct}+?{Modifier?|0}]]");
    expect(formula).toContain("&{tracker}");
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

  it("should tick Stress up by 1, reading the current value and bounds fresh", () => {
    type GetAttrsCallback = (response: Record<string, string>) => void;
    const mockGetAttrs = vi.fn((_request: string[], callback: GetAttrsCallback) => {
      callback({
        stress: "5",
        stress_min: "2",
        stress_max: "20",
      });
    });
    const mockSetAttrs = vi.fn();
    vi.stubGlobal("getAttrs", mockGetAttrs);
    vi.stubGlobal("setAttrs", mockSetAttrs);

    adjustStress(1);

    expect(mockGetAttrs).toHaveBeenCalledWith(
      ["stress", "stress_min", "stress_max"],
      expect.any(Function),
    );
    expect(mockSetAttrs).toHaveBeenCalledWith({ stress: 6 });
  });

  it("should tick Stress down by 1", () => {
    type GetAttrsCallback = (response: Record<string, string>) => void;
    const mockGetAttrs = vi.fn((_request: string[], callback: GetAttrsCallback) => {
      callback({
        stress: "5",
        stress_min: "2",
        stress_max: "20",
      });
    });
    const mockSetAttrs = vi.fn();
    vi.stubGlobal("getAttrs", mockGetAttrs);
    vi.stubGlobal("setAttrs", mockSetAttrs);

    adjustStress(-1);

    expect(mockSetAttrs).toHaveBeenCalledWith({ stress: 4 });
  });

  it("should clamp at the bounds read off the sheet, not a hardcoded value", () => {
    type GetAttrsCallback = (response: Record<string, string>) => void;
    const mockGetAttrs = vi.fn((_request: string[], callback: GetAttrsCallback) => {
      callback({
        stress: "2",
        stress_min: "2",
        stress_max: "20",
      });
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

describe("recomputeWorstSave", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should write worst_save from the three current Saves", () => {
    type GetAttrsCallback = (response: Record<string, string>) => void;
    const mockGetAttrs = vi.fn((_request: string[], callback: GetAttrsCallback) => {
      callback({
        sanity: "60",
        fear: "35",
        body: "50",
      });
    });
    const mockSetAttrs = vi.fn();
    vi.stubGlobal("getAttrs", mockGetAttrs);
    vi.stubGlobal("setAttrs", mockSetAttrs);

    recomputeWorstSave();

    expect(mockSetAttrs).toHaveBeenCalledWith({ worst_save: 35 });
  });
});

describe("rollRestSave", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should target worst_save directly and adjust Stress on the outcome", async () => {
    type GetAttrsCallback = (response: Record<string, string>) => void;
    const mockGetAttrs = vi.fn((_request: string[], callback: GetAttrsCallback) => {
      callback({
        stress: "10",
        stress_min: "2",
        stress_max: "20",
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
    expect(formula).toContain("target=[[@{worst_save}+");
    expect(mockSetAttrs).toHaveBeenCalledWith({ stress: 6 });
  });

  it("should clamp to stress_min as read off the sheet, not a hardcoded bound", async () => {
    type GetAttrsCallback = (response: Record<string, string>) => void;
    // An unusual floor of 4, not the ordinary 2, proves the clamp reads
    // stress_min rather than a value baked into checks.ts.
    const mockGetAttrs = vi.fn((_request: string[], callback: GetAttrsCallback) => {
      callback({
        stress: "5",
        stress_min: "4",
        stress_max: "20",
      });
    });
    const mockStartRoll = vi.fn().mockResolvedValue({
      rollId: "id",
      results: {
        roll: { result: 48 },
        roll2: { result: 80 },
        edge: { result: 0 },
        target: { result: 99 },
      },
    });
    const mockFinishRoll = vi.fn();
    const mockSetAttrs = vi.fn();
    vi.stubGlobal("getAttrs", mockGetAttrs);
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", mockFinishRoll);
    vi.stubGlobal("setAttrs", mockSetAttrs);

    // A success reduces Stress by 8 (the roll's ones digit): 5 - 8 would be
    // -3, floored at the custom minimum of 4 rather than the usual 2.
    await rollRestSave();

    expect(mockSetAttrs).toHaveBeenCalledWith({ stress: 4 });
  });

  // #110 regression: rollRestSave used to await a getAttrs round trip before
  // its startRoll, which silently broke the roll -- Roll20 requires
  // startRoll to be reached synchronously from the click handler. This pins
  // the call order so that ordering cannot drift back.
  it("should reach startRoll before making any getAttrs call", async () => {
    const calls: string[] = [];
    type GetAttrsCallback = (response: Record<string, string>) => void;
    const mockGetAttrs = vi.fn((_request: string[], callback: GetAttrsCallback) => {
      calls.push("getAttrs");
      callback({
        stress: "10",
        stress_min: "2",
        stress_max: "20",
      });
    });
    const mockStartRoll = vi.fn(() => {
      calls.push("startRoll");
      return Promise.resolve({
        rollId: "id",
        results: {
          roll: { result: 24 },
          roll2: { result: 80 },
          edge: { result: 0 },
          target: { result: 35 },
        },
      });
    });
    vi.stubGlobal("getAttrs", mockGetAttrs);
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", vi.fn());
    vi.stubGlobal("setAttrs", vi.fn());

    await rollRestSave();

    expect(calls).toEqual(["startRoll", "getAttrs"]);
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
