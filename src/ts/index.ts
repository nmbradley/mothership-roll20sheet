import { handleStartingCondition } from "./rules/ships";
import { incrementHighScore } from "./rules/stats";

on("clicked:increment_score", incrementHighScore);
on("clicked:starting_condition", () => {
  void handleStartingCondition();
});
