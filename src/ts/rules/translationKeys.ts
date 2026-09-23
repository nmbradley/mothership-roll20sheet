import {
  CHECK_ATTRIBUTES, NONE_LABEL, ROLL_PHRASES, SKILL_PROMPT, checkKey,
} from "./checks";
import { Outcomes } from "./rolls";

/** Every translation key a roll macro emits through `^{...}`. */
export function rollMacroKeys(): readonly string[] {
  const keys: string[] = [];

  for (const outcome of Object.values(Outcomes)) {
    keys.push(outcome);
  }
  for (const phrase of ROLL_PHRASES) {
    keys.push(phrase);
  }
  keys.push(SKILL_PROMPT);
  keys.push(NONE_LABEL);
  for (const attribute of CHECK_ATTRIBUTES) {
    const key = checkKey(attribute);
    if (!keys.includes(key)) keys.push(key);
  }
  return keys;
}
