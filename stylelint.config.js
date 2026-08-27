// Property ordering follows the 9elements pattern:
// https://9elements.com/css-rule-order/
//
// Declarations run from most to least structural: what the browser needs to
// place a box comes before what it needs to paint one. Groups are separated by a
// blank line once a rule is long enough for that to help.

const generatedContent = ["content"];

const positionAndLayout = [
  "display",
  "position",
  "z-index",
  "inset",
  "top",
  "right",
  "bottom",
  "left",
  "flex",
  "flex-basis",
  "flex-direction",
  "flex-flow",
  "flex-grow",
  "flex-shrink",
  "flex-wrap",
  "grid",
  "grid-area",
  "grid-template",
  "grid-template-areas",
  "grid-template-columns",
  "grid-template-rows",
  "grid-auto-columns",
  "grid-auto-flow",
  "grid-auto-rows",
  "grid-column",
  "grid-row",
  "gap",
  "row-gap",
  "column-gap",
  "align-content",
  "align-items",
  "align-self",
  "justify-content",
  "justify-items",
  "justify-self",
  "place-content",
  "place-items",
  "place-self",
  "order",
  "float",
  "clear",
];

const displayAndVisibility = [
  "visibility",
  "opacity",
  "transform",
  "transform-origin",
  "backface-visibility",
  "perspective",
];

const clipping = ["overflow", "overflow-x", "overflow-y", "clip", "clip-path"];

const animation = [
  "animation",
  "animation-delay",
  "animation-duration",
  "animation-name",
  "animation-timing-function",
  "transition",
  "transition-delay",
  "transition-duration",
  "transition-property",
  "transition-timing-function",
  "will-change",
];

// Box model, from the outside in.
const boxModel = [
  "margin",
  "margin-block",
  "margin-inline",
  "margin-top",
  "margin-right",
  "margin-bottom",
  "margin-left",
  "box-shadow",
  "border",
  "border-width",
  "border-style",
  "border-color",
  "border-top",
  "border-right",
  "border-bottom",
  "border-left",
  "border-radius",
  "border-top-left-radius",
  "border-top-right-radius",
  "border-bottom-right-radius",
  "border-bottom-left-radius",
  "outline",
  "outline-offset",
  "box-sizing",
  "width",
  "min-width",
  "max-width",
  "height",
  "min-height",
  "max-height",
  "padding",
  "padding-block",
  "padding-inline",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
];

const background = [
  "background",
  "background-color",
  "background-image",
  "background-position",
  "background-repeat",
  "background-size",
  "accent-color",
  "cursor",
];

const typography = [
  "font",
  "font-size",
  "line-height",
  "font-family",
  "font-weight",
  "font-style",
  "font-variant",
  "text-align",
  "text-decoration",
  "text-transform",
  "text-overflow",
  "letter-spacing",
  "word-spacing",
  "white-space",
  "vertical-align",
  "list-style",
  "color",
];

/** Wraps a property list as an ordered stylelint group. */
function group(groupName, properties) {
  return {
    groupName,
    emptyLineBefore: "always",
    noEmptyLineBetween: true,
    properties,
  };
}

export default {
  // Build artifacts, not sources: mothership.css is generated from the blocks
  // linted here, so flagging it would report every finding twice.
  ignoreFiles: ["mothership.css", "mothership.html", "dist/**"],

  plugins: ["stylelint-order"],
  rules: {
    // Class names are already global here (see scripts/collect-styles.js):
    // Svelte never scopes or compiles these components' styles, so
    // `:global(...)` survives verbatim into mothership.css, where it is not
    // valid CSS and the browser drops the whole rule. Nest the plain
    // selector instead.
    "selector-pseudo-class-disallowed-list": ["global"],

    // Sass inheritance first, then custom properties, declarations, nested rules.
    "order/order": [
      {
        type: "at-rule",
        name: "extend",
      },
      {
        type: "at-rule",
        name: "include",
      },
      "dollar-variables",
      "custom-properties",
      "declarations",
      "rules",
      "at-rules",
    ],
    "order/properties-order": [
      [
        group("generated content", generatedContent),
        group("position and layout", positionAndLayout),
        group("display and visibility", displayAndVisibility),
        group("clipping", clipping),
        group("animation", animation),
        group("box model", boxModel),
        group("background", background),
        group("typography", typography),
      ],
      {
        unspecified: "bottomAlphabetical",
      },
    ],
  },
  overrides: [
    {
      files: ["**/*.scss"],
      customSyntax: "postcss-scss",
    },
    {
      files: ["**/*.svelte"],
      customSyntax: "postcss-html",
    },
  ],
};
