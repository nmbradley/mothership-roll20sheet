import * as esbuild from "esbuild";
import path from "path";

/** Where the bundled sheetworkers land before being inlined into the sheet. */
export const WORKER_BUNDLE = "dist/worker.js";

/**
 * Bundles the sheetworkers for Roll20's `<script type="text/worker">` sandbox.
 *
 * The sandbox has no module loader, so the output is an IIFE: a CommonJS build
 * would reference `exports` and throw before a single handler registered. The
 * sheetworker globals are ambient rather than imported, so they survive
 * bundling as free variables and resolve inside the sandbox.
 *
 * Left unminified because Roll20's sheet editor is where this gets debugged,
 * and a sourcemap is not an option: an inline one is a `data:` URL, which
 * Roll20's security filter strips.
 */
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
