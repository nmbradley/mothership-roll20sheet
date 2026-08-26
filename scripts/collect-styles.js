import fs from "fs";
import path from "path";

const STYLE_BLOCK = /<style[^>]*>([\s\S]*?)<\/style>/;
const COMPONENT_ROOT = "src/svelte";

/**
 * Strips the style block out of a component before Svelte sees it.
 *
 * The stylesheet is built by compiling every component's SCSS as one Sass
 * document (see collectComponentStyles), which is what lets `@extend` group
 * selectors across components instead of duplicating a generic into each one.
 * Removing the block here means Svelte emits no CSS and adds no `svelte-<hash>`
 * class to the markup, so components rely on BEM for isolation.
 */
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

/**
 * Concatenates every component's SCSS into one document.
 *
 * Components do not write `@use`: Sass requires those at the top of a file, and
 * the combined document provides the tokens and generics ambiently. Paths are
 * sorted so the cascade is stable between builds, and each block is labelled so
 * a Sass error can be traced back to its component.
 */
export function collectComponentStyles() {
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
