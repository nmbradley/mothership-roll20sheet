import { skillsByKey } from "#game/constants.js";
import { allSaves, allStats } from "#game/enums.js";

import { addTopBar, refreshTopBar } from "./charactermancer/1-intro";
import { onLoadStats, onRollStats } from "./charactermancer/2-stats";
import {
  advanceSkillChoice,
  applyFloatingBonus,
  disableChosenSkill,
  onLoadClass,
  onSelectClass,
  reselectClass,
} from "./charactermancer/3-class";
import {
  onLoadSkills, recalculateSkillPoints, toggleSkill,
} from "./charactermancer/4-skills";
import {
  chooseEquipmentPackage,
  onLoadEquipment,
  rollCredits,
  rollPatch,
  rollTrinket,
} from "./charactermancer/5-equipment";
import { onLoadReview } from "./charactermancer/6-review";
import { onFinish } from "./charactermancer/7-final";
import { TrackedStats, type CharmancerData } from "./charactermancer/types";
import { destroyedArmorRowId, handleDestroyArmor } from "./rules/armor";
import {
  CHECK_ATTRIBUTES,
  checkKey,
  handleAttackClick,
  recomputeSkillQuery,
  recomputeWorstSave,
  rollCheck,
  rollDeathSave,
  rollNPCInitiative,
  rollPanicCheck,
  rollPCInitiative,
  rollRestSave,
  rollSaveCheck,
  skillQuery,
} from "./rules/checks";
import {
  handleApplyBleeding, handleStopBleeding, handleTakeDamage, handleTakeWound,
} from "./rules/damage";
import { recalculateArmorTotals } from "./rules/equipment";
import { handleRadiationLevelChange, handleRadiationRound } from "./rules/radiation";
import {
  handleAfterBattleReport,
  handleAnnualMaintenanceCheck,
  handleBankruptcySave,
  handleBattleCheck,
  handleMdmgChange,
  handleMoraleCheck,
  handleRevealFuelBid,
  handleStartingCondition,
  handleSystemsCheck,
  handleThrustersCheck,
} from "./rules/ships";
import { handleMilitaryTraining } from "./rules/skills";
import { incrementHighScore } from "./rules/stats";

on("clicked:increment_score", incrementHighScore);
on("clicked:starting_condition", () => {
  void handleStartingCondition();
});
on("clicked:annual_maintenance", () => {
  void handleAnnualMaintenanceCheck();
});
on("clicked:after_battle_report", () => {
  void handleAfterBattleReport();
});
on("clicked:bankruptcy_save", () => {
  void handleBankruptcySave();
});
on("clicked:systems_check", () => {
  void handleSystemsCheck();
});
on("clicked:thrusters_check", () => {
  void handleThrustersCheck();
});
on("clicked:battle_check", () => {
  void handleBattleCheck();
});
on("change:ship_mdmg", handleMdmgChange);
on("clicked:morale_check", () => {
  void handleMoraleCheck();
});
on("clicked:reveal_bid", () => {
  void handleRevealFuelBid();
});

on("clicked:repeating_equipment:destroy_armor", (eventInfo) => {
  const rowId = destroyedArmorRowId(eventInfo);
  if (rowId === undefined) return;
  void handleDestroyArmor(rowId);
});

const ARMOR_ROW_EVENTS = [
  "change:repeating_equipment:equipment_type",
  "change:repeating_equipment:equipment_armor_points",
  "change:repeating_equipment:equipment_damage_reduction",
  "change:repeating_equipment:equipment_destroyed",
  "change:repeating_equipment:equipment_equipped",
  "remove:repeating_equipment",
].join(" ");
on(ARMOR_ROW_EVENTS, () => {
  recalculateArmorTotals();
});

on("sheet:opened", () => {
  recalculateArmorTotals();
});

const SKILLED_CHECKS: readonly string[] = [...allStats, ...allSaves];

for (const attribute of CHECK_ATTRIBUTES) {
  const isSkilled = SKILLED_CHECKS.includes(attribute);
  const isSave = (allSaves as readonly string[]).includes(attribute);

  on(`clicked:check-${attribute}`, () => {
    if (isSave) {
      rollSaveCheck(attribute);
      return;
    }
    void rollCheck({
      i18nKey: checkKey(attribute),
      target: `@{${attribute}}`,
      ...(isSkilled ? { bonus: skillQuery() } : {}),
    });
  });
}

