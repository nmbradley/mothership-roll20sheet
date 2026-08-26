/**
 * Reads the stored high score and writes it back incremented by one.
 */
export function incrementHighScore() {
  const request = ["high_score"];
  getAttrs(request, (response) => {
    const stored = response.high_score ?? "";
    const parsed = Number.parseInt(stored, 10);
    const highScore = Number.isNaN(parsed) ? 0 : parsed;
    const newScore = highScore + 1;
    setAttrs({ high_score: newScore });
  });
};
