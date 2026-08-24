export interface Equipment {
  name: string;
  cost: string;
  description: string;
}

export const equipment: Equipment[] = [
  {
    name: "Assorted Tools",
    cost: "20cr",
    description:
      "Wrenches, spanners, screwdrivers, etc. Can be used as weapons in a pinch (1d5 DMG).",
  },
  {
    name: "Automed (x5)",
    cost: "1.5kcr",
    description:
      "Nanotech pills that assist your body in repairing Damage by granting Advantage to Body Saves meant to repel disease and poison, as well as attempts to heal from rest.",
  },
  {
    name: "Battery (High Power)",
    cost: "500cr",
    description:
      "Heavy duty battery used for powering laser cutters, salvage drones, and other items. Can be recharged in 1 hour if connected to power or in 6 hours with solar power. Add waterproofing (+500cr).",
  },
  {
    name: "Binoculars",
    cost: "150cr",
    description:
      "20x magnification. Add night vision (+300cr) or thermal vision (+1kcr).",
  },
  {
    name: "Bioscanner",
    cost: "3kcr",
    description:
      "Long Range. Allows the user to scan for signs of life. Can tell the location of signs of life, but not what that life is. Blocked by some materials at the Warden’s discretion.",
  },
  {
    name: "Body Cam",
    cost: "50cr",
    description:
      "A camera worn on your clothing that can stream video back to a control center so your other crewmembers can see what you’re seeing. Add night vision (+300cr) or thermal vision (+1kcr).",
  },
  {
    name: "Chemlight (x5)",
    cost: "5cr",
    description:
      "Small disposable glowsticks capable of dim illumination in a 1m radius.",
  },
  {
    name: "Crowbar",
    cost: "25cr",
    description:
      "Grants Advantage on Strength Checks to open jammed airlocks, lift heavy objects, etc.",
  },
  {
    name: "Cybernetic Diagnostic Scanner",
    cost: "2kcr",
    description:
      "Allows the user to scan androids and other cybernetic organisms in order to diagnose any physical or mental issues they may be having. Often distrusted by androids.",
  },
  {
    name: "Electronic Tool Set",
    cost: "100cr",
    description:
      "A full set of tools for doing detailed repair or construction work on electronics.",
  },
  {
    name: "Emergency Beacon",
    cost: "2kcr",
    description:
      "A small device that sends up a flare and then emits a loud beep every few seconds. Additionally, sends out a call on all radio channels to ships or vehicles in the area, but can be blocked by a radio jammer.",
  },
  {
    name: "Exoloader",
    cost: "100kcr",
    description:
      "Open-air mechanical exoskeleton used for heavy lifting (up to 5000kg). Loader claws deal 1 Wound. User can only wear Standard Crew Attire or Standard Battle Dress while operating. Battery operated (48 hours of use).",
  },
  {
    name: "Explosives & Detonator",
    cost: "500cr",
    description:
      "Explosive charge powerful enough to blow open an airlock. All organisms in Close Range must make a Body Save or take a Wound (Explosive). Detonator works at Long Range, but can be blocked by a radio jammer.",
  },
  {
    name: "First Aid Kit",
    cost: "75cr",
    description:
      "An assortment of dressings and treatments to help stop bleeding, bandage cuts, and treat other minor injuries.",
  },
  {
    name: "Flashlight",
    cost: "30cr",
    description:
      "Handheld or shoulder mounted. Illuminates 10m ahead of the user.",
  },
  {
    name: "Foldable Stretcher",
    cost: "150cr",
    description:
      "Portable stretcher that can fit within a rucksack. Allows the user to safely strap down the patient and carry them to a location where their wounds can be better treated. Unfolds to roughly 2m.",
  },
  {
    name: "Geiger Counter",
    cost: "20cr",
    description: "Detects radiation and displays radiation levels.",
  },
  {
    name: "Heads-Up Display (HUD)",
    cost: "100cr",
    description:
      "Often worn by marines, the HUD allows the wearer to see through the body cams of others in their unit, and connect to any smart-link upgraded weapon.",
  },
  {
    name: "Infrared Goggles",
    cost: "1.5kcr",
    description:
      "Allows the wearer to see heat signatures, sometimes up to several hours old. Add night vision (+300cr).",
  },
  {
    name: "Jetpack",
    cost: "75kcr",
    description:
      "Allows wearer to fly up to 100m high and up to a speed of 100km/hr for 2 hours on a tank of fuel. Deals 1d100[+] DMG if destroyed. Fuel can be refilled for 200cr.",
  },
  {
    name: "Lockpick Set",
    cost: "40cr",
    description:
      "A highly advanced set of tools meant for hacking basic airlock and electronic door systems.",
  },
  {
    name: "Long-range Comms",
    cost: "1kcr",
    description:
      "Rucksack-sized communication device for use in surface-to-ship communication.",
  },
  {
    name: "Mag-boots",
    cost: "350cr",
    description:
      "Grants a magnetic grip to the wearer, allowing them to easily walk on the exterior of a ship (in space, while docked, or free-floating), metal-based asteroids, or any other magnetic surface.",
  },
  {
    name: "Medscanner",
    cost: "8kcr",
    description:
      "Allows the user to scan a living or dead body to analyze it for disease or abnormalities, without having to do a biopsy or autopsy. Results may not be instantaneous and may require a lab for complete analysis.",
  },
  {
    name: "MoHab Unit",
    cost: "1kcr",
    description:
      "Tent, canteen, stove, rucksack, compass, and sleeping bag.",
  },
  {
    name: "MRE (x7)",
    cost: "70cr",
    description:
      "“Meal, Ready-to-Eat.” Self-contained, individual field rations in lightweight packaging. Each has sufficient sustenance for a single person for one day (does not include water).",
  },
  {
    name: "Mylar Blanket",
    cost: "10cr",
    description:
      "Lightweight blanket made of heat-reflective material. Often used for thermal regulation of patients suffering from extreme cold or other trauma.",
  },
  {
    name: "Oxygen Tank",
    cost: "50cr",
    description:
      "When attached to a vaccsuit provides up to 12 hours of oxygen under normal circumstances, 4 hours under stressful circumstances. Explosive.",
  },
  {
    name: "Paracord (50m)",
    cost: "10cr",
    description: "General purpose lightweight nylon rope.",
  },
  {
    name: "Patch Kit (x3)",
    cost: "200cr",
    description:
      "Repairs punctured and torn vaccsuits, restoring their space readiness. Patched vaccsuits have an AP of 1.",
  },
  {
    name: "Personal Locator",
    cost: "200cr",
    description:
      "Allows crewmembers at a control center (or on the bridge of a ship) to track the location of the wearer.",
  },
  {
    name: "Pet (Organic)",
    cost: "200kcr",
    description:
      "Small to medium-sized organic pet animal. Larger or rare pets cost 2d10x base pet cost.",
  },
  {
    name: "Pet (Synthetic)",
    cost: "15kcr",
    description:
      "Small to medium-sized synthetic pet animal. Larger or rare pets cost 2d10x base pet cost.",
  },
  {
    name: "Portable Computer Terminal",
    cost: "1.5kcr",
    description:
      "Flat computer monitor, keyboard and interface which allows the user to hack into pre-existing computers and networks, as well as perform standard computer tasks.",
  },
  {
    name: "Radiation Pills (x5)",
    cost: "200cr",
    description:
      "Take 1d5 DMG and reduce your Radiation Level (see pg. 33.2) by 1 for 2d10 minutes.",
  },
  {
    name: "Radio Jammer",
    cost: "4kcr",
    description:
      "Rucksack-sized device which, when activated, renders all radio signals within 100km incomprehensible.",
  },
  {
    name: "Rebreather",
    cost: "500cr",
    description:
      "When worn, filters toxic air and/or allows for underwater breathing for up to 20 minutes at a time without resurfacing. Can be connected to an oxygen tank.",
  },
  {
    name: "Rucksack",
    cost: "50cr",
    description: "Large, durable, waterproof backpack.",
  },
  {
    name: "Salvage Drone",
    cost: "10kcr",
    description:
      "Battery operated remote controlled drone. Requires two hands to operate receiver. Can fly up to 450m high, to a distance of 3km from operator. Can run for 2 hours. Can record and transmit footage to receiver. If purchased separately, can be equipped with up to two of the following: binoculars, radio jammer, Geiger counter, laser cutter, medscanner, personal locator, infrared goggles, emergency beacon, cybernetic diagnostic scanner, bioscanner. Can carry up to 20-30kg.",
  },
  {
    name: "Sample Collection Kit",
    cost: "50cr",
    description:
      "Used to research xenoflora and xenofauna in the field. Can take vital signs, DNA samples, and collect other data on foreign material. Results may not be instantaneous and may require a lab for complete analysis.",
  },
  {
    name: "Short-range Comms",
    cost: "100cr",
    description:
      "Allows communication from ship-to-ship within a reasonable distance, as well as surface-to-surface within a dozen kilometers. Blocked by radio jammer.",
  },
  {
    name: "Smart-link Add-On",
    cost: "10kcr",
    description:
      "Grants remote viewing, recording, and operation of a ranged weapon as well as +5 DMG to the weapon.",
  },
  {
    name: "Stimpak",
    cost: "1kcr ea.",
    description:
      "Cures cryosickness, reduces Stress by 1, restores 1d10 Health, and grants [+] to all rolls for 1d10 min. Roll 1d10. If you roll under the amount of doses you’ve taken in the past 24 hours, make a Death Save.",
  },
  {
    name: "Water Filtration Device",
    cost: "50cr",
    description:
      "Can pump 4 liters of filtered water per hour from even the most brackish swamps.",
  },
];
