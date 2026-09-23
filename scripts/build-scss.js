import fs from "fs";
import path from "path";
import prettier from "prettier";
import * as sass from "sass";

const STYLE_BLOCK = /<style[^>]*>([\s\S]*?)<\/style>/;
const COMPONENT_ROOT = "src/svelte";

/** Strips the style block out of a component before Svelte sees it. */
export const stripStyles = {
  markup: ({ content }) => ({ code: content.replace(STYLE_BLOCK, "") }),
};

function findComponents(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const found = entries.flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return findComponents(full);
    return entry.name.endsWith(".svelte") ? [full] : [];
  });
  return found;
}

/** Concatenates every component's SCSS into one document. */
function collectComponentStyles() {
  const components = findComponents(COMPONENT_ROOT).sort();
  const blocks = components.flatMap((file) => {
    const source = fs.readFileSync(file, "utf8");
    const match = STYLE_BLOCK.exec(source);
    if (!match) return [];
    const scss = match[1].trim();
    if (!scss) return [];
    return [`// ${file}\n${scss}`];
  });
  return blocks.join("\n\n");
}

/** The sheet's own scope, repeated to carry weight. */
const SHEET_ROOT = ".charsheet.charsheet.charsheet";

/** Reads a style partial as text so it can be nested inside a selector. */
function readPartial(name) {
  const file = path.join("src/svelte/styles", `_${name}.scss`);
  return fs.readFileSync(file, "utf8");
}

/** Writes mothership.css from one Sass document. */
export async function buildCss() {
  const document = [
    "@use \"tokens\";",
    "@use \"generics\" as *;",
    "@use \"unset\";",
    "@use \"rolltemplate\";",
    "",
    `${SHEET_ROOT} {`,
    readPartial("base"),
    collectComponentStyles(),
    "}",
  ].join("\n");

  const result = sass.compileString(document, {
    style: "expanded",
    loadPaths: ["src/svelte/styles"],
    charset: false,
  });

  const formatted = await prettier.format(result.css, { parser: "css" });
  fs.writeFileSync(path.resolve("mothership.css"), formatted);

  const kb = (Buffer.byteLength(formatted) / 1024).toFixed(1);
  console.log(`✅ Successfully built mothership.css using Svelte! (${kb} kB)`);
}
