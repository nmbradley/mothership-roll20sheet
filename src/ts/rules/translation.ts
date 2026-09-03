/**
 * Reading translations from a sheetworker.
 *
 * Roll20's `getTranslationByKey` returns `false` -- not a string, and not
 * undefined -- for a key the campaign's loaded translation does not carry.
 * That is the normal state for every key added since the campaign last took a
 * translation.json, so it is not an edge case worth trusting a type over:
 * calling a string method on it throws inside the sandbox and takes the whole
 * handler down, silently abandoning whatever write it was building.
 */

/**
 * The translation for a key, or the key itself when it cannot be resolved.
 *
 * Two cases fall back, both to the key: Roll20 answering `false` for a key the
 * campaign's translation does not carry, and the global being absent
 * altogether -- which is every unit test, since the suite stubs only the
 * Roll20 APIs a given test exercises.
 */
export function translateOr(key: string): string {
  if (typeof getTranslationByKey !== "function") return key;

  const translated = getTranslationByKey(key);
  if (typeof translated === "string") return translated;
  return key;
}
