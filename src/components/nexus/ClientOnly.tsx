import { useEffect, useState, type ReactNode } from "react";

/** Renders children only after hydration — required for WebGL / browser-only code. */
export function ClientOnly({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return <>{mounted ? children : fallback}</>;
}

/**
 * Coarse capability check: only skip heavy 3D when the user asked for reduced
 * motion or the device is genuinely tiny/low-memory. Core count is NOT used —
 * ordinary 4-core laptops render these scenes fine.
 */
export function useLightMode() {
  const [light, setLight] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tiny = window.matchMedia("(max-width: 420px)").matches;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const memory = (navigator as any).deviceMemory as number | undefined;
    setLight(reduce || tiny || (memory !== undefined && memory <= 1));
  }, []);
  return light;
}

