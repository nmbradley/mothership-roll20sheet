import {
  describe, expect, it,
} from "vitest";

import {
  npc_armor_points,
  npc_attack_ammunition,
  npc_attack_crit_damage,
  npc_attack_crit_effect,
  npc_attack_damage,
  npc_attack_name,
  npc_attack_notes,
  npc_attack_range,
  npc_attack_shots,
  npc_attack_type,
  character_name,
  npc_combat,
  npc_description,
  npc_equipment,
  npc_health,
  npc_instinct,
  npcAttacks,
  npcAttributes,
  npcTraits,
  npc_trait_description,
  npc_trait_name,
  npc_wounds,
} from "#game/fields/npcFields";

describe("NPC Fields (1e Conversion)", () => {
  describe("Core NPC Attributes", () => {
    it("should define character name and npc_combat / npc_instinct stats (excluding speed)", () => {
      const charNameExpect = expect(character_name.name);
      charNameExpect.toBe("character_name");

      const combatNameExpect = expect(npc_combat.name);
      combatNameExpect.toBe("npc_combat");

      const combatUiTypeExpect = expect(npc_combat.control);
      combatUiTypeExpect.toBe("number");

      const instinctNameExpect = expect(npc_instinct.name);
      instinctNameExpect.toBe("npc_instinct");

      const instinctUiTypeExpect = expect(npc_instinct.control);
      instinctUiTypeExpect.toBe("number");
    });

    it("should define npc_wounds and npc_health with max support", () => {
      const woundsNameExpect = expect(npc_wounds.name);
      woundsNameExpect.toBe("npc_wounds");

      const woundsMaxExpect = expect(npc_wounds.max);
      woundsMaxExpect.toBe(0);

      const woundsUiTypeExpect = expect(npc_wounds.control);
      woundsUiTypeExpect.toBe("number");

      const healthNameExpect = expect(npc_health.name);
      healthNameExpect.toBe("npc_health");

      const healthMaxExpect = expect(npc_health.max);
      healthMaxExpect.toBe(0);

      const healthUiTypeExpect = expect(npc_health.control);
      healthUiTypeExpect.toBe("number");
    });

    it("should define armor points attribute", () => {
      const apNameExpect = expect(npc_armor_points.name);
      apNameExpect.toBe("npc_armor_points");

      const apUiTypeExpect = expect(npc_armor_points.control);
      apUiTypeExpect.toBe("number");
    });

    it("should define npc_description and npc_equipment attributes as textareas", () => {
      const descUiTypeExpect = expect(npc_description.control);
      descUiTypeExpect.toBe("textarea");

      const equipUiTypeExpect = expect(npc_equipment.control);
      equipUiTypeExpect.toBe("textarea");
    });

    it("should contain all attributes in npcAttributes map", () => {
      const mapCombatExpect = expect(npcAttributes.npc_combat);
      mapCombatExpect.toBe(npc_combat);

      const mapInstinctExpect = expect(npcAttributes.npc_instinct);
      mapInstinctExpect.toBe(npc_instinct);

      const mapWoundsExpect = expect(npcAttributes.npc_wounds);
      mapWoundsExpect.toBe(npc_wounds);

      const mapHealthExpect = expect(npcAttributes.npc_health);
      mapHealthExpect.toBe(npc_health);

      const mapApExpect = expect(npcAttributes.npc_armor_points);
      mapApExpect.toBe(npc_armor_points);
    });
  });

  describe("Attacks Repeating Section", () => {
    it("should define repeating section named repeating_npcattacks", () => {
      const sectionNameExpect = expect(npcAttacks.name);
      sectionNameExpect.toBe("repeating_npcattacks");
    });

    it("should define all weapon-equivalent fields in attacks section", () => {
      const nameExpect = expect(npcAttacks.attributes.npc_attack_name);
      nameExpect.toMatchObject(npc_attack_name);

      const typeExpect = expect(npcAttacks.attributes.npc_attack_type);
      typeExpect.toMatchObject(npc_attack_type);

      const typeOptionsExpect = expect(npc_attack_type.options);
      typeOptionsExpect.toEqual(["Ranged", "Melee"]);

      const dmgExpect = expect(npcAttacks.attributes.npc_attack_damage);
      dmgExpect.toMatchObject(npc_attack_damage);

      const rangeExpect = expect(npcAttacks.attributes.npc_attack_range);
      rangeExpect.toMatchObject(npc_attack_range);

      const critDmgExpect = expect(npcAttacks.attributes.npc_attack_crit_damage);
      critDmgExpect.toMatchObject(npc_attack_crit_damage);

      const critEffExpect = expect(npcAttacks.attributes.npc_attack_crit_effect);
      critEffExpect.toMatchObject(npc_attack_crit_effect);

      const shotsExpect = expect(npcAttacks.attributes.npc_attack_shots);
      shotsExpect.toMatchObject(npc_attack_shots);

      const ammoExpect = expect(npcAttacks.attributes.npc_attack_ammunition);
      ammoExpect.toMatchObject(npc_attack_ammunition);

      const notesExpect = expect(npcAttacks.attributes.npc_attack_notes);
      notesExpect.toMatchObject(npc_attack_notes);

      const notesUiTypeExpect = expect(npc_attack_notes.control);
      notesUiTypeExpect.toBe("textarea");
    });
  });

  describe("Traits Repeating Section", () => {
    it("should define repeating section named repeating_npctraits", () => {
      const sectionNameExpect = expect(npcTraits.name);
      sectionNameExpect.toBe("repeating_npctraits");
    });

    it("should define trait name and npc_description fields", () => {
      const nameExpect = expect(npcTraits.attributes.npc_trait_name);
      nameExpect.toMatchObject(npc_trait_name);

      const descExpect = expect(npcTraits.attributes.npc_trait_description);
      descExpect.toMatchObject(npc_trait_description);

      const descUiTypeExpect = expect(npc_trait_description.control);
      descUiTypeExpect.toBe("textarea");
    });
  });
});
