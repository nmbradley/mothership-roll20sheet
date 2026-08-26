import {
  describe,
  it,
  expect,
} from "vitest";

import {
  skillsByLevel, skillKey, skills,
} from "../src/game/constants";
import { SkillLevels, Skills } from "../src/game/enums";

describe("Skills grouped by level", () => {
  it("should cover every skill exactly once", () => {
    const grouped = Object.values(skillsByLevel).flat();
    const all = Object.values(skills);
    expect(grouped).toHaveLength(all.length);

    const names = new Set(grouped.map((skill) => skill.name));
    expect(names.size).toBe(all.length);
  });

  it("should place each skill in its own tier", () => {
    for (const [level, entries] of Object.entries(skillsByLevel)) {
      for (const entry of entries) {
        expect(entry.level).toBe(level);
      }
    }
  });

  it("should build attribute-safe keys from names", () => {
    expect(skillKey(Skills.IndustrialEquipment)).toBe("industrial_equipment");
    expect(skillKey(Skills.HandToHandCombat)).toBe("hand-to-hand_combat");
    expect(skillKey(Skills.ZeroG)).toBe("zero-g");
  });

  it("should invert prereq into unlocks", () => {
    const master = skillsByLevel[SkillLevels.Master];
    const hyperspace = master.find((skill) => skill.name === Skills.Hyperspace);
    expect(hyperspace?.prereq).toContain(Skills.Physics);

    const expert = skillsByLevel[SkillLevels.Expert];
    const physics = expert.find((skill) => skill.name === Skills.Physics);
    expect(physics?.unlocks).toContain(Skills.Hyperspace);
  });

  it("should leave a leaf skill with an empty unlocks list", () => {
    const master = skillsByLevel[SkillLevels.Master];
    const surgery = master.find((skill) => skill.name === Skills.Surgery);
    expect(surgery?.unlocks).toEqual([]);
  });

  it("should list every skill a prerequisite opens up", () => {
    const trained = skillsByLevel[SkillLevels.Trained];
    const botany = trained.find((skill) => skill.name === Skills.Botany);
    expect(botany?.unlocks).toEqual([
      Skills.Psychology,
      Skills.Pathology,
      Skills.FieldMedicine,
      Skills.Ecology,
      Skills.WildernessSurvival,
    ]);
  });
});
