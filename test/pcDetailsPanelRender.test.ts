import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import * as esbuild from "esbuild";
import esbuildSvelte from "esbuild-svelte";
import sveltePreprocess from "svelte-preprocess";
import {
  describe, it, expect,
} from "vitest";

import { stripStyles } from "../scripts/build-scss.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PC_DETAILS_PANEL = path.resolve(__dirname, "../src/svelte/pc/PCDetailsPanel.svelte");

/** Renders `PCDetailsPanel.svelte` to static HTML the way `build-svelte.js` does. */
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
