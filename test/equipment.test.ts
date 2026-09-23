import {
  describe, it, expect, vi, afterEach,
} from "vitest";

import { DESTROYED } from "../src/ts/rules/armor";
import {
  destroyedArmorUpdates,
  destroyWornArmor,
  recalculateArmorTotals,
  sumArmor,
  type EquipmentRow,
} from "../src/ts/rules/equipment";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("sumArmor", () => {
  it("sums AP and DR across every equipped, undestroyed Armor-type row", () => {
    const rows: EquipmentRow[] = [
      {
        id: "row1",
        type: "Armor",
        armorPoints: 3,
        damageReduction: 0,
        equipped: true,
        destroyed: false,
      },
      {
        id: "row2",
        type: "Armor",
        armorPoints: 10,
        damageReduction: 3,
        equipped: true,
        destroyed: false,
      },
    ];
    expect(sumArmor(rows)).toEqual({
      armorPoints: 13,
      damageReduction: 3,
    });
  });

  it("ignores rows that are not Armor", () => {
    const rows: EquipmentRow[] = [
      {
        id: "row1",
        type: "Weapon",
        armorPoints: 99,
        damageReduction: 99,
        equipped: true,
        destroyed: false,
      },
      {
        id: "row2",
        type: "Gear",
        armorPoints: 99,
        damageReduction: 99,
        equipped: true,
        destroyed: false,
      },
    ];
    expect(sumArmor(rows)).toEqual({
      armorPoints: 0,
      damageReduction: 0,
    });
  });

  it("returns zero for an empty equipment list", () => {
    expect(sumArmor([])).toEqual({
      armorPoints: 0,
      damageReduction: 0,
    });
  });

  it("excludes an unequipped row's AP and DR, even undestroyed", () => {
    const rows: EquipmentRow[] = [
      {
        id: "row1",
        type: "Armor",
        armorPoints: 5,
        damageReduction: 3,
        equipped: false,
        destroyed: false,
      },
    ];
    expect(sumArmor(rows)).toEqual({
      armorPoints: 0,
      damageReduction: 0,
    });
  });

  it("excludes a destroyed row's AP but keeps its DR, while equipped", () => {
    const rows: EquipmentRow[] = [
      {
        id: "row1",
        type: "Armor",
        armorPoints: 5,
        damageReduction: 3,
        equipped: true,
        destroyed: true,
      },
    ];
    expect(sumArmor(rows)).toEqual({
      armorPoints: 0,
      damageReduction: 3,
    });
  });

  it("excludes both AP and DR from a row that is unequipped and destroyed", () => {
    const rows: EquipmentRow[] = [
      {
        id: "row1",
        type: "Armor",
        armorPoints: 5,
        damageReduction: 3,
        equipped: false,
        destroyed: true,
      },
    ];
    expect(sumArmor(rows)).toEqual({
      armorPoints: 0,
      damageReduction: 0,
    });
  });
});

describe("destroyedArmorUpdates", () => {
  it("marks every worn, undestroyed Armor row destroyed", () => {
    const rows: EquipmentRow[] = [
      {
        id: "row1",
        type: "Armor",
        armorPoints: 5,
        damageReduction: 3,
        equipped: true,
        destroyed: false,
      },
    ];
    expect(destroyedArmorUpdates(rows)).toEqual({
      repeating_equipment_row1_equipment_destroyed: DESTROYED,
    });
  });

  it("leaves non-Armor rows untouched", () => {
    const rows: EquipmentRow[] = [
      {
        id: "row1",
        type: "Weapon",
        armorPoints: 0,
        damageReduction: 0,
        equipped: true,
        destroyed: false,
      },
    ];
    expect(destroyedArmorUpdates(rows)).toEqual({});
  });

  it("skips an Armor row that is already destroyed", () => {
    const rows: EquipmentRow[] = [
      {
        id: "row1",
        type: "Armor",
        armorPoints: 5,
        damageReduction: 3,
        equipped: true,
        destroyed: true,
      },
    ];
    expect(destroyedArmorUpdates(rows)).toEqual({});
  });

  it("skips an unequipped Armor row (#220)", () => {
    const rows: EquipmentRow[] = [
      {
        id: "row1",
        type: "Armor",
        armorPoints: 5,
        damageReduction: 3,
        equipped: false,
        destroyed: false,
      },
    ];
    expect(destroyedArmorUpdates(rows)).toEqual({});
  });
});

