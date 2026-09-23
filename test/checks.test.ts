import {
  describe,
  it,
  expect,
  afterEach,
  vi,
} from "vitest";

import type { PanicEffect } from "../src/game/data/panic";
import { skill_query } from "../src/game/fields/pcFields";
import {
  Comparisons, Edges, Outcomes, SKILL_BONUS, makeCheck,
} from "../src/ts/rules/rolls";
import { panicEffect } from "../src/ts/rules/tables";
import {
  applyStressDelta,
  STRESS_MAX,
  attackBonus,
  buildSkillCatalog,
  buildSkillQuery,
  clickedRowId,
  gradeAttack,
  handleAttackClick,
  isNpcSheet,
  isOutOfAmmo,
  isSaveSkillSelectEnabled,
  makePanicCheck,
  panicConditionRow,
  readSkillName,
  recomputeSkillQuery,
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
  stressOverflow,
  weaponLine,
  worstSave,
  type AttackRow,
} from "../src/ts/rules/checks";

/** Stands in for Roll20's translator with a fixed table. */
function translateWith(table: Record<string, string>): void {
  vi.stubGlobal("getTranslationByKey", (key: string) => table[key] ?? key);
}

/** Lets a fire-and-forget follow-up card settle. */
async function flush(): Promise<void> {
  for (let i = 0; i < 5; i += 1) await Promise.resolve();
}

describe("skillQuery", () => {
  it("should only ever reference the persisted attribute, never build the list itself", () => {
    expect(skillQuery()).toBe("@{skill_query}");
  });
});

describe("buildSkillCatalog", () => {
  it("should tag every Skill with its own tier's bonus", () => {
    const catalog = buildSkillCatalog(["Genetics"], ["Hacking"], ["Astrogation"]);
    expect(catalog).toEqual([
      {
        name: "Genetics",
        bonus: SKILL_BONUS.trained,
        level: "trained",
      },
      {
        name: "Hacking",
        bonus: SKILL_BONUS.expert,
        level: "expert",
      },
      {
        name: "Astrogation",
        bonus: SKILL_BONUS.master,
        level: "master",
      },
    ]);
  });

  it("should leave out a row with no name typed yet", () => {
    const catalog = buildSkillCatalog(["Genetics", "", "  "], [], []);
    expect(catalog).toEqual([{
      name: "Genetics",
      bonus: SKILL_BONUS.trained,
      level: "trained",
    }]);
  });

  it("should build an empty catalog for a character with no Skills at all", () => {
    expect(buildSkillCatalog([], [], [])).toEqual([]);
  });
});

describe("buildSkillQuery", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should fall back to the plain tiers for a character with no Skills", () => {
    translateWith({});
    expect(buildSkillQuery([])).toBe(
      "?{Apply Skill?|None,0|Trained (+10),10[Trained]|Expert (+15),15[Expert]|Master (+20),20[Master]}",
    );
  });

  it("should match skill_query's seeded default, so a fresh sheet still rolls", () => {
    translateWith({});
    expect(skill_query.value).toBe(buildSkillQuery([]));
  });

  it("should carry each Skill's own name as an annotation on its tier bonus", () => {
    translateWith({});
    const query = buildSkillQuery([
      {
        name: "Genetics",
        bonus: SKILL_BONUS.trained,
        level: "trained",
      },
      {
        name: "Hydroponics",
        bonus: SKILL_BONUS.expert,
        level: "expert",
      },
    ]);
    expect(query).toBe(
      "?{Apply Skill?|None,0|Trained: Genetics (+10),10[Genetics]"
      + "|Expert: Hydroponics (+15),15[Hydroponics]"
      + "|Trained (+10),10[Trained]|Expert (+15),15[Expert]|Master (+20),20[Master]}",
    );
  });

  it("should translate the prompt and the (none) label", () => {
    translateWith({
      "Apply Skill?": "Compétence ?",
      "None": "Aucune",
    });
    const query = buildSkillQuery([{
      name: "Genetics",
      bonus: SKILL_BONUS.trained,
      level: "trained",
    }]);
    expect(query).toBe(
      "?{Compétence ?|Aucune,0|Trained: Genetics (+10),10[Genetics]"
      + "|Trained (+10),10[Trained]|Expert (+15),15[Expert]|Master (+20),20[Master]}",
    );
  });

  it("should strip query and annotation syntax out of a player-typed Skill name", () => {
    translateWith({});
    const query = buildSkillQuery([{
      name: "Gen|et,ics{}[]",
      bonus: SKILL_BONUS.trained,
      level: "trained",
    }]);
    expect(query).toBe(
      "?{Apply Skill?|None,0|Trained: Genetics (+10),10[Genetics]|Trained (+10),10[Trained]|Expert (+15),15[Expert]|Master (+20),20[Master]}",
    );
  });
});

describe("readSkillName", () => {
  it("should decode the [Name] annotation off a resolved target expression", () => {
    expect(readSkillName("45 + 10[Genetics]")).toBe("Genetics");
  });

  it("should return empty when (none) was picked, leaving no annotation behind", () => {
    expect(readSkillName("45 + 0")).toBe("");
  });

  it("should return empty when the check offered no Skill prompt at all", () => {
    expect(readSkillName(undefined)).toBe("");
  });
});

