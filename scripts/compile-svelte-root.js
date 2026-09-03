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
 * Puts every tag back on one line.
 *
 * Prettier wraps long tags across lines, so an element with several attributes
 * comes out as `<charmancer\n  class="..."\n>`. That is valid HTML and every
 * real parser accepts it -- but Roll20's sheet pipeline is not a real parser
 * everywhere it looks, and anything scanning for a literal tag string misses
 * the split form. It bit the closing tags first (an element after a split
 * `</label\n>` ends up nested inside the one that should have closed), and
 * opening tags carry the same risk.
 *
 * Whitespace between attributes is insignificant, and whitespace *inside* an
 * attribute value is preserved here, so collapsing changes the rendered
 * markup for nobody -- it only removes a shape a lenient parser can trip on.
 *
 * Written as a scanner rather than a regex because an attribute value may
 * legitimately contain `<` or `>` -- the skill query is `?{Apply Skill?|...}`
 * today, and a roll expression could hold either -- and a regex that ends a
 * tag at the first `>` would truncate one.
 */
function collapseTags(html) {
  let out = "";
  let index = 0;

  while (index < html.length) {
    const open = html.indexOf("<", index);
    if (open === -1) {
      out += html.slice(index);
      break;
    }

    out += html.slice(index, open);

    // Comments are copied through untouched: their content is not markup and
    // may hold anything, including quotes and angle brackets.
    if (html.startsWith("<!--", open)) {
      const end = html.indexOf("-->", open);
      const stop = end === -1 ? html.length : end + 3;
      out += html.slice(open, stop);
      index = stop;
      continue;
    }

    const close = findTagEnd(html, open);
    if (close === -1) {
      out += html.slice(open);
      break;
    }

    out += collapseInsideTag(html.slice(open, close + 1));
    index = close + 1;
  }

  return out;
}

/** The index of the `>` that ends the tag opening at `start`, quotes respected. */
function findTagEnd(html, start) {
  let quote = null;

  for (let i = start + 1; i < html.length; i += 1) {
    const char = html[i];
    if (quote !== null) {
      if (char === quote) quote = null;
      continue;
    }
    if (char === "\"" || char === "'") {
      quote = char;
      continue;
    }
    if (char === ">") return i;
  }

  return -1;
}

/** One tag with every run of whitespace outside its attribute values collapsed. */
function collapseInsideTag(tag) {
  let out = "";
  let quote = null;
  let pendingSpace = false;

  for (const char of tag) {
    if (quote !== null) {
      out += char;
      if (char === quote) quote = null;
      continue;
    }

    if (char === "\"" || char === "'") {
      if (pendingSpace) out += " ";
      pendingSpace = false;
      quote = char;
      out += char;
      continue;
    }

    if (/\s/.test(char)) {
      pendingSpace = out !== "<";
      continue;
    }

    // A space before `>` or `/>` is what splits a tag in the first place.
    if (pendingSpace && char !== ">" && char !== "/") out += " ";
    pendingSpace = false;
    out += char;
  }

  return out;
}

/** Renders one component tree to formatted static HTML. */
async function renderComponent(Component) {
  const result = render(Component, { props: {} });
  const rawHtml = result.html || result.body || result;

  // Stripped before formatting so Prettier closes up the gaps they leave behind.
  const markup = stripHydrationMarkers(rawHtml);
  const formatted = await prettier.format(markup, { parser: "html" });
  return collapseTags(formatted).trimEnd();
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
