import { defineConfig } from "vitest/config";

// Agent worktrees are created under .claude/worktrees/, inside the repo. Each
// carries a full copy of the tree, so without this vitest collects every
// worktree's tests alongside the real ones -- inflating the count several times
// over and failing on whatever half-finished state a worktree happens to be in.
// The same reasoning puts .claude in the eslint ignore list.
export default defineConfig({
  test: {
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      ".claude/**",
    ],
  },
});
