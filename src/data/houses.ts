import type { House, HouseColors, HouseId } from "./types";

/**
 * Every house owns a three-tone palette (primary / secondary / accent).
 * Defaults live here; runtime overrides come from src/lib/house-theme.ts and are
 * published to the CSS variables named below, so the entire public site follows.
 */
function make(
  id: HouseId,
  name: string,
  emblem: string,
  colors: HouseColors,
): House {
  return {
    id,
    name,
    colorVar: `--house-${id}`,
    colorVar2: `--house-${id}-2`,
    colorVar3: `--house-${id}-3`,
    colors,
    emblem,
    motto: null,
    teacher: null,
    captain: null,
    viceCaptain: null,
    points: 0,
    achievements: [],
    events: [],
    description: null,
  };
}

export const houses: House[] = [
  make("chanakya", "Chanakya", "◈", {
    primary: "#c9a54e",
    secondary: "#8c6f2e",
    accent: "#f0dda4",
  }),
  make("valmiki", "Valmiki", "◆", {
    primary: "#8d5560",
    secondary: "#5e343d",
    accent: "#dfa9b3",
  }),
  make("patanjali", "Patanjali", "❖", {
    primary: "#5f9e79",
    secondary: "#33604a",
    accent: "#a8d8bb",
  }),
  make("dronacharya", "Dronacharya", "◇", {
    primary: "#8a97a8",
    secondary: "#5a6674",
    accent: "#d3dbe4",
  }),
];

export function getHouse(id: HouseId | null | undefined): House | undefined {
  if (!id) return undefined;
  return houses.find((h) => h.id === id);
}

export function houseColor(id: HouseId | null | undefined): string {
  const house = getHouse(id);
  return house ? `var(${house.colorVar})` : "var(--muted-foreground)";
}

export function houseColorTrio(id: HouseId | null | undefined) {
  const house = getHouse(id);
  if (!house) {
    return {
      primary: "var(--muted-foreground)",
      secondary: "var(--muted)",
      accent: "var(--silver)",
    };
  }
  return {
    primary: `var(${house.colorVar})`,
    secondary: `var(${house.colorVar2})`,
    accent: `var(${house.colorVar3})`,
  };
}
