# CLAUDE.md

Project instructions for this repository. These override default behaviour.

## No comments

Do not write comments. Not explanatory ones, not section headers, not
"why this is here" prose, not TODOs, not commented-out code.

Code carries its meaning in names and structure. If a line needs a comment to be
understood, the line is wrong — rename the value, extract the expression, or
split the function until it reads on its own.

Three exceptions, and only these:

1. **JSDoc on exported symbols.** `jsdoc/require-jsdoc` and
   `jsdoc/require-description` make this mandatory in `src/`. It is one line,
   and `jsdoc/multiline-blocks` enforces that:

   ```ts
   /** Bundles the sheetworkers for Roll20's worker sandbox. */
   export function buildWorker() {
   ```

   One sentence naming what the symbol does. No rationale, no history, no
   second paragraph, no tag list. A block that will not fit on one line under
   the 100-column limit is too wordy, not too constrained.

2. **Tooling directives.** `eslint-disable`, `@ts-expect-error`,
   `stylelint-disable`, `prettier-ignore` and the like are instructions to a
   tool, not commentary. Keep them, including any justification the rule itself
   requires.

3. **Roll20 template syntax.** Anything inside `src/rolltemplates/` that Roll20
   parses is markup, not a comment.

Rationale that would have been a comment belongs in the commit message, the PR
body, or an issue — places that are versioned, searchable, and do not drift out
of sync with the code they describe.

## Formatting

Nothing formats this repository except ESLint (`@stylistic`) and Stylelint.
Prettier is a build dependency only — it formats generated output in
`scripts/`, never source. `.vscode/settings.json` disables every editor
formatter and runs both linters' fixers on save.
