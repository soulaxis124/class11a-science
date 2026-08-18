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
 * Capability check: only skip heavy 3D when the user explicitly asked for
 * reduced motion, or when the device reports very low memory. Screen size is
 * NOT used — phones render these scenes fine at a lower device pixel ratio.
 */
export function useLightMode() {
  const [light, setLight] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nav = navigator as any;
    const memory = (nav.deviceMemory ?? nav.deviceMemory) as number | undefined;
    setLight(reduce || (memory !== undefined && memory <= 1));
  }, []);
  return light;
}


