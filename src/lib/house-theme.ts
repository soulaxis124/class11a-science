import { useEffect } from "react";
import { houses } from "@/data/houses";
import type { HouseColors, HouseId } from "@/data/types";
import { useContentSection } from "@/hooks/useSiteContent";

/**
 * House colors are DATA, never hard-coded in components.
 * The stored `houses` document (Admin → Houses) owns primary / secondary /
 * accent per house; these are published to CSS variables
 * (--house-<id>, --house-<id>-2, --house-<id>-3) so the whole public site —
 * emblems, cards, badges, leaderboard, particles, 3D scenes — follows one source.
 */

export type HouseColorMap = Record<HouseId, HouseColors>;

export function defaultHouseColors(): HouseColorMap {
  return houses.reduce((acc, h) => {
    acc[h.id] = { ...h.colors };
    return acc;
  }, {} as HouseColorMap);
}

export function applyHouseColors(map: HouseColorMap) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  for (const h of houses) {
    const c = map[h.id];
    if (!c) continue;
    root.style.setProperty(`--house-${h.id}`, c.primary);
    root.style.setProperty(`--house-${h.id}-2`, c.secondary);
    root.style.setProperty(`--house-${h.id}-3`, c.accent);
  }
  window.dispatchEvent(new CustomEvent("nexus:house-colors"));
}

/** Publishes the stored house colors to CSS variables (runs site-wide in __root). */
export function useHouseColorSync() {
  const stored = useContentSection("houses");
  useEffect(() => {
    const map = defaultHouseColors();
    for (const h of stored) {
      if (h?.id && h.colors?.primary) map[h.id] = { ...map[h.id], ...h.colors };
    }
    applyHouseColors(map);
  }, [stored]);
}

/** Reads a live CSS color value (used by WebGL scenes, which need real hex/oklch). */
export function readCssColor(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}
