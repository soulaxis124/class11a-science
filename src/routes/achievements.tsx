import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { achievements, achievementCategories } from "@/data/content";
import { PageShell, Section, SectionHero } from "@/components/nexus/primitives";
import { AchievementCard } from "@/components/nexus/cards";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { title: "Hall of Fame — Class 11-A Science" },
      {
        name: "description",
        content:
          "The achievement hall of Class 11-A Science: academic, house, sports, competition and individual honours.",
      },
      { property: "og:title", content: "Hall of Fame — Class 11-A Science" },
      { property: "og:description", content: "Achievements and honours of Class 11-A Science." },
    ],
  }),
  component: AchievementsPage,
});

function AchievementsPage() {
  const [cat, setCat] = useState<string>("All");
  const list = cat === "All" ? achievements : achievements.filter((a) => a.category === cat);

  return (
    <PageShell>
      <SectionHero
        eyebrow="Hall of Fame"
        title="Achievements"
        subtitle="Every milestone of Class 11-A, preserved"
        description="Trophies, medals and certificates take their place here as they are earned."
      />
      <Section hint={`${list.length} display cases`}>
        <div className="mb-6 flex flex-wrap gap-2">
          {["All", ...achievementCategories].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.14em] transition-colors",
                cat === c
                  ? "border-primary/60 bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((a) => (
            <AchievementCard key={a.id} item={a} />
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
