import { render } from "svelte/server";
import Sheet from "../src/svelte/Sheet.svelte";
import Charactermancer from "../src/svelte/charactermancer/Charactermancer.svelte";
import fs from "fs";
import path from "path";
import prettier from "prettier";

import { WORKER_BUNDLE } from "./build-worker.js";

const ROLLTEMPLATE_DIR = "src/rolltemplates";

/** Reads the roll templates as authored. */
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

/** Reads the bundled sheetworkers. */
function readWorker() {
  const bundle = fs.readFileSync(WORKER_BUNDLE, "utf8").trim();
  return `<script type="text/worker">\n${bundle}\n</script>`;
}

/** Removes Svelte's hydration markers. */
function stripHydrationMarkers(html) {
  return html.replace(/<!--(\[-?\d*|\])?-->/g, "");
}

/** Puts every tag back on one line. */
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

  const markup = stripHydrationMarkers(rawHtml);
  const formatted = await prettier.format(markup, { parser: "html" });
  return collapseTags(formatted).trimEnd();
}

const sheetMarkup = await renderComponent(Sheet);
const charmancerPages = await renderComponent(Charactermancer);

const rollTemplates = readRollTemplates();
const worker = readWorker();
const sheet = [sheetMarkup, rollTemplates, charmancerPages, worker].join("\n\n") + "\n";

fs.writeFileSync(path.resolve(process.cwd(), "mothership.html"), sheet);
console.log("✅ Successfully built mothership.html using Svelte!");
