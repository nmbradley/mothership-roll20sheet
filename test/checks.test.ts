import {
  describe,
  it,
  expect,
  afterEach,
  vi,
} from "vitest";

import {
  Comparisons, Edges, Outcomes, SKILL_BONUS, makeCheck,
} from "../src/ts/rules/rolls";
import {
  applyStressDelta,
  gradeAttack,
  isNpcSheet,
  isOutOfAmmo,
  isSaveSkillSelectEnabled,
  makePanicCheck,
  recomputeWorstSave,
  restSaveStressDelta,
  rollAttack,
  rollCheck,
  rollDeathSave,
  rollNPCInitiative,
  rollPCInitiative,
  rollPanicCheck,
  rollRestSave,
  rollSaveCheck,
  skillQuery,
  spendAmmo,
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

describe("makePanicCheck", () => {
  it("should pass when the die beats current Stress", () => {
    const check = makePanicCheck(5, [12]);
    expect(check.outcome).toBe(Outcomes.Success);
  });

  it("should fail when the die does not beat current Stress", () => {
    const check = makePanicCheck(10, [3]);
    expect(check.outcome).toBe(Outcomes.Failure);
  });

  it("should fail on a tie, since the die must beat Stress outright", () => {
    const check = makePanicCheck(7, [7]);
    expect(check.outcome).toBe(Outcomes.Failure);
  });

  it("should take the higher die with advantage", () => {
    const check = makePanicCheck(10, [4, 15], Edges.Advantage);
    expect(check.roll).toBe(15);
    expect(check.outcome).toBe(Outcomes.Success);
  });
});

describe("rollPanicCheck", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should point a failure at the character's Trauma Response, not a table", async () => {
    const mockStartRoll = vi.fn().mockResolvedValue({
      rollId: "id",
      results: {
        roll: { result: 3 },
        roll2: { result: 3 },
        edge: { result: 0 },
        target: { result: 10 },
      },
    });
    const mockFinishRoll = vi.fn();
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", mockFinishRoll);

    await rollPanicCheck();

    expect(mockFinishRoll).toHaveBeenCalledWith("id", expect.objectContaining({
      notes: "@{stress_effect}",
    }));
  });

  it("should not reference getAttrs at all -- the check reads off the roll itself", async () => {
    const mockGetAttrs = vi.fn();
    const mockStartRoll = vi.fn().mockResolvedValue({
      rollId: "id",
      results: {
        roll: { result: 15 },
        roll2: { result: 15 },
        edge: { result: 0 },
        target: { result: 10 },
      },
    });
    vi.stubGlobal("getAttrs", mockGetAttrs);
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", vi.fn());

    await rollPanicCheck();

    expect(mockGetAttrs).not.toHaveBeenCalled();
  });
});

describe("gradeAttack (#51)", () => {
  it("should show Damage and cost no Stress on a Success", () => {
    expect(gradeAttack(Outcomes.Success)).toEqual({
      showDamage: true,
      stressDelta: 0,
    });
  });

  it("should show Damage and cost no Stress on a Critical Success", () => {
    expect(gradeAttack(Outcomes.CriticalSuccess)).toEqual({
      showDamage: true,
      stressDelta: 0,
    });
  });

  it("should withhold Damage and cost 1 Stress on a Failure", () => {
    expect(gradeAttack(Outcomes.Failure)).toEqual({
      showDamage: false,
      stressDelta: 1,
    });
  });

  it("should withhold Damage and cost 1 Stress on a Critical Failure too", () => {
    expect(gradeAttack(Outcomes.CriticalFailure)).toEqual({
      showDamage: false,
      stressDelta: 1,
    });
  });
});

