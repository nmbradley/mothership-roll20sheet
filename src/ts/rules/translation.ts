/** Reading translations from a sheetworker, where a missing key answers `false`. */

/** The translation for a key, or the key itself when it cannot be resolved. */
export function translateOr(key: string): string {
  if (typeof getTranslationByKey !== "function") return key;

  const translated = getTranslationByKey(key);
  if (typeof translated === "string") return translated;
  return key;
}
