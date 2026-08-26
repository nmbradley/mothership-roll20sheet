import stylistic from "@stylistic/eslint-plugin";
import importX from "eslint-plugin-import-x";
import jsdoc from "eslint-plugin-jsdoc";
import tseslint from "typescript-eslint";
import sveltePlugin from "eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";

import svelteConfig from "./svelte.config.js";

const CASTS = ":matches(TSAsExpression, TSNonNullExpression, TSSatisfiesExpression)";
// `x as unknown as T` nests two cast nodes, so each guarded position needs both depths.
const CASTS_2 = `${CASTS} > ${CASTS}`;

const NO_NESTED_CALLS = [
  {
    selector: "CallExpression > CallExpression",
    message: "No nested calls. Bind the inner call to a named value first.",
  },
  {
    selector: "IfStatement > CallExpression",
    message: "No call in a condition. Bind it to a named value first.",
  },
  {
    selector: "WhileStatement > CallExpression",
    message: "No call in a condition. Bind it to a named value first.",
  },
  {
    selector: "ReturnStatement > CallExpression",
    message: "No call in a return. Bind it to a named value first.",
  },
  {
    selector: `CallExpression > ${CASTS} > CallExpression`,
    message: "No nested calls. Bind the inner call to a named value first, then cast.",
  },
  {
    selector: `ReturnStatement > ${CASTS} > CallExpression`,
    message: "No call in a return. Bind it to a named value first, then cast.",
  },
  {
    selector: `:matches(IfStatement, WhileStatement) > ${CASTS} > CallExpression`,
    message: "No call in a condition. Bind it to a named value first, then cast.",
  },
  {
    selector: `CallExpression > ${CASTS_2} > CallExpression`,
    message: "No nested calls. Bind the inner call to a named value first, then cast.",
  },
  {
    selector: `ReturnStatement > ${CASTS_2} > CallExpression`,
    message: "No call in a return. Bind it to a named value first, then cast.",
  },
  {
    selector: `:matches(IfStatement, WhileStatement) > ${CASTS_2} > CallExpression`,
    message: "No call in a condition. Bind it to a named value first, then cast.",
  },
  {
    selector: `ArrowFunctionExpression > ${CASTS} > CallExpression`,
    message: "No call under a cast in an arrow body. Use a block and bind it first.",
  },
  {
    selector: `ArrowFunctionExpression > ${CASTS_2} > CallExpression`,
    message: "No call under a cast in an arrow body. Use a block and bind it first.",
  },
];

const NO_CLASSES = [
  {
    selector: "ClassDeclaration",
    message: "Classes are banned. Use a module of functions.",
  },
  {
    selector: "ClassExpression",
    message: "Classes are banned. Use a module of functions.",
  },
  {
    selector: "ThisExpression",
    message: "`this` is banned. Pass values as parameters.",
  },
];

const NO_DOC_CITATIONS = [
  {
    selector: "Literal[value=/ADR ?[0-9]/]",
    message: "Cite no ADR in a name or message. Describe the behaviour; ADRs get superseded.",
  },
  {
    selector: "TemplateElement[value.raw=/ADR ?[0-9]/]",
    message: "Cite no ADR in a name or message. Describe the behaviour; ADRs get superseded.",
  },
  {
    selector: "Literal[value=/#[0-9]/]",
    message: "Do not cite a ticket in a name or message. Describe the behaviour.",
  },
];

const MISC_BANS = [
  {
    selector: "ExportAllDeclaration",
    message: "No `export *`. Re-export by name.",
  },
];

export default tseslint.config(
  { ignores: ["**/dist/**", "**/node_modules/**", "src/js/**", "sources/**", ".claude/**"] },

  ...sveltePlugin.configs["flat/recommended"],

  {
    files: ["**/*.ts", "**/*.js", "**/*.svelte"],
    extends: [tseslint.configs.base, stylistic.configs.customize({
      semi: true,
      quotes: "double",
      indent: 2,
      commaDangle: "always-multiline",
      arrowParens: true,
      braceStyle: "1tbs",
    })],
    plugins: {
      "import-x": importX,
      jsdoc,
    },
    settings: { "import-x/resolver": { typescript: true } },
    rules: {
      "@stylistic/max-len": ["error", {
        code: 100,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      }],
      "@stylistic/operator-linebreak": ["error", "before", { overrides: { "=": "after" } }],
      "@stylistic/object-property-newline": ["error", { allowAllPropertiesOnSameLine: false }],
      "@stylistic/object-curly-newline": ["error", {
        multiline: true,
        minProperties: 3,
        consistent: true,
      }],
    },
  },

  {
    files: ["src/**/*.ts", "src/**/*.svelte"],
    extends: [tseslint.configs.strictTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: [".svelte"],
      },
    },
    rules: {
      "no-restricted-syntax": [
        "error",
        ...NO_CLASSES,
        ...NO_NESTED_CALLS,
        ...NO_DOC_CITATIONS,
        ...MISC_BANS,
      ],
      "no-restricted-properties": [
        "error",
        {
          property: "then",
          message: "No .then() chains. Use async/await.",
        },
      ],
      "no-else-return": ["error", { allowElseIf: false }],
      "no-param-reassign": ["error", { props: true }],

      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/restrict-template-expressions": ["error", { allowNumber: true }],
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { fixStyle: "separate-type-imports" },
      ],
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
        {
          selector: "variable",
          types: ["boolean"],
          format: ["PascalCase"],
          prefix: ["is", "has", "should", "can", "was"],
        },
      ],

      "import-x/no-default-export": "error",
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          patterns: [{
            group: ["../*"],
            message: "No parent-relative imports. Use a #subpath import.",
          }],
        },
      ],
      "import-x/no-unassigned-import": "error",
      "import-x/order": [
        "error",
        {
          "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
          "alphabetize": { order: "asc" },
          "newlines-between": "always",
        },
      ],

      "jsdoc/require-description": "error",
      "jsdoc/require-jsdoc": [
        "error",
        {
          publicOnly: true,
          require: {
            FunctionDeclaration: true,
            ArrowFunctionExpression: true,
            FunctionExpression: true,
          },
        },
      ],
    },
  },

  {
    files: ["**/*.svelte"],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tseslint.parser,
        svelteConfig,
      },
    },
    rules: {
      "import-x/no-default-export": "off",
      "import-x/no-unassigned-import": "off", // Bypassing for Svelte styling imports
      "svelte/valid-compile": "error",
      // Every block is typed/preprocessed: an untagged <script> silently skips
      // the type-aware rules, which is how untyped data slips in.
      "svelte/block-lang": ["error", {
        script: "ts",
        style: "scss",
      }],
      // Roll20 buttons are type="roll" and type="action"; the rule only knows
      // the HTML values, so it rejects every correct sheet button.
      "svelte/button-has-type": "off",
      // Roll20 roll macros are single unbreakable strings in a value attribute,
      // and this sheet keys translations on the English sentence itself, so a
      // data-i18n key can be a full sentence. Neither can be wrapped.
      // `ignoreStrings` does not reach them: the Svelte parser sees markup
      // text rather than a string literal.
      "@stylistic/max-len": ["error", {
        code: 100,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
        ignorePattern: "^\\s*(value=\"&lbrace;|data-i18n=\")",
      }],
      "svelte/require-each-key": "error",
      "svelte/no-dupe-use-directives": "error",
    },
  },
);
