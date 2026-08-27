import {
  describe, expect, it,
} from "vitest";

import {
  character_name,
  description,
  gear_notes,
  instinct,
  npcAttributes,
  npcTraits,
  trait_description,
  trait_name,
} from "#game/fields/npcFields";
import {
  armor_points, combat, health, wounds,
} from "#game/fields/pcFields";

describe("NPC Fields (1e Conversion)", () => {
  describe("Core NPC Attributes", () => {
    it("should define character name and instinct (excluding speed)", () => {
      const charNameExpect = expect(character_name.name);
      charNameExpect.toBe("character_name");

      const instinctNameExpect = expect(instinct.name);
      instinctNameExpect.toBe("instinct");

      const instinctUiTypeExpect = expect(instinct.control);
      instinctUiTypeExpect.toBe("number");
    });

    it("should share combat, wounds, health and armor_points with the PC sheet", () => {
      const combatNameExpect = expect(combat.name);
      combatNameExpect.toBe("combat");

      const woundsNameExpect = expect(wounds.name);
      woundsNameExpect.toBe("wounds");

      const healthNameExpect = expect(health.name);
      healthNameExpect.toBe("health");

      const apNameExpect = expect(armor_points.name);
      apNameExpect.toBe("armor_points");
    });

    it("should define description and gear_notes attributes as textareas", () => {
      const descUiTypeExpect = expect(description.control);
      descUiTypeExpect.toBe("textarea");

      const gearNotesUiTypeExpect = expect(gear_notes.control);
      gearNotesUiTypeExpect.toBe("textarea");
    });

    it("should contain the NPC-only attributes in npcAttributes map", () => {
      const mapCharNameExpect = expect(npcAttributes.character_name);
      mapCharNameExpect.toBe(character_name);

      const mapInstinctExpect = expect(npcAttributes.instinct);
      mapInstinctExpect.toBe(instinct);

      const mapDescExpect = expect(npcAttributes.description);
      mapDescExpect.toBe(description);

      const mapGearNotesExpect = expect(npcAttributes.gear_notes);
      mapGearNotesExpect.toBe(gear_notes);
    });
  });

  describe("Traits Repeating Section", () => {
    it("should define repeating section named repeating_npctraits", () => {
      const sectionNameExpect = expect(npcTraits.name);
      sectionNameExpect.toBe("repeating_npctraits");
    });

    it("should define trait_name and trait_description fields without the npc_ prefix", () => {
      const nameExpect = expect(npcTraits.attributes.trait_name);
      nameExpect.toMatchObject(trait_name);

      const descExpect = expect(npcTraits.attributes.trait_description);
      descExpect.toMatchObject(trait_description);

      const descUiTypeExpect = expect(trait_description.control);
      descUiTypeExpect.toBe("textarea");
    });
  });

  describe("Namespace merge", () => {
    it("should export no attribute name that still begins with npc_", () => {
      const names = [
        ...Object.values(npcAttributes).map((attr) => attr.name),
        ...Object.values(npcTraits.attributes).map((attr) => attr.name),
      ];
      const prefixed = names.filter((name) => name.startsWith("npc_"));
      expect(prefixed).toEqual([]);
    });

    it("should have exactly one sheet writing attr_equipment", () => {
      // The PC charactermancer writes attr_equipment directly with JSON'd
      // loadout items; the NPC free-text field was renamed to gear_notes so
      // it does not collide and get silently overwritten.
      const names = [
        ...Object.values(npcAttributes).map((attr) => attr.name),
        ...Object.values(npcTraits.attributes).map((attr) => attr.name),
      ];
      expect(names).not.toContain("equipment");
      expect(gear_notes.name).toBe("gear_notes");
    });
  });
});
