import {
  describe, expect, it,
} from "vitest";

import {
  pcAttributes,
  pcAttacks,
  pcEquipment,
  pcTrainedSkills,
  pcExpertSkills,
  pcMasterSkills,
} from "#game/fields/pcFields";

describe("pcFields", () => {
  it("exports a top-level character name", () => {
    expect(pcAttributes.character_name.name).toBe("character_name");
  });

  it("exports stats and saves", () => {
    expect(pcAttributes.strength.name).toBe("strength");
    expect(pcAttributes.sanity.name).toBe("sanity");
  });

  it("exports repeating attacks", () => {
    expect(pcAttacks.name).toBe("repeating_attacks");
    expect(pcAttacks.attributes.attack_name.name).toBe("attack_name");
  });

  it("exports repeating equipment", () => {
    expect(pcEquipment.name).toBe("repeating_equipment");
    expect(pcEquipment.attributes.equipment_name.name).toBe("equipment_name");
  });

  it("exports repeating skills", () => {
    expect(pcTrainedSkills.name).toBe("repeating_trained");
    expect(pcExpertSkills.name).toBe("repeating_expert");
    expect(pcMasterSkills.name).toBe("repeating_master");

    expect(pcTrainedSkills.attributes.skill_name.name).toBe("skill_name");
  });
});
