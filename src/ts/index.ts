import { incrementHighScore } from "./rules/stats";

on(`clicked:increment_score`, incrementHighScore);
