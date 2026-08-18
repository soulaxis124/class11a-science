import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Scene } from "@/components/three/Scene";
import { classInfo, classStats } from "@/data/classInfo";
import { campusLocations } from "@/data/navigation";
import { GlassPanel, StatCounter } from "@/components/nexus/primitives";
import { NexusIcon } from "@/components/nexus/icons";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Science Nexus — Class 11-A Science" },
      {
        name: "description",
        content:
          "Enter the class universe of 11-A Science: 33 students, four houses, the Green Cabinet, achievements, memories and a scientific journey in 3D.",
      },
      { property: "og:title", content: "Science Nexus — Class 11-A Science" },
      {
        property: "og:description",
        content: "One Class. Four Houses. One Scientific Journey. An interactive 3D class universe.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [entered, setEntered] = useState(false);

  return (
    <main className="relative z-10">
      {/* ——— Cinematic hero ——— */}
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6">
        <Scene name="hero" className="opacity-90" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 50%, transparent 30%, color-mix(in oklab, var(--deep) 85%, transparent) 100%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="animate-fade-up label-mono">{classInfo.identity}</p>
          <h1
            className="animate-fade-up mt-5 font-display text-6xl font-semibold uppercase leading-[0.95] tracking-tight text-glow sm:text-8xl"
            style={{ animationDelay: "80ms" }}
          >
            Class 11-A
            <span className="mt-2 block text-primary">Science</span>
          </h1>
          <p
            className="animate-fade-up mt-6 font-display text-base tracking-wide text-foreground/85 sm:text-lg"
            style={{ animationDelay: "160ms" }}
          >
            {classInfo.primaryConcept}
          </p>
          <p
            className="animate-fade-up mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground"
            style={{ animationDelay: "220ms" }}
          >
            {classInfo.intro}
          </p>
          <div
            className="animate-fade-up mt-9 flex flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: "280ms" }}
          >
            <a
              href="#campus"
              onClick={() => setEntered(true)}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-transform hover:scale-[1.03]"
            >
              Enter the Class Universe
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <Link
              to="/students"
              className="glass rounded-xl px-6 py-3.5 text-sm uppercase tracking-[0.16em] transition-colors hover:border-primary/50"
            >
              Meet the 33
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
          <p className="label-mono">Scroll to explore</p>
          <div className="mx-auto mt-2 h-8 w-px bg-gradient-to-b from-primary to-transparent" />
        </div>
      </section>

      {/* ——— 3D campus hub ——— */}
      <section id="campus" className="relative scroll-mt-20 px-6 py-20">
        <div className="mx-auto max-w-6xl text-center">
          <p className="label-mono">The Campus Hub</p>
          <h2 className="mt-3 font-display text-3xl font-semibold uppercase tracking-tight sm:text-4xl">
            Choose a destination
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            Every glowing node is a real place in our class universe. Hover to identify it, click to
            travel there.
          </p>
        </div>

        <div className="relative mx-auto mt-10 h-[62vh] min-h-[420px] w-full max-w-6xl overflow-hidden rounded-3xl border border-border">
          <Scene name="campus" forceRender={entered} />
        </div>

        {/* Accessible / lightweight parallel navigation */}
        <div className="mx-auto mt-8 grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {campusLocations.map((loc) => (
            <Link key={loc.to} to={loc.to} className="group">
              <GlassPanel hover className="flex h-full items-center gap-3 p-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-surface/60 text-base">
                  <NexusIcon name={loc.icon} className="size-5 text-primary" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-display text-sm font-medium group-hover:text-primary">
                    {loc.label}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">{loc.blurb}</span>
                </span>
              </GlassPanel>
            </Link>
          ))}
        </div>
      </section>

      {/* ——— Statistics ——— */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="label-mono">Class Statistics</p>
            <h2 className="mt-3 font-display text-3xl font-semibold uppercase tracking-tight">
              {classInfo.tertiaryConcept}
            </h2>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {classStats.map((s, i) => (
              <StatCounter key={s.label} value={s.value} label={s.label} delay={i * 90} />
            ))}
          </div>
        </div>
      </section>

      {/* ——— Concept strip ——— */}
      <section className="px-6 pb-24">
        <GlassPanel className="mx-auto max-w-4xl px-8 py-12 text-center">
          <p className="font-display text-2xl font-medium tracking-tight sm:text-3xl">
            “{classInfo.secondaryConcept}”
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            A digital universe built for our class — its people, its houses, its science and its
            memories.
          </p>
        </GlassPanel>
      </section>
    </main>
  );
}
