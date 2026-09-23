import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import * as esbuild from "esbuild";
import esbuildSvelte from "esbuild-svelte";
import sveltePreprocess from "svelte-preprocess";
import {
  describe, it, expect,
} from "vitest";

import { stripStyles } from "../scripts/build-scss.js";
import {
  shipAttributes,
  shipCrew,
  shipLoadout,
  shipUpgrades,
  shipWeapons,
} from "../src/game/fields/shipFields";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SHIP_SHEET = path.resolve(__dirname, "../src/svelte/ShipSheet.svelte");

/** Renders `ShipSheet.svelte` to static HTML the way `build-svelte.js` does. */
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

/** `name` plus its companion `name_max`, for attributes seeded with `max`. */
function withMaxCompanion(field: {
  name: string;
  max?: number;
}): string[] {
  return field.max === undefined ? [field.name] : [field.name, `${field.name}_max`];
}

const sharedControlNames = ["settings_toggle"];

const validAttributeNames = new Set([
  ...Object.values(shipAttributes).flatMap(withMaxCompanion),
  ...Object.keys(shipWeapons.attributes),
  ...Object.keys(shipCrew.attributes),
  ...Object.keys(shipLoadout.attributes),
  ...Object.keys(shipUpgrades.attributes),
  ...sharedControlNames,
]);

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
    shipAttributes.ship_crew,
    shipAttributes.ship_upgrades,
    shipAttributes.ship_cargo,
    shipAttributes.ship_minor_repairs,
    shipAttributes.ship_major_repairs,
  ].flatMap(withMaxCompanion),
  ...Object.keys(shipWeapons.attributes),
  ...Object.keys(shipCrew.attributes),
  ...Object.keys(shipUpgrades.attributes),
]);

describe("ShipSheet render (svelte/server)", () => {
  it("renders no attr_* name outside shipFields.ts", async () => {
    const html = await renderShipSheet();
    const rendered = renderedAttributeNames(html);

    for (const name of rendered) {
      expect(validAttributeNames.has(name)).toBe(true);
    }
  }, 30000);

  it("renders every field the ship sheet owns", async () => {
    const html = await renderShipSheet();
    const rendered = renderedAttributeNames(html);

    for (const name of ownedAttributeNames) {
      expect(rendered.has(name)).toBe(true);
    }
  }, 30000);
});
