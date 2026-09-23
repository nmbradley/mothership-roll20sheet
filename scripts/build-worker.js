import * as esbuild from "esbuild";
import path from "path";

/** Where the bundled sheetworkers land before being inlined into the sheet. */
export const WORKER_BUNDLE = "dist/worker.js";

/** Bundles the sheetworkers for Roll20's `<script type="text/worker">` sandbox. */
export async function buildWorker() {
  await esbuild.build({
    entryPoints: ["src/ts/index.ts"],
    bundle: true,
    outfile: path.resolve(WORKER_BUNDLE),
    format: "iife",
    target: "es2020",
    platform: "browser",
  });
}
