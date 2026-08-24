export interface PanicEffect {
  roll: number;
  name: string;
  effect: string;
}

export const panicTable: PanicEffect[] = [
  {
    roll: 1,
    name: "ADRENALINE RUSH",
    effect: "[+] on all rolls for the next 2d10 minutes. Reduce Stress by 1d5.",
  },
  {
    roll: 2,
    name: "NERVOUS",
    effect: "Gain 1 Stress.",
  },
  {
    roll: 3,
    name: "JUMPY",
    effect: "Gain 1 Stress. All Close crewmembers gain 2 Stress.",
  },
  {
    roll: 4,
    name: "OVERWHELMED",
    effect: "[-] on all rolls for the next 1d10 minutes. Increase Minimum Stress by 1.",
  },
  {
    roll: 5,
    name: "COWARD",
    effect: "Gain a new Condition: You must make a Fear Save to engage in violence, otherwise you flee.",
  },
  {
    roll: 6,
    name: "FRIGHTENED",
    effect: "Gain a new Condition: When encountering what frightened you, make a Fear Save [-] or gain 1d5 Stress.",
  },
  {
    roll: 7,
    name: "NIGHTMARES",
    effect: "Gain a new Condition: Sleep is difficult, gain [-] on Rest Saves.",
  },
  {
    roll: 8,
    name: "LOSS OF CONFIDENCE",
    effect: "Gain a new Condition: Choose one Skill and lose that Skill’s bonus.",
  },
  {
    roll: 9,
    name: "DEFLATED",
    effect: "Gain a new Condition: Whenever a Close crewmember fails a Save, gain 1 Stress.",
  },
  {
    roll: 10,
    name: "DOOMED",
    effect: "Gain a new Condition: You feel cursed and unlucky. All Critical Successes are instead Critical Failures.",
  },
  {
    roll: 11,
    name: "SUSPICIOUS",
    effect: "For the next week, whenever someone joins the crew (even if they only left for a short period of time), make a Fear Save or gain 1 Stress.",
  },
  {
    roll: 12,
    name: "HAUNTED",
    effect: "Gain a new Condition: Something starts visiting the character at night. In their dreams. Out of the corner of their eye. And soon it will start making demands.",
  },
  {
    roll: 13,
    name: "DEATH WISH",
    effect: "For the next 24 hours, whenever encountering a stranger or known enemy, make a Sanity Save or immediately attack them.",
  },
  {
    roll: 14,
    name: "PROPHETIC VISION",
    effect: "Character immediately experiences an intense hallucination or vision of an impending terror or horrific event. Increase Minimum Stress by 2.",
  },
  {
    roll: 15,
    name: "CATATONIC",
    effect: "Become unresponsive and unmoving for 2d10 minutes. Reduce Stress by 1d10.",
  },
  {
    roll: 16,
    name: "RAGE",
    effect: "[+] on all Damage rolls for the next 1d10 hours. All crewmembers gain 1 Stress.",
  },
  {
    roll: 17,
    name: "SPIRALING",
    effect: "Gain a new Condition: Panic Checks are at [-].",
  },
  {
    roll: 18,
    name: "COMPOUNDING PROBLEMS",
    effect: "Roll twice on this table. Increase your Minimum Stress by 1.",
  },
  {
    roll: 19,
    name: "HEART ATTACK / SHORT CIRCUIT (ANDROIDS)",
    effect: "Reduce Maximum Wounds by 1. Gain [-] on all rolls for 1d10 hours. Increase Minimum Stress by 1.",
  },
  {
    roll: 20,
    name: "RETIRE",
    effect: "Roll up a new character to play.",
  },
];
