import { ParticleField, ScienceOverlay } from "./ScienceOverlay";

/** Cinematic instrument backdrop shared by every route (canvas 2D, no WebGL cost). */
export function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-deep" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 55% at 50% 0%, color-mix(in oklab, var(--primary) 12%, transparent), transparent 65%), radial-gradient(50% 40% at 85% 90%, color-mix(in oklab, var(--eco) 10%, transparent), transparent 70%), radial-gradient(60% 50% at 8% 68%, color-mix(in oklab, var(--gold) 6%, transparent), transparent 70%)",
        }}
      />
      <div className="grid-field absolute inset-0 opacity-40 [mask-image:radial-gradient(75%_65%_at_50%_40%,black,transparent)]" />
      <ScienceOverlay intensity={0.55} />
      <ParticleField className="opacity-70" />
      {/* vignette keeps the reading surface calm */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 70% at 50% 45%, transparent 40%, color-mix(in oklab, var(--deep) 78%, transparent) 100%)",
        }}
      />
    </div>
  );
}

/** Route-change fade/scale so the whole site feels like one continuous world. */
export function RouteTransition({
  routeKey,
  children,
}: {
  routeKey: string;
  children: React.ReactNode;
}) {
  return (
    <div key={routeKey} className="animate-fade-up">
      {children}
    </div>
  );
}
