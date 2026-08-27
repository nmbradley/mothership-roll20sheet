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
  CHECK_ATTRIBUTES,
  checkKey,
  recomputeSkillQuery,
  recomputeWorstSave,
  rollAttack,
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
import { recalculateArmorTotals } from "./rules/equipment";
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
on("clicked:reveal_bid", () => {
  void handleRevealFuelBid();
});

// --- ARMOR ---

// Destroy lives on the equipment row now (#112): it zeroes the clicked row's
// own AP/DR rather than a panel-level total, so the sourceSection the click
// raised on says which row.
on("clicked:repeating_equipment:destroy_armor", (eventInfo) => {
  const rowId = eventInfo.sourceSection;
  if (rowId === undefined) return;
  void handleDestroyArmor(rowId);
});

// AP and DR are summed from the equipment rows rather than owned by the
// character (#112); this recalculates the totals on every edit, add and
// remove -- add and edit share the row's own change events, since a newly
// added row's fields fire the same change: events as an edited one.
const ARMOR_ROW_EVENTS = [
  "change:repeating_equipment:equipment_type",
  "change:repeating_equipment:equipment_armor_points",
  "change:repeating_equipment:equipment_damage_reduction",
  "remove:repeating_equipment",
].join(" ");
on(ARMOR_ROW_EVENTS, () => {
  void recalculateArmorTotals();
});

// #127: armor_points and damage_reduction are never written until an Armor
// row changes, so a sheet opened before that leaves both attributes
// unwritten -- this seeds them from whatever equipment is already worn.
on("sheet:opened", () => {
  void recalculateArmorTotals();
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

// #110: worst_save is a hidden mirror of whichever Save reads lowest, kept in
// step here rather than read inline by rollRestSave, so its startRoll can
// fire synchronously off the click. sheet:opened seeds it for a character
// saved before this attribute existed.
on("change:sanity change:fear change:body", recomputeWorstSave);
on("sheet:opened", recomputeWorstSave);

on("clicked:rest_save", () => {
  void rollRestSave();
});

// #5: skill_query is a hidden mirror of the character's own Trained, Expert
// and Master rows, kept in step here rather than read inline by a skilled
// check's click handler, so skillQuery()'s reference to it can reach
// startRoll synchronously (#110). sheet:opened seeds it for a character
// saved before this attribute existed.
const SKILL_ROW_EVENTS = [
  "change:repeating_trained:skill_name",
  "change:repeating_expert:skill_name",
  "change:repeating_master:skill_name",
  "remove:repeating_trained",
  "remove:repeating_expert",
  "remove:repeating_master",
].join(" ");
on(SKILL_ROW_EVENTS, () => {
  void recomputeSkillQuery();
});
on("sheet:opened", () => {
  void recomputeSkillQuery();
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

// Rolls made from a repeating row read that row's own attributes. The PC and
// NPC attack rows share repeating_attacks (#90), so one handler covers both.
// #13: the Skill/situational bonus query is baked in here, same as every
// other skilled check in the loop above. #6: the row's own attack_bonus and
// the sheet-wide attack_modifier are added the same way -- @{...} references
// resolved by Roll20 itself, so the roll still fires synchronously (#110).
// The row id (eventInfo.sourceSection) is passed through for #14's ammo
// tracking, which needs the fully-qualified attribute name to read/write it.
on("clicked:repeating_attacks:attack", (eventInfo) => {
  void rollAttack({
    name: "@{attack_name}",
    target: "@{combat}+@{attack_bonus}+@{attack_modifier}",
    bonus: skillQuery(),
  }, eventInfo.sourceSection);
});

on("clicked:repeating_npctraits:npc-trait", () => {
  void rollCheck({
    name: "@{trait_name}",
    target: "@{instinct}",
  });
});

// #49: the Military Training exception -- 6 years, free, its own Combat
// Check rather than a Skill Training purchase.
on("clicked:military_training", () => {
  void handleMilitaryTraining();
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