describe("Sheetworkers getSectionIDs / getAttrs integration", () => {
  it("recalculateArmorTotals sums every Armor row into the panel totals", async () => {
    vi.stubGlobal("getSectionIDs", (_section: string, callback: (ids: string[]) => void) => {
      callback(["row1", "row2"]);
    });
    vi.stubGlobal("getAttrs", (_request: string[], callback: (response: Record<string, string>) => void) => {
      callback({
        repeating_equipment_row1_equipment_type: "Armor",
        repeating_equipment_row1_equipment_armor_points: "5",
        repeating_equipment_row1_equipment_damage_reduction: "0",
        repeating_equipment_row2_equipment_type: "Gear",
        repeating_equipment_row2_equipment_armor_points: "0",
        repeating_equipment_row2_equipment_damage_reduction: "0",
      });
    });
    const mockSetAttrs = vi.fn();
    vi.stubGlobal("setAttrs", mockSetAttrs);

    await recalculateArmorTotals();

    expect(mockSetAttrs).toHaveBeenCalledWith({
      armor_points: 5,
      damage_reduction: 0,
    });
  });

  it("recalculateArmorTotals keeps DR but drops AP for a destroyed, equipped row", async () => {
    vi.stubGlobal("getSectionIDs", (_section: string, callback: (ids: string[]) => void) => {
      callback(["row1"]);
    });
    vi.stubGlobal("getAttrs", (_request: string[], callback: (response: Record<string, string>) => void) => {
      callback({
        repeating_equipment_row1_equipment_type: "Armor",
        repeating_equipment_row1_equipment_armor_points: "5",
        repeating_equipment_row1_equipment_damage_reduction: "3",
        repeating_equipment_row1_equipment_equipped: "1",
        repeating_equipment_row1_equipment_destroyed: "1",
      });
    });
    const mockSetAttrs = vi.fn();
    vi.stubGlobal("setAttrs", mockSetAttrs);

    await recalculateArmorTotals();

    expect(mockSetAttrs).toHaveBeenCalledWith({
      armor_points: 0,
      damage_reduction: 3,
    });
  });

  it("recalculateArmorTotals drops both AP and DR for an unequipped row", async () => {
    vi.stubGlobal("getSectionIDs", (_section: string, callback: (ids: string[]) => void) => {
      callback(["row1"]);
    });
    vi.stubGlobal("getAttrs", (_request: string[], callback: (response: Record<string, string>) => void) => {
      callback({
        repeating_equipment_row1_equipment_type: "Armor",
        repeating_equipment_row1_equipment_armor_points: "5",
        repeating_equipment_row1_equipment_damage_reduction: "3",
        repeating_equipment_row1_equipment_equipped: "0",
        repeating_equipment_row1_equipment_destroyed: "0",
      });
    });
    const mockSetAttrs = vi.fn();
    vi.stubGlobal("setAttrs", mockSetAttrs);

    await recalculateArmorTotals();

    expect(mockSetAttrs).toHaveBeenCalledWith({
      armor_points: 0,
      damage_reduction: 0,
    });
  });

  it("recalculateArmorTotals treats a row with no equipped attribute yet as equipped (#216)", async () => {
    vi.stubGlobal("getSectionIDs", (_section: string, callback: (ids: string[]) => void) => {
      callback(["row1"]);
    });
    vi.stubGlobal("getAttrs", (_request: string[], callback: (response: Record<string, string>) => void) => {
      callback({
        repeating_equipment_row1_equipment_type: "Armor",
        repeating_equipment_row1_equipment_armor_points: "5",
        repeating_equipment_row1_equipment_damage_reduction: "3",
      });
    });
    const mockSetAttrs = vi.fn();
    vi.stubGlobal("setAttrs", mockSetAttrs);

    await recalculateArmorTotals();

    expect(mockSetAttrs).toHaveBeenCalledWith({
      armor_points: 5,
      damage_reduction: 3,
    });
  });

  it("recalculateArmorTotals totals to zero with no equipment rows", async () => {
    vi.stubGlobal("getSectionIDs", (_section: string, callback: (ids: string[]) => void) => {
      callback([]);
    });
    const mockSetAttrs = vi.fn();
    vi.stubGlobal("setAttrs", mockSetAttrs);

    await recalculateArmorTotals();

    expect(mockSetAttrs).toHaveBeenCalledWith({
      armor_points: 0,
      damage_reduction: 0,
    });
  });

  it("recalculateArmorTotals always writes both attributes, even unworn (#127)", async () => {
    vi.stubGlobal("getSectionIDs", (_section: string, callback: (ids: string[]) => void) => {
      callback([]);
    });
    const mockSetAttrs = vi.fn();
    vi.stubGlobal("setAttrs", mockSetAttrs);

    await recalculateArmorTotals();

    expect(mockSetAttrs).toHaveBeenCalledTimes(1);
    const written = mockSetAttrs.mock.calls[0]?.[0] as Record<string, unknown>;
    expect(written).toHaveProperty("armor_points");
    expect(written).toHaveProperty("damage_reduction");
  });

  it("reaches setAttrs synchronously, with no promise between the section read and the write", () => {
    const calls: string[] = [];
    vi.stubGlobal("getSectionIDs", (_section: string, callback: (ids: string[]) => void) => {
      calls.push("getSectionIDs");
      callback(["row1"]);
    });
    vi.stubGlobal("getAttrs", (_request: string[], callback: (response: Record<string, string>) => void) => {
      calls.push("getAttrs");
      callback({
        repeating_equipment_row1_equipment_type: "Armor",
        repeating_equipment_row1_equipment_armor_points: "5",
        repeating_equipment_row1_equipment_damage_reduction: "0",
      });
    });
    const mockSetAttrs = vi.fn(() => {
      calls.push("setAttrs");
    });
    vi.stubGlobal("setAttrs", mockSetAttrs);

    recalculateArmorTotals();

    expect(calls).toEqual(["getSectionIDs", "getAttrs", "setAttrs"]);
  });

  it("destroyWornArmor reads the current rows and returns the destroyed-flag updates", async () => {
    vi.stubGlobal("getSectionIDs", (_section: string, callback: (ids: string[]) => void) => {
      callback(["row1"]);
    });
    vi.stubGlobal("getAttrs", (_request: string[], callback: (response: Record<string, string>) => void) => {
      callback({
        repeating_equipment_row1_equipment_type: "Armor",
        repeating_equipment_row1_equipment_armor_points: "5",
        repeating_equipment_row1_equipment_damage_reduction: "3",
      });
    });

    let updates: Record<string, string> = {};
    destroyWornArmor((result) => {
      updates = result;
    });

    expect(updates).toEqual({
      repeating_equipment_row1_equipment_destroyed: DESTROYED,
    });
  });

  it("destroyWornArmor skips an unequipped Armor row (#220)", async () => {
    vi.stubGlobal("getSectionIDs", (_section: string, callback: (ids: string[]) => void) => {
      callback(["row1"]);
    });
    vi.stubGlobal("getAttrs", (_request: string[], callback: (response: Record<string, string>) => void) => {
      callback({
        repeating_equipment_row1_equipment_type: "Armor",
        repeating_equipment_row1_equipment_armor_points: "5",
        repeating_equipment_row1_equipment_damage_reduction: "3",
        repeating_equipment_row1_equipment_equipped: "0",
      });
    });

    let updates: Record<string, string> = {};
    destroyWornArmor((result) => {
      updates = result;
    });

    expect(updates).toEqual({});
  });
});
