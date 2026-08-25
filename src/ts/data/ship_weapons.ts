export interface ShipWeapon {
  name: string;
  cost: string;
  bonus: string;
  description: string;
}

export const shipWeapons: ShipWeapon[] = [
  {
    name: "Autocannon",
    cost: "2.5mcr",
    bonus: "+2",
    description: "Kinetic ballistic weaponry.",
  },
  {
    name: "Electronic Countermeasures",
    cost: "5mcr",
    bonus: "+1",
    description: "Confers [-] to enemy ship’s MDMG rolls.",
  },
  {
    name: "Laser Cannon",
    cost: "2mcr",
    bonus: "+1",
    description: "Powerful laser beam used for scrapping hulks and cutting asteroids.",
  },
  {
    name: "Laser Defense System",
    cost: "1.5mcr",
    bonus: "+1",
    description: "Ignore enemy’s MDMG bonus from Missile Launchers. If this is your only weapon, you do not deal MDMG in ship combat (nor does your enemy take exta MDMG from failing Battle Checks).",
  },
  {
    name: "Missile Launcher (Light)",
    cost: "3.6mcr",
    bonus: "+3",
    description: "",
  },
  {
    name: "Missile Launcher (Heavy)",
    cost: "7mcr",
    bonus: "+5",
    description: "Grants +1 MDMG.",
  },
  {
    name: "Particle Beam",
    cost: "3mcr",
    bonus: "+1",
    description: "Enemy must make a Systems Check or increase their Radiation Level by 1.",
  },
  {
    name: "Railgun",
    cost: "6.2mcr",
    bonus: "+2",
    description: "Can be fired at Detection Range.",
  },
];

export interface Class0Vessel {
  name: string;
  cost: string;
  capacity: string;
  travel: string;
  description: string;
}

export const class0Vessels: Class0Vessel[] = [
  {
    name: "Boarding Skiff",
    cost: "20MCR",
    capacity: "12",
    travel: "1 week",
    description: "Can attach to enemy ships when in Contact Range and forcibly insert a boarding party. Enemy may make a Battle Check to resist.",
  },
  {
    name: "Coffin Lander",
    cost: "1MCR",
    capacity: "4",
    travel: "2 years in cryo",
    description: "Planetary landing pod. Has a single-use launcher which can launch the command module back into orbit, but otherwise has no navigation capabilities.",
  },
  {
    name: "Dropship",
    cost: "50MCR",
    capacity: "24 (or 12 if an APC, cargo container, or other vehicle stored)",
    travel: "2 months",
    description: "Planetary insertion vehicle. Has enough room in its hold for a single 20-foot shipping container or APC.",
  },
  {
    name: "Escape Pod",
    cost: "5MCR",
    capacity: "4",
    travel: "40 years in cryo",
    description: "Hard landings (on solid terrain) require a Body Save from all passengers or 1 Wound. Heavy Drop Pod (HDP) upgrade (+7mcr): Carries up to 12, withstands hard landings, and automatically injects a stimpak on landing.",
  },
  {
    name: "Fighter",
    cost: "75MCR",
    capacity: "2",
    travel: "1 week piloted / 6 months in cryo",
    description: "Each Fighter grants its carrier ship +1 Battle (max +10).",
  },
  {
    name: "Utility Pod",
    cost: "2.5MCR",
    capacity: "2",
    travel: "1 month",
    description: "Space repair and service vehicle. Equipped with 2 robotic arms and a Laser Cutter. Not equipped for planetary landing.",
  },
];
