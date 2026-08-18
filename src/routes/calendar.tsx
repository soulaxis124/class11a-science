import { createFileRoute } from "@tanstack/react-router";
import { events } from "@/data/content";
import { GlassPanel, PageShell, Section, SectionHero } from "@/components/nexus/primitives";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Activity Center — Class Calendar | Class 11-A Science" },
      {
        name: "description",
        content:
          "The class calendar of 11-A Science: exams, tests, projects, competitions, birthdays and school events.",
      },
      { property: "og:title", content: "Class Calendar — Class 11-A Science" },
      { property: "og:description", content: "Important dates for Class 11-A Science." },
    ],
  }),
  component: CalendarPage,
});

const groups = ["Exam", "Test", "Project", "Competition", "Birthday", "School", "House"] as const;

function CalendarPage() {
  return (
    <PageShell>
      <SectionHero
        eyebrow="Activity Center"
        title="Class Calendar"
        subtitle="Every important date in one orbit"
        description="Exams, tests, projects, competitions, birthdays and events for Class 11-A."
      />
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((g) => {
            const list = events.filter((e) => e.type === g);
            return (
              <GlassPanel key={g} className="p-5">
                <h2 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                  {g}
                </h2>
                <ul className="mt-4 space-y-2">
                  {list.map((e) => (
                    <li key={e.id} className="rounded-xl border border-border/60 px-3 py-3">
                      <p className="text-sm">
                        {e.title ?? <span className="text-muted-foreground">Entry slot</span>}
                      </p>
                      <p className="label-mono mt-1">{e.date ?? "Date TBA"}</p>
                    </li>
                  ))}
                </ul>
              </GlassPanel>
            );
          })}
        </div>
      </Section>
    </PageShell>
  );
}
