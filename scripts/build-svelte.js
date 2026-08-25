import * as esbuild from "esbuild";
import esbuildSvelte from "esbuild-svelte";
import { execSync } from "child_process";
import path from "path";

async function build() {
  console.log("⚙️ Compiling Svelte components via esbuild...");

  // Bundle our compile.js wrapper which renders the Svelte tree
  await esbuild.build({
    entryPoints: ["scripts/compile-svelte-root.js"],
    bundle: true,
    outfile: "dist/compile-ssr.js",
    format: "cjs",
    platform: "node",
    plugins: [
      esbuildSvelte({ compilerOptions: { generate: "server" } }),
    ],
  });

  console.log("🚀 Generating static HTML...");
  execSync("node dist/compile-ssr.js", { stdio: "inherit" });
}

build().catch(console.error);