describe("recomputeSkillQuery", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should persist a query built from the three Skill sections", async () => {
    translateWith({});
    vi.stubGlobal("getSectionIDs", (section: string, callback: (ids: string[]) => void) => {
      if (section === "repeating_trained") callback(["row1"]);
      else callback([]);
    });
    vi.stubGlobal("getAttrs", (_request: string[], callback: (response: Record<string, string>) => void) => {
      callback({ repeating_trained_row1_skill_name: "Genetics" });
    });
    const mockSetAttrs = vi.fn();
    vi.stubGlobal("setAttrs", mockSetAttrs);

    await recomputeSkillQuery();

    expect(mockSetAttrs).toHaveBeenCalledWith({
      skill_query: "?{Apply Skill?|None,0|Trained: Genetics (+10),10[Genetics]|Trained (+10),10[Trained]|Expert (+15),15[Expert]|Master (+20),20[Master]}",
    });
  });

  it("should still persist (none) alone with every section empty", async () => {
    translateWith({});
    vi.stubGlobal("getSectionIDs", (_section: string, callback: (ids: string[]) => void) => {
      callback([]);
    });
    const mockSetAttrs = vi.fn();
    vi.stubGlobal("setAttrs", mockSetAttrs);

    await recomputeSkillQuery();

    expect(mockSetAttrs).toHaveBeenCalledWith({
      skill_query: "?{Apply Skill?|None,0|Trained (+10),10[Trained]|Expert (+15),15[Expert]|Master (+20),20[Master]}",
    });
  });

  it("should reach setAttrs synchronously, with no promise between the three section reads and the write", () => {
    translateWith({});
    const calls: string[] = [];
    vi.stubGlobal("getSectionIDs", (section: string, callback: (ids: string[]) => void) => {
      calls.push(`getSectionIDs:${section}`);
      callback([]);
    });
    const mockSetAttrs = vi.fn(() => {
      calls.push("setAttrs");
    });
    vi.stubGlobal("setAttrs", mockSetAttrs);

    recomputeSkillQuery();

    expect(calls).toEqual([
      "getSectionIDs:repeating_trained",
      "getSectionIDs:repeating_expert",
      "getSectionIDs:repeating_master",
      "setAttrs",
    ]);
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

  it("should decode the Skill a skilled check's target carries back (#5)", async () => {
    const mockStartRoll = vi.fn().mockResolvedValue({
      rollId: "id",
      results: {
        roll: { result: 30 },
        roll2: { result: 80 },
        edge: { result: 0 },
        target: {
          result: 45,
          expression: "35 + 10[Genetics]",
        },
      },
    });
    const mockFinishRoll = vi.fn();
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", mockFinishRoll);

    await rollCheck({
      name: "Strength Check",
      target: "@{strength}",
      bonus: skillQuery(),
    });

    expect(mockFinishRoll).toHaveBeenCalledWith("id", expect.objectContaining({
      skill: "Genetics",
    }));
  });

  it("should read Unskilled where a Skill was offered and declined", async () => {
    const mockStartRoll = vi.fn().mockResolvedValue({
      rollId: "id",
      results: {
        roll: { result: 30 },
        roll2: { result: 80 },
        edge: { result: 0 },
        target: {
          result: 35,
          expression: "35 + 0",
        },
      },
    });
    const mockFinishRoll = vi.fn();
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", mockFinishRoll);

    await rollCheck({
      name: "Strength Check",
      target: "@{strength}",
      bonus: skillQuery(),
    });

    expect(mockFinishRoll).toHaveBeenCalledWith("id", expect.objectContaining({
      skill: "Unskilled",
    }));
  });

  it("should leave the Skill blank where the check offered no prompt at all", async () => {
    const mockStartRoll = vi.fn().mockResolvedValue({
      rollId: "id",
      results: {
        roll: { result: 30 },
        roll2: { result: 80 },
        edge: { result: 0 },
        target: {
          result: 35,
          expression: "35 + 0",
        },
      },
    });
    const mockFinishRoll = vi.fn();
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", mockFinishRoll);

    await rollCheck({
      name: "Instinct Check",
      target: "@{instinct}",
    });

    expect(mockFinishRoll).toHaveBeenCalledWith("id", expect.objectContaining({
      skill: "",
    }));
  });
});

