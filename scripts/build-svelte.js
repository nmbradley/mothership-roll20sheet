import * as esbuild from "esbuild";
import esbuildSvelte from "esbuild-svelte";
import { sveltePreprocess } from "svelte-preprocess";
import { execSync } from "child_process";
import fs from "fs";

async function build() {
  console.log("⚙️ Compiling Svelte components via esbuild...");

  if (!fs.existsSync("dist")) {
    fs.mkdirSync("dist", { recursive: true });
  }

  // Bundle our compile.js wrapper which renders the Svelte tree
  await esbuild.build({
    entryPoints: ["scripts/compile-svelte-root.js"],
    bundle: true,
    outfile: "dist/compile-ssr.js",
    format: "esm",
    platform: "node",
    packages: "external",
    plugins: [
      esbuildSvelte({
        preprocess: sveltePreprocess(),
        compilerOptions: { generate: "server" },
      }),
    ],
  });

  console.log("🚀 Generating static HTML...");
  execSync("node dist/compile-ssr.js", { stdio: "inherit" });
}

build().catch(console.error);
