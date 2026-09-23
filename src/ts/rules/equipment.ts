/** Equipment panel totals: Armor Points and Damage Reduction summed from the armor worn. */

const ARMOR_TYPE = "Armor";

export type EquipmentRow = {
  id: string;
  type: string;
  armorPoints: number;
  damageReduction: number;
  equipped: boolean;
  destroyed: boolean;
};

/** Sums Armor Points (equipped, undestroyed) and Damage Reduction (equipped) across Armor rows. */
export function sumArmor(rows: readonly EquipmentRow[]): {
  armorPoints: number;
  damageReduction: number;
} {
  let armorPoints = 0;
  let damageReduction = 0;
  for (const row of rows) {
    if (row.type !== ARMOR_TYPE || !row.equipped) continue;
    if (!row.destroyed) armorPoints += row.armorPoints;
    damageReduction += row.damageReduction;
  }
  return {
    armorPoints,
    damageReduction,
  };
}

/** Attribute updates that zero every worn Armor row's own AP and DR. */
export function destroyedArmorUpdates(rows: readonly EquipmentRow[]): Record<string, number> {
  const updates: Record<string, number> = {};
  for (const row of rows) {
    if (row.type !== ARMOR_TYPE) continue;
    if (row.armorPoints === 0 && row.damageReduction === 0) continue;
    updates[`repeating_equipment_${row.id}_equipment_armor_points`] = 0;
    updates[`repeating_equipment_${row.id}_equipment_damage_reduction`] = 0;
  }
  return updates;
}

/** Every equipment row's type, AP and DR, read together in one round trip. */
function readEquipmentRows(done: (rows: EquipmentRow[]) => void): void {
  getSectionIDs("repeating_equipment", (ids) => {
    if (ids.length === 0) {
      done([]);
      return;
    }

    const keys = ids.flatMap((id) => [
      `repeating_equipment_${id}_equipment_type`,
      `repeating_equipment_${id}_equipment_armor_points`,
      `repeating_equipment_${id}_equipment_damage_reduction`,
      `repeating_equipment_${id}_equipment_equipped`,
      `repeating_equipment_${id}_equipment_destroyed`,
    ]);

    getAttrs(keys, (attrs) => {
      const rows = ids.map((id) => ({
        id,
        type: attrs[`repeating_equipment_${id}_equipment_type`] ?? "",
        armorPoints: Number(attrs[`repeating_equipment_${id}_equipment_armor_points`]) || 0,
        damageReduction:
          Number(attrs[`repeating_equipment_${id}_equipment_damage_reduction`]) || 0,
        equipped: attrs[`repeating_equipment_${id}_equipment_equipped`] !== "0",
        destroyed: attrs[`repeating_equipment_${id}_equipment_destroyed`] === "1",
      }));
      done(rows);
    });
  });
}

/** Roll20 Sheetworker: recalculates the panel's Armor Points and Damage Reduction totals. */
export function recalculateArmorTotals(): void {
  readEquipmentRows((rows) => {
    const totals = sumArmor(rows);
    setAttrs({
      armor_points: totals.armorPoints,
      damage_reduction: totals.damageReduction,
    });
  });
}

/** Reads the current equipment rows and zeroes every worn Armor row's AP/DR. */
export function destroyWornArmor(done: (updates: Record<string, number>) => void): void {
  readEquipmentRows((rows) => {
    const updates = destroyedArmorUpdates(rows);
    done(updates);
  });
}
