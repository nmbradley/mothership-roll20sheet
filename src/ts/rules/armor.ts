import { TEMPLATE_PHRASES } from "./rollTemplate";

/** Armor Points and Damage Reduction, which live on the equipment rows that carry them. */

/** What the Destroy button leaves a row's AP and DR at. */
export const DESTROYED_AP = 0;

/** Roll20 Sheetworker: zeroes the clicked armor row's AP and DR and announces it. */
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
