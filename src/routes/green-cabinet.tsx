import { createFileRoute } from "@tanstack/react-router";
import { greenCabinet, greenMission } from "@/data/greenCabinet";
import {
  GlassPanel,
  PageShell,
  PhotoSlot,
  PlaceholderBadge,
  Section,
  SectionHero,
  StatCounter,
} from "@/components/nexus/primitives";
import { Scene } from "@/components/three/Scene";

export const Route = createFileRoute("/green-cabinet")({
  head: () => ({
    meta: [
      { title: "Green Cabinet — Class 11-A Science" },
      {
        name: "description",
        content:
          "The 12-member Green Cabinet of Class 11-A Science: guardians of a cleaner classroom and a greener future.",
      },
      { property: "og:title", content: "Green Cabinet — Class 11-A Science" },
      {
        property: "og:description",
        content: "Guardians of a cleaner classroom and a greener future.",
      },
    ],
  }),
  component: GreenCabinetPage,
});

function GreenCabinetPage() {
  const named = greenCabinet.filter((m) => m.name).length;

  return (
    <PageShell>
      <div className="relative">
        <div className="absolute inset-0 h-[520px] overflow-hidden">
          <Scene name="green" className="opacity-70" />
        </div>
        <SectionHero
          eyebrow="Green Zone"
          title="Green Cabinet"
          subtitle="Guardians of a Cleaner Classroom and a Greener Future"
          description="Twelve students of Class 11-A Science who keep our classroom clean, organized and environmentally responsible."
          accent="var(--eco)"
        />
      </div>

      <Section>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCounter value={12} label="Members" />
          <StatCounter value={named} label="Names Confirmed" delay={80} />
          <StatCounter value={8} label="Missions" delay={160} />
          <StatCounter value={1} label="Classroom" delay={240} />
        </div>
      </Section>

      <Section title="Our Mission" hint="Why the cabinet exists">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {greenMission.map((m, i) => (
            <GlassPanel
              key={m}
              hover
              className="p-5"
              style={{ borderColor: "color-mix(in oklab, var(--eco) 22%, transparent)" }}
            >
              <span className="font-mono text-xs" style={{ color: "var(--eco)" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90">{m}</p>
            </GlassPanel>
          ))}
        </div>
      </Section>

      <Section title="The 12 Members" hint={`${named} of 12 confirmed`}>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {greenCabinet.map((m) => (
            <GlassPanel
              key={m.slot}
              hover
              className="overflow-hidden p-0"
              style={{ borderColor: "color-mix(in oklab, var(--eco) 22%, transparent)" }}
            >
              <div className="relative aspect-[4/5]">
                <PhotoSlot src={null} alt={m.name ?? `Member ${m.slot}`} accent="var(--eco)" />
                <span className="absolute left-3 top-3 rounded-lg border border-white/15 bg-black/55 px-2 py-1 font-mono text-[0.6rem] tracking-[0.16em] text-white/90 backdrop-blur-md">
                  {String(m.slot).padStart(2, "0")}
                </span>
              </div>
              <div className="p-4">
                {m.name ? (
                  <>
                    <p className="truncate font-display text-sm font-medium">{m.name}</p>
                    <p className="label-mono mt-1.5">
                      {m.roll ? `Roll ${String(m.roll).padStart(2, "0")}` : "Roll TBA"}
                    </p>
                  </>
                ) : (
                  <PlaceholderBadge label="Member awaited" />
                )}
              </div>
            </GlassPanel>
          ))}
        </div>
      </Section>

      <Section>
        <GlassPanel
          className="px-8 py-12 text-center"
          style={{ borderColor: "color-mix(in oklab, var(--eco) 30%, transparent)" }}
        >
          <p className="font-display text-xl sm:text-2xl" style={{ color: "var(--eco)" }}>
            A cleaner classroom today, a greener planet tomorrow.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Green Cabinet · Class 11-A Science
          </p>
        </GlassPanel>
      </Section>
    </PageShell>
  );
}
