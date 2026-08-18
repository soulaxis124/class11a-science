import { createFileRoute } from "@tanstack/react-router";
import { timeline } from "@/data/content";
import { PageShell, Section, SectionHero } from "@/components/nexus/primitives";
import { TimelineCard } from "@/components/nexus/cards";

export const Route = createFileRoute("/timeline")({
  head: () => ({
    meta: [
      { title: "Time Tunnel — Class 11-A Science" },
      {
        name: "description",
        content:
          "The journey of Class 11-A Science as an interactive timeline of events, competitions, celebrations and memories.",
      },
      { property: "og:title", content: "Time Tunnel — Class 11-A Science" },
      { property: "og:description", content: "The journey of our class, chapter by chapter." },
    ],
  }),
  component: TimelinePage,
});

function TimelinePage() {
  return (
    <PageShell>
      <SectionHero
        eyebrow="Time Tunnel"
        title="Our Journey"
        subtitle="From the first day to countless memories"
        description="Every chapter of the Class 11-A session will be recorded along this tunnel."
      />
      <Section>
        <div className="relative">
          <span className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-primary/60 via-primary/25 to-transparent md:left-1/2" />
          <div className="space-y-6">
            {timeline.map((entry, i) => (
              <TimelineCard key={entry.id} entry={entry} index={i} />
            ))}
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
