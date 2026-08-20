import { createFileRoute } from "@tanstack/react-router";
import { GlassPanel, PageShell, PhotoSlot, PlaceholderBadge, Section, SectionHero } from "@/components/nexus/primitives";
import { Scene } from "@/components/three/Scene";
import { useContentSection } from "@/hooks/useSiteContent";

export const Route = createFileRoute("/science-lab")({
  head: () => ({
    meta: [
      { title: "Science Lab — Class 11-A Science" },
      {
        name: "description",
        content:
          "A virtual laboratory for Class 11-A Science with Physics, Chemistry, Biology and Mathematics zones.",
      },
      { property: "og:title", content: "Science Lab — Class 11-A Science" },
      { property: "og:description", content: "Our virtual laboratory across four disciplines." },
    ],
  }),
  component: ScienceLabPage,
});

function ScienceLabPage() {
  const labSections = useContentSection("labSections");
  return (
    <PageShell>
      <div className="relative">
        <div className="absolute inset-0 h-[460px] overflow-hidden">
          <Scene name="lab" className="opacity-70" />
        </div>
        <SectionHero
          eyebrow="Virtual Laboratory"
          title="Science Lab"
          subtitle="Where Curiosity Becomes Discovery"
          description="Four disciplines, one laboratory. Experiments, models and demonstrations will be added here."
        />
      </div>

      <Section>
        <div className="grid gap-4 sm:grid-cols-2">
          {labSections.map((s) => (
            <GlassPanel key={s.id} hover className="p-6">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl border border-border bg-surface/60 text-lg">
                  {s.symbol}
                </span>
                <div>
                  <h2 className="font-display text-lg font-semibold uppercase tracking-wide">
                    {s.name}
                  </h2>
                  <p className="text-xs text-muted-foreground">{s.tagline}</p>
                </div>
              </div>
              <ul className="mt-5 space-y-2">
                {s.entries.map((e) => (
                  <li
                    key={e.id}
                    className="flex items-center gap-3 rounded-xl border border-border/60 p-3"
                  >
                    <span className="size-12 shrink-0 overflow-hidden rounded-lg border border-border/60">
                      <PhotoSlot src={e.media} alt={e.title ?? "Experiment"} />
                    </span>
                    <span className="min-w-0 flex-1 text-sm">
                      <span className="block">{e.title ?? <span className="text-muted-foreground">Experiment slot</span>}</span>
                      {e.note && <span className="mt-1 block text-xs text-muted-foreground">{e.note}</span>}
                    </span>
                    {!e.title && <PlaceholderBadge label="Awaited" />}
                  </li>
                ))}
              </ul>
            </GlassPanel>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
