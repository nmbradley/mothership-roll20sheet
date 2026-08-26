import { sveltePreprocess } from "svelte-preprocess";

// Editor-facing config. esbuild-svelte is handed its own preprocessors in
// scripts/build-svelte.js and never reads this file, so nothing here can change
// what ships.
export default {
  // The build concatenates every component's <style> into a single Sass
  // document that loads the generics once, which is what lets `@extend
  // %ms-btn-reset` resolve -- and what lets one generic extended from several
  // components emit one grouped rule. The language server has no such document:
  // it compiles each block alone, where the placeholder does not exist and Sass
  // reports "target selector was not found". Handing each block the same
  // generics keeps the editor honest without changing the output.
  preprocess: sveltePreprocess({
    scss: {
      prependData: "@use \"generics\" as *;",
      includePaths: ["src/svelte/styles"],
    },
  }),

  // The build strips every <style> block before Svelte compiles (see
  // scripts/collect-styles.js), so Svelte never scopes anything and its CSS
  // analysis does not apply. Base rules deliberately live in a dispatcher
  // component while the elements they style live in its leaves, which the
  // compiler reports as unused selectors.
  warningFilter: (warning) => warning.code !== "css_unused_selector",
};
