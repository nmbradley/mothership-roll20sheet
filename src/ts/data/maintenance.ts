export interface MaintenanceIssue {
  roll: string;
  issue_type: string;
  description: string;
}

export const maintenanceTable: MaintenanceIssue[] = [
  {
    roll: "00",
    issue_type: "Minor",
    description: "Rancid smell permeates cabins.",
  },
  {
    roll: "01",
    issue_type: "Minor",
    description: "Huge mess everywhere.",
  },
  {
    roll: "02",
    issue_type: "Minor",
    description: "Staticky comms.",
  },
  {
    roll: "03",
    issue_type: "Minor",
    description: "Faulty electrical system.",
  },
  {
    roll: "04",
    issue_type: "Minor",
    description: "Loose couplings.",
  },
  {
    roll: "05",
    issue_type: "Minor",
    description: "Hidden (highly illegal) contraband.",
  },
  {
    roll: "06",
    issue_type: "Minor",
    description: "Autopilot systems down.",
  },
  {
    roll: "07",
    issue_type: "Minor",
    description: "Leaking hydraulic systems.",
  },
  {
    roll: "08",
    issue_type: "Minor",
    description: "Creaking hull.",
  },
  {
    roll: "09",
    issue_type: "Minor",
    description: "Damaged bulkheads.",
  },
  {
    roll: "10",
    issue_type: "Minor",
    description: "Misaligned docking clamps.",
  },
  {
    roll: "11",
    issue_type: "Minor",
    description: "Viewports blocked.",
  },
  {
    roll: "12",
    issue_type: "Minor",
    description: "Jammed exterior airlocks.",
  },
  {
    roll: "13",
    issue_type: "Minor",
    description: "Dysfunctional gravity plating.",
  },
  {
    roll: "14",
    issue_type: "Minor",
    description: "Out of code compliance.",
  },
  {
    roll: "15",
    issue_type: "Minor",
    description: "Controls sticking.",
  },
  {
    roll: "16",
    issue_type: "Minor",
    description: "Coolant leak.",
  },
  {
    roll: "17",
    issue_type: "Minor",
    description: "Miscalibrated Thruster Gimbal System.",
  },
  {
    roll: "18",
    issue_type: "Minor",
    description: "Bevvy of OSHA violations.",
  },
  {
    roll: "19",
    issue_type: "Minor",
    description: "Blocked air vents.",
  },
  {
    roll: "20",
    issue_type: "Minor",
    description: "Emergency lighting only.",
  },
  {
    roll: "21",
    issue_type: "Minor",
    description: "Internal networking issues.",
  },
  {
    roll: "22",
    issue_type: "Minor",
    description: "Inaccurate data collection.",
  },
  {
    roll: "23",
    issue_type: "Major",
    description: "Oxygen leak. If ship is low on O2, lose 1d5 extra per day.",
  },
  {
    roll: "24",
    issue_type: "Major",
    description: "Throttled afterburners. -2d10 Thrusters.",
  },
  {
    roll: "25",
    issue_type: "Major",
    description: "Lemon. Maintenance Checks at [-].",
  },
  {
    roll: "26",
    issue_type: "Major",
    description: "Slow acceleration. +1 Week to travel.",
  },
  {
    roll: "27",
    issue_type: "Major",
    description: "Inaccurate navigation.",
  },
  {
    roll: "28",
    issue_type: "Major",
    description: "Miscalibrated targeting sensors. -1d10 Battle.",
  },
  {
    roll: "29",
    issue_type: "Major",
    description: "Faulty cryopods. Nightmares. Cryosickness lasts an additional week.",
  },
  {
    roll: "30",
    issue_type: "Major",
    description: "Malfunctioning escape pods.",
  },
  {
    roll: "31",
    issue_type: "Major",
    description: "Unable to send distress signals.",
  },
  {
    roll: "32",
    issue_type: "Major",
    description: "Sabotaged coolant system.",
  },
  {
    roll: "33",
    issue_type: "Major",
    description: "Death trap. [-] on all rolls.",
  },
  {
    roll: "34",
    issue_type: "Minor",
    description: "Worn landing struts.",
  },
  {
    roll: "35",
    issue_type: "Minor",
    description: "Out-of-date air filters.",
  },
  {
    roll: "36",
    issue_type: "Minor",
    description: "Corroded pipes.",
  },
  {
    roll: "37",
    issue_type: "Minor",
    description: "Innaccurate orbital transfer navigation.",
  },
  {
    roll: "38",
    issue_type: "Minor",
    description: "Worn out fuel injection nozzles.",
  },
  {
    roll: "39",
    issue_type: "Minor",
    description: "Inoperative exterior lighting system.",
  },
  {
    roll: "40",
    issue_type: "Minor",
    description: "Defective intercom system.",
  },
  {
    roll: "41",
    issue_type: "Minor",
    description: "Inadequate waste recycling.",
  },
  {
    roll: "42",
    issue_type: "Minor",
    description: "Faulty altitude control thrusters.",
  },
  {
    roll: "43",
    issue_type: "Minor",
    description: "Insufficient Life Support redundancy.",
  },
  {
    roll: "44",
    issue_type: "Minor",
    description: "Delayed communication relays.",
  },
  {
    roll: "45",
    issue_type: "Minor",
    description: "Damaged fuel lines.",
  },
  {
    roll: "46",
    issue_type: "Minor",
    description: "Corroded exhaust manifolds.",
  },
  {
    roll: "47",
    issue_type: "Minor",
    description: "Terminal displays non-functional.",
  },
  {
    roll: "48",
    issue_type: "Minor",
    description: "Check engine light won’t turn off.",
  },
  {
    roll: "49",
    issue_type: "Minor",
    description: "Failed backup systems.",
  },
  {
    roll: "50",
    issue_type: "Minor",
    description: "Faulty door locks.",
  },
  {
    roll: "51",
    issue_type: "Minor",
    description: "Buggy communications.",
  },
  {
    roll: "52",
    issue_type: "Minor",
    description: "Infected food storage facilities.",
  },
  {
    roll: "53",
    issue_type: "Minor",
    description: "Corrupted data banks.",
  },
  {
    roll: "54",
    issue_type: "Minor",
    description: "Jammed cargo bay doors.",
  },
  {
    roll: "55",
    issue_type: "Minor",
    description: "Flickering interior lights.",
  },
  {
    roll: "56",
    issue_type: "Minor",
    description: "Failed airlock seals.",
  },
  {
    roll: "57",
    issue_type: "Major",
    description: "Fuel leak. Burn +1 Fuel every time you spend fuel.",
  },
  {
    roll: "58",
    issue_type: "Major",
    description: "Jump bug. 10% chance Jump takes 2d10 months, not 2d10 days.",
  },
  {
    roll: "59",
    issue_type: "Major",
    description: "Fragile. Always take +1 MDMG.",
  },
  {
    roll: "60",
    issue_type: "Major",
    description: "Cracked heat shields.",
  },
  {
    roll: "61",
    issue_type: "Major",
    description: "Outdated software. -1d10 Systems.",
  },
  {
    roll: "62",
    issue_type: "Major",
    description: "Parasites in the water supply.",
  },
  {
    roll: "63",
    issue_type: "Major",
    description: "Malfunctioning waste management system.",
  },
  {
    roll: "64",
    issue_type: "Major",
    description: "Fusion Reactors overheating.",
  },
  {
    roll: "65",
    issue_type: "Major",
    description: "Failed radiation filter.",
  },
  {
    roll: "66",
    issue_type: "Major",
    description: "Radiation leak. Entire ship is at Radiation Level 2.",
  },
  {
    roll: "67",
    issue_type: "Minor",
    description: "Miscalibrated guidance system.",
  },
  {
    roll: "68",
    issue_type: "Minor",
    description: "Overloaded power storage.",
  },
  {
    roll: "69",
    issue_type: "Minor",
    description: "Malfunctioning sensor arrays.",
  },
  {
    roll: "70",
    issue_type: "Minor",
    description: "Failed Water Recovery System.",
  },
  {
    roll: "71",
    issue_type: "Minor",
    description: "Micrometeoroid hull damage.",
  },
  {
    roll: "72",
    issue_type: "Minor",
    description: "Faulty Carbon Dioxide Removal Assembly.",
  },
  {
    roll: "73",
    issue_type: "Minor",
    description: "Solar panel degradation.",
  },
  {
    roll: "74",
    issue_type: "Minor",
    description: "Computer failure from cosmic radiation.",
  },
  {
    roll: "75",
    issue_type: "Minor",
    description: "Overloaded circuitry.",
  },
  {
    roll: "76",
    issue_type: "Minor",
    description: "Malfunctioning plasma thruster.",
  },
  {
    roll: "77",
    issue_type: "Minor",
    description: "Thermal management system failure.",
  },
  {
    roll: "78",
    issue_type: "Minor",
    description: "Intermittent electrical outages.",
  },
  {
    roll: "79",
    issue_type: "Minor",
    description: "Fire suppression system out of code.",
  },
  {
    roll: "80",
    issue_type: "Minor",
    description: "Damaged floor paneling.",
  },
  {
    roll: "81",
    issue_type: "Minor",
    description: "Broken light fixture in remote corridor.",
  },
  {
    roll: "82",
    issue_type: "Minor",
    description: "Damaged coolant pump.",
  },
  {
    roll: "83",
    issue_type: "Minor",
    description: "Cracked viewports.",
  },
  {
    roll: "84",
    issue_type: "Minor",
    description: "Systems overloaded with malware.",
  },
  {
    roll: "85",
    issue_type: "Minor",
    description: "Leaky fuel valve.",
  },
  {
    roll: "86",
    issue_type: "Minor",
    description: "Jammed exhaust vent.",
  },
  {
    roll: "87",
    issue_type: "Minor",
    description: "Stuck waste disposal chute.",
  },
  {
    roll: "88",
    issue_type: "Minor",
    description: "Lifts non-functioning.",
  },
  {
    roll: "89",
    issue_type: "Minor",
    description: "Damaged communications antenna.",
  },
  {
    roll: "90",
    issue_type: "Major",
    description: "Clogged air filtration. Crew capacity cut in half.",
  },
  {
    roll: "91",
    issue_type: "Major",
    description: "Malfunctioning climate control. 85 ºF / 29 ºC at all times.",
  },
  {
    roll: "92",
    issue_type: "Major",
    description: "No emergency power.",
  },
  {
    roll: "93",
    issue_type: "Major",
    description: "Weak frame. -1 Hull, -1 Upgrade.",
  },
  {
    roll: "94",
    issue_type: "Major",
    description: "Toxic chemical spill.",
  },
  {
    roll: "95",
    issue_type: "Major",
    description: "Poor scanners. Ship has to be one range band closer than normal.",
  },
  {
    roll: "96",
    issue_type: "Major",
    description: "Counterfeit papers. Ship is stolen. There is a bounty on it.",
  },
  {
    roll: "97",
    issue_type: "Major",
    description: "Corrupted A.I.",
  },
  {
    roll: "98",
    issue_type: "Major",
    description: "Warp Cores fail 10% of the time.",
  },
  {
    roll: "99",
    issue_type: "Major",
    description: "Rust bucket. Everything that can go wrong, does. +1 Minimum Stress to crew.",
  },
];
