import { createFileRoute } from "@tanstack/react-router";
import { monitors, teacher } from "@/data/classInfo";
import { GlassPanel, PageShell, Section, SectionHero } from "@/components/nexus/primitives";
import { PersonCard } from "@/components/nexus/cards";

export const Route = createFileRoute("/monitors")({
  head: () => ({
    meta: [
      { title: "Class Leadership — Class 11-A Science" },
      {
        name: "description",
        content:
          "Class leadership of 11-A Science: Ibrahim as Boys Monitor and Tanishka as Girls Monitor, under class teacher Rachna Ma'am.",
      },
      { property: "og:title", content: "Class Leadership — Class 11-A Science" },
      {
        property: "og:description",
        content: "Meet the monitors leading Class 11-A Science.",
      },
    ],
  }),
  component: MonitorsPage,
});

function MonitorsPage() {
  return (
    <PageShell>
      <SectionHero
        eyebrow="Leadership"
        title="Class Leadership"
        subtitle="Guiding the day-to-day life of 11-A"
        description="Our monitors coordinate the class, support the teacher and keep the class running smoothly."
      />

      <Section>
        <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
          {monitors.map((m) => (
            <PersonCard key={m.id} name={m.name} role={m.role} photo={m.photo} note={m.note} />
          ))}
        </div>
      </Section>

      <Section title="Reporting Structure">
        <GlassPanel className="p-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="glass rounded-xl px-6 py-4">
              <p className="label-mono">Class Teacher</p>
              <p className="mt-1 font-display text-lg">{teacher.name}</p>
            </div>
            <span className="h-8 w-px bg-gradient-to-b from-primary to-transparent" />
            <div className="grid w-full gap-4 sm:grid-cols-2">
              {monitors.map((m) => (
                <div key={m.id} className="glass rounded-xl px-6 py-4">
                  <p className="label-mono">{m.role}</p>
                  <p className="mt-1 font-display text-lg">{m.name}</p>
                </div>
              ))}
            </div>
            <span className="h-8 w-px bg-gradient-to-b from-primary/60 to-transparent" />
            <div className="glass rounded-xl px-6 py-4">
              <p className="label-mono">Class</p>
              <p className="mt-1 font-display text-lg">33 Students · 4 Houses</p>
            </div>
          </div>
        </GlassPanel>
      </Section>
    </PageShell>
  );
}
