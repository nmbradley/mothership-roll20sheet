import {
  describe, it, expect, vi, afterEach,
} from "vitest";

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
  it("sums AP and DR across every Armor-type row", () => {
    const rows: EquipmentRow[] = [
      {
        id: "row1",
        type: "Armor",
        armorPoints: 3,
        damageReduction: 0,
      },
      {
        id: "row2",
        type: "Armor",
        armorPoints: 10,
        damageReduction: 3,
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
      },
      {
        id: "row2",
        type: "Gear",
        armorPoints: 99,
        damageReduction: 99,
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
});

describe("destroyedArmorUpdates", () => {
  it("zeroes every worn Armor row's own AP and DR", () => {
    const rows: EquipmentRow[] = [
      {
        id: "row1",
        type: "Armor",
        armorPoints: 5,
        damageReduction: 3,
      },
    ];
    expect(destroyedArmorUpdates(rows)).toEqual({
      repeating_equipment_row1_equipment_armor_points: 0,
      repeating_equipment_row1_equipment_damage_reduction: 0,
    });
  });

  it("leaves non-Armor rows untouched", () => {
    const rows: EquipmentRow[] = [
      {
        id: "row1",
        type: "Weapon",
        armorPoints: 0,
        damageReduction: 0,
      },
    ];
    expect(destroyedArmorUpdates(rows)).toEqual({});
  });

  it("skips an Armor row that is already at 0/0", () => {
    const rows: EquipmentRow[] = [
      {
        id: "row1",
        type: "Armor",
        armorPoints: 0,
        damageReduction: 0,
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
    // #127: this is what sheet:opened relies on to seed armor_points and
    // damage_reduction before an Armor row has ever changed -- an attribute
    // Roll20 has never written leaves its DisplayValue span empty.
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

  it("destroyWornArmor reads the current rows and returns the zeroing updates", async () => {
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

    const updates = await destroyWornArmor();

    expect(updates).toEqual({
      repeating_equipment_row1_equipment_armor_points: 0,
      repeating_equipment_row1_equipment_damage_reduction: 0,
    });
  });
});
