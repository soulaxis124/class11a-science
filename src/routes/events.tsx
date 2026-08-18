import { createFileRoute } from "@tanstack/react-router";
import { events } from "@/data/content";
import { GlassPanel, PageShell, Section, SectionHero } from "@/components/nexus/primitives";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Class Events — Class 11-A Science" },
      {
        name: "description",
        content:
          "School events, competitions, house activities and celebrations of Class 11-A Science.",
      },
      { property: "og:title", content: "Class Events — Class 11-A Science" },
      { property: "og:description", content: "Events and activities of Class 11-A Science." },
    ],
  }),
  component: EventsPage,
});

function EventsPage() {
  return (
    <PageShell>
      <SectionHero
        eyebrow="Activity Log"
        title="Class Events"
        subtitle="Everything that brings 11-A together"
        description="Competitions, celebrations, house activities and school events will be listed here."
      />
      <Section hint={`${events.length} slots`}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <GlassPanel key={e.id} hover className="p-5">
              <span className="rounded-full bg-primary/12 px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.18em] text-primary">
                {e.type}
              </span>
              <h3 className="mt-3 font-display text-base">
                {e.title ?? <span className="text-muted-foreground">Event slot</span>}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {e.description ?? "Details coming soon."}
              </p>
              <p className="label-mono mt-3">{e.date ?? "Date TBA"}</p>
            </GlassPanel>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