describe("rollAttack", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should roll the row's own Damage as a second card on a hit", async () => {
    const mockStartRoll = vi.fn()
      .mockResolvedValueOnce({
        rollId: "check",
        results: {
          roll: { result: 20 },
          roll2: { result: 80 },
          edge: { result: 0 },
          target: { result: 45 },
        },
      })
      .mockResolvedValueOnce({
        rollId: "damage",
        results: {},
      });
    const mockFinishRoll = vi.fn();
    const mockGetAttrs = vi.fn();
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", mockFinishRoll);
    vi.stubGlobal("getAttrs", mockGetAttrs);

    await rollAttack({
      name: "@{attack_name}",
      target: "@{combat}",
    });

    const followUpFormula = mockStartRoll.mock.calls[1][0] as string;
    expect(followUpFormula).toContain("{{damage=[[@{attack_damage}]]}}");
    expect(mockFinishRoll).toHaveBeenLastCalledWith("damage", { alert: "" });
    // A hit costs no Stress, so there is nothing to read off the sheet for.
    expect(mockGetAttrs).not.toHaveBeenCalled();
  });

  it("should withhold Damage and gain 1 Stress automatically on a miss", async () => {
    const mockStartRoll = vi.fn()
      .mockResolvedValueOnce({
        rollId: "check",
        results: {
          roll: { result: 91 },
          roll2: { result: 91 },
          edge: { result: 0 },
          target: { result: 45 },
        },
      })
      .mockResolvedValueOnce({
        rollId: "miss",
        results: {},
      });
    const mockFinishRoll = vi.fn();
    type GetAttrsCallback = (response: Record<string, string>) => void;
    const mockGetAttrs = vi.fn((_request: string[], callback: GetAttrsCallback) => {
      callback({
        stress: "3",
        stress_min: "0",
        stress_max: "10",
      });
    });
    const mockSetAttrs = vi.fn();
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", mockFinishRoll);
    vi.stubGlobal("getAttrs", mockGetAttrs);
    vi.stubGlobal("setAttrs", mockSetAttrs);

    await rollAttack({
      name: "@{attack_name}",
      target: "@{combat}",
    });

    const followUpFormula = mockStartRoll.mock.calls[1][0] as string;
    expect(followUpFormula).not.toContain("damage");
    expect(mockFinishRoll).toHaveBeenLastCalledWith("miss", {
      alert: "^{Attack Failed: Gain 1 Stress}",
    });
    expect(mockSetAttrs).toHaveBeenCalledWith({ stress: 4 });
  });

  it("should still gain Stress on a Critical Failure, on top of the Panic warning the Check card already carries", async () => {
    const mockStartRoll = vi.fn()
      .mockResolvedValueOnce({
        rollId: "check",
        results: {
          roll: { result: 99 },
          roll2: { result: 99 },
          edge: { result: 0 },
          target: { result: 45 },
        },
      })
      .mockResolvedValueOnce({
        rollId: "miss",
        results: {},
      });
    const mockFinishRoll = vi.fn();
    type GetAttrsCallback = (response: Record<string, string>) => void;
    const mockGetAttrs = vi.fn((_request: string[], callback: GetAttrsCallback) => {
      callback({
        stress: "3",
        stress_min: "0",
        stress_max: "10",
      });
    });
    const mockSetAttrs = vi.fn();
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", mockFinishRoll);
    vi.stubGlobal("getAttrs", mockGetAttrs);
    vi.stubGlobal("setAttrs", mockSetAttrs);

    await rollAttack({
      name: "@{attack_name}",
      target: "@{combat}",
    });

    // The Check card itself (the first finishRoll call) already carries the
    // Panic warning via checkComputed -- rollAttack does not duplicate it.
    expect(mockFinishRoll.mock.calls[0][1]).toEqual(
      expect.objectContaining({ notes: "^{Critical Failure: Make a Panic Check}" }),
    );
    expect(mockSetAttrs).toHaveBeenCalledWith({ stress: 4 });
  });

  // Mirrors the #110 regression coverage on rollRestSave: the Check's own
  // startRoll must still be reached synchronously off the click, before any
  // getAttrs the failure-Stress follow-up makes.
  it("should reach the Check's startRoll before making any getAttrs call", async () => {
    const calls: string[] = [];
    type GetAttrsCallback = (response: Record<string, string>) => void;
    const mockGetAttrs = vi.fn((_request: string[], callback: GetAttrsCallback) => {
      calls.push("getAttrs");
      callback({
        stress: "3",
        stress_min: "0",
        stress_max: "10",
      });
    });
    const mockStartRoll = vi.fn()
      .mockImplementationOnce(() => {
        calls.push("startRoll");
        return Promise.resolve({
          rollId: "check",
          results: {
            roll: { result: 91 },
            roll2: { result: 91 },
            edge: { result: 0 },
            target: { result: 45 },
          },
        });
      })
      .mockImplementationOnce(() => {
        calls.push("startRoll");
        return Promise.resolve({
          rollId: "miss",
          results: {},
        });
      });
    vi.stubGlobal("getAttrs", mockGetAttrs);
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", vi.fn());
    vi.stubGlobal("setAttrs", vi.fn());

    await rollAttack({
      name: "@{attack_name}",
      target: "@{combat}",
    });

    expect(calls).toEqual(["startRoll", "startRoll", "getAttrs"]);
  });

  // #147: NPCs share repeating_attacks and this same handler with PCs (#90),
  // but must not gain Stress from a miss.
  it("should not grant Stress on a miss for an NPC", async () => {
    const mockStartRoll = vi.fn()
      .mockResolvedValueOnce({
        rollId: "check",
        results: {
          roll: { result: 91 },
          roll2: { result: 91 },
          edge: { result: 0 },
          target: { result: 45 },
        },
      })
      .mockResolvedValueOnce({
        rollId: "miss",
        results: {},
      });
    type GetAttrsCallback = (response: Record<string, string>) => void;
    const mockGetAttrs = vi.fn((_request: string[], callback: GetAttrsCallback) => {
      callback({
        stress: "3",
        stress_min: "0",
        stress_max: "10",
        sheet_toggle: "npc",
      });
    });
    const mockSetAttrs = vi.fn();
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", vi.fn());
    vi.stubGlobal("getAttrs", mockGetAttrs);
    vi.stubGlobal("setAttrs", mockSetAttrs);

    await rollAttack({
      name: "@{attack_name}",
      target: "@{combat}",
    });

    expect(mockSetAttrs).not.toHaveBeenCalled();
  });

  // #14: a rowId lets rollAttack spend the row's own ammo after the roll.
  it("should spend one shot from the row's ammo on a hit, given a rowId", async () => {
    const mockStartRoll = vi.fn()
      .mockResolvedValueOnce({
        rollId: "check",
        results: {
          roll: { result: 20 },
          roll2: { result: 80 },
          edge: { result: 0 },
          target: { result: 45 },
        },
      })
      .mockResolvedValueOnce({
        rollId: "damage",
        results: {},
      });
    type GetAttrsCallback = (response: Record<string, string>) => void;
    const mockGetAttrs = vi.fn((_request: string[], callback: GetAttrsCallback) => {
      callback({
        "stress": "3",
        "stress_min": "0",
        "stress_max": "10",
        "sheet_toggle": "pc",
        "repeating_attacks_-row1_attack_shots": "5",
      });
    });
    const mockSetAttrs = vi.fn();
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", vi.fn());
    vi.stubGlobal("getAttrs", mockGetAttrs);
    vi.stubGlobal("setAttrs", mockSetAttrs);

    await rollAttack({
      name: "@{attack_name}",
      target: "@{combat}",
    }, "-row1");

    expect(mockGetAttrs).toHaveBeenCalledWith(
      expect.arrayContaining(["repeating_attacks_-row1_attack_shots"]),
      expect.any(Function),
    );
    expect(mockSetAttrs).toHaveBeenCalledWith({
      "repeating_attacks_-row1_attack_shots": "4",
    });
  });

  it("should post a loud Out of Ammo card once a tracked weapon's magazine empties", async () => {
    const mockStartRoll = vi.fn()
      .mockResolvedValueOnce({
        rollId: "check",
        results: {
          roll: { result: 20 },
          roll2: { result: 80 },
          edge: { result: 0 },
          target: { result: 45 },
        },
      })
      .mockResolvedValueOnce({
        rollId: "damage",
        results: {},
      })
      .mockResolvedValueOnce({
        rollId: "empty",
        results: {},
      });
    type GetAttrsCallback = (response: Record<string, string>) => void;
    const mockGetAttrs = vi.fn((_request: string[], callback: GetAttrsCallback) => {
      callback({
        "stress": "3",
        "stress_min": "0",
        "stress_max": "10",
        "sheet_toggle": "pc",
        "repeating_attacks_-row1_attack_shots": "1",
      });
    });
    const mockFinishRoll = vi.fn();
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", mockFinishRoll);
    vi.stubGlobal("getAttrs", mockGetAttrs);
    vi.stubGlobal("setAttrs", vi.fn());

    await rollAttack({
      name: "@{attack_name}",
      target: "@{combat}",
    }, "-row1");

    expect(mockStartRoll).toHaveBeenCalledTimes(3);
    expect(mockFinishRoll).toHaveBeenLastCalledWith("empty", {
      alert: "^{Out of Ammo}",
    });
  });

  it("should leave an untracked (e.g. infinite) weapon's ammo untouched", async () => {
    const mockStartRoll = vi.fn()
      .mockResolvedValueOnce({
        rollId: "check",
        results: {
          roll: { result: 20 },
          roll2: { result: 80 },
          edge: { result: 0 },
          target: { result: 45 },
        },
      })
      .mockResolvedValueOnce({
        rollId: "damage",
        results: {},
      });
    type GetAttrsCallback = (response: Record<string, string>) => void;
    const mockGetAttrs = vi.fn((_request: string[], callback: GetAttrsCallback) => {
      callback({
        "stress": "3",
        "stress_min": "0",
        "stress_max": "10",
        "sheet_toggle": "pc",
        "repeating_attacks_-row1_attack_shots": "∞",
      });
    });
    const mockSetAttrs = vi.fn();
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", vi.fn());
    vi.stubGlobal("getAttrs", mockGetAttrs);
    vi.stubGlobal("setAttrs", mockSetAttrs);

    await rollAttack({
      name: "@{attack_name}",
      target: "@{combat}",
    }, "-row1");

    expect(mockSetAttrs).toHaveBeenCalledWith({
      "repeating_attacks_-row1_attack_shots": "∞",
    });
    expect(mockStartRoll).toHaveBeenCalledTimes(2);
  });
});

