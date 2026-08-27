/**
 * Equipment panel totals (#112).
 *
 * Armor Points and Damage Reduction are a function of the armor worn, not a
 * value the character owns independently: each Armor-type row on the
 * equipment list carries its own AP and DR, and this sums them into the
 * panel's totals. Nothing else writes armor_points or damage_reduction --
 * the Destroy button and the #52 damage cascade both zero a row's own AP/DR
 * instead, and the total falls out of the recalculation below.
 */

const ARMOR_TYPE = "Armor";

export type EquipmentRow = {
  id: string;
  type: string;
  armorPoints: number;
  damageReduction: number;
};

/** Sums Armor Points and Damage Reduction across every Armor-type row. */
export function sumArmor(rows: readonly EquipmentRow[]): {
  armorPoints: number;
  damageReduction: number;
} {
  let armorPoints = 0;
  let damageReduction = 0;
  for (const row of rows) {
    if (row.type !== ARMOR_TYPE) continue;
    armorPoints += row.armorPoints;
    damageReduction += row.damageReduction;
  }
  return {
    armorPoints,
    damageReduction,
  };
}

/**
 * Attribute updates that zero every worn Armor row's own AP and DR -- what a
 * hit that meets or exceeds the pooled total, or the Destroy button, leaves
 * behind. A row already at 0/0 is left out, so destroying armor never writes
 * rows that carry none.
 */
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

/**
 * Every equipment row's type, AP and DR, read together in one round trip.
 *
 * Callback rather than a Promise, deliberately. Roll20 binds the active
 * character for the synchronous duration of an event handler and its own
 * callbacks run inside that binding; a native promise continuation resumes
 * after the handler has returned, by which point setAttrs fails with
 * "Trying to do setAttrs when no character is active in sandbox". That is
 * silent in the test suite, which resolves the mocked APIs synchronously.
 */
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
    ]);

    getAttrs(keys, (attrs) => {
      const rows = ids.map((id) => ({
        id,
        type: attrs[`repeating_equipment_${id}_equipment_type`] ?? "",
        armorPoints: Number(attrs[`repeating_equipment_${id}_equipment_armor_points`]) || 0,
        damageReduction:
          Number(attrs[`repeating_equipment_${id}_equipment_damage_reduction`]) || 0,
      }));
      done(rows);
    });
  });
}

/**
 * Roll20 Sheetworker: recalculate the equipment panel's Armor Points and
 * Damage Reduction totals from the current equipment rows.
 */
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
