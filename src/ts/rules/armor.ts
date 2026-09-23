import { TEMPLATE_PHRASES } from "./rollTemplate";

/** Armor Points and Damage Reduction, which live on the equipment rows that carry them. */

/** Value written to a row's hidden `destroyed` toggle once it is destroyed. */
export const DESTROYED = "1";

const DESTROY_ARMOR_TRIGGER = /^clicked:repeating_equipment_(.+)_destroy_armor$/;

/** The clicked row's id: `sourceSection` if Roll20 supplies it, else parsed from `triggerName`. */
export function destroyedArmorRowId(eventInfo: EventInfo): string | undefined {
  return eventInfo.sourceSection ?? DESTROY_ARMOR_TRIGGER.exec(eventInfo.triggerName)?.[1];
}

/** Roll20 Sheetworker: marks the clicked armor row destroyed and announces it. */
export async function handleDestroyArmor(rowId: string): Promise<void> {
  const row = `repeating_equipment_${rowId}_equipment`;
  setAttrs({
    [`${row}_destroyed`]: DESTROYED,
  });

  const rollFormula =
    `&{template:ms} {{title=^{${TEMPLATE_PHRASES.ArmorDestroyed}}}} {{subtitle=@{character_name}}} {{notes=[[0]]}} {{hasnotes=[[0]]}}`;
  const rollData = await startRoll(rollFormula);
  finishRoll(rollData.rollId, {
    notes: "",
    hasnotes: 0,
  });
}
