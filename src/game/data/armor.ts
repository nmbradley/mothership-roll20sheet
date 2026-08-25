export type Armor = {
  name: string;
  points: string;
  description: string;
};

export const armor: Armor[] = [
  {
    name: "Standard Crew Attire",
    points: "1",
    description:
      "Standard Aava Technology Crew Attire. Armor Points: 1. Coveralls and leather jackets. Basic clothing assumed to be worn by all crew members.",
  },
  {
    name: "Vaccsuit",
    points: "3",
    description:
      "Valecore Mk2 Vaccsuit. Armor Points: 3. Basic suit worn while operating in space. Heavy: Speed Checks at [-]. Includes Headlamp x2, Short-Range Comms, and Oxygen Supply (can be fitted with an Oxygen Tank for up to 12 hours of oxygen under normal circumstances, 4 hours under stressful circumstances. Explosive).",
  },
  {
    name: "Hazard Suit",
    points: "5",
    description:
      "Aava Tech V-Path 2 Hazard Suit. Armor Points: 5. Designed for planetary exploration and examination. Includes Air Filter (allows breathing in most toxic environments and atmospheres), Oxygen Supply (stores up to 1 hour of O2), Hydro Reclamation (1 liter of water lasts for 4 days), Environmental Protection (protects against extreme heat and cold), Radiation Shielding, Headlamp, and Short-Range Comms.",
  },
  {
    name: "Standard Battle Dress",
    points: "7",
    description:
      "Carter Tactical Standard Battle Dress. Armor Points: 7. Light plated armor. Standard dress for all marines or combat mercenaries. Includes Short-Range Comms.",
  },
  {
    name: "Advanced Battle Dress",
    points: "10",
    description:
      "Armadyne “Heavy-K” Advanced Battle Dress. Armor Points: 10. Combat heavy attire for offworld engagements. Heavy: Speed Checks at [-]. Damage Reduction: 3. Includes Heads-Up Display (HUD), Body Cam, Radiation Shielding, Short-Range Comms, and Exoskeletal Weave (grants [+] to Strength Checks).",
  },
];
