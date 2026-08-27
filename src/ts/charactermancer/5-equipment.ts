import { loadouts, type LoadoutOption } from "#game/data/loadouts.js";
import { patches } from "#game/data/patches.js";
import { trinkets } from "#game/data/trinkets.js";
import { Classes, type Class } from "#game/enums.js";

import { charmancerData, stepValues } from "./helpers";
import { Steps } from "./types";

const CUSTOM_PACKAGE = "custom";
const NO_LOADOUT = "no loadout";
const UNCHOSEN = "choose";

/** Loads the loadout list, the starting-credits roll, and the trinket/patch rolls. */
export function onLoadEquipment(): void {
  offerLoadouts();
  buildCreditsRoll(10);
  buildTableRoll("trinket", trinkets, "t__trinketroll");
  buildTableRoll("patch", patches, "t__patchroll");
  restoreChosenEquipment();
}

/**
 * Offers the loadouts for the chosen class.
 *
 * Loadouts are per class in the rules, so an unchosen class leaves only the
 * custom and no-loadout options rather than every class's kit at once.
 */
function offerLoadouts(): void {
  const options = [...loadoutNames(), CUSTOM_PACKAGE, NO_LOADOUT];
  setCharmancerOptions("package", options);
}

function loadoutNames(): readonly string[] {
  const options = chosenLoadouts();
  const names: string[] = [];
  for (const option of options) {
    const label = loadoutLabel(option);
    names.push(label);
  }
  return names;
}

/** A loadout is identified by its roll number on the class's table. */
function loadoutLabel(option: LoadoutOption): string {
  const label = String(option.roll);
  return label;
}

function chosenLoadouts(): readonly LoadoutOption[] {
  const data = charmancerData();
  const chosen = stepValues(data, Steps.Class)["class"];
  if (chosen === undefined) return [];

  const key = chosen.toLowerCase();
  const isKnown = Object.values(Classes).includes(key as Class);
  if (!isKnown) return [];
  return loadouts[key as Class];
}

/**
 * The starting-credits multiplier for a package choice.
 *
 * Forgoing a loadout trades it for 2d10x100 credits instead of the usual
 * 2d10x10.
 */
export function creditsMultiplier(choice: string): number {
  return choice === NO_LOADOUT ? 100 : 10;
}

/** Records the chosen loadout, or opens the free-text/no-loadout option. */
export function chooseEquipmentPackage(choice: string): void {
  hideChoices([]);
  if (choice === UNCHOSEN) return;

  const multiplier = creditsMultiplier(choice);
  buildCreditsRoll(multiplier);

  if (choice === NO_LOADOUT) {
    showChoices(["noloadout"]);
    setCharmancerText({ t__package: "" });
    setAttrs({ equipment: "" });
    return;
  }

  if (choice === CUSTOM_PACKAGE) {
    showChoices(["custompackage"]);
    setCharmancerText({ t__package: "" });
    setAttrs({ equipment: "" });
    return;
  }

  const options = chosenLoadouts();
  for (const option of options) {
    const label = loadoutLabel(option);
    if (label !== choice) continue;

    const described = option.items.join(", ");
    const encoded = JSON.stringify(option.items);
    setCharmancerText({ t__package: described });
    setAttrs({ equipment: encoded });
    return;
  }
}

/** Builds the starting-credits roll button for the given credits multiplier. */
function buildCreditsRoll(multiplier: number): void {
  const value = `&{template:ms-cm} {{title=credit roll}} {{credits=[[2d10*${multiplier}]]}}`;
  setCharmancerText({
    t__creditsroll: `<button class="ms-cm-creditsroll" name="roll_credits" `
      + `type="roll" value="${value}"></button>`,
  });
}

/**
 * Builds a roll button for a d100 table.
 *
 * Each entry is passed to the roll template as an option, so the template can
 * show the rolled result without a second lookup.
 */
function buildTableRoll(name: string, entries: readonly string[], target: string): void {
  const options: string[] = [];
  for (let index = 0; index < entries.length; index += 1) {
    options.push(`{{opt${index}=${entries[index] ?? ""}}}`);
  }

  const joined = options.join(" ");
  const value = `&{template:ms-cm} {{title=${name} roll}} {{roll=[[1d100-1]]}} ${joined}`;
  setCharmancerText({
    [target]: `<button class="ms-cm-${name}roll" name="roll_${name}" `
      + `type="roll" value="${value}"></button>`,
  });
}

/** Repaints anything the player already rolled on a previous visit. */
function restoreChosenEquipment(): void {
  const data = charmancerData();
  const values = stepValues(data, Steps.Equipment);

  const text: Record<string, string> = {};
  for (const field of ["credits", "trinket", "patch"]) {
    const value = values[field];
    if (value !== undefined) text[`t__${field}`] = value;
  }
  setCharmancerText(text);
}

/** Records rolled starting credits. */
export function rollCredits(rolls: readonly RollResult[]): void {
  const result = rolls[0]?.result;
  if (result === undefined) return;
  setAttrs({ credits: result });
  setCharmancerText({ t__credits: String(result) });
}

/** Records a rolled trinket. */
export function rollTrinket(rolls: readonly RollResult[]): void {
  applyTableRoll(rolls, trinkets, "trinket");
}

/** Records a rolled patch. */
export function rollPatch(rolls: readonly RollResult[]): void {
  applyTableRoll(rolls, patches, "patch");
}

function applyTableRoll(
  rolls: readonly RollResult[],
  entries: readonly string[],
  attribute: string,
): void {
  const index = rolls[0]?.result;
  if (index === undefined) return;

  const chosen = entries[index];
  if (chosen === undefined) return;

  setAttrs({ [attribute]: chosen });
  setCharmancerText({ [`t__${attribute}`]: chosen });
}