on("clicked:pc-initiative", () => {
  void rollPCInitiative();
});
on("clicked:npc-initiative", () => {
  void rollNPCInitiative();
});

on("clicked:panic", () => {
  void rollPanicCheck();
});

on("change:sanity change:fear change:body", recomputeWorstSave);
on("sheet:opened", recomputeWorstSave);

on("clicked:rest_save", () => {
  void rollRestSave();
});

const SKILL_ROW_EVENTS = [
  "change:repeating_trained:skill_name",
  "change:repeating_expert:skill_name",
  "change:repeating_master:skill_name",
  "remove:repeating_trained",
  "remove:repeating_expert",
  "remove:repeating_master",
].join(" ");
on(SKILL_ROW_EVENTS, () => {
  recomputeSkillQuery();
});
on("sheet:opened", () => {
  recomputeSkillQuery();
});

on("clicked:launch_charmancer", () => {
  startCharactermancer("intro");
});

on("clicked:death_save", () => {
  void rollDeathSave();
});

on("clicked:take_damage", () => {
  handleTakeDamage();
});

on("clicked:take_wound", () => {
  handleTakeWound();
});

on("clicked:apply_bleeding", () => {
  handleApplyBleeding();
});

on("clicked:stop_bleeding", () => {
  handleStopBleeding();
});

on("clicked:apply_radiation", () => {
  handleRadiationRound();
});

on("change:radiation_level", () => {
  handleRadiationLevelChange();
});

on("clicked:repeating_attacks:attack", (eventInfo) => {
  handleAttackClick(eventInfo);
});

on("clicked:repeating_npctraits:npc-trait", () => {
  void rollCheck({
    name: "@{trait_name}",
    target: "@{instinct}",
  });
});

on("clicked:military_training", () => {
  void handleMilitaryTraining();
});

/** Slides that carry the running stat topbar. */
const TOPBAR_SLIDES = ["intro", "stats", "class", "skills", "equipment"] as const;

for (const slide of TOPBAR_SLIDES) {
  on(`page:${slide}`, () => {
    addTopBar();
  });
}

for (const stat of TrackedStats) {
  on(`mancerchange:${stat} mancerchange:${stat}_mod`, () => {
    refreshTopBar();
  });
}

on("page:stats", () => {
  onLoadStats();
});
on("mancerroll:stats", (eventInfo) => {
  onRollStats(eventInfo.roll ?? []);
});

on("page:class", () => {
  onLoadClass();
});
on("mancerchange:repeating_class_selected", (eventInfo) => {
  const section = eventInfo.sourceSection;
  if (section === undefined) return;
  onSelectClass(section, eventInfo.sourceType);
});
on("clicked:reselectc", () => {
  reselectClass();
});
on("mancerchange:repeating_choicerow", (eventInfo) => {
  if (eventInfo.sourceAttribute === "floatstat") {
    applyFloatingBonus(eventInfo.newValue ?? "");
    return;
  }
  disableChosenSkill(eventInfo.newValue ?? "");
  advanceSkillChoice(eventInfo.sourceSection, eventInfo.newValue ?? "");
});

on("page:skills", () => {
  onLoadSkills();
});
for (const key of Object.keys(skillsByKey)) {
  on(`clicked:toggle-${key}`, () => {
    toggleSkill(key);
    recalculateSkillPoints();
  });
}

on("page:equipment", () => {
  onLoadEquipment();
});
on("mancerchange:package", (eventInfo) => {
  chooseEquipmentPackage(eventInfo.newValue ?? "");
});
on("mancerroll:credits", (eventInfo) => {
  rollCredits(eventInfo.roll ?? []);
});
on("mancerroll:trinket", (eventInfo) => {
  rollTrinket(eventInfo.roll ?? []);
});
on("mancerroll:patch", (eventInfo) => {
  rollPatch(eventInfo.roll ?? []);
});

on("page:review", () => {
  onLoadReview();
});
on("mancerfinish:newcharacter", (eventInfo) => {
  const data = (eventInfo.data ?? {}) as CharmancerData;
  onFinish(data);
});
