import {
  handleAnnualMaintenanceCheck,
  handleBankruptcySave,
  handleBattleCheck,
  handleSystemsCheck,
  handleThrustersCheck,
} from "./rules/ships";
import { incrementHighScore } from "./rules/stats";

on("clicked:increment_score", incrementHighScore);
on("clicked:annual_maintenance", () => {
  void handleAnnualMaintenanceCheck();
});
on("clicked:bankruptcy_save", () => {
  void handleBankruptcySave();
});
on("clicked:systems_check", () => {
  void handleSystemsCheck();
});
on("clicked:thrusters_check", () => {
  void handleThrustersCheck();
});
on("clicked:battle_check", () => {
  void handleBattleCheck();
});
