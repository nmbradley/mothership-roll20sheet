import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import * as esbuild from "esbuild";
import esbuildSvelte from "esbuild-svelte";
// Named import resolves to `undefined` under Vitest's CJS interop for this
// package (works fine in build-svelte.js, which runs under plain Node ESM).
import sveltePreprocess from "svelte-preprocess";
import {
  describe, it, expect,
} from "vitest";

import { stripStyles } from "../scripts/collect-styles.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PC_DETAILS_PANEL = path.resolve(__dirname, "../src/svelte/pc/PCDetailsPanel.svelte");

/**
 * Renders `PCDetailsPanel.svelte` to static HTML the same way `build-svelte.js`
 * does: bundle through esbuild-svelte with the SCSS blocks stripped, then run
 * the bundle's `svelte/server` render. Vitest has no Svelte transform of its
 * own, so this is the only way to get real rendered markup rather than
 * inspecting component source by hand.
 */
async function renderPCDetailsPanel(): Promise<string> {
  const entry = `
    import { render } from "svelte/server";
    import PCDetailsPanel from ${JSON.stringify(PC_DETAILS_PANEL)};
    const result = render(PCDetailsPanel, { props: {} });
    export const html = result.html ?? result.body ?? result;
  `;

  const built = await esbuild.build({
    stdin: {
      contents: entry,
      resolveDir: path.dirname(PC_DETAILS_PANEL),
      sourcefile: "pc-details-panel-render-entry.js",
      loader: "js",
    },
    bundle: true,
    write: false,
    format: "esm",
    platform: "node",
    packages: "external",
    plugins: [
      esbuildSvelte({
        preprocess: [stripStyles, sveltePreprocess()],
        compilerOptions: { generate: "server" },
      }),
    ],
  });

  const [outputFile] = built.outputFiles;
  if (!outputFile) {
    throw new Error("esbuild produced no output for the PC details panel render entry");
  }

  // Imported from `dist/` (gitignored) rather than the OS temp dir: Node
  // resolves the bundle's bare `svelte/server` import by walking up from the
  // importing file looking for node_modules, and the OS temp dir sits outside
  // that walk.
  const distDir = path.resolve(__dirname, "../dist");
  fs.mkdirSync(distDir, { recursive: true });
  const tempFile = path.join(distDir, `.pc-details-panel-render-${process.pid}-${Date.now()}.mjs`);
  fs.writeFileSync(tempFile, outputFile.text);
  try {
    const rendered = await import(pathToFileURL(tempFile).href) as { html: string };
    return rendered.html;
  } finally {
    fs.rmSync(tempFile, { force: true });
  }
}

describe("PCDetailsPanel render (svelte/server)", () => {
  it("gives each attribute wrapper an attribute--{name} modifier", async () => {
    const html = await renderPCDetailsPanel();

    for (const name of ["character_name", "pronouns", "class", "high_score", "trinket", "patch"]) {
      expect(html).toContain(`attribute--${name}`);
    }
  }, 30000);
});
