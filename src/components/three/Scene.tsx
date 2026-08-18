import { Suspense, lazy, type ReactNode } from "react";
import { ClientOnly, useLightMode } from "@/components/nexus/ClientOnly";
import { cn } from "@/lib/utils";

const scenes = {
  hero: lazy(() => import("./HeroScene")),
  campus: lazy(() => import("./CampusScene")),
  constellation: lazy(() => import("./ConstellationScene")),
  towers: lazy(() => import("./TowersScene")),
  green: lazy(() => import("./GreenScene")),
  lab: lazy(() => import("./LabScene")),
};

export type SceneName = keyof typeof scenes;

/**
 * Client-only, lazily loaded WebGL scene with a styled static fallback.
 * On reduced-motion / small / low-core devices the fallback is used instead.
 */
export function Scene({
  name,
  className,
  fallback,
  forceRender = false,
}: {
  name: SceneName;
  className?: string;
  fallback?: ReactNode;
  forceRender?: boolean;
}) {
  const Cmp = scenes[name];
  const still = fallback ?? <SceneFallback />;
  return (
    <div className={cn("absolute inset-0", className)}>
      <ClientOnly fallback={still}>
        <Gate forceRender={forceRender} fallback={still}>
          <Suspense fallback={still}>
            <Cmp />
          </Suspense>
        </Gate>
      </ClientOnly>
    </div>
  );
}

function Gate({
  forceRender,
  fallback,
  children,
}: {
  forceRender: boolean;
  fallback: ReactNode;
  children: ReactNode;
}) {
  const light = useLightMode();
  if (light && !forceRender) return <>{fallback}</>;
  return <>{children}</>;
}

export function SceneFallback() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="grid-field absolute inset-0 opacity-50" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 40%, color-mix(in oklab, var(--primary) 18%, transparent), transparent 70%)",
        }}
      />
      <div className="absolute left-1/2 top-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/25 animate-float" />
      <div className="absolute left-1/2 top-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full border border-primary/15" />
    </div>
  );
}
