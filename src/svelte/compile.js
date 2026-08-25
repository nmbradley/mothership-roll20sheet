import { render } from 'svelte/server';
import Sheet from './Sheet.svelte';
import fs from 'fs';
import path from 'path';

// Render the root Svelte component to HTML and CSS
const result = render(Sheet, { props: {} });

// Ensure we just grab the raw HTML string
const html = result.html || result.body || result;
const css = result.head || ""; // If scoped CSS gets injected here in Svelte 5 SSR

fs.writeFileSync(path.resolve(process.cwd(), 'mothership.html'), html);
console.log("✅ Successfully built mothership.html using Svelte!");