describe("a failed Check or Save gains 1 Stress (#199)", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should gain 1 Stress for a plain failed Stat Check", async () => {
    const mockSetAttrs = vi.fn();
    stubAttrs({
      stress: "3",
      stress_min: "2",
    });
    vi.stubGlobal("startRoll", vi.fn().mockResolvedValue(checkRoll(MISS)));
    vi.stubGlobal("finishRoll", vi.fn());
    vi.stubGlobal("setAttrs", mockSetAttrs);

    await rollCheck({
      i18nKey: "Strength Check",
      target: "@{strength}",
    });

    expect(mockSetAttrs).toHaveBeenCalledWith({ stress: 4 });
  });

  it("should gain no Stress and read nothing off the sheet for a success", async () => {
    const mockGetAttrs = vi.fn();
    vi.stubGlobal("getAttrs", mockGetAttrs);
    vi.stubGlobal("startRoll", vi.fn().mockResolvedValue(checkRoll(HIT)));
    vi.stubGlobal("finishRoll", vi.fn());
    vi.stubGlobal("setAttrs", vi.fn());

    await rollCheck({
      i18nKey: "Strength Check",
      target: "@{strength}",
    });

    expect(mockGetAttrs).not.toHaveBeenCalled();
  });

  it("should route the gain through applyStressDelta, so the cap and overflow still hold", async () => {
    const mockStartRoll = vi.fn()
      .mockResolvedValueOnce(checkRoll(MISS))
      .mockResolvedValueOnce({
        rollId: "overflow",
        results: {},
      });
    const mockFinishRoll = vi.fn();
    const mockSetAttrs = vi.fn();
    stubAttrs({
      stress: String(STRESS_MAX),
      stress_min: "2",
    });
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", mockFinishRoll);
    vi.stubGlobal("setAttrs", mockSetAttrs);

    await rollCheck({
      i18nKey: "Strength Check",
      target: "@{strength}",
    });
    await flush();

    expect(mockSetAttrs).toHaveBeenCalledWith({ stress: STRESS_MAX });
    expect(mockFinishRoll).toHaveBeenLastCalledWith("overflow", expect.objectContaining({
      hasalert: 1,
    }));
  });

  it("should leave an NPC's failed check alone, since an NPC has no Stress track", async () => {
    const mockSetAttrs = vi.fn();
    stubAttrs({
      stress: "3",
      stress_min: "2",
      sheet_toggle: "npc",
    });
    vi.stubGlobal("startRoll", vi.fn().mockResolvedValue(checkRoll(MISS)));
    vi.stubGlobal("finishRoll", vi.fn());
    vi.stubGlobal("setAttrs", mockSetAttrs);

    await rollCheck({
      i18nKey: "Instinct Check",
      target: "@{instinct}",
    });

    expect(mockSetAttrs).not.toHaveBeenCalled();
  });

  it("should leave a Ship's failed check to the alert its crew already gets", async () => {
    const mockGetAttrs = vi.fn();
    const mockFinishRoll = vi.fn();
    vi.stubGlobal("getAttrs", mockGetAttrs);
    vi.stubGlobal("startRoll", vi.fn().mockResolvedValue(checkRoll(MISS)));
    vi.stubGlobal("finishRoll", mockFinishRoll);
    vi.stubGlobal("setAttrs", vi.fn());

    await rollCheck({
      i18nKey: "Systems Check",
      target: "@{ship_systems}",
      ship: true,
    });

    expect(mockGetAttrs).not.toHaveBeenCalled();
    expect(mockFinishRoll).toHaveBeenCalledWith("check", expect.objectContaining({
      notes: "",
      hasnotes: 0,
    }));
  });
});

