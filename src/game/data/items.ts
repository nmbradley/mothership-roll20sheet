import { armor, type Armor } from "#game/data/armor.js";
import { equipment, type Equipment } from "#game/data/equipment.js";
import { weapons, type Weapon } from "#game/data/weapons.js";

/**
 * A single lookup across everything a character can carry.
 *
 * Loadouts name items without saying which table they come from, so anything
 * reading a loadout needs to search all three.
 */
export type Item =
  | {
    kind: "weapon";
    entry: Weapon;
  }
  | {
    kind: "armor";
    entry: Armor;
  }
  | {
    kind: "gear";
    entry: Equipment;
  };

/** Loadouts write names with parenthetical notes, e.g. "Vaccsuit (AP 3)". */
function baseName(name: string): string {
  const withoutNote = name.replace(/\s*\(.*\)\s*$/, "");
  const trimmed = withoutNote.trim();
  const lowered = trimmed.toLowerCase();
  return lowered;
}

/** Finds an item by name across weapons, armor and general equipment. */
export function findItem(name: string): Item | undefined {
  const wanted = baseName(name);

  for (const entry of weapons) {
    const candidate = baseName(entry.name);
    if (candidate === wanted) return {
      kind: "weapon",
      entry,
    };
  }
  for (const entry of armor) {
    const candidate = baseName(entry.name);
    if (candidate === wanted) return {
      kind: "armor",
      entry,
    };
  }
  for (const entry of equipment) {
    const candidate = baseName(entry.name);
    if (candidate === wanted) return {
      kind: "gear",
      entry,
    };
  }
  return undefined;
}
