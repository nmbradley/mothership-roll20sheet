import * as esbuild from "esbuild";
import esbuildSvelte from "esbuild-svelte";
import { sveltePreprocess } from "svelte-preprocess";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import prettier from "prettier";
import * as sass from "sass";

import { buildWorker } from "./build-worker.js";
import { collectComponentStyles, stripStyles } from "./collect-styles.js";

const preprocess = [stripStyles, sveltePreprocess()];

/**
 * Renders the component tree to static HTML.
 */
async function buildHtml() {
  await esbuild.build({
    entryPoints: ["scripts/compile-svelte-root.js"],
    bundle: true,
    outfile: "dist/compile-ssr.js",
    format: "esm",
    platform: "node",
    packages: "external",
    plugins: [
      esbuildSvelte({
        preprocess,
        compilerOptions: { generate: "server" },
      }),
    ],
  });

  execSync("node dist/compile-ssr.js", { stdio: "inherit" });
}

/** The sheet's own scope, repeated to carry weight. See buildCss. */
const SHEET_ROOT = ".charsheet.charsheet.charsheet";

/**
 * Reads a style partial as text so it can be nested inside a selector.
 *
 * `@use` has to sit at the top of a document and cannot be nested, so anything
 * that belongs inside the root selector is inlined rather than loaded.
 */
function readPartial(name) {
  const file = path.join("src/svelte/styles", `_${name}.scss`);
  return fs.readFileSync(file, "utf8");
}

/**
 * Builds the stylesheet from one Sass document: the shared layer followed by
 * every component's style block. Compiling together is what allows a generic
 * extended from several components to emit a single grouped rule.
 *
 * Everything the sheet owns is nested inside `SHEET_ROOT`, whose class is
 * repeated three times. Repeating a class does not change what it matches, only
 * what it outweighs: it lifts every rule by three classes in one move, so the
 * whole sheet clears Roll20's `.charsheet input[type="..."]` defaults at once
 * and the relative order of the sheet's own rules is left exactly as authored.
 *
 * Three things stay outside it. Tokens declare their custom properties on the
 * roll template roots as well as the sheet; roll templates render in the chat
 * pane, where no sheet element is an ancestor; and _unset.scss carries its own
 * root selector, so nesting it would turn it into a descendant of the root it
 * means to reset.
 */
function buildCss() {
  const componentStyles = collectComponentStyles();
  const document = [
    "@use \"tokens\";",
    "@use \"generics\" as *;",
    "@use \"unset\";",
    "@use \"rolltemplate\";",
    "",
    `${SHEET_ROOT} {`,
    readPartial("base"),
    componentStyles,
    "}",
  ].join("\n");

  const result = sass.compileString(document, {
    style: "expanded",
    loadPaths: ["src/svelte/styles"],
    // Sass emits `@charset "UTF-8"` ahead of everything else the moment the
    // stylesheet holds a non-ASCII byte. Roll20's sanitizer has no reason to
    // expect an at-rule there and the sheet is served UTF-8 regardless, so
    // suppress it rather than hand the parser something to trip on.
    charset: false,
  });
  return result.css;
}

async function build() {
  console.log("⚙️  Compiling Svelte components via esbuild...");
  if (!fs.existsSync("dist")) fs.mkdirSync("dist", { recursive: true });

  console.log("🔧 Bundling sheetworkers...");
  await buildWorker();

  // After the worker: the HTML step inlines the bundle it just produced.
  console.log("🚀 Generating static HTML...");
  await buildHtml();

  console.log("🎨 Generating stylesheet...");
  const css = buildCss();
  const formatted = await prettier.format(css, { parser: "css" });
  fs.writeFileSync(path.resolve("mothership.css"), formatted);

  const kb = (Buffer.byteLength(formatted) / 1024).toFixed(1);
  console.log(`✅ Successfully built mothership.css using Svelte! (${kb} kB)`);
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