describe("a Critical Failure forces a Panic Check (#200)", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  /** A Critical Failure, then the Panic Check it forces. */
  function criticalThenPanic(panic: number): ReturnType<typeof vi.fn> {
    return vi.fn()
      .mockResolvedValueOnce(checkRoll(99))
      .mockResolvedValueOnce(panicRoll(panic, 4));
  }

  it("should gain the Stress before rolling the Panic Check it measures against", async () => {
    const order: string[] = [];
    const mockStartRoll = vi.fn((formula: string) => {
      order.push(`startRoll ${formula.includes("Panic Check") ? "panic" : "check"}`);
      const panic = formula.includes("Panic Check");
      return Promise.resolve(panic ? panicRoll(3, 4) : checkRoll(99));
    });
    stubAttrs({
      stress: "3",
      stress_min: "2",
    });
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", vi.fn());
    vi.stubGlobal("setAttrs", vi.fn((attrs: Record<string, unknown>) => {
      order.push(`setAttrs ${JSON.stringify(attrs)}`);
    }));

    await rollCheck({
      i18nKey: "Fear Save",
      target: "@{fear}",
    });
    await flush();

    expect(order).toEqual([
      "startRoll check",
      "setAttrs {\"stress\":4}",
      "startRoll panic",
    ]);
  });

  it("should measure the Panic Check against the Stress the failure just added", async () => {
    const mockStartRoll = criticalThenPanic(3);
    stubAttrs({
      stress: "3",
      stress_min: "2",
    });
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", vi.fn());
    vi.stubGlobal("setAttrs", vi.fn());

    await rollCheck({
      i18nKey: "Fear Save",
      target: "@{fear}",
    });
    await flush();

    const panicFormula = mockStartRoll.mock.calls[1][0] as string;
    expect(panicFormula).toContain("{{target=[[4]]}}");
    expect(panicFormula).not.toContain("@{stress}");
  });

  it("should not force a Panic Check on an ordinary failure", async () => {
    const mockStartRoll = vi.fn().mockResolvedValue(checkRoll(MISS));
    stubAttrs({
      stress: "3",
      stress_min: "2",
    });
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", vi.fn());
    vi.stubGlobal("setAttrs", vi.fn());

    await rollCheck({
      i18nKey: "Fear Save",
      target: "@{fear}",
    });
    await flush();

    expect(mockStartRoll).toHaveBeenCalledTimes(1);
  });

  it("should not drag an NPC into a Panic Check", async () => {
    const mockStartRoll = criticalThenPanic(3);
    stubAttrs({
      stress: "3",
      stress_min: "2",
      sheet_toggle: "npc",
    });
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", vi.fn());
    vi.stubGlobal("setAttrs", vi.fn());

    await rollCheck({
      i18nKey: "Instinct Check",
      target: "@{instinct}",
    });
    await flush();

    expect(mockStartRoll).toHaveBeenCalledTimes(1);
  });

  it("should reach the check's startRoll before it reads any attribute", async () => {
    const calls: string[] = [];
    type GetAttrsCallback = (response: Record<string, string>) => void;
    vi.stubGlobal("getAttrs", vi.fn((_request: string[], callback: GetAttrsCallback) => {
      calls.push("getAttrs");
      callback({
        stress: "3",
        stress_min: "2",
      });
    }));
    vi.stubGlobal("startRoll", vi.fn(() => {
      calls.push("startRoll");
      return Promise.resolve(checkRoll(MISS));
    }));
    vi.stubGlobal("finishRoll", vi.fn());
    vi.stubGlobal("setAttrs", vi.fn());

    await rollCheck({
      i18nKey: "Fear Save",
      target: "@{fear}",
    });

    expect(calls).toEqual(["startRoll", "getAttrs"]);
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
    expect(formula).toContain("target=[[@{sanity}+@{skill_query}]]");
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
    expect(formula).toContain("target=[[@{speed}+@{skill_query}]]");
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

describe("stressOverflow (#182)", () => {
  it("should report no overflow within the maximum", () => {
    expect(stressOverflow(10, 5)).toBe(0);
  });

  it("should report no overflow landing exactly on the maximum", () => {
    expect(stressOverflow(STRESS_MAX - 5, 5)).toBe(0);
  });

  it("should report the excess when a gain overflows by several points", () => {
    expect(stressOverflow(STRESS_MAX - 1, 5)).toBe(4);
  });
});

describe("applyStressDelta", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should write back a plain in-bounds change", () => {
    const mockSetAttrs = vi.fn();
    vi.stubGlobal("setAttrs", mockSetAttrs);

    applyStressDelta(5, 1, 0);

    expect(mockSetAttrs).toHaveBeenCalledWith({ stress: 6 });
  });

  it("should clamp a reduction at the given minimum", () => {
    const mockSetAttrs = vi.fn();
    vi.stubGlobal("setAttrs", mockSetAttrs);

    applyStressDelta(3, -5, 2);

    expect(mockSetAttrs).toHaveBeenCalledWith({ stress: 2 });
  });

  it("should clamp a gain landing exactly on 1e's fixed Stress maximum, with no overflow card", async () => {
    const mockSetAttrs = vi.fn();
    const mockStartRoll = vi.fn();
    vi.stubGlobal("setAttrs", mockSetAttrs);
    vi.stubGlobal("startRoll", mockStartRoll);

    applyStressDelta(STRESS_MAX - 5, 5, 0);
    await flush();

    expect(mockSetAttrs).toHaveBeenCalledWith({ stress: STRESS_MAX });
    expect(mockStartRoll).not.toHaveBeenCalled();
  });

  it("should clamp at the maximum and post an overflow card naming the excess", async () => {
    const mockSetAttrs = vi.fn();
    const mockFinishRoll = vi.fn();
    const mockStartRoll = vi.fn().mockResolvedValue({
      rollId: "overflow",
      results: {},
    });
    vi.stubGlobal("setAttrs", mockSetAttrs);
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", mockFinishRoll);

    applyStressDelta(STRESS_MAX - 1, 5, 0);
    await flush();

    expect(mockSetAttrs).toHaveBeenCalledWith({ stress: STRESS_MAX });
    expect(mockStartRoll).toHaveBeenCalledTimes(1);
    expect(mockFinishRoll).toHaveBeenCalledWith("overflow", {
      alert: "Stress Overflow: Reduces Most Relevant Stat or Save by 4",
      hasalert: 1,
    });
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
    applyStressDelta(3, delta, 2);
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

    await rollRestSave();

    expect(mockSetAttrs).toHaveBeenCalledWith({ stress: 4 });
  });

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

  it("should gain 1 Stress once for a failed Rest Save, not once per rule that grants it", async () => {
    const mockSetAttrs = vi.fn();
    stubAttrs({
      stress: "10",
      stress_min: "2",
    });
    vi.stubGlobal("startRoll", vi.fn().mockResolvedValue({
      rollId: "id",
      results: {
        roll: { result: 64 },
        roll2: { result: 64 },
        edge: { result: 0 },
        target: { result: 35 },
      },
    }));
    vi.stubGlobal("finishRoll", vi.fn());
    vi.stubGlobal("setAttrs", mockSetAttrs);

    await rollRestSave();
    await flush();

    expect(mockSetAttrs).toHaveBeenCalledTimes(1);
    expect(mockSetAttrs).toHaveBeenCalledWith({ stress: 11 });
  });

  it("should still force a Panic Check where the Rest Save critically failed", async () => {
    const mockStartRoll = vi.fn()
      .mockResolvedValueOnce({
        rollId: "id",
        results: {
          roll: { result: 55 },
          roll2: { result: 55 },
          edge: { result: 0 },
          target: { result: 35 },
        },
      })
      .mockResolvedValueOnce(panicRoll(3, 11));
    const mockSetAttrs = vi.fn();
    stubAttrs({
      stress: "10",
      stress_min: "2",
    });
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", vi.fn());
    vi.stubGlobal("setAttrs", mockSetAttrs);

    await rollRestSave();
    await flush();

    expect(mockSetAttrs).toHaveBeenCalledWith({ stress: 11 });
    expect(mockStartRoll.mock.calls[1][0] as string).toContain("{{target=[[11]]}}");
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
      hasnotes: 1,
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

  it("should read a failure off the Panic Table and keep Trauma Response as its own line", async () => {
    const mockStartRoll = vi.fn().mockResolvedValue(panicRoll(3, 10));
    const mockFinishRoll = vi.fn();
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", mockFinishRoll);
    vi.stubGlobal("setAttrs", vi.fn());

    await rollPanicCheck();

    expect(mockFinishRoll).toHaveBeenCalledWith("panic", expect.objectContaining({
      verdict: "JUMPY",
      notes: "Gain 1 Stress. All Close crewmembers gain 2 Stress.\n"
        + "Trauma Response: @{stress_effect}",
      hasnotes: 1,
    }));
  });

  it("should look the Panic Die up on the table, not the margin it beat the Stress by", async () => {
    const mockStartRoll = vi.fn().mockResolvedValue(panicRoll(17, 19));
    const mockFinishRoll = vi.fn();
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", mockFinishRoll);
    vi.stubGlobal("setAttrs", vi.fn());
    vi.stubGlobal("generateRowID", () => "-row");

    await rollPanicCheck();

    expect(mockFinishRoll).toHaveBeenCalledWith("panic", expect.objectContaining({
      verdict: "SPIRALING",
    }));
  });

  it("should leave the table alone where the Panic Check is kept together", async () => {
    const mockStartRoll = vi.fn().mockResolvedValue(panicRoll(17, 10));
    const mockFinishRoll = vi.fn();
    const mockSetAttrs = vi.fn();
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", mockFinishRoll);
    vi.stubGlobal("setAttrs", mockSetAttrs);

    await rollPanicCheck();

    expect(mockFinishRoll).toHaveBeenCalledWith("panic", expect.objectContaining({
      verdict: "Kept It Together",
      notes: "",
    }));
    expect(mockSetAttrs).not.toHaveBeenCalled();
  });

  it("should measure against a Stress handed to it rather than re-reading the sheet", async () => {
    const mockStartRoll = vi.fn().mockResolvedValue(panicRoll(3, 7));
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", vi.fn());
    vi.stubGlobal("setAttrs", vi.fn());

    await rollPanicCheck(7);

    const formula = mockStartRoll.mock.calls[0][0] as string;
    expect(formula).toContain("{{target=[[7]]}}");
    expect(formula).not.toContain("@{stress}");
  });

  it("should not reference getAttrs at all -- the check reads off the roll itself", async () => {
    const mockGetAttrs = vi.fn();
    const mockStartRoll = vi.fn().mockResolvedValue(panicRoll(15, 10));
    vi.stubGlobal("getAttrs", mockGetAttrs);
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", vi.fn());

    await rollPanicCheck();

    expect(mockGetAttrs).not.toHaveBeenCalled();
  });
});

/** Stands in for a table lookup that missed, so a test reads as a failure rather than a crash. */
const MISSING_ENTRY: PanicEffect = {
  roll: 0,
  name: "",
  effect: "",
  condition: false,
};

describe("panicConditionRow (#193)", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should write an Affliction row for a result that leaves a Condition", () => {
    vi.stubGlobal("generateRowID", () => "-cond1");
    const coward = panicEffect(5) ?? MISSING_ENTRY;

    expect(panicConditionRow(coward)).toEqual({
      "repeating_afflictions_-cond1_affliction_name": "COWARD",
      "repeating_afflictions_-cond1_affliction_effect": coward.effect,
      "repeating_afflictions_-cond1_affliction_settings": "0",
    });
  });

  it("should write no row for a result that leaves nothing lasting behind", () => {
    const nervous = panicEffect(2) ?? MISSING_ENTRY;

    expect(nervous.name).toBe("NERVOUS");
    expect(panicConditionRow(nervous)).toEqual({});
  });

  it("should record the Condition from a Panic Check it just rolled", async () => {
    const mockSetAttrs = vi.fn();
    vi.stubGlobal("startRoll", vi.fn().mockResolvedValue(panicRoll(7, 10)));
    vi.stubGlobal("finishRoll", vi.fn());
    vi.stubGlobal("setAttrs", mockSetAttrs);
    vi.stubGlobal("generateRowID", () => "-cond2");

    await rollPanicCheck();

    expect(mockSetAttrs).toHaveBeenCalledWith({
      "repeating_afflictions_-cond2_affliction_name": "NIGHTMARES",
      "repeating_afflictions_-cond2_affliction_effect":
        "Gain a new Condition: Sleep is difficult, gain [-] on Rest Saves.",
      "repeating_afflictions_-cond2_affliction_settings": "0",
    });
  });
});

