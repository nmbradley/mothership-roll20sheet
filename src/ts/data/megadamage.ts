export interface MegaDamageEffect {
  level: number;
  effect: string;
}

export const megadamageTable: MegaDamageEffect[] = [
  {
    level: 0,
    effect: "ALL SYSTEMS NORMAL. 5x5. Ready to ride.",
  },
  {
    level: 1,
    effect: "EMERGENCY FUEL LEAK. Every time you spend fuel, you spend 1 more.",
  },
  {
    level: 2,
    effect: "WEAPONS OFFLINE. Automatically fail Battle Checks.",
  },
  {
    level: 3,
    effect: "NAVIGATION OFFLINE. Cannot make Thruster Checks. 10% chance all navigation data wiped.",
  },
  {
    level: 4,
    effect: "FIRE ON DECK. Fire spreads throughout the ship, creating a toxic atmosphere (due to smoke inhalation) and a highly corrosive atmosphere (10 DMG/round) for locations on fire (see Toxic & Corrosive Atmospheres, Player’s Survival Guide pg. 32.1 for details).",
  },
  {
    level: 5,
    effect: "HULL BREACH. All aboard make a Body Save or take 1 Wound (Explosion). On a Critical Failure, get violently sucked into space.",
  },
  {
    level: 6,
    effect: "LIFE SUPPORT SYSTEMS OFFLINE. Oxygen limited to 1d10 multiplied by the maximum crew capacity (see Oxygen, Player’s Survival Guide pg. 33.1 for details).",
  },
  {
    level: 7,
    effect: "RADIATION LEAK. Radiation Level increases every 2d10 minutes.",
  },
  {
    level: 8,
    effect: "DEAD IN THE WATER. All systems offline, emergency power only.",
  },
  {
    level: 9,
    effect: "ABANDON SHIP! Ship is destroyed in 1d10 minutes.",
  },
];
