import { render } from "svelte/server";
import Sheet from "../src/svelte/Sheet.svelte";
import Charactermancer from "../src/svelte/charactermancer/Charactermancer.svelte";
import fs from "fs";
import path from "path";
import prettier from "prettier";

import { WORKER_BUNDLE } from "./build-worker.js";

const ROLLTEMPLATE_DIR = "src/rolltemplates";

/**
 * Reads the roll templates as authored.
 *
 * They are plain HTML rather than components because Roll20's `{{...}}` syntax
 * collides with Svelte's own: `{{#name}}` is a compile error, and the rest would
 * need every brace escaped as an entity. They also carry no reactivity, existing
 * only to be serialised as text for Roll20 to interpret at runtime.
 */
function readRollTemplates() {
  const files = fs.readdirSync(ROLLTEMPLATE_DIR)
    .filter((file) => file.endsWith(".html"))
    .sort();
  const templates = files.map((file) => {
    const contents = fs.readFileSync(path.join(ROLLTEMPLATE_DIR, file), "utf8");
    return contents.trim();
  });
  return templates.join("\n\n");
}

/**
 * Reads the bundled sheetworkers.
 *
 * Roll20 runs whatever sits inside `<script type="text/worker">` in its own
 * sandbox, so the bundle is inlined rather than linked -- the sheet is a single
 * uploaded file with nothing to fetch.
 */
function readWorker() {
  const bundle = fs.readFileSync(WORKER_BUNDLE, "utf8").trim();
  return `<script type="text/worker">\n${bundle}\n</script>`;
}

/**
 * Removes Svelte's hydration markers.
 *
 * `render()` emits `<!--[-->`, `<!--]-->`, `<!---->` and indexed variants like
 * `<!--[-1-->` so the client runtime can find block boundaries when it hydrates.
 * Roll20 never hydrates -- it parses the sheet as static markup -- so all 1300
 * of them are dead weight in a file people have to read and Roll20 has to
 * sanitise. Only these exact forms are matched, so an authored comment would
 * survive.
 */
function stripHydrationMarkers(html) {
  return html.replace(/<!--(\[-?\d*|\])?-->/g, "");
}

/**
 * Rejoins closing tags that Prettier split across lines.
 *
 * At its default whitespace sensitivity Prettier emits `</label\n>` so that a
 * line break never becomes rendered whitespace. It is valid HTML -- a closing
 * tag may hold whitespace before its `>` -- but a parser scanning for the
 * literal `</label>` misses it, and every element after the split tag ends up
 * nested inside the one that should have closed. Whitespace inside a closing
 * tag is insignificant, so rejoining changes the markup for no one but a
 * lenient parser.
 */
function joinSplitClosingTags(html) {
  return html.replace(/<\/([a-zA-Z][a-zA-Z0-9-]*)\s*\n\s*>/g, "</$1>");
}

/** Renders one component tree to formatted static HTML. */
async function renderComponent(Component) {
  const result = render(Component, { props: {} });
  const rawHtml = result.html || result.body || result;

  // Stripped before formatting so Prettier closes up the gaps they leave behind.
  const markup = stripHydrationMarkers(rawHtml);
  const formatted = await prettier.format(markup, { parser: "html" });
  return joinSplitClosingTags(formatted).trimEnd();
}

const sheetMarkup = await renderComponent(Sheet);
const charmancerPages = await renderComponent(Charactermancer);

// Document order follows the official Mothership sheet: the sheet, then the
// roll templates, then the charactermancer pages, then the worker. The
// templates and the worker are appended after formatting because Prettier would
// reflow the `{{...}}` blocks and reindent the bundle.
const rollTemplates = readRollTemplates();
const worker = readWorker();
const sheet = [sheetMarkup, rollTemplates, charmancerPages, worker].join("\n\n") + "\n";

fs.writeFileSync(path.resolve(process.cwd(), "mothership.html"), sheet);
console.log("✅ Successfully built mothership.html using Svelte!");
