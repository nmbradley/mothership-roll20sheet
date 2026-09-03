import {
  describe, it, expect, vi, afterEach,
} from "vitest";

import { DamageTypes } from "../src/game/enums";
import {
  MAX_WOUNDS_ALERT,
  applyArmor,
  applyDamage,
  applyWound,
  handleTakeDamage,
  handleTakeWound,
  woundLine,
  type DamageState,
} from "../src/ts/rules/damage";

/**
 * Lets the roll half of a handler run.
 *
 * The handlers read their state through a Roll20 callback and only then start
 * the roll, so there is no promise for a test to await -- draining the
 * microtask queue a few times lets the awaited startRoll/finishRoll chain
 * inside settle.
 */
async function flush(): Promise<void> {
  for (let i = 0; i < 5; i += 1) await Promise.resolve();
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("applyArmor", () => {
  it("ignores a hit that comes in under Armor Points", () => {
    const result = applyArmor(4, 5, 0);
    expect(result).toEqual({
      damage: 0,
      armorPoints: 5,
      armorDestroyed: false,
      absorbed: true,
    });
  });

  it("destroys the armor on a hit that exactly meets Armor Points", () => {
    const result = applyArmor(5, 5, 0);
    expect(result).toEqual({
      damage: 5,
      armorPoints: 0,
      armorDestroyed: true,
      absorbed: false,
    });
  });

  it("destroys the armor on a hit that exceeds Armor Points", () => {
    const result = applyArmor(10, 5, 0);
    expect(result.armorDestroyed).toBe(true);
    expect(result.damage).toBe(10);
  });

  it("subtracts Damage Reduction before testing Armor Points", () => {
    // Without DR this 7 would meet AP 5 and break the armor; DR knocks it
    // under the threshold instead, so DR has to run first.
    const result = applyArmor(7, 5, 3);
    expect(result).toEqual({
      damage: 0,
      armorPoints: 5,
      armorDestroyed: false,
      absorbed: true,
    });
  });

  it("passes the DR-reduced damage through once it breaks the armor", () => {
    const result = applyArmor(10, 5, 3);
    expect(result.damage).toBe(7);
    expect(result.armorDestroyed).toBe(true);
  });

  it("never floors damage below zero when DR exceeds the hit", () => {
    const result = applyArmor(2, 0, 5);
    expect(result.damage).toBe(0);
  });

  it("does not report bare skin (0 AP) as armor destroyed", () => {
    const result = applyArmor(5, 0, 0);
    expect(result).toEqual({
      damage: 5,
      armorPoints: 0,
      armorDestroyed: false,
      absorbed: false,
    });
  });
});

describe("applyDamage", () => {
  const baseState: DamageState = {
    health: 10,
    healthMax: 10,
    wounds: 0,
    woundsMax: 2,
    armorPoints: 0,
    damageReduction: 0,
  };

  it("leaves Health and Wounds alone when a hit does not drop Health to 0", () => {
    const result = applyDamage(4, baseState, DamageTypes.Blunt, []);
    expect(result.health).toBe(6);
    expect(result.wounds).toBe(0);
    expect(result.woundRolls).toEqual([]);
    expect(result.requiresDeathSave).toBe(false);
  });

  it("ignores damage under Armor Points and never touches Health or Wounds", () => {
    const state: DamageState = {
      ...baseState,
      armorPoints: 8,
    };
    const result = applyDamage(5, state, DamageTypes.Blunt, [0]);
    expect(result.health).toBe(10);
    expect(result.wounds).toBe(0);
    expect(result.absorbed).toBe(true);
    expect(result.armorPoints).toBe(8);
  });

  it("subtracts Damage Reduction from every incoming hit", () => {
    const state: DamageState = {
      ...baseState,
      damageReduction: 3,
    };
    const result = applyDamage(6, state, DamageTypes.Blunt, []);
    expect(result.health).toBe(7);
  });

  it("gains exactly one Wound and resets to Maximum on a single overkill hit", () => {
    // 15 damage against 10 Health drops it to -5; the Wounds Table roll (0)
    // is consumed, Health resets to Maximum (10) and absorbs the 5 carryover.
    const result = applyDamage(15, baseState, DamageTypes.Blunt, [0]);
    expect(result.wounds).toBe(1);
    expect(result.health).toBe(5);
    expect(result.woundRolls).toHaveLength(1);
    expect(result.woundRolls[0]).toEqual({
      damageType: DamageTypes.Blunt,
      roll: 0,
      effect: expect.objectContaining({ severity: "Flesh Wound" }),
    });
    expect(result.requiresDeathSave).toBe(false);
  });

  it("cascades into exactly one extra Wound when the carryover itself overkills the reset Health", () => {
    const state: DamageState = {
      ...baseState,
      health: 5,
      woundsMax: 5,
    };
    // 20 damage against 5 Health: -15 carryover, reset to 10, still -5 short,
    // a second Wound rolls and the remaining 5 carryover lands exactly on 0.
    const result = applyDamage(20, state, DamageTypes.Gunshot, [1, 2]);
    expect(result.wounds).toBe(2);
    expect(result.health).toBe(5);
    expect(result.woundRolls.map((wound) => wound.roll)).toEqual([1, 2]);
  });

  it("cascades through several Wounds for one very large hit", () => {
    const state: DamageState = {
      ...baseState,
      health: 5,
      healthMax: 5,
      woundsMax: 10,
    };
    const result = applyDamage(17, state, DamageTypes.Fire, [0, 1, 2, 3]);
    expect(result.wounds).toBe(3);
    expect(result.health).toBe(3);
    expect(result.woundRolls.map((wound) => wound.roll)).toEqual([0, 1, 2]);
    expect(result.requiresDeathSave).toBe(false);
  });

  it("stops at Maximum Wounds and requires a Death Save, even with Health still negative", () => {
    const state: DamageState = {
      ...baseState,
      health: 5,
      healthMax: 5,
      woundsMax: 2,
    };
    const result = applyDamage(100, state, DamageTypes.Gore, [0, 1, 2, 3]);
    expect(result.wounds).toBe(2);
    expect(result.requiresDeathSave).toBe(true);
    // The cascade only ever consumed the two dice it needed.
    expect(result.woundRolls).toHaveLength(2);
    expect(result.health).toBeLessThan(0);
  });

  it("terminates instead of looping forever when Maximum Health is 0", () => {
    const state: DamageState = {
      health: 1,
      healthMax: 0,
      wounds: 0,
      woundsMax: 3,
      armorPoints: 0,
      damageReduction: 0,
    };
    const result = applyDamage(1, state, DamageTypes.Fire, [0, 1, 2, 3, 4]);
    // Bounded by Wounds' own Maximum, not by Health ever recovering.
    expect(result.wounds).toBe(3);
    expect(result.requiresDeathSave).toBe(true);
    expect(result.health).toBeLessThanOrEqual(0);
  });
});

describe("applyWound", () => {
  it("increments Wounds by exactly one", () => {
    const result = applyWound(DamageTypes.Gunshot, 3, {
      wounds: 0,
      woundsMax: 2,
    });
    expect(result.wounds).toBe(1);
    expect(result.requiresDeathSave).toBe(false);
    expect(result.woundRoll).toEqual({
      damageType: DamageTypes.Gunshot,
      roll: 3,
      effect: expect.objectContaining({ severity: "Minor Injury" }),
    });
  });

  it("requires a Death Save once Wounds reach Maximum", () => {
    const result = applyWound(DamageTypes.Blunt, 0, {
      wounds: 1,
      woundsMax: 2,
    });
    expect(result.wounds).toBe(2);
    expect(result.requiresDeathSave).toBe(true);
  });

  it("never lets Wounds climb past Maximum", () => {
    const result = applyWound(DamageTypes.Blunt, 0, {
      wounds: 2,
      woundsMax: 2,
    });
    expect(result.wounds).toBe(2);
    expect(result.requiresDeathSave).toBe(true);
  });
});

describe("woundLine", () => {
  it("reads the severity and the column for the damage type rolled", () => {
    const line = woundLine({
      damageType: DamageTypes.Gunshot,
      roll: 3,
      effect: {
        roll: 3,
        severity: "Minor Injury",
        blunt: "Leg or foot broken. [-] on Speed Checks.",
        bleeding: "Major cut. Bleeding +2.",
        gunshot: "Fractured extremity.",
        fire: "Shrapnel/large burn.",
        gore: "Eyes gouged out.",
      },
    });
    expect(line).toBe("Minor Injury: Fractured extremity.");
  });
});

describe("MAX_WOUNDS_ALERT", () => {
  it("is not empty", () => {
    expect(MAX_WOUNDS_ALERT.length).toBeGreaterThan(0);
  });
});

describe("Sheetworkers startRoll / finishRoll integration", () => {
  it("handleTakeDamage rolls one wound die per point of Wound headroom", async () => {
    vi.stubGlobal("getAttrs", (_request: string[], callback: (response: Record<string, string>) => void) => {
      callback({
        health: "10",
        health_max: "10",
        wounds: "0",
        wounds_max: "2",
        armor_points: "0",
        damage_reduction: "0",
      });
    });
    const mockStartRoll = vi.fn().mockResolvedValue({
      rollId: "id",
      results: {
        damage: { result: 15 },
        damage_type: { result: 0 },
        wound_roll_0: { result: 5 },
        wound_roll_1: { result: 0 },
      },
    });
    const mockSetAttrs = vi.fn();
    const mockFinishRoll = vi.fn();
    vi.stubGlobal("generateRowID", () => "row1");
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("setAttrs", mockSetAttrs);
    vi.stubGlobal("finishRoll", mockFinishRoll);

    handleTakeDamage();
    await flush();

    const formula = mockStartRoll.mock.calls[0]?.[0] as string;
    expect(formula.match(/wound_roll_\d/g)).toHaveLength(2);

    expect(mockSetAttrs).toHaveBeenCalledWith({
      health: 5,
      wounds: 1,
      repeating_afflictions_row1_affliction_name: "Major Injury (Blunt)",
      repeating_afflictions_row1_affliction_effect: "Snapped collarbone. [-] on Strength Checks.",
      repeating_afflictions_row1_affliction_settings: "0",
    });
    expect(mockFinishRoll).toHaveBeenCalledWith("id", {
      notes: "Major Injury: Snapped collarbone. [-] on Strength Checks.",
      hasnotes: 1,
      alert: "",
    });
  });

  it("handleTakeDamage zeroes the worn Armor row's own AP/DR only when the hit destroys the armor", async () => {
    vi.stubGlobal("getAttrs", (request: string[], callback: (response: Record<string, string>) => void) => {
      if (request.includes("armor_points")) {
        callback({
          health: "10",
          health_max: "10",
          wounds: "0",
          wounds_max: "2",
          armor_points: "5",
          damage_reduction: "0",
        });
        return;
      }
      callback({
        repeating_equipment_row1_equipment_type: "Armor",
        repeating_equipment_row1_equipment_armor_points: "5",
        repeating_equipment_row1_equipment_damage_reduction: "0",
      });
    });
    vi.stubGlobal("getSectionIDs", (_section: string, callback: (ids: string[]) => void) => {
      callback(["row1"]);
    });
    const mockStartRoll = vi.fn().mockResolvedValue({
      rollId: "id",
      results: {
        damage: { result: 6 },
        damage_type: { result: 0 },
        wound_roll_0: { result: 0 },
        wound_roll_1: { result: 0 },
      },
    });
    const mockSetAttrs = vi.fn();
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("setAttrs", mockSetAttrs);
    vi.stubGlobal("finishRoll", vi.fn());

    handleTakeDamage();
    await flush();

    expect(mockSetAttrs).toHaveBeenCalledWith(
      expect.objectContaining({
        repeating_equipment_row1_equipment_armor_points: 0,
        repeating_equipment_row1_equipment_damage_reduction: 0,
      }),
    );
    expect(mockSetAttrs.mock.calls[0]?.[0]).not.toHaveProperty("armor_points");
  });

  it("handleTakeDamage surfaces the Death Save prompt once Wounds reach Maximum", async () => {
    vi.stubGlobal("getAttrs", (_request: string[], callback: (response: Record<string, string>) => void) => {
      callback({
        health: "1",
        health_max: "5",
        wounds: "1",
        wounds_max: "2",
        armor_points: "0",
        damage_reduction: "0",
      });
    });
    const mockStartRoll = vi.fn().mockResolvedValue({
      rollId: "id",
      results: {
        damage: { result: 10 },
        damage_type: { result: 0 },
        wound_roll_0: { result: 0 },
      },
    });
    const mockFinishRoll = vi.fn();
    vi.stubGlobal("generateRowID", () => "row1");
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("setAttrs", vi.fn());
    vi.stubGlobal("finishRoll", mockFinishRoll);

    handleTakeDamage();
    await flush();

    expect(mockFinishRoll).toHaveBeenCalledWith("id", expect.objectContaining({
      alert: MAX_WOUNDS_ALERT,
    }));
  });

  it("handleTakeWound increments Wounds and records the roll without touching Health", async () => {
    vi.stubGlobal("getAttrs", (_request: string[], callback: (response: Record<string, string>) => void) => {
      callback({
        wounds: "0",
        wounds_max: "2",
      });
    });
    const mockStartRoll = vi.fn().mockResolvedValue({
      rollId: "id",
      results: {
        damage_type: { result: 2 },
        roll: { result: 1 },
      },
    });
    const mockSetAttrs = vi.fn();
    const mockFinishRoll = vi.fn();
    vi.stubGlobal("generateRowID", () => "row2");
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("setAttrs", mockSetAttrs);
    vi.stubGlobal("finishRoll", mockFinishRoll);

    handleTakeWound();
    await flush();

    expect(mockSetAttrs).toHaveBeenCalledWith({
      wounds: 1,
      repeating_afflictions_row2_affliction_name: "Flesh Wound (Gunshot)",
      repeating_afflictions_row2_affliction_effect: "Bleeding +1.",
      repeating_afflictions_row2_affliction_settings: "0",
    });
    expect(mockFinishRoll).toHaveBeenCalledWith("id", {
      notes: "Flesh Wound: Bleeding +1.",
      hasnotes: 1,
      alert: "",
    });
  });

  // #171: handleTakeDamage/handleTakeWound read state through a Roll20
  // getAttrs callback and only then call startRoll, rather than reaching it
  // straight off the click like every other handler. Roll20 keeps the
  // character bound across its own callbacks -- the same reason
  // recomputeWorstSave has always worked -- so startRoll firing from inside
  // that callback, with no awaited promise in between, is the correct shape.
  // Pinning the call order here, with no await/flush at all, catches a
  // regression the same way the #110/#152 fixes did: a promise-wrapped
  // getAttrs would push "startRoll" out to a later microtask instead of
  // leaving it in this same synchronous call.
  it("handleTakeDamage reaches startRoll from inside readDamageState's own getAttrs callback", () => {
    const calls: string[] = [];
    vi.stubGlobal("getAttrs", (_request: string[], callback: (response: Record<string, string>) => void) => {
      calls.push("getAttrs");
      callback({
        health: "10",
        health_max: "10",
        wounds: "0",
        wounds_max: "2",
        armor_points: "0",
        damage_reduction: "0",
      });
    });
    const mockStartRoll = vi.fn(() => {
      calls.push("startRoll");
      return Promise.resolve({
        rollId: "id",
        results: {},
      });
    });
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("setAttrs", vi.fn());
    vi.stubGlobal("finishRoll", vi.fn());

    handleTakeDamage();

    expect(calls).toEqual(["getAttrs", "startRoll"]);
  });

  it("handleTakeWound reaches startRoll from inside readWoundState's own getAttrs callback", () => {
    const calls: string[] = [];
    vi.stubGlobal("getAttrs", (_request: string[], callback: (response: Record<string, string>) => void) => {
      calls.push("getAttrs");
      callback({
        wounds: "0",
        wounds_max: "2",
      });
    });
    const mockStartRoll = vi.fn(() => {
      calls.push("startRoll");
      return Promise.resolve({
        rollId: "id",
        results: {},
      });
    });
    vi.stubGlobal("startRoll", mockStartRoll);
    vi.stubGlobal("setAttrs", vi.fn());
    vi.stubGlobal("finishRoll", vi.fn());

    handleTakeWound();

    expect(calls).toEqual(["getAttrs", "startRoll"]);
  });
});
