/**
 *
 */
export function incrementHighScore() {
  const request = ["high_score"];
  getAttrs(request, (response) => {
    const highScore = Number.parseInt(response.high_score) ?? 0;
    const newScore = highScore + 1;
    setAttrs({
      high_score: newScore,
    });
  });
};
