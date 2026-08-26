import fs from "node:fs";
import os from "node:os";
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
import {
  shipAttributes,
  shipCrew,
  shipLoadout,
  shipUpgrades,
  shipWeapons,
} from "../src/game/fields/shipFields";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SHIP_SHEET = path.resolve(__dirname, "../src/svelte/ShipSheet.svelte");

/**
 * Renders `ShipSheet.svelte` to static HTML the same way `build-svelte.js`
 * does: bundle through esbuild-svelte with the SCSS blocks stripped, then run
 * the bundle's `svelte/server` render. Vitest has no Svelte transform of its
 * own, so this is the only way to get real rendered markup rather than
 * inspecting component source by hand.
 */
async function renderShipSheet(): Promise<string> {
  const entry = `
    import { render } from "svelte/server";
    import ShipSheet from ${JSON.stringify(SHIP_SHEET)};
    const result = render(ShipSheet, { props: {} });
    export const html = result.html ?? result.body ?? result;
  `;

  const built = await esbuild.build({
    stdin: {
      contents: entry,
      resolveDir: path.dirname(SHIP_SHEET),
      sourcefile: "ship-sheet-render-entry.js",
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
    throw new Error("esbuild produced no output for the ship sheet render entry");
  }

  // Imported from `dist/` (gitignored) rather than the OS temp dir: Node
  // resolves the bundle's bare `svelte/server` import by walking up from the
  // importing file looking for node_modules, and the OS temp dir sits outside
  // that walk.
  const distDir = path.resolve(__dirname, "../dist");
  fs.mkdirSync(distDir, { recursive: true });
  const tempFile = path.join(distDir, `.ship-sheet-render-${process.pid}-${Date.now()}.mjs`);
  fs.writeFileSync(tempFile, outputFile.text);
  try {
    const rendered = await import(pathToFileURL(tempFile).href) as { html: string };
    return rendered.html;
  } finally {
    fs.rmSync(tempFile, { force: true });
  }
}

/** Every `name="attr_..."` the rendered markup declares, without the prefix. */
function renderedAttributeNames(html: string): Set<string> {
  const matches = [...html.matchAll(/name="attr_([a-z0-9_]+)"/g)];
  return new Set(matches.map((match) => match[1]));
}

/** `name` plus its companion `name_max`, for attributes {@link attribute} seeded with `max`. */
function withMaxCompanion(field: {
  name: string;
  max?: number;
}): string[] {
  return field.max === undefined ? [field.name] : [field.name, `${field.name}_max`];
}

// Every attr_* name the whole ship sheet may legitimately render: shipAttributes'
// companion _max inputs plus every repeating section's row fields. Crew,
// Upgrades and the Manifest trackers (#87) and the ship_npc setting are
// declared here but not required to be rendered yet -- this set only bounds
// what's *allowed*, drift-checking is done against the fields these two
// issues actually own, in `ownedAttributeNames` below.
const validAttributeNames = new Set([
  ...Object.values(shipAttributes).flatMap(withMaxCompanion),
  ...Object.keys(shipWeapons.attributes),
  ...Object.keys(shipCrew.attributes),
  ...Object.keys(shipLoadout.attributes),
  ...Object.keys(shipUpgrades.attributes),
]);

// The fields #85 and #86 put on the sheet: #58 sections 1-6 (Transponder,
// Stats & Saves, Engines, Survival, Weapons, MegaDamage Track & Hull). Crew
// (7) and Status/Manifest (8) are #87's.
const ownedAttributeNames = new Set([
  ...[
    shipAttributes.ship_name,
    shipAttributes.ship_captain,
    shipAttributes.ship_transponder,
    shipAttributes.ship_systems,
    shipAttributes.ship_thrusters,
    shipAttributes.ship_battle,
    shipAttributes.ship_bankruptcy_save,
    shipAttributes.ship_fuel,
    shipAttributes.ship_fuel_bid,
    shipAttributes.ship_warp_cores,
    shipAttributes.ship_o2,
    shipAttributes.ship_cryopods,
    shipAttributes.ship_escape_pods,
    shipAttributes.ship_weapons_base,
    shipAttributes.ship_weapons_total,
    shipAttributes.ship_mdmg_base,
    shipAttributes.ship_mdmg_total,
    shipAttributes.ship_hardpoints,
    shipAttributes.ship_mdmg,
    shipAttributes.ship_hull,
  ].flatMap(withMaxCompanion),
  ...Object.keys(shipWeapons.attributes),
]);

describe("ShipSheet render (svelte/server)", () => {
  it("renders no attr_* name outside shipFields.ts", async () => {
    const html = await renderShipSheet();
    const rendered = renderedAttributeNames(html);

    for (const name of rendered) {
      expect(validAttributeNames.has(name)).toBe(true);
    }
  }, 30000);

  it("renders every field #85 and #86 put on the sheet", async () => {
    const html = await renderShipSheet();
    const rendered = renderedAttributeNames(html);

    for (const name of ownedAttributeNames) {
      expect(rendered.has(name)).toBe(true);
    }
  }, 30000);
});
