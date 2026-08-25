import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/ts/index.ts"],
  format: ["cjs"],
  outDir: "src/js",
  clean: true,
});
