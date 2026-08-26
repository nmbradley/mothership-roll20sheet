import { skillsByKey } from "#game/constants.js";
import { allSaves, allStats } from "#game/enums.js";

import { addTopBar, refreshTopBar } from "./charactermancer/1-intro";
import { onLoadStats, onRollStats } from "./charactermancer/2-stats";
import {
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
import {
  CHECK_ATTRIBUTES, checkKey, rollCheck, rollPanicCheck, skillQuery,
} from "./rules/checks";
import {
  handleAnnualMaintenanceCheck,
  handleBankruptcySave,
  handleBattleCheck,
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

// --- CHECKS ---

// Training raises a character's own Stat and Save checks. An NPC's Combat and
// Instinct are not skills it trained for, so those keep the plain modifier.
const SKILLED_CHECKS: readonly string[] = [...allStats, ...allSaves];

for (const attribute of CHECK_ATTRIBUTES) {
  const isSkilled = SKILLED_CHECKS.includes(attribute);

  on(`clicked:check-${attribute}`, () => {
    void rollCheck({
      i18nKey: checkKey(attribute),
      target: `@{${attribute}}`,
      ...(isSkilled ? { bonus: skillQuery() } : {}),
    });
  });
}

on("clicked:panic", () => {
  void rollPanicCheck();
});

// Rolls made from a repeating row read that row's own attributes.
on("clicked:repeating_attacks:attack", () => {
  void rollCheck({
    name: "@{attack_name}",
    target: "@{combat}",
  });
});

on("clicked:repeating_npcattacks:npc-attack", () => {
  void rollCheck({
    name: "@{npc_attack_name}",
    target: "@{npc_combat}",
  });
});

on("clicked:repeating_npctraits:npc-trait", () => {
  void rollCheck({
    name: "@{npc_trait_name}",
    target: "@{npc_instinct}",
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
