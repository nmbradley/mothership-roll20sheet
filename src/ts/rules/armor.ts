import { TEMPLATE_PHRASES } from "./rollTemplate";

/**
 * Armor Points (AP) and Damage Reduction (DR).
 *
 * AP absorbs a hit until one meets or exceeds it, which destroys the armor;
 * DR is flat reduction some heavy armor (e.g. Advanced Battle Dress) grants
 * on top of that. Weighing either against an incoming hit is #52's job.
 * AP and DR are summed from equipment.ts's rows rather than owned by the
 * character (#112), so it is the item that gets destroyed -- this zeroes the
 * clicked row's own AP and DR, and the panel's totals fall out of that
 * section's recalculation.
 */

/** What the Destroy button leaves a row's AP and DR at. */
export const DESTROYED_AP = 0;

/**
 * Roll20 Sheetworker: Destroy Armor
 *
 * Zeroes the clicked row's AP and DR and posts a notification to chat. Goes
 * through startRoll/finishRoll like every other chat post in this sheet (see
 * ships.ts) even though nothing is rolled -- it is the only way a
 * sheetworker reaches the chat pane.
 */
export async function handleDestroyArmor(rowId: string): Promise<void> {
  const row = `repeating_equipment_${rowId}_equipment`;
  setAttrs({
    [`${row}_armor_points`]: DESTROYED_AP,
    [`${row}_damage_reduction`]: DESTROYED_AP,
  });

  const rollFormula =
    `&{template:ms} {{title=^{${TEMPLATE_PHRASES.ArmorDestroyed}}}} {{subtitle=@{character_name}}} {{notes=[[0]]}} {{hasnotes=[[0]]}}`;
  const rollData = await startRoll(rollFormula);
  finishRoll(rollData.rollId, {
    notes: "",
    hasnotes: 0,
  });
}