describe("gradeAttack (#51)", () => {
  it("should show Damage on a Success", () => {
    expect(gradeAttack(Outcomes.Success)).toEqual({ showDamage: true });
  });

  it("should show Damage on a Critical Success", () => {
    expect(gradeAttack(Outcomes.CriticalSuccess)).toEqual({ showDamage: true });
  });

  it("should withhold Damage on a Failure", () => {
    expect(gradeAttack(Outcomes.Failure)).toEqual({ showDamage: false });
  });

  it("should withhold Damage on a Critical Failure too", () => {
    expect(gradeAttack(Outcomes.CriticalFailure)).toEqual({ showDamage: false });
  });
});

/** The eventInfo Roll20 hands a click on a weapon row's attack button. */
function attackClick(overrides: Record<string, string> = {}): EventInfo {
  return {
    sourceAttribute: "repeating_attacks_-N1a2B3c_attack",
    sourceType: "player",
    triggerName: "clicked:repeating_attacks_-N1a2B3c_attack",
    ...overrides,
  };
}

/** One weapon row, as the sheetworker reads it back off the sheet. */
function attackRow(overrides: Partial<AttackRow> = {}): AttackRow {
  return {
    name: "Pulse Rifle",
    bonus: "10",
    damage: "1d10",
    type: "Ranged",
    shots: "",
    ...overrides,
  };
}