describe("isNpcSheet (#147)", () => {
  it("should read the npc sheet type as an NPC", () => {
    expect(isNpcSheet("npc")).toBe(true);
  });

  it("should read pc, ship and unset as not an NPC", () => {
    expect(isNpcSheet("pc")).toBe(false);
    expect(isNpcSheet("ship")).toBe(false);
    expect(isNpcSheet(undefined)).toBe(false);
  });
});

describe("spendAmmo (#14)", () => {
  it("should spend one shot from a plain magazine count", () => {
    expect(spendAmmo("5")).toBe("4");
  });

  it("should floor at 0 rather than go negative", () => {
    expect(spendAmmo("0")).toBe("0");
  });

  it("should tolerate surrounding whitespace", () => {
    expect(spendAmmo(" 3 ")).toBe("2");
  });

  it("should leave an untracked value untouched", () => {
    expect(spendAmmo("∞")).toBe("∞");
    expect(spendAmmo("")).toBe("");
    expect(spendAmmo("many")).toBe("many");
  });
});

describe("isOutOfAmmo (#14)", () => {
  it("should read a tracked magazine at 0 as out", () => {
    expect(isOutOfAmmo("0")).toBe(true);
  });

  it("should read a tracked magazine above 0 as not out", () => {
    expect(isOutOfAmmo("3")).toBe(false);
  });

  it("should read an untracked value as not out", () => {
    expect(isOutOfAmmo("∞")).toBe(false);
    expect(isOutOfAmmo("")).toBe(false);
  });
});
