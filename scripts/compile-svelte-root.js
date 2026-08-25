import { render } from "svelte/server";
import Sheet from "../src/svelte/Sheet.svelte";
import fs from "fs";
import path from "path";

// Render the root Svelte component to HTML and CSS
const result = render(Sheet, { props: {} });

// Ensure we just grab the raw HTML string and strip Svelte SSR hydration markers
const rawHtml = result.html || result.body || result;
const html = typeof rawHtml === "string" ? rawHtml.replace(/<!--[^a-zA-Z0-9]*-->/g, "") : rawHtml;

fs.writeFileSync(path.resolve(process.cwd(), "mothership.html"), html);
console.log("✅ Successfully built mothership.html using Svelte!");

// Extract CSS from the SSR render and write it to mothership.css
const css = result.css && result.css.code ? result.css.code : (result.css?.code || result.css || "");

fs.writeFileSync(path.resolve(process.cwd(), "mothership.css"), css);
console.log("✅ Successfully built mothership.css using Svelte!");