/** A started check whose two dice both land on the same result. */
function checkRoll(result: number): Record<string, unknown> {
  return {
    rollId: "check",
    results: {
      roll: { result },
      roll2: { result },
      edge: { result: 0 },
      target: { result: 45 },
    },
  };
}

/** A started Panic Check whose two d20s both land on the same result. */
function panicRoll(result: number, stress: number): Record<string, unknown> {
  return {
    rollId: "panic",
    results: {
      roll: { result },
      roll2: { result },
      edge: { result: 0 },
      target: { result: stress },
    },
  };
}

const HIT = 20;
const MISS = 91;

/** Answers every getAttrs with one fixed table. */
function stubAttrs(attrs: Record<string, string>): void {
  type GetAttrsCallback = (response: Record<string, string>) => void;
  const mockGetAttrs = vi.fn((_request: string[], callback: GetAttrsCallback) => {
    callback(attrs);
  });
  vi.stubGlobal("getAttrs", mockGetAttrs);
}

describe("clickedRowId", () => {
  it("should take the row straight off sourceSection where Roll20 supplies it", () => {
    const eventInfo = attackClick({ sourceSection: "-fromSection" });
    expect(clickedRowId(eventInfo)).toBe("-fromSection");
  });

  it("should parse the row out of triggerName where sourceSection is missing", () => {
    expect(clickedRowId(attackClick())).toBe("-N1a2B3c");
  });

  it("should fall back to sourceAttribute where the trigger names no row", () => {
    const eventInfo = attackClick({ triggerName: "clicked:attack" });
    expect(clickedRowId(eventInfo)).toBe("-N1a2B3c");
  });

  it("should read a legacy numeric row id too", () => {
    const eventInfo = attackClick({
      sourceAttribute: "repeating_attacks_0_attack",
      triggerName: "clicked:repeating_attacks_0_attack",
    });
    expect(clickedRowId(eventInfo)).toBe("0");
  });

  it("should answer undefined for a click that names no row at all", () => {
    const eventInfo = attackClick({
      sourceAttribute: "death_save",
      triggerName: "clicked:death_save",
    });
    expect(clickedRowId(eventInfo)).toBeUndefined();
  });
});

describe("attackBonus", () => {
  it("should carry the row's own bonus through as a term the target can add", () => {
    expect(attackBonus("10")).toBe("10");
  });

  it("should read a blank bonus as 0, so the target expression still parses", () => {
    expect(attackBonus("")).toBe("0");
  });

  it("should read a signed bonus as a plain number", () => {
    expect(attackBonus("+5")).toBe("5");
  });

  it("should read anything non-numeric as 0 rather than break the roll", () => {
    expect(attackBonus("big")).toBe("0");
  });
});

describe("weaponLine", () => {
  it("should name the weapon's type and what its magazine has left", () => {
    expect(weaponLine("Ranged", "4")).toBe("Ranged · Ammo: 4");
  });

  it("should leave out the ammo of a weapon that tracks none", () => {
    expect(weaponLine("Melee", "")).toBe("Melee");
  });

  it("should be blank for a row that names neither", () => {
    expect(weaponLine("", "")).toBe("");
  });
});

