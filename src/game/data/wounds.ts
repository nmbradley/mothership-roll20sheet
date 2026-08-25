export type WoundEffect = {
  roll: number;
  severity: string;
  blunt: string;
  bleeding: string;
  gunshot: string;
  fire: string;
  gore: string;
};

export const woundsTable: WoundEffect[] = [
  {
    roll: 0,
    severity: "Flesh Wound",
    blunt: "Knocked down. Winded. [-] until you catch your breath.",
    bleeding: "Drop held item. Lots of blood. Those Close gain 1 Stress.",
    gunshot: "Grazed. Knocked down.",
    fire: "Hair burnt. Gain 1d5 Stress.",
    gore: "Vomit. [-] on next action.",
  },
  {
    roll: 1,
    severity: "Flesh Wound",
    blunt: "Sprained Ankle. [-] on Speed Checks.",
    bleeding: "Blood in eyes. [-] until wiped clean.",
    gunshot: "Bleeding +1.",
    fire: "Awesome scar. +1 Minimum Stress.",
    gore: "Awesome scar. +1 Minimum Stress.",
  },
  {
    roll: 2,
    severity: "Minor Injury",
    blunt: "Concussion. [-] on mental tasks.",
    bleeding: "Laceration. Bleeding +1.",
    gunshot: "Broken rib.",
    fire: "Singed. [-] on next action.",
    gore: "Digit mangled.",
  },
  {
    roll: 3,
    severity: "Minor Injury",
    blunt: "Leg or foot broken. [-] on Speed Checks.",
    bleeding: "Major cut. Bleeding +2.",
    gunshot: "Fractured extremity.",
    fire: "Shrapnel/large burn.",
    gore: "Eyes gouged out.",
  },
  {
    roll: 4,
    severity: "Major Injury",
    blunt: "Arm or hand broken. [-] manual tasks.",
    bleeding: "Fingers/toes severed. Bleeding +3.",
    gunshot: "Internal bleeding. Bleeding +2.",
    fire: "Extensive burns. -1d10 Strength.",
    gore: "Ripped off flesh. -1d10 Strength.",
  },
  {
    roll: 5,
    severity: "Major Injury",
    blunt: "Snapped collarbone. [-] on Strength Checks.",
    bleeding: "Hand/foot severed. Bleeding +4.",
    gunshot: "Lodged bullet. Surgery required.",
    fire: "Major Burn. -2d10 Body Save.",
    gore: "Paralyzed waist down.",
  },
  {
    roll: 6,
    severity: "Lethal Injury (Death Save in 1d10 rounds)",
    blunt: "Back broken. [-] on all rolls.",
    bleeding: "Limb severed. Bleeding +5.",
    gunshot: "Gunshot wound to the neck.",
    fire: "Skin grafts required. -2d10 Body Save.",
    gore: "Limb severed. Bleeding +5.",
  },
  {
    roll: 7,
    severity: "Lethal Injury (Death Save in 1d10 rounds)",
    blunt: "Skull fracture. [-] on all rolls.",
    bleeding: "Major artery cut. Bleeding +6.",
    gunshot: "Major blood loss. Bleeding +4.",
    fire: "Limb on fire. 2d10 Damage per round.",
    gore: "Impaled. Bleeding +6.",
  },
  {
    roll: 8,
    severity: "Fatal Injury (Death Save)",
    blunt: "Spine or neck broken. Death Save.",
    bleeding: "Throat slit or heart pierced. Death Save.",
    gunshot: "Sucking chest wound. Bleeding +5.",
    fire: "Body on fire. 3d10 Damage per round.",
    gore: "Guts spooled on floor. Bleeding +7.",
  },
  {
    roll: 9,
    severity: "Fatal Injury (Death Save)",
    blunt: "Spine or neck broken. Death Save.",
    bleeding: "Throat slit or heart pierced. Death Save.",
    gunshot: "Headshot. Death Save.",
    fire: "Engulfed in fiery explosion. Death Save.",
    gore: "Head explodes. No Death Save. You have died.",
  },
];

export type DeathEffect = { roll: string;
  result: string; };

export const deathTable: DeathEffect[] = [
  { roll: "0",
    result: "You are unconscious. You wake up in 2d10 minutes. Reduce your Maximum Health by 1d5." },
  { roll: "1-2",
    result: "You are unconscious and dying. You die in 1d5 rounds without intervention." },
  { roll: "3-4",
    result: "You are comatose. Only extraordinary measures can return you to the waking world." },
  { roll: "5-9",
    result: "You have died. Roll up a new character." },
];
