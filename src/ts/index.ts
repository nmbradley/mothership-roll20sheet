import { incrementHighScore } from "./rules/stats";
import {
  handleAnnualMaintenanceCheck,
  handleBankruptcySave,
  handleSystemsCheck,
  handleThrustersCheck,
  handleBattleCheck,
} from "./rules/ships";

on("clicked:increment_score", incrementHighScore);
on("clicked:annual_maintenance", handleAnnualMaintenanceCheck);
on("clicked:bankruptcy_save", handleBankruptcySave);
on("clicked:systems_check", handleSystemsCheck);
on("clicked:thrusters_check", handleThrustersCheck);
on("clicked:battle_check", handleBattleCheck);
