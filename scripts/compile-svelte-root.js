import { render } from "svelte/server";
import Sheet from "../src/svelte/Sheet.svelte";
import fs from "fs";
import path from "path";
import prettier from "prettier";

// Render the root Svelte component to HTML and CSS
const result = render(Sheet, { props: {} });

// Ensure we just grab the raw HTML string
const rawHtml = result.html || result.body || result;
const formattedHtml = await prettier.format(rawHtml, { parser: "html" });

fs.writeFileSync(path.resolve(process.cwd(), "mothership.html"), formattedHtml);
console.log("✅ Successfully built mothership.html using Svelte!");

// Extract CSS from the SSR render and write it to mothership.css
const css = result.css && result.css.code ? result.css.code : (result.css?.code || result.css || "");
const formattedCss = await prettier.format(css, { parser: "css" });

fs.writeFileSync(path.resolve(process.cwd(), "mothership.css"), formattedCss);
console.log("✅ Successfully built mothership.css using Svelte!");
