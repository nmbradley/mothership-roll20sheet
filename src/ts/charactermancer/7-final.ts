import { skillsByKey } from "#game/constants.js";
import { findItem, type Item } from "#game/data/items.js";
import { type Weapon } from "#game/data/weapons.js";
import { RangeBands } from "#game/enums.js";
import { recalculateArmorTotals } from "#rules/equipment.js";

import {
  parseJSON, parseStringList, stepValues,
} from "./helpers";
import { Steps, type CharmancerData } from "./types";

/** Attributes written to the sheet, keyed by attribute name. */
type SheetAttributes = Record<string, string | number>;

/** Repeating sections rebuilt from scratch when a character is created. */
const REBUILT_SECTIONS = ["equipment", "attacks"] as const;

/** Review attributes copied straight onto the sheet under the same name. */
const COPIED_ATTRIBUTES = [
  "armor",
  "body",
  "class",
  "combat",
  "credits",
  "fear",
  "intellect",
  "patch",
  "sanity",
  "speed",
  "strength",
  "trinket",
  "stress",
  "resolve",
] as const;

/** Clears the sheet, then writes the finished character onto it. */
export function onFinish(data: CharmancerData): void {
  clearSheet(() => {
    compileCharacter(data);
  });
}

/** Empties the repeating sections and every skill toggle. */
function clearSheet(done: () => void): void {
  for (const section of REBUILT_SECTIONS) {
    clearRepeatingSections(`repeating_${section}`);
  }

  const attrs: Record<string, string> = {};
  for (const key of Object.keys(skillsByKey)) {
    attrs[key] = "0";
  }
  setAttrs(attrs, { silent: true }, done);
}

/** Writes the reviewed character onto the sheet. */
function compileCharacter(data: CharmancerData): void {
  const review = stepValues(data, Steps.Review);
  const attrs: SheetAttributes = {};

  for (const key of COPIED_ATTRIBUTES) {
    attrs[key] = review[`${key}_final`] ?? "";
  }

  const health = review["health_final"] ?? "";
  attrs["health"] = health;
  attrs["health_max"] = health;
  attrs["skill_points"] = review["skillpoints_final"] ?? "";

  // Already attribute keys, so they go straight on the sheet.
  const skills = parseStringList(review["skills_final"]);
  for (const key of skills) {
    attrs[key] = "on";
  }

  for (const name of equipmentNames(review["equipment_final"])) {
    const rows = equipmentRows(name);
    Object.assign(attrs, rows);
  }

  writeCharacter(attrs);

  // writeCharacter writes silently, so the equipment section's own
  // change:repeating_equipment:... listener never fires for it (#112) --
  // this runs the same summing routine directly once the armour rows above
  // have landed, rather than seeding armor_points itself.
  recalculateArmorTotals();
}

/** The bare item names from a package, dropping any quantities. */
function equipmentNames(packed: string | undefined): readonly string[] {
  const parsed = parseJSON(packed);
  if (!Array.isArray(parsed)) return [];

  const names: string[] = [];
  for (const item of parsed) {
    const isPair = Array.isArray(item);
    const name: unknown = isPair ? item[0] : item;
    const text = String(name);
    names.push(text);
  }
  return names;
}

/** One item as an equipment row, plus an attack row where it is a weapon. */
function equipmentRows(name: string): SheetAttributes {
  const rowId = generateRowID();
  const row = `repeating_equipment_${rowId}_equipment`;
  const item = findItem(name);

  const attrs: SheetAttributes = {
    [`${row}_name`]: name,
    [`${row}_notes`]: itemNotes(item),
    [`${row}_settings`]: "0",
    [`${row}_type`]: itemType(item),
  };

  // Armor Points and Damage Reduction live on the row itself, like any other
  // equipment (#112); the equipment section's own sheetworker sums them into
  // the panel total.
  if (item?.kind === "armor") {
    attrs[`${row}_armor_points`] = item.entry.points;
    if (item.entry.reduction !== undefined) {
      attrs[`${row}_damage_reduction`] = item.entry.reduction;
    }
    return attrs;
  }

  if (item?.kind === "weapon") {
    const attackId = generateRowID();
    attrs[`${row}_linkedid`] = attackId;
    const attack = attackRow(item.entry, attackId, rowId);
    Object.assign(attrs, attack);
  }

  return attrs;
}

/** An unrecognised item is still carried, just as plain gear. */
function itemType(item: Item | undefined): string {
  if (item === undefined) return "Gear";
  if (item.kind === "weapon") return "Weapon";
  if (item.kind === "armor") return "Armor";
  return "Gear";
}

function itemNotes(item: Item | undefined): string {
  if (item === undefined) return "";
  if (item.kind === "weapon") return item.entry.special;
  return item.entry.description;
}

/** The attack row a weapon in the equipment list implies. */
function attackRow(
  weapon: Weapon,
  attackId: string,
  equipmentId: string,
): SheetAttributes {
  const row = `repeating_attacks_${attackId}_attack`;
  const isMelee = weapon.range === RangeBands.Adjacent;

  return {
    [`${row}_linkedid`]: equipmentId,
    [`${row}_name`]: weapon.name,
    [`${row}_damage`]: weapon.damage,
    [`${row}_crit_effect`]: weapon.wound,
    [`${row}_notes`]: weapon.special,
    [`${row}_settings`]: "0",
    [`${row}_range`]: weapon.range,
    [`${row}_type`]: isMelee ? "Melee" : "Ranged",
    [`${row}_shots`]: weapon.shots,
  };
}

/**
 * Writes the character one attribute at a time so the progress bar can advance,
 * then hands control back to Roll20.
 */
function writeCharacter(attrs: SheetAttributes): void {
  const entries = Object.entries(attrs);
  const total = entries.length;

  for (let index = 0; index < total; index += 1) {
    const entry = entries[index];
    if (entry === undefined) continue;
    const [key, value] = entry;
    const percentage = (100 / total) * (index + 1);

    setAttrs({ [key]: value }, { silent: true });
    setCharmancerText({ t__progressbar: `<div style="width:${percentage}%"> </div>` });
  }

  deleteCharmancerData([]);
  finishCharactermancer();
}