describe("handleAttackClick", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should read the clicked row's own fields before it rolls anything", async () => {
    const calls: string[] = [];
    type GetAttrsCallback = (response: Record<string, string>) => void;
    const mockGetAttrs = vi.fn((_request: string[], callback: GetAttrsCallback) => {
      calls.push("getAttrs");
      callback({ "repeating_attacks_-N1a2B3c_attack_name": "Pulse Rifle" });
    });
    const mockStartRoll = vi.fn(() => {
      calls.push("startRoll");
      return Promise.resolve(checkRoll(HIT));
    });
    vi.stubGlobal("getAttrs", mockGetAttrs);
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", vi.fn());
    vi.stubGlobal("setAttrs", vi.fn());

    handleAttackClick(attackClick());
    await flush();

    expect(mockGetAttrs).toHaveBeenCalledWith(
      expect.arrayContaining([
        "repeating_attacks_-N1a2B3c_attack_name",
        "repeating_attacks_-N1a2B3c_attack_bonus",
        "repeating_attacks_-N1a2B3c_attack_damage",
        "repeating_attacks_-N1a2B3c_attack_type",
        "repeating_attacks_-N1a2B3c_attack_shots",
        "repeating_attacks_-N1a2B3c_attack_anti_armor",
      ]),
      expect.any(Function),
    );
    expect(calls).toEqual(["getAttrs", "startRoll"]);
  });

  it("should build the macro out of the row's own values, never an unscoped reference", async () => {
    stubAttrs({
      "repeating_attacks_-N1a2B3c_attack_name": "Pulse Rifle",
      "repeating_attacks_-N1a2B3c_attack_bonus": "10",
      "repeating_attacks_-N1a2B3c_attack_damage": "1d10",
      "repeating_attacks_-N1a2B3c_attack_type": "Ranged",
      "repeating_attacks_-N1a2B3c_attack_shots": "5",
    });
    const mockStartRoll = vi.fn().mockResolvedValue(checkRoll(HIT));
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", vi.fn());
    vi.stubGlobal("setAttrs", vi.fn());

    handleAttackClick(attackClick());
    await flush();

    const formula = mockStartRoll.mock.calls[0][0] as string;
    expect(formula).toContain("{{title=Pulse Rifle}}");
    expect(formula).toContain("{{target=[[@{combat}+10+@{attack_modifier}");
    expect(formula).toContain("{{damage=[[1d10]]}}");
    expect(formula).toContain("{{weapon=Ranged · Ammo: 4}}");
    expect(formula).not.toContain("@{attack_name}");
    expect(formula).not.toContain("@{attack_bonus}");
  });

  it("should read a weapon row's own Anti-Armor toggle onto the card", async () => {
    stubAttrs({
      "repeating_attacks_-N1a2B3c_attack_name": "Smart Rifle",
      "repeating_attacks_-N1a2B3c_attack_bonus": "10",
      "repeating_attacks_-N1a2B3c_attack_damage": "4d10",
      "repeating_attacks_-N1a2B3c_attack_type": "Ranged",
      "repeating_attacks_-N1a2B3c_attack_shots": "3",
      "repeating_attacks_-N1a2B3c_attack_anti_armor": "1",
    });
    const mockStartRoll = vi.fn().mockResolvedValue(checkRoll(HIT));
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", vi.fn());
    vi.stubGlobal("setAttrs", vi.fn());

    handleAttackClick(attackClick());
    await flush();

    const formula = mockStartRoll.mock.calls[0][0] as string;
    expect(formula).toContain("{{antiarmor=1}}");
  });

  it("should still roll a bare Combat Check where the click names no row", async () => {
    const mockGetAttrs = vi.fn();
    const mockStartRoll = vi.fn().mockResolvedValue(checkRoll(HIT));
    vi.stubGlobal("getAttrs", mockGetAttrs);
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", vi.fn());
    vi.stubGlobal("setAttrs", vi.fn());

    handleAttackClick(attackClick({
      sourceAttribute: "attack",
      triggerName: "clicked:attack",
    }));
    await flush();

    expect(mockGetAttrs).not.toHaveBeenCalled();
    const formula = mockStartRoll.mock.calls[0][0] as string;
    expect(formula).toContain("{{target=[[@{combat}+0+@{attack_modifier}");
  });
});

