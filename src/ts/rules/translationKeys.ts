import {
  CHECK_ATTRIBUTES, ROLL_PHRASES, SKILL_PROMPT, UNTRAINED_LABEL, checkKey,
} from "./checks";
import { Outcomes } from "./rolls";

/**
 * Every translation key a roll macro emits through `^{...}`.
 *
 * Roll20 generates translation.json from `data-i18n` attributes in the markup,
 * which cannot see keys built inside a roll macro. Deriving them from the same
 * constants the buttons use keeps the two from drifting.
 */
export function rollMacroKeys(): readonly string[] {
  const keys: string[] = [];

  for (const outcome of Object.values(Outcomes)) {
    keys.push(outcome);
  }
  for (const phrase of ROLL_PHRASES) {
    keys.push(phrase);
  }
  // The skill query's prompt and its option labels are translated in the
  // sheetworker, so they need keys of their own.
  keys.push(SKILL_PROMPT);
  keys.push(UNTRAINED_LABEL);
  for (const attribute of CHECK_ATTRIBUTES) {
    const key = checkKey(attribute);
    if (!keys.includes(key)) keys.push(key);
  }
  return keys;
}
