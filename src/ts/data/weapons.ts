export interface Weapon {
  name: string;
  cost: string;
  range: string;
  damage: string;
  shots: string;
  wound: string;
  special: string;
}

export const weapons: Weapon[] = [
  {
    name: "F20 “Arbiter” Pulse Rifle",
    cost: "2.4kcr",
    range: "Long Range",
    damage: "3d10 DMG",
    shots: "5",
    wound: "Gunshot",
    special: "",
  },
  {
    name: "SK 109 Seeker Smart Rifle",
    cost: "5kcr",
    range: "Extreme Range",
    damage: "4d10 DMG (Anti-Armor)",
    shots: "3",
    wound: "Gunshot[+]",
    special: "[-] on Combat Check when fired at Close Range.",
  },
  {
    name: "Kano X9 Combat Shotgun",
    cost: "1.4kcr",
    range: "Close Range",
    damage: "4d10 DMG",
    shots: "4",
    wound: "Gunshot",
    special: "1d10 DMG at Long Range or greater.",
  },
  {
    name: "Arma 29 Submachine Gun",
    cost: "1kcr",
    range: "Long Range",
    damage: "2d10 DMG",
    shots: "5",
    wound: "Gunshot",
    special: "Can be fired one-handed.",
  },
  {
    name: "FN Slug Revolver",
    cost: "750cr",
    range: "Close Range",
    damage: "1d10+1 DMG",
    shots: "6",
    wound: "Gunshot",
    special: "",
  },
  {
    name: "Peabody Flare Gun",
    cost: "25cr",
    range: "Long Range",
    damage: "1d5 DMG",
    shots: "2",
    wound: "Fire/Explosives[-]",
    special: "High intensity flare. Visible day and night.",
  },
  {
    name: "D&C 7 Tranq Pistol",
    cost: "250cr",
    range: "Close Range",
    damage: "1d5 DMG",
    shots: "6",
    wound: "Blunt Force",
    special: "If DMG: Body Save or 1d10 rounds unconscious.",
  },
  {
    name: "MNC Mode A Laser Cutter",
    cost: "1.2kcr",
    range: "Long Range",
    damage: "1d100 DMG",
    shots: "6",
    wound: "Bleeding[+] or Gore[+]",
    special: "Two handed. Heavy. 1 round recharge between shots.",
  },
  {
    name: "HAN-290 Rigging Gun",
    cost: "350cr",
    range: "Close Range",
    damage: "1d10 DMG + 2d10 DMG when removed.",
    shots: "1",
    wound: "Bleeding[+]",
    special: "100m micro-filament. Body Save or become entangled.",
  },
  {
    name: "Ramhorn 1 Flamethrower",
    cost: "4kcr",
    range: "Close Range",
    damage: "2d10 DMG",
    shots: "4",
    wound: "Fire/Explosives[+]",
    special: "Body Save [-] or be set on fire (2d10 DMG / round).",
  },
  {
    name: "Rosco SS6 Nail Gun",
    cost: "150cr",
    range: "Close Range",
    damage: "1d5 DMG",
    shots: "32",
    wound: "Bleeding",
    special: "",
  },
  {
    name: "EVA Mk II Hand Welder",
    cost: "250cr",
    range: "Adjacent",
    damage: "1d10 DMG",
    shots: "∞",
    wound: "Bleeding",
    special: "Can cut through airlock doors.",
  },
  {
    name: "Halls B Series Foam Gun",
    cost: "500cr",
    range: "Close Range (1sqm quick-hardening foam)",
    damage: "1 DMG",
    shots: "3",
    wound: "Blunt Force",
    special: "Body Save or become stuck. Strength Check [-] to escape.",
  },
];