describe("rollAttack", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should roll the row's own Damage on the check card itself, not a second card", async () => {
    const mockStartRoll = vi.fn().mockResolvedValue(checkRoll(HIT));
    const mockFinishRoll = vi.fn();
    const mockGetAttrs = vi.fn();
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", mockFinishRoll);
    vi.stubGlobal("getAttrs", mockGetAttrs);

    await rollAttack(attackRow());

    const formula = mockStartRoll.mock.calls[0][0] as string;
    expect(mockStartRoll).toHaveBeenCalledTimes(1);
    expect(formula).toContain("{{damage=[[1d10]]}}");
    expect(mockFinishRoll).toHaveBeenCalledWith("check", expect.objectContaining({
      hasdamage: 1,
    }));
    expect(mockGetAttrs).not.toHaveBeenCalled();
  });

  it("should broadcast Anti-Armor on the card for a weapon row that carries it (#191)", async () => {
    const mockStartRoll = vi.fn().mockResolvedValue(checkRoll(HIT));
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", vi.fn());
    vi.stubGlobal("getAttrs", vi.fn());

    await rollAttack(attackRow({ antiArmor: true }));

    const formula = mockStartRoll.mock.calls[0][0] as string;
    expect(formula).toContain("{{antiarmor=1}}");
  });

  it("should leave Anti-Armor off the card for a weapon row that does not carry it", async () => {
    const mockStartRoll = vi.fn().mockResolvedValue(checkRoll(HIT));
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", vi.fn());
    vi.stubGlobal("getAttrs", vi.fn());

    await rollAttack(attackRow());

    const formula = mockStartRoll.mock.calls[0][0] as string;
    expect(formula).not.toContain("{{antiarmor=");
  });

  it("should hide the Damage it rolled once the check reads as a miss", async () => {
    const mockStartRoll = vi.fn().mockResolvedValue(checkRoll(MISS));
    const mockFinishRoll = vi.fn();
    stubAttrs({
      stress: "3",
      stress_min: "0",
    });
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", mockFinishRoll);
    vi.stubGlobal("setAttrs", vi.fn());

    await rollAttack(attackRow());

    expect(mockFinishRoll).toHaveBeenCalledWith("check", expect.objectContaining({
      hasdamage: 0,
    }));
  });

  it("should leave the Damage readout out of a row that names no Damage", async () => {
    const mockStartRoll = vi.fn().mockResolvedValue(checkRoll(HIT));
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", vi.fn());
    vi.stubGlobal("getAttrs", vi.fn());

    await rollAttack(attackRow({ damage: "" }));

    const formula = mockStartRoll.mock.calls[0][0] as string;
    expect(formula).not.toContain("{{damage=");
    expect(formula).not.toContain("{{hasdamage=");
  });

  it("should name the Stress on the check card itself and gain it on a miss", async () => {
    const mockStartRoll = vi.fn().mockResolvedValue(checkRoll(MISS));
    const mockFinishRoll = vi.fn();
    stubAttrs({
      stress: "3",
      stress_min: "0",
    });
    const mockSetAttrs = vi.fn();
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", mockFinishRoll);
    vi.stubGlobal("setAttrs", mockSetAttrs);

    await rollAttack(attackRow());
    await flush();

    expect(mockStartRoll).toHaveBeenCalledTimes(1);
    expect(mockFinishRoll).toHaveBeenCalledWith("check", expect.objectContaining({
      notes: "Stress Gained: 1",
      hasnotes: 1,
    }));
    expect(mockSetAttrs).toHaveBeenCalledWith({ stress: 4 });
  });

  it("should gain the Stress and roll the forced Panic Check on a Critical Failure", async () => {
    const mockStartRoll = vi.fn()
      .mockResolvedValueOnce(checkRoll(99))
      .mockResolvedValueOnce(panicRoll(3, 4));
    const mockFinishRoll = vi.fn();
    stubAttrs({
      stress: "3",
      stress_min: "0",
    });
    const mockSetAttrs = vi.fn();
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", mockFinishRoll);
    vi.stubGlobal("setAttrs", mockSetAttrs);
    vi.stubGlobal("generateRowID", () => "-row");

    await rollAttack(attackRow());
    await flush();

    expect(mockFinishRoll.mock.calls[0][1]).toEqual(
      expect.objectContaining({ notes: "Stress Gained: 1\nCritical Failure: Panic Check" }),
    );
    expect(mockSetAttrs).toHaveBeenCalledWith({ stress: 4 });
    expect(mockStartRoll).toHaveBeenCalledTimes(2);
  });

  it("should not grant Stress on a miss for an NPC", async () => {
    const mockStartRoll = vi.fn()
      .mockResolvedValueOnce(checkRoll(MISS))
      .mockResolvedValueOnce({
        rollId: "miss",
        results: {},
      });
    stubAttrs({
      stress: "3",
      stress_min: "0",
      sheet_toggle: "npc",
    });
    const mockSetAttrs = vi.fn();
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", vi.fn());
    vi.stubGlobal("setAttrs", mockSetAttrs);

    await rollAttack(attackRow());

    expect(mockSetAttrs).not.toHaveBeenCalled();
  });

  it("should spend one shot from the row's ammo and show what is left", async () => {
    const mockStartRoll = vi.fn().mockResolvedValue(checkRoll(HIT));
    const mockSetAttrs = vi.fn();
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", vi.fn());
    vi.stubGlobal("getAttrs", vi.fn());
    vi.stubGlobal("setAttrs", mockSetAttrs);

    await rollAttack(attackRow({ shots: "5" }), "-row1");

    const formula = mockStartRoll.mock.calls[0][0] as string;
    expect(formula).toContain("{{weapon=Ranged · Ammo: 4}}");
    expect(mockSetAttrs).toHaveBeenCalledWith({
      "repeating_attacks_-row1_attack_shots": "4",
    });
  });

  it("should post a loud Out of Ammo card once a tracked weapon's magazine empties", async () => {
    const mockStartRoll = vi.fn()
      .mockResolvedValueOnce(checkRoll(HIT))
      .mockResolvedValueOnce({
        rollId: "empty",
        results: {},
      });
    const mockFinishRoll = vi.fn();
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", mockFinishRoll);
    vi.stubGlobal("getAttrs", vi.fn());
    vi.stubGlobal("setAttrs", vi.fn());

    await rollAttack(attackRow({ shots: "1" }), "-row1");
    await flush();

    expect(mockStartRoll).toHaveBeenCalledTimes(2);
    expect(mockFinishRoll).toHaveBeenLastCalledWith("empty", {
      alert: "Out of Ammo",
      hasalert: 1,
    });
  });

  it("should leave an untracked (e.g. infinite) weapon's ammo untouched", async () => {
    const mockStartRoll = vi.fn().mockResolvedValue(checkRoll(HIT));
    const mockSetAttrs = vi.fn();
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", vi.fn());
    vi.stubGlobal("getAttrs", vi.fn());
    vi.stubGlobal("setAttrs", mockSetAttrs);

    await rollAttack(attackRow({ shots: "∞" }), "-row1");

    expect(mockSetAttrs).toHaveBeenCalledWith({
      "repeating_attacks_-row1_attack_shots": "∞",
    });
    expect(mockStartRoll).toHaveBeenCalledTimes(1);
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
