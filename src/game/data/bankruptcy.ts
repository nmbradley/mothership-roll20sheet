export type BankruptcyEffect = {
  result: string;
  consequence: string;
};

export const bankruptcyTable: BankruptcyEffect[] = [
  {
    result: "CRITICAL SUCCESS",
    consequence: "You turn a small profit. Choose one: Purchase 1 Major Upgrade for the ship; Repair 1d5 Major Repairs; Pay each crewmember 1d5x100kcr; Raise your Bankruptcy Save by 1d10.",
  },
  {
    result: "SUCCESS",
    consequence: "You scrape by. Choose one: Purchase 1 Minor Upgrade for the ship; Purchase 1 Minor Repair for the ship; Pay each crewmember 2d10 mos salary; Raise your Bankruptcy Save by 1d5.",
  },
  {
    result: "FAILURE",
    consequence: "You are 1d10mcr in debt to ruthless lenders.",
  },
  {
    result: "CRITICAL FAILURE",
    consequence: "The company goes bankrupt and owes a massive debt to the worst people imaginable.",
  },
];
