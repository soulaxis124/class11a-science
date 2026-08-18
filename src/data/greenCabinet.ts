import type { GreenMember } from "./types";

/** Exactly 12 Green Cabinet slots. Three confirmed, nine awaiting names. */
export const greenCabinet: GreenMember[] = [
  { slot: 1, name: "Asadullah", roll: 11, responsibility: null },
  { slot: 2, name: "Mishti", roll: null, responsibility: null },
  { slot: 3, name: "Mobinaa", roll: null, responsibility: null },
  ...Array.from({ length: 9 }, (_, i) => ({
    slot: i + 4,
    name: null,
    roll: null,
    responsibility: null,
  })),
];

export const greenMission = [
  "Maintaining classroom cleanliness",
  "Environmental protection",
  "Cleanliness awareness",
  "Reducing unnecessary waste",
  "Responsible use of resources",
  "Keeping the classroom organized",
  "Promoting environmental responsibility",
  "Supporting a cleaner and greener environment",
];
