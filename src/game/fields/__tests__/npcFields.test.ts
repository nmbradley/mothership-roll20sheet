import { describe, expect, it } from "vitest";

import {
  armor_points,
  attack_ammunition,
  attack_crit_damage,
  attack_crit_effect,
  attack_damage,
  attack_name,
  attack_notes,
  attack_range_l,
  attack_range_m,
  attack_range_s,
  attack_shots,
  attack_type,
  character_name,
  combat,
  description,
  equipment,
  health,
  instinct,
  npcAttacks,
  npcAttributes,
  npcTraits,
  trait_description,
  trait_name,
  wounds,
} from "../npcFields";

describe("NPC Fields (1e Conversion)", () => {
  describe("Core NPC Attributes", () => {
    it("should define character name and combat / instinct stats (excluding speed)", () => {
      const charNameExpect = expect(character_name.name);
      charNameExpect.toBe("character_name");

      const combatNameExpect = expect(combat.name);
      combatNameExpect.toBe("combat");

      const combatTypeExpect = expect(combat.type);
      combatTypeExpect.toBe("number");

      const combatUiTypeExpect = expect(combat.uiType);
      combatUiTypeExpect.toBe("number");

      const instinctNameExpect = expect(instinct.name);
      instinctNameExpect.toBe("instinct");

      const instinctTypeExpect = expect(instinct.type);
      instinctTypeExpect.toBe("number");

      const instinctUiTypeExpect = expect(instinct.uiType);
      instinctUiTypeExpect.toBe("number");
    });

    it("should define wounds and health with max support", () => {
      const woundsNameExpect = expect(wounds.name);
      woundsNameExpect.toBe("wounds");

      const woundsMaxExpect = expect(wounds.max);
      woundsMaxExpect.toBe(true);

      const woundsUiTypeExpect = expect(wounds.uiType);
      woundsUiTypeExpect.toBe("number-max");

      const healthNameExpect = expect(health.name);
      healthNameExpect.toBe("health");

      const healthMaxExpect = expect(health.max);
      healthMaxExpect.toBe(true);

      const healthUiTypeExpect = expect(health.uiType);
      healthUiTypeExpect.toBe("number-max");
    });

    it("should define armor points attribute", () => {
      const apNameExpect = expect(armor_points.name);
      apNameExpect.toBe("armor_points");

      const apTypeExpect = expect(armor_points.type);
      apTypeExpect.toBe("number");

      const apUiTypeExpect = expect(armor_points.uiType);
      apUiTypeExpect.toBe("number");
    });

    it("should define description and equipment attributes as textareas", () => {
      const descUiTypeExpect = expect(description.uiType);
      descUiTypeExpect.toBe("textarea");

      const equipUiTypeExpect = expect(equipment.uiType);
      equipUiTypeExpect.toBe("textarea");
    });

    it("should contain all attributes in npcAttributes map", () => {
      const mapCombatExpect = expect(npcAttributes.combat);
      mapCombatExpect.toBe(combat);

      const mapInstinctExpect = expect(npcAttributes.instinct);
      mapInstinctExpect.toBe(instinct);

      const mapWoundsExpect = expect(npcAttributes.wounds);
      mapWoundsExpect.toBe(wounds);

      const mapHealthExpect = expect(npcAttributes.health);
      mapHealthExpect.toBe(health);

      const mapApExpect = expect(npcAttributes.armor_points);
      mapApExpect.toBe(armor_points);
    });
  });

  describe("Attacks Repeating Section", () => {
    it("should define repeating section named repeating_attacks", () => {
      const sectionNameExpect = expect(npcAttacks.name);
      sectionNameExpect.toBe("repeating_attacks");
    });

    it("should define all weapon-equivalent fields in attacks section", () => {
      const nameExpect = expect(npcAttacks.fields.attack_name);
      nameExpect.toBe(attack_name);

      const typeExpect = expect(npcAttacks.fields.attack_type);
      typeExpect.toBe(attack_type);

      const typeOptionsExpect = expect(attack_type.options);
      typeOptionsExpect.toEqual(["Ranged", "Melee"]);

      const dmgExpect = expect(npcAttacks.fields.attack_damage);
      dmgExpect.toBe(attack_damage);

      const rangeSExpect = expect(npcAttacks.fields.attack_range_s);
      rangeSExpect.toBe(attack_range_s);

      const rangeMExpect = expect(npcAttacks.fields.attack_range_m);
      rangeMExpect.toBe(attack_range_m);

      const rangeLExpect = expect(npcAttacks.fields.attack_range_l);
      rangeLExpect.toBe(attack_range_l);

      const critDmgExpect = expect(npcAttacks.fields.attack_crit_damage);
      critDmgExpect.toBe(attack_crit_damage);

      const critEffExpect = expect(npcAttacks.fields.attack_crit_effect);
      critEffExpect.toBe(attack_crit_effect);

      const shotsExpect = expect(npcAttacks.fields.attack_shots);
      shotsExpect.toBe(attack_shots);

      const ammoExpect = expect(npcAttacks.fields.attack_ammunition);
      ammoExpect.toBe(attack_ammunition);

      const notesExpect = expect(npcAttacks.fields.attack_notes);
      notesExpect.toBe(attack_notes);

      const notesUiTypeExpect = expect(attack_notes.uiType);
      notesUiTypeExpect.toBe("textarea");
    });
  });

  describe("Traits Repeating Section", () => {
    it("should define repeating section named repeating_traits", () => {
      const sectionNameExpect = expect(npcTraits.name);
      sectionNameExpect.toBe("repeating_traits");
    });

    it("should define trait name and description fields", () => {
      const nameExpect = expect(npcTraits.fields.trait_name);
      nameExpect.toBe(trait_name);

      const descExpect = expect(npcTraits.fields.trait_description);
      descExpect.toBe(trait_description);

      const descUiTypeExpect = expect(trait_description.uiType);
      descUiTypeExpect.toBe("textarea");
    });
  });
});
