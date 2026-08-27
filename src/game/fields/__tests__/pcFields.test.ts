import {
  describe, expect, it,
} from "vitest";

import {
  pcAttributes,
  pcAfflictions,
  pcAttacks,
  pcEquipment,
  pcTrainedSkills,
  pcExpertSkills,
  pcMasterSkills,
  save_skill_select,
  settings_open,
  sheet_toggle_select,
  speed_initiative,
} from "#game/fields/pcFields";

describe("pcFields", () => {
  it("exports a top-level character name", () => {
    expect(pcAttributes.character_name.name).toBe("character_name");
  });

  it("exports stats and saves", () => {
    expect(pcAttributes.strength.name).toBe("strength");
    expect(pcAttributes.sanity.name).toBe("sanity");
  });

  it("no longer exports the 0e header fields", () => {
    expect("level" in pcAttributes).toBe(false);
    expect("rank_title" in pcAttributes).toBe(false);
    expect("xp" in pcAttributes).toBe(false);
  });

  it("exports damage reduction alongside armor points", () => {
    expect(pcAttributes.armor_points.name).toBe("armor_points");
    expect(pcAttributes.damage_reduction.name).toBe("damage_reduction");
  });

  it("exports repeating attacks", () => {
    expect(pcAttacks.name).toBe("repeating_attacks");
    expect(pcAttacks.attributes.attack_name.name).toBe("attack_name");
  });

  it("exports repeating equipment", () => {
    expect(pcEquipment.name).toBe("repeating_equipment");
    expect(pcEquipment.attributes.equipment_name.name).toBe("equipment_name");
  });

  it("exports repeating afflictions", () => {
    expect(pcAfflictions.name).toBe("repeating_afflictions");
    expect(pcAfflictions.attributes.affliction_name.name).toBe("affliction_name");
    expect(pcAfflictions.attributes.affliction_effect.control).toBe("textarea");
    expect(pcAfflictions.attributes.affliction_treated.control).toBe("checkbox");
  });

  it("keeps the superseded conditions attribute declared for old data", () => {
    expect(pcAttributes.conditions.name).toBe("conditions");
    expect(pcAttributes.conditions.control).toBe("textarea");
  });

  it("no longer exports the 0e equipment armor bonus", () => {
    expect("equipment_armor_bonus" in pcEquipment.attributes).toBe(false);
  });

  it("exports repeating skills", () => {
    expect(pcTrainedSkills.name).toBe("repeating_trained");
    expect(pcExpertSkills.name).toBe("repeating_expert");
    expect(pcMasterSkills.name).toBe("repeating_master");

    expect(pcTrainedSkills.attributes.skill_name.name).toBe("skill_name");
  });

  it("exports the Speed Check Initiative settings toggle", () => {
    expect(pcAttributes.speed_initiative.name).toBe("speed_initiative");
    expect(speed_initiative.control).toBe("checkbox");
    expect(speed_initiative.checkedValue).toBe("on");
  });

  it("exports the Skill Select for Saves settings toggle, on by default", () => {
    expect(pcAttributes.save_skill_select.name).toBe("save_skill_select");
    expect(save_skill_select.control).toBe("checkbox");
    expect(save_skill_select.checkedValue).toBe("on");
    expect(save_skill_select.checked).toBe(true);
  });

  it("exports settings_open, layered over sheet_toggle rather than a value of it", () => {
    expect(pcAttributes.settings_open.name).toBe("settings_open");
    expect(settings_open.control).toBe("checkbox");
    expect(settings_open.checkedValue).toBe("on");
  });

  it("exports a visible select sharing sheet_toggle's attribute name", () => {
    expect(sheet_toggle_select.name).toBe(pcAttributes.sheet_toggle.name);
    expect(sheet_toggle_select.control).toBe("select");
    expect(sheet_toggle_select.options).toEqual([
      {
        value: "pc",
        label: "PC",
      },
      {
        value: "npc",
        label: "NPC",
      },
      {
        value: "ship",
        label: "Ship",
      },
    ]);
  });
});
