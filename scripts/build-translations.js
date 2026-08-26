import * as esbuild from "esbuild";
import fs from "fs";
import path from "path";

/**
 * Regenerates translation.json.
 *
 * Roll20 can dump the keys used by `data-i18n` attributes from the browser
 * console, but it cannot see keys built inside a roll macro with `^{...}`.
 * This collects both, keeps any translation already written, and leaves the
 * English text as the value for anything new.
 */

const SHEET = "mothership.html";
const OUTPUT = "translation.json";

/**
 * Undoes the HTML escaping the sheet is written with.
 *
 * A key is the English text a translator reads, so `Attacks &amp; Weapons` has
 * to reach translation.json as `Attacks & Weapons`.
 */
function decode(text) {
  return text
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", "\"")
    .replaceAll("&#39;", "'")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&lbrace;", "{")
    .replaceAll("&rbrace;", "}")
    .replaceAll("&amp;", "&");
}

/** The i18n attributes Roll20 supports, per the translation docs. */
const ATTRIBUTES = ["title", "alt", "aria-label", "label", "placeholder"];

/**
 * Pulls `data-i18n` keys out of the built sheet, along with the English text
 * each one stands for.
 */
function keysFromMarkup(html) {
  const found = new Map();

  // An element's own text is the source string for a plain data-i18n key.
  const elements = html.matchAll(
    /<(\w+)[^>]*\bdata-i18n="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/g,
  );
  for (const [, , rawKey, body] of elements) {
    const key = decode(rawKey);
    const stripped = body.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
    const text = decode(stripped);

    // An element the sheetworkers fill is empty in the markup. Coming later in
    // the document, it must not overwrite the English that another element with
    // the same key spells out, so only real text wins and the key only stands
    // in while no element has supplied any.
    if (text !== "") found.set(key, text);
    else if (!found.has(key)) found.set(key, key);
  }

  // Self-closing and empty elements still register their key.
  const bare = html.matchAll(/\bdata-i18n="([^"]+)"/g);
  for (const [, rawKey] of bare) {
    const key = decode(rawKey);
    if (!found.has(key)) found.set(key, key);
  }

  // data-i18n-<attr> takes its source string from that attribute.
  for (const attribute of ATTRIBUTES) {
    const pattern = new RegExp(`\\bdata-i18n-${attribute}="([^"]+)"`, "g");
    for (const [, rawKey] of html.matchAll(pattern)) {
      const key = decode(rawKey);
      if (!found.has(key)) found.set(key, key);
    }
  }
  return found;
}

/** Bundles the key list out of TypeScript so it stays derived, not copied. */
async function keysFromRollMacros() {
  const outfile = path.resolve("dist/translation-keys.mjs");
  await esbuild.build({
    entryPoints: ["src/ts/rules/translationKeys.ts"],
    bundle: true,
    outfile,
    format: "esm",
    platform: "node",
  });

  const module = await import(`${outfile}?t=${String(fs.statSync(outfile).mtimeMs)}`);
  return module.rollMacroKeys();
}

async function build() {
  if (!fs.existsSync("dist")) fs.mkdirSync("dist", { recursive: true });

  const html = fs.readFileSync(SHEET, "utf8");
  const fromMarkup = keysFromMarkup(html);
  const fromMacros = await keysFromRollMacros();

  const existing = fs.existsSync(OUTPUT)
    ? JSON.parse(fs.readFileSync(OUTPUT, "utf8"))
    : {};

  const merged = {};
  const keys = [...fromMarkup.keys(), ...fromMacros].sort();
  for (const key of keys) {
    // A translation already written wins -- but a value identical to its key is
    // the untranslated fallback rather than a translation, and freezing it
    // means the sheet renders the lowercase key instead of the English the
    // markup actually carries.
    const written = existing[key];
    const isTranslated = written !== undefined && written !== key;
    merged[key] = isTranslated ? written : fromMarkup.get(key) ?? key;
  }

  const added = keys.filter((key) => !(key in existing));
  const dropped = Object.keys(existing).filter((key) => !keys.includes(key));

  fs.writeFileSync(OUTPUT, `${JSON.stringify(merged, null, 2)}\n`);
  console.log(`✅ ${OUTPUT}: ${String(keys.length)} keys `
    + `(${String(added.length)} added, ${String(dropped.length)} no longer used)`);
  if (dropped.length > 0) console.log(`   unused: ${dropped.join(", ")}`);
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
