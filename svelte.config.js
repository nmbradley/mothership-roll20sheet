import { sveltePreprocess } from "svelte-preprocess";

export default {
  preprocess: sveltePreprocess({
    scss: {
      prependData: "@use \"generics\" as *;",
      includePaths: ["src/svelte/styles"],
    },
  }),

  warningFilter: (warning) => warning.code !== "css_unused_selector",
};
