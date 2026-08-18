import { createFileRoute } from "@tanstack/react-router";
import { houses } from "@/data/houses";
import { GlassPanel, PageShell, Section, SectionHero } from "@/components/nexus/primitives";
import { HouseCard } from "@/components/nexus/cards";
import { HouseCrest } from "@/components/nexus/HouseCrest";
import { Scene } from "@/components/three/Scene";

export const Route = createFileRoute("/houses/")({
  head: () => ({
    meta: [
      { title: "Four Houses — Chanakya · Valmiki · Patanjali · Dronacharya | Class 11-A" },
      {
        name: "description",
        content:
          "The four house towers of Class 11-A Science — Chanakya, Valmiki, Patanjali and Dronacharya — plus the live house championship leaderboard.",
      },
      { property: "og:title", content: "Four Houses of Class 11-A Science" },
      {
        property: "og:description",
        content: "Explore the four house towers and the house championship leaderboard.",
      },
    ],
  }),
  component: HousesPage,
});

function HousesPage() {
  const ranked = [...houses].sort((a, b) => b.points - a.points);
  const allZero = houses.every((h) => h.points === 0);
  const maxPoints = Math.max(1, ...houses.map((h) => h.points));

  return (
    <PageShell>
      <SectionHero
        eyebrow="House Towers"
        title="Four Houses"
        subtitle="One Class. Four Houses. One Scientific Journey."
        description="Four towers rise from the class universe. Each holds its own members, captains, colors and story."
      />

      <Section>
        <GlassPanel className="overflow-hidden p-0">
          <div className="relative h-[50vh] min-h-[340px]">
            <Scene name="towers" />
          </div>
          <p className="border-t border-border px-5 py-3 text-center text-xs text-muted-foreground">
            Click a tower to enter that house
          </p>
        </GlassPanel>
      </Section>

      <Section title="The Houses">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {houses.map((h) => (
            <HouseCard key={h.id} house={h} />
          ))}
        </div>
      </Section>

      <Section title="House Championship" hint={allZero ? "Awaiting points" : "Live standings"}>
        <GlassPanel className="overflow-hidden p-0">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-5 py-3 label-mono font-normal">House</th>
                <th className="px-5 py-3 label-mono font-normal">Progress</th>
                <th className="px-5 py-3 label-mono font-normal text-right">Points</th>
                <th className="px-5 py-3 label-mono font-normal text-right">Position</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((h, i) => {
                const accent = `var(${h.colorVar})`;
                return (
                  <tr key={h.id} className="border-b border-border/50 last:border-0">
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-3">
                        <HouseCrest id={h.id} className="size-9" />
                        <span className="font-display font-medium">{h.name}</span>
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="block h-1.5 w-full overflow-hidden rounded-full bg-surface">
                        <span
                          className="block h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${(h.points / maxPoints) * 100}%`,
                            background: accent,
                          }}
                        />
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-display tabular-nums" style={{ color: accent }}>
                      {h.points}
                    </td>
                    <td className="px-5 py-4 text-right text-muted-foreground">
                      {allZero ? "—" : `#${i + 1}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </GlassPanel>
      </Section>
    </PageShell>
  );
}
