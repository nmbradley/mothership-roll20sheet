import {
  describe, it, expect, vi, afterEach,
} from "vitest";

import {
  MOD_ATTRIBUTES,
  RadiationLevels,
  handleRadiationLevelChange,
  handleRadiationRound,
  radiationRoundEffect,
  shiftStatSaveMods,
} from "../src/ts/rules/radiation";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("radiationRoundEffect", () => {
  it("does nothing mechanical at Trace (33.2)", () => {
    expect(radiationRoundEffect(RadiationLevels.Trace)).toEqual({ kind: "none" });
  });

  it("reduces all Stats and Saves by 1 at Acute (33.2)", () => {
    expect(radiationRoundEffect(RadiationLevels.Acute)).toEqual({
      kind: "stat-penalty",
      amount: -1,
    });
  });

  it("calls for a Body Save at Lethal (33.2)", () => {
    expect(radiationRoundEffect(RadiationLevels.Lethal)).toEqual({ kind: "body-save" });
  });

  it("treats an unrecognized level as no effect", () => {
    expect(radiationRoundEffect("")).toEqual({ kind: "none" });
  });
});

describe("shiftStatSaveMods", () => {
  it("shifts every modifier by the same amount, stacking on top of any class bonus", () => {
    const shifted = shiftStatSaveMods({
      strength_mod: 2,
      sanity_mod: 0,
    }, -1);
    expect(shifted).toEqual({
      strength_mod: 1,
      sanity_mod: -1,
    });
  });
});

describe("MOD_ATTRIBUTES", () => {
  it("covers every Stat and Save's own modifier attribute", () => {
    expect(MOD_ATTRIBUTES).toEqual(expect.arrayContaining([
      "strength_mod",
      "speed_mod",
      "intellect_mod",
      "combat_mod",
      "sanity_mod",
      "fear_mod",
      "body_mod",
    ]));
    expect(MOD_ATTRIBUTES).toHaveLength(7);
  });
});

describe("handleRadiationRound", () => {
  it("does nothing at Trace", () => {
    vi.stubGlobal("getAttrs", (_request: string[], callback: (response: Record<string, string>) => void) => {
      callback({ radiation_level: RadiationLevels.Trace });
    });
    const mockSetAttrs = vi.fn();
    vi.stubGlobal("setAttrs", mockSetAttrs);

    handleRadiationRound();

    expect(mockSetAttrs).not.toHaveBeenCalled();
  });

  it("posts a Body Save at Lethal, using the existing Save roll", () => {
    vi.stubGlobal("getAttrs", (_request: string[], callback: (response: Record<string, string>) => void) => {
      callback({
        radiation_level: RadiationLevels.Lethal,
        save_skill_select: "0",
      });
    });
    const mockStartRoll = vi.fn().mockResolvedValue({
      rollId: "id",
      results: {},
    });
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", vi.fn());

    handleRadiationRound();

    const formula = mockStartRoll.mock.calls[0]?.[0] as string;
    expect(formula).toContain("@{body}");
  });

  it("stacks -1 across every Stat/Save mod at Acute and tracks the round count", async () => {
    vi.stubGlobal("getAttrs", (request: string[], callback: (response: Record<string, string>) => void) => {
      if (request.includes("radiation_level")) {
        callback({ radiation_level: RadiationLevels.Acute });
        return;
      }
      if (request.includes("radiation_penalty_rounds")) {
        callback({ radiation_penalty_rounds: "1" });
        return;
      }
      const mods: Record<string, string> = {};
      for (const key of MOD_ATTRIBUTES) mods[key] = "0";
      callback(mods);
    });
    const mockSetAttrs = vi.fn();
    const mockStartRoll = vi.fn().mockResolvedValue({
      rollId: "id",
      results: {},
    });
    vi.stubGlobal("setAttrs", mockSetAttrs);
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("finishRoll", vi.fn());

    handleRadiationRound();
    for (let i = 0; i < 5; i += 1) await Promise.resolve();

    expect(mockSetAttrs).toHaveBeenCalledWith(expect.objectContaining({
      strength_mod: -1,
      sanity_mod: -1,
      radiation_penalty_rounds: 2,
    }));
  });
});

describe("handleRadiationLevelChange", () => {
  it("reverses the stacked penalty once the level clears back to Trace", () => {
    vi.stubGlobal("getAttrs", (request: string[], callback: (response: Record<string, string>) => void) => {
      if (request.includes("radiation_level")) {
        callback({
          radiation_level: RadiationLevels.Trace,
          radiation_penalty_rounds: "3",
        });
        return;
      }
      const mods: Record<string, string> = {};
      for (const key of MOD_ATTRIBUTES) mods[key] = "-3";
      callback(mods);
    });
    const mockSetAttrs = vi.fn();
    vi.stubGlobal("setAttrs", mockSetAttrs);

    handleRadiationLevelChange();

    expect(mockSetAttrs).toHaveBeenCalledWith(expect.objectContaining({
      strength_mod: 0,
      body_mod: 0,
      radiation_penalty_rounds: 0,
    }));
  });

  it("leaves the mods alone once the level is still exposed", () => {
    vi.stubGlobal("getAttrs", (_request: string[], callback: (response: Record<string, string>) => void) => {
      callback({
        radiation_level: RadiationLevels.Acute,
        radiation_penalty_rounds: "2",
      });
    });
    const mockSetAttrs = vi.fn();
    vi.stubGlobal("setAttrs", mockSetAttrs);

    handleRadiationLevelChange();

    expect(mockSetAttrs).not.toHaveBeenCalled();
  });

  it("does nothing once cleared to Trace with no penalty stacked", () => {
    vi.stubGlobal("getAttrs", (_request: string[], callback: (response: Record<string, string>) => void) => {
      callback({
        radiation_level: RadiationLevels.Trace,
        radiation_penalty_rounds: "0",
      });
    });
    const mockSetAttrs = vi.fn();
    vi.stubGlobal("setAttrs", mockSetAttrs);

    handleRadiationLevelChange();

    expect(mockSetAttrs).not.toHaveBeenCalled();
  });
});
