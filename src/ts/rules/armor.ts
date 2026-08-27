import { TEMPLATE_PHRASES } from "./rollTemplate";

/**
 * Armor Points (AP) and Damage Reduction (DR).
 *
 * AP absorbs a hit until one meets or exceeds it, which destroys the armor;
 * DR is flat reduction some heavy armor (e.g. Advanced Battle Dress) grants
 * on top of that. Weighing either against an incoming hit is #52's job, once
 * it and #54 land -- this only covers the Destroy button, a quick way to zero
 * AP by hand.
 */

/** What the Destroy button leaves AP at. */
export const DESTROYED_AP = 0;

/**
 * Roll20 Sheetworker: Destroy Armor
 *
 * Zeroes AP and posts a notification to chat. Goes through startRoll/finishRoll
 * like every other chat post in this sheet (see ships.ts) even though nothing
 * is rolled -- it is the only way a sheetworker reaches the chat pane.
 */
export async function handleDestroyArmor(): Promise<void> {
  setAttrs({ armor_points: DESTROYED_AP });

  const rollFormula =
    `&{template:ms} {{name=^{${TEMPLATE_PHRASES.ArmorDestroyed}}}} {{character_name=@{character_name}}} {{notes=[[0]]}}`;
  const rollData = await startRoll(rollFormula);
  finishRoll(rollData.rollId, { notes: "" });
}
