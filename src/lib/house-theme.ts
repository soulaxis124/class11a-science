import { useEffect, useState } from "react";
import { houses } from "@/data/houses";
import type { HouseColors, HouseId } from "@/data/types";

/**
 * House colors are DATA, never hard-coded in components.
 * Every house exposes primary / secondary / accent, published to CSS variables
 * (--house-<id>, --house-<id>-2, --house-<id>-3) so the whole public site —
 * emblems, cards, badges, leaderboard, particles, 3D scenes — follows one source.
 *
 * This pass stores overrides locally (no backend); a later phase can swap the
 * storage adapter without touching any component.
 */

const STORAGE_KEY = "nexus.house-colors.v1";

export type HouseColorMap = Record<HouseId, HouseColors>;

export function defaultHouseColors(): HouseColorMap {
  return houses.reduce((acc, h) => {
    acc[h.id] = { ...h.colors };
    return acc;
  }, {} as HouseColorMap);
}

export function loadHouseColors(): HouseColorMap {
  const base = defaultHouseColors();
  if (typeof window === "undefined") return base;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw) as Partial<HouseColorMap>;
    for (const h of houses) {
      const found = parsed[h.id];
      if (found?.primary && found.secondary && found.accent) base[h.id] = found;
    }
  } catch {
    /* corrupted storage → defaults */
  }
  return base;
}

export function applyHouseColors(map: HouseColorMap) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  for (const h of houses) {
    const c = map[h.id];
    root.style.setProperty(`--house-${h.id}`, c.primary);
    root.style.setProperty(`--house-${h.id}-2`, c.secondary);
    root.style.setProperty(`--house-${h.id}-3`, c.accent);
  }
  window.dispatchEvent(new CustomEvent("nexus:house-colors"));
}

export function saveHouseColors(map: HouseColorMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  applyHouseColors(map);
}

/** Publishes stored house colors to CSS variables on mount. */
export function useHouseColorSync() {
  useEffect(() => {
    applyHouseColors(loadHouseColors());
  }, []);
}

/** Editable state for the admin customization panel. */
export function useHouseColors() {
  const [map, setMap] = useState<HouseColorMap>(defaultHouseColors);
  useEffect(() => setMap(loadHouseColors()), []);

  function update(id: HouseId, key: keyof HouseColors, value: string) {
    setMap((prev) => {
      const next = { ...prev, [id]: { ...prev[id], [key]: value } };
      saveHouseColors(next);
      return next;
    });
  }

  function reset() {
    const next = defaultHouseColors();
    saveHouseColors(next);
    setMap(next);
  }

  return { map, update, reset };
}

/** Reads a live CSS color value (used by WebGL scenes, which need real hex/oklch). */
export function readCssColor(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}
