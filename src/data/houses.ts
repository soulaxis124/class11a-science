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

/**
 * Official house colors: Chanakya = Yellow, Valmiki = Red,
 * Patanjali = Green, Dronacharya = Blue. Secondary/accent are shades of the
 * same identity. These are the defaults; admins may change them.
 */
export const houses: House[] = [
  make("chanakya", "Chanakya", "◈", {
    primary: "#e8c344",
    secondary: "#a8860f",
    accent: "#f8e39a",
  }),
  make("valmiki", "Valmiki", "◆", {
    primary: "#d64545",
    secondary: "#8e2323",
    accent: "#f0a5a5",
  }),
  make("patanjali", "Patanjali", "❖", {
    primary: "#3fa96b",
    secondary: "#1f6b41",
    accent: "#9be0b8",
  }),
  make("dronacharya", "Dronacharya", "◇", {
    primary: "#3b82d9",
    secondary: "#1f4f8f",
    accent: "#a3c8f5",
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
