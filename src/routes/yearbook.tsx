import { createFileRoute, Link } from "@tanstack/react-router";
import { classInfo, classStats, monitors, teacher } from "@/data/classInfo";
import { displayName } from "@/data/students";
import { GlassPanel, PageShell, PhotoSlot, Section, SectionHero, StatCounter } from "@/components/nexus/primitives";
import { useContentSection, useClassText } from "@/hooks/useSiteContent";
import { HouseCrest } from "@/components/nexus/HouseCrest";

export const Route = createFileRoute("/yearbook")({
  head: () => ({
    meta: [
      { title: "Digital Yearbook — Class 11-A Science" },
      {
        name: "description",
        content:
          "The digital yearbook vault of Class 11-A Science: our teacher, 33 students, four houses, Green Cabinet, leadership and memories in one place.",
      },
      { property: "og:title", content: "Digital Yearbook — Class 11-A Science" },
      { property: "og:description", content: "A premium memory vault for Class 11-A Science." },
    ],
  }),
  component: YearbookPage,
});

function YearbookPage() {
  const houses = useContentSection("houses");
  const students = useContentSection("students");
  const greenCabinet = useContentSection("greenCabinet");
  const yearbookEntries = useContentSection("yearbookEntries");
  const text = useClassText();
  return (
    <PageShell>
      <SectionHero
        eyebrow="Yearbook Vault"
        title={text("yearbookTitle", "Digital Yearbook")}
        subtitle={text("yearbookIntro", classInfo.tertiaryConcept)}
        description={text(
          "yearbookClosing",
          "Everything about Class 11-A Science, gathered into one memory vault.",
        )}
      />

      <Section title="The Class">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {classStats.map((s, i) => (
            <StatCounter key={s.label} value={s.value} label={s.label} delay={i * 70} />
          ))}
        </div>
      </Section>

      <Section title="Our Teacher">
        <GlassPanel className="flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <p className="label-mono">Class Teacher</p>
            <p className="mt-1 font-display text-2xl">{teacher.name}</p>
          </div>
          <Link to="/teacher" className="text-xs uppercase tracking-[0.16em] text-primary">
            Open chamber →
          </Link>
        </GlassPanel>
      </Section>

      <Section title="Leadership">
        <div className="grid gap-4 sm:grid-cols-2">
          {monitors.map((m) => (
            <GlassPanel key={m.id} className="p-6">
              <p className="label-mono">{m.role}</p>
              <p className="mt-1 font-display text-xl">{m.name}</p>
            </GlassPanel>
          ))}
        </div>
      </Section>

      <Section title="Four Houses">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {houses.map((h) => (
            <GlassPanel key={h.id} className="p-5 text-center">
              <HouseCrest id={h.id} className="mx-auto size-12" />
              <p className="mt-2 font-display text-sm uppercase tracking-[0.16em]">{h.name}</p>
              <p className="label-mono mt-1">{h.points} pts</p>
            </GlassPanel>
          ))}
        </div>
      </Section>

      {yearbookEntries.length > 0 && (
        <Section title="Memory Pages" hint={`${yearbookEntries.length} entries`}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {yearbookEntries.map((entry) => (
              <GlassPanel key={entry.id} className="overflow-hidden p-0">
                <div className="aspect-[16/10]"><PhotoSlot src={entry.media} alt={entry.title ?? "Yearbook memory"} /></div>
                <div className="p-5">
                  <p className="label-mono">{entry.date ?? "Memory"}</p>
                  <h2 className="mt-2 font-display text-lg">{entry.title ?? "Untitled memory"}</h2>
                  {entry.description && <p className="mt-2 text-sm text-muted-foreground">{entry.description}</p>}
                </div>
              </GlassPanel>
            ))}
          </div>
        </Section>
      )}

      <Section title="Green Cabinet" hint="12 members">
        <div className="flex flex-wrap gap-2">
          {greenCabinet.map((m) => (
            <span
              key={m.slot}
              className="rounded-full border px-3 py-1.5 text-xs"
              style={{ borderColor: "color-mix(in oklab, var(--eco) 35%, transparent)", color: "var(--eco)" }}
            >
              {m.name ?? `Member ${String(m.slot).padStart(2, "0")}`}
            </span>
          ))}
        </div>
      </Section>

      <Section title="Class Roll" hint="33 students">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {students.map((s) => (
            <Link
              key={s.roll}
              to="/students/$roll"
              params={{ roll: String(s.roll) }}
              className="glass glass-hover flex items-center gap-3 rounded-xl px-4 py-3"
            >
              <span className="font-mono text-xs text-primary">
                {String(s.roll).padStart(2, "0")}
              </span>
              <span className="truncate text-sm">{displayName(s)}</span>
            </Link>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
