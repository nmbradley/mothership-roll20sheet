export interface ShipUpgrade {
  name: string;
  cost: string;
  inst: string;
  description: string;
}

export const minorUpgrades: ShipUpgrade[] = [
  {
    name: "Agar Cushioning",
    cost: "600kcr",
    inst: "2 wks.",
    description: "Upgraded cryopods which cut Cryosickness from 1 week to 1d10 hours. Stats & Saves don’t begin to deteriorate while in cryosleep until ten years have passed, and then only half as much.",
  },
  {
    name: "Comms Jammer",
    cost: "450kcr",
    inst: "1 wk.",
    description: "Systems Check (Firing Range): Allows for communication jamming and eavesdropping.",
  },
  {
    name: "Contraband Hold",
    cost: "40kcr",
    inst: "1 mo.",
    description: "Small hidden Cargo Bay. Very hard for boarding parties to detect.",
  },
  {
    name: "Cosmetic Remodel",
    cost: "100kcr+",
    inst: "1+ mos.",
    description: "Upgrade in appearance to the ship’s interior including paint, furnishings, and other decorations.",
  },
  {
    name: "Cryochamber",
    cost: "250kcr",
    inst: "2 wks.",
    description: "Increase the number of cryopods by up to 24 per Ship Class (ex: Class-III could have up to 72).",
  },
  {
    name: "Dedicated Reactor",
    cost: "450kcr",
    inst: "1 mo.",
    description: "Grants +10 Systems.",
  },
  {
    name: "Deep Space Scanners",
    cost: "1mcr",
    inst: "2 wks.",
    description: "Increases the range of all detection abilities by 1 Range Band (i.e. what you used to be able to scan at Contact range you can now scan at firing range, etc.).",
  },
  {
    name: "Emergency Systems",
    cost: "1mcr",
    inst: "1 mo.",
    description: "Grants 1 month of emergency power and Life Support. Must be replaced after use.",
  },
  {
    name: "Expanded Fuel Bay",
    cost: "750kcr",
    inst: "3 wks.",
    description: "Increases maximum fuel capacity by 12.",
  },
  {
    name: "Habitat Module",
    cost: "350kcr",
    inst: "1 mo.",
    description: "Increases maximum crew capacity by up to 24 per Ship Class (ex: Class-IV could have up to 96).",
  },
  {
    name: "Machine Shop",
    cost: "750kcr",
    inst: "3 wks.",
    description: "Allows users to repair up to 3 MDMG and 3 Hull without returning to port. Resupply for 200kcr.",
  },
  {
    name: "Medbay",
    cost: "250kcr",
    inst: "3 wks.",
    description: "Rest Saves aboard the ship are at [+], other medical treatments available at Warden’s discretion.",
  },
  {
    name: "Reinforced Plating",
    cost: "2mcr",
    inst: "1 mo.",
    description: "Increases Maximum Hull to 1.",
  },
  {
    name: "Science Lab",
    cost: "300kcr",
    inst: "3 wks.",
    description: "Allows for detailed research, study, testing, and experimentation of samples.",
  },
];

export const majorUpgrades: ShipUpgrade[] = [
  {
    name: "Adaptive Armor",
    cost: "10mcr",
    inst: "1 mo.",
    description: "Increases Maximum Hull to 2.",
  },
  {
    name: "Enhanced A.I.",
    cost: "10mcr",
    inst: "1 wk.",
    description: "Grants +15 Systems.",
  },
  {
    name: "Expanded Frame",
    cost: "20mcr",
    inst: "2 mo.",
    description: "Structural alterations. Grants +5 Upgrades.",
  },
  {
    name: "Hangar/Dronebay",
    cost: "1mcr",
    inst: "1 mo.",
    description: "Allows for the storage and maintenance of 4 Class-0 Vessels.",
  },
  {
    name: "Hardpoint",
    cost: "2mcr",
    inst: "2 wks.",
    description: "Grants +1 Hardpoint. Each additional Hardpoint costs 3x the previous.",
  },
  {
    name: "Improved Radiators",
    cost: "3mcr",
    inst: "3 wks.",
    description: "Grants +15 Thrusters.",
  },
  {
    name: "Increased MDMG Output",
    cost: "25mcr",
    inst: "1 mo.",
    description: "Improves Megadamage output from 1 to 1d5, or from 1d5 to a max of 1d10 MDMG.",
  },
  {
    name: "Jump-1 Drive",
    cost: "5mcr",
    inst: "1 mo.",
    description: "Standard commercial Jump Drive. Allows for Jump-1 travel.",
  },
  {
    name: "Jump-2 Drive",
    cost: "20mcr",
    inst: "2 mo.",
    description: "Standard military Jump Drive. Allows for Jump-2 travel.",
  },
  {
    name: "Jump-3 Drive",
    cost: "40mcr",
    inst: "3 mo.",
    description: "Long range, cutting edge Jump Drive. Allows for Jump-3 travel.",
  },
  {
    name: "Jump-4+ Drive",
    cost: "???",
    inst: "???",
    description: "Highly experimental Jump Drives. Not available on the open market.",
  },
  {
    name: "Redundant Systems",
    cost: "5mcr",
    inst: "1 mo.",
    description: "Allows ship to ignore any one Megadamage roll. Must be replaced after use.",
  },
  {
    name: "Signature Reduction",
    cost: "35mcr",
    inst: "1 mo.",
    description: "While activated, your ship is only detectable with a successful Systems Check [-] at Firing Range. Double fuel costs/travel times while in use. Does not work in Core Space.",
  },
  {
    name: "Streamlined Fuel Injectors",
    cost: "50mcr",
    inst: "1 mo.",
    description: "1 Fuel lasts for 2 months of space travel. In the movement phase, bidding 1 Fuel also counts as bidding 2 Fuel.",
  },
  {
    name: "System Overhaul",
    cost: "20mcr",
    inst: "3 mo.",
    description: "Wide ranging upgrade to the ship’s hull and systems. Increase Ship Class by 1.",
  },
  {
    name: "Targeting Sensors",
    cost: "750kcr",
    inst: "2 wks.",
    description: "Systems Check (Firing Range): Confers [+] to Battle Checks made in ship-to-ship combat.",
  },
];
