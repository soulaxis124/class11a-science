import { createFileRoute, Link } from "@tanstack/react-router";
import { classInfo, classStats, teacher, monitors } from "@/data/classInfo";
import { houses } from "@/data/houses";
import { GlassPanel, PageShell, Section, SectionHero, StatCounter } from "@/components/nexus/primitives";
import { Scene } from "@/components/three/Scene";

export const Route = createFileRoute("/class")({
  head: () => ({
    meta: [
      { title: "Our Class — Class 11-A Science" },
      {
        name: "description",
        content:
          "The classroom core of 11-A Science: our identity, statistics, teacher, houses and leadership at a glance.",
      },
      { property: "og:title", content: "Our Class — Class 11-A Science" },
      {
        property: "og:description",
        content: "The classroom core of 11-A Science — identity, people and structure.",
      },
    ],
  }),
  component: ClassPage,
});

function ClassPage() {
  return (
    <PageShell>
      <div className="relative">
        <div className="absolute inset-0 h-[420px] overflow-hidden">
          <Scene name="hero" className="opacity-40" />
        </div>
        <SectionHero
          eyebrow="Classroom"
          title="Our Class"
          subtitle={classInfo.primaryConcept}
          description="One classroom, thirty-three minds, four houses and a single scientific journey. This is the core of the Science Nexus."
        />
      </div>

      <Section title="Class Statistics" hint="Live from the data layer">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {classStats.map((s, i) => (
            <StatCounter key={s.label} value={s.value} label={s.label} delay={i * 80} />
          ))}
        </div>
      </Section>

      <Section title="Class Identity">
        <div className="grid gap-4 md:grid-cols-3">
          {[classInfo.primaryConcept, classInfo.secondaryConcept, classInfo.tertiaryConcept].map(
            (line, i) => (
              <GlassPanel key={i} hover className="p-6">
                <p className="label-mono">Concept {i + 1}</p>
                <p className="mt-3 font-display text-lg leading-snug">{line}</p>
              </GlassPanel>
            ),
          )}
        </div>
      </Section>

      <Section title="The People">
        <div className="grid gap-4 md:grid-cols-3">
          <LinkPanel to="/teacher" label="Class Teacher" value={teacher.name} glyph="·" />
          <LinkPanel to="/students" label="Students" value="33 individual profiles" glyph="·" />
          <LinkPanel
            to="/monitors"
            label="Leadership"
            value={monitors.map((m) => m.name).join(" · ")}
            glyph="·"
          />
        </div>
      </Section>

      <Section title="Four Houses" hint="One class · four towers">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {houses.map((h) => (
            <Link key={h.id} to="/houses/$house" params={{ house: h.id }}>
              <GlassPanel
                hover
                className="p-6 text-center"
                style={{ borderColor: `color-mix(in oklab, var(${h.colorVar}) 30%, transparent)` }}
              >
                <span className="font-display text-3xl" style={{ color: `var(${h.colorVar})` }}>
                  {h.emblem}
                </span>
                <p className="mt-3 font-display text-sm uppercase tracking-[0.18em]">{h.name}</p>
              </GlassPanel>
            </Link>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}

function LinkPanel({
  to,
  label,
  value,
  glyph,
}: {
  to: string;
  label: string;
  value: string;
  glyph: string;
}) {
  return (
    <Link to={to} className="group">
      <GlassPanel hover className="flex h-full items-center gap-4 p-6">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-border bg-surface/60 text-xl">
          {glyph}
        </span>
        <span className="min-w-0">
          <span className="label-mono block">{label}</span>
          <span className="mt-1 block truncate font-display text-base group-hover:text-primary">
            {value}
          </span>
        </span>
      </GlassPanel>
    </Link>
  );
}
