export type LoadoutOption = {
  roll: number;
  items: string[];
};

export type Loadouts = {
  marine: LoadoutOption[];
  android: LoadoutOption[];
  scientist: LoadoutOption[];
  teamster: LoadoutOption[];
};

export const loadouts: Loadouts = {
  marine: [
    {
      roll: 0,
      items: [
        "Tank Top and Camo Pants (AP 1)",
        "Combat Knife (as Scalpel DMG [+])",
        "Stimpak (x5)",
      ],
    },
    {
      roll: 1,
      items: [
        "Advanced Battle Dress (AP 10)",
        "Flamethrower (4 shots)",
        "Boarding Axe",
      ],
    },
    {
      roll: 2,
      items: [
        "Standard Battle Dress (AP 7)",
        "Combat Shotgun (4 rounds)",
        "Rucksack",
        "Camping Gear",
      ],
    },
    {
      roll: 3,
      items: [
        "Standard Battle Dress (AP 7)",
        "Pulse Rifle (3 mags)",
        "Infrared Goggles",
      ],
    },
    {
      roll: 4,
      items: [
        "Standard Battle Dress (AP 7)",
        "Smart Rifle (3 mags)",
        "Binoculars",
        "Personal Locator",
      ],
    },
    {
      roll: 5,
      items: [
        "Standard Battle Dress (AP 7)",
        "SMG (3 mags)",
        "MRE (x7)",
      ],
    },
    {
      roll: 6,
      items: [
        "Fatigues (AP 2)",
        "Combat Shotgun (2 rounds)",
        "Dog (pet)",
        "Leash",
        "Tennis Ball",
      ],
    },
    {
      roll: 7,
      items: [
        "Fatigues (AP 2)",
        "Revolver (12 rounds)",
        "Frag Grenade",
      ],
    },
    {
      roll: 8,
      items: [
        "Dress Uniform (AP 1)",
        "Revolver (1 round)",
        "Challenge Coin",
      ],
    },
    {
      roll: 9,
      items: [
        "Advanced Battle Dress (AP 10)",
        "General-Purpose Machine Gun (1 Can of ammo)",
        "HUD",
      ],
    },
  ],
  android: [
    {
      roll: 0,
      items: [
        "Vaccsuit (AP 3)",
        "Smart Rifle (2 mags)",
        "Infrared Goggles",
        "Mylar Blanket",
      ],
    },
    {
      roll: 1,
      items: [
        "Vaccsuit (AP 3)",
        "Revolver (12 rounds)",
        "Long-range Comms",
        "Satchel",
      ],
    },
    {
      roll: 2,
      items: [
        "Hazard Suit (AP 5)",
        "Revolver (6 rounds)",
        "Defibrillator",
        "First Aid Kit",
        "Flashlight",
      ],
    },
    {
      roll: 3,
      items: [
        "Hazard Suit (AP 5)",
        "Foam Gun (2 charges)",
        "Sample Collection Kit",
        "Screwdriver (as Assorted Tools)",
      ],
    },
    {
      roll: 4,
      items: [
        "Standard Battle Dress (AP 7)",
        "Tranq Pistol (3 shots)",
        "Paracord (100m)",
      ],
    },
    {
      roll: 5,
      items: [
        "Standard Crew Attire (AP 1)",
        "Stun Baton",
        "Small Pet (organic)",
      ],
    },
    {
      roll: 6,
      items: [
        "Standard Crew Attire (AP 1)",
        "Scalpel",
        "Bioscanner",
      ],
    },
    {
      roll: 7,
      items: [
        "Standard Crew Attire (AP 1)",
        "Frag Grenade",
        "Pen Knife",
      ],
    },
    {
      roll: 8,
      items: [
        "Manufacturer Supplied Attire (AP 1)",
        "Jump-9 Ticket (destination blank)",
      ],
    },
    {
      roll: 9,
      items: [
        "Corporate Attire (AP 1)",
        "VIP Corporate Key Card",
      ],
    },
  ],
  scientist: [
    {
      roll: 0,
      items: [
        "Hazard Suit (AP 5)",
        "Tranq Pistol (3 shots)",
        "Bioscanner",
        "Sample Collection Kit",
      ],
    },
    {
      roll: 1,
      items: [
        "Hazard Suit (AP 5)",
        "Flamethrower (1 charge)",
        "Stimpak",
        "Electronic Tool Set",
      ],
    },
    {
      roll: 2,
      items: [
        "Vaccsuit (AP 3)",
        "Rigging Gun",
        "Sample Collection Kit",
        "Flashlight",
        "Lab Rat (pet)",
      ],
    },
    {
      roll: 3,
      items: [
        "Vaccsuit (AP 3)",
        "Foam Gun (2 charges)",
        "Foldable Stretcher",
        "First Aid Kit",
        "Radiation Pills (x5)",
      ],
    },
    {
      roll: 4,
      items: [
        "Lab Coat (AP 1)",
        "Screwdriver (as Assorted Tools)",
        "Medscanner",
        "Vaccine (1 dose)",
      ],
    },
    {
      roll: 5,
      items: [
        "Lab Coat (AP 1)",
        "Cybernetic Diagnostic Scanner",
        "Portable Computer Terminal",
      ],
    },
    {
      roll: 6,
      items: [
        "Scrubs (AP 1)",
        "Scalpel",
        "Automed (x5)",
        "Oxygen Tank with Filter Mask",
      ],
    },
    {
      roll: 7,
      items: [
        "Scrubs (AP 1)",
        "Vial of Acid",
        "Mylar Blanket",
        "First Aid Kit",
      ],
    },
    {
      roll: 8,
      items: [
        "Standard Crew Attire (AP 1)",
        "Utility Knife (as Scalpel)",
        "Cybernetic Diagnostic Scanner",
        "Duct Tape",
      ],
    },
    {
      roll: 9,
      items: [
        "Civilian Clothes (AP 1)",
        "Briefcase",
        "Prescription Pad",
        "Fountain Pen (Poison Injector)",
      ],
    },
  ],
  teamster: [
    {
      roll: 0,
      items: [
        "Vaccsuit (AP 3)",
        "Laser Cutter (1 extra battery)",
        "Patch Kit (x3)",
        "Toolbelt with Assorted Tools",
      ],
    },
    {
      roll: 1,
      items: [
        "Vaccsuit (AP 3)",
        "Revolver (6 rounds)",
        "Crowbar",
        "Flashlight",
      ],
    },
    {
      roll: 2,
      items: [
        "Vaccsuit (AP 3)",
        "Rigging Gun (1 shot)",
        "Shovel",
        "Salvage Drone",
      ],
    },
    {
      roll: 3,
      items: [
        "Hazard Suit (AP 5)",
        "Vibechete",
        "Spanner",
        "Camping Gear",
        "Water Filtration Device",
      ],
    },
    {
      roll: 4,
      items: [
        "Heavy Duty Work Clothes (AP 2)",
        "Explosives & Detonator",
        "Cigarettes",
      ],
    },
    {
      roll: 5,
      items: [
        "Heavy Duty Work Clothes (AP 2)",
        "Drill (as Assorted Tools)",
        "Paracord (100m)",
        "Salvage Drone",
      ],
    },
    {
      roll: 6,
      items: [
        "Standard Crew Attire (AP 1)",
        "Combat Shotgun (4 rounds)",
        "Extension Cord (20m)",
        "Cat (pet)",
      ],
    },
    {
      roll: 7,
      items: [
        "Standard Crew Attire (AP 1)",
        "Nail Gun (32 rounds)",
        "Head Lamp",
        "Toolbelt with Assorted Tools",
        "Lunch Box",
      ],
    },
    {
      roll: 8,
      items: [
        "Standard Crew Attire (AP 1)",
        "Flare Gun (2 rounds)",
        "Water Filtration Device",
        "Personal Locator",
        "Subsurface Scanner",
      ],
    },
    {
      roll: 9,
      items: [
        "Lounge Wear (AP 1)",
        "Crowbar",
        "Stimpak",
        "Six Pack of Beer",
      ],
    },
  ],
};
