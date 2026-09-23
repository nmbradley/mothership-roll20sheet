import * as esbuild from "esbuild";
import fs from "fs";
import path from "path";

const SHEET = "mothership.html";
const OUTPUT = "translation.json";

/** Undoes the HTML escaping the sheet is written with. */
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

/** Pulls `data-i18n` keys out of the built sheet, with the English text each stands for. */
function keysFromMarkup(html) {
  const found = new Map();

  const elements = html.matchAll(
    /<(\w+)[^>]*\bdata-i18n="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/g,
  );
  for (const [, , rawKey, body] of elements) {
    const key = decode(rawKey);
    const stripped = body.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
    const text = decode(stripped);

    if (text !== "") found.set(key, text);
    else if (!found.has(key)) found.set(key, key);
  }

  const bare = html.matchAll(/\bdata-i18n="([^"]+)"/g);
  for (const [, rawKey] of bare) {
    const key = decode(rawKey);
    if (!found.has(key)) found.set(key, key);
  }

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
