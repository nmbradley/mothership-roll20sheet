import { skillsByKey } from "#game/constants.js";
import { allSaves, allStats } from "#game/enums.js";

import { addTopBar, refreshTopBar } from "./charactermancer/1-intro";
import { onLoadStats, onRollStats } from "./charactermancer/2-stats";
import {
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
import { handleDestroyArmor } from "./rules/armor";
import {
  adjustStress,
  CHECK_ATTRIBUTES,
  checkKey,
  rollCheck,
  rollDeathSave,
  rollNPCInitiative,
  rollPanicCheck,
  rollPCInitiative,
  rollRestSave,
  rollSaveCheck,
  skillQuery,
} from "./rules/checks";
import { handleTakeDamage, handleTakeWound } from "./rules/damage";
import {
  handleAfterBattleReport,
  handleAnnualMaintenanceCheck,
  handleBankruptcySave,
  handleBattleCheck,
  handleMdmgChange,
  handleMoraleCheck,
  handleStartingCondition,
  handleSystemsCheck,
  handleThrustersCheck,
} from "./rules/ships";
import { incrementHighScore } from "./rules/stats";

// --- SHIP ---

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

// --- ARMOR ---

on("clicked:destroy_armor", () => {
  void handleDestroyArmor();
});

// --- CHECKS ---

// Training raises a character's own Stat and Save checks. Instinct has no PC
// equivalent, so it keeps the plain modifier. Combat is trainable for a PC but
// not an NPC; the merged handler (#90) now asks an NPC the same Skill query
// too, but answering Untrained costs nothing, so this is left shared rather
// than branched on sheet_toggle.
const SKILLED_CHECKS: readonly string[] = [...allStats, ...allSaves];

for (const attribute of CHECK_ATTRIBUTES) {
  const isSkilled = SKILLED_CHECKS.includes(attribute);
  const isSave = (allSaves as readonly string[]).includes(attribute);

  on(`clicked:check-${attribute}`, () => {
    // #9: a Save's Skill prompt is a Keeper toggle read at click time, so it
    // cannot be baked in below the way every other skilled check's is.
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

// #50: the optional rule where a Speed/Instinct Check also sets Initiative.
// Two buttons rather than one shared action: the PC and NPC sheets target
// different attributes, and a Roll20 button click cannot branch on which
// sheet is active before the handler runs.
on("clicked:pc-initiative", () => {
  void rollPCInitiative();
});
on("clicked:npc-initiative", () => {
  void rollNPCInitiative();
});

on("clicked:panic", () => {
  void rollPanicCheck();
});

on("clicked:rest_save", () => {
  void rollRestSave();
});

on("clicked:death_save", () => {
  void rollDeathSave();
});

on("clicked:take_damage", () => {
  void handleTakeDamage();
});

on("clicked:take_wound", () => {
  void handleTakeWound();
});

on("clicked:stress_up", () => {
  adjustStress(1);
});

on("clicked:stress_down", () => {
  adjustStress(-1);
});

// Rolls made from a repeating row read that row's own attributes. The PC and
// NPC attack rows share repeating_attacks (#90), so one handler covers both.
on("clicked:repeating_attacks:attack", () => {
  void rollCheck({
    name: "@{attack_name}",
    target: "@{combat}",
  });
});

on("clicked:repeating_npctraits:npc-trait", () => {
  void rollCheck({
    name: "@{trait_name}",
    target: "@{instinct}",
  });
});

// --- CHARACTERMANCER ---

/** Slides that carry the running stat topbar. */
const TOPBAR_SLIDES = ["intro", "stats", "class", "skills", "equipment"] as const;

for (const slide of TOPBAR_SLIDES) {
  on(`page:${slide}`, () => {
    addTopBar();
  });
}

// A stat can change on any slide, so the topbar listens to all of them.
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
  // Both skill and floating-bonus pickers are charactermancer "choice rows"
  // and share this one event; the field that changed tells them apart.
  if (eventInfo.sourceAttribute === "floatstat") {
    applyFloatingBonus(eventInfo.newValue);
    return;
  }
  disableChosenSkill(eventInfo.newValue);
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
  chooseEquipmentPackage(eventInfo.newValue);
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
