import * as esbuild from "esbuild";
import esbuildSvelte from "esbuild-svelte";
import { sveltePreprocess } from "svelte-preprocess";
import { execSync } from "child_process";
import fs from "fs";

import { buildWorker } from "./build-worker.js";
import { buildCss, stripStyles } from "./build-scss.js";

const preprocess = [stripStyles, sveltePreprocess()];

/** Renders the component tree to static HTML. */
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

async function build() {
  console.log("⚙️  Compiling Svelte components via esbuild...");
  if (!fs.existsSync("dist")) fs.mkdirSync("dist", { recursive: true });

  console.log("🔧 Bundling sheetworkers...");
  await buildWorker();

  console.log("🚀 Generating static HTML...");
  await buildHtml();

  console.log("🎨 Generating stylesheet...");
  await buildCss();
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
