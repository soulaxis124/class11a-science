import { createFileRoute } from "@tanstack/react-router";
import { useContentSection } from "@/hooks/useSiteContent";
import { PersonCard } from "@/components/nexus/cards";
import {
  EmptyState,
  Field,
  GlassPanel,
  PageShell,
  PhotoSlot,
  PlaceholderBadge,
  Section,
  SectionHero,
} from "@/components/nexus/primitives";
import { Reveal } from "@/components/nexus/Reveal";

export const Route = createFileRoute("/teachers")({
  head: () => ({
    meta: [
      { title: "Subject Teachers & Principal — Class 11-A Science" },
      {
        name: "description",
        content:
          "The faculty of Class 11-A Science — subject teachers across English, Physics, Chemistry, Computer Science, Physical Education, Fine Arts and Mathematics.",
      },
      { property: "og:title", content: "Subject Teachers — Class 11-A Science" },
      {
        property: "og:description",
        content: "Meet the subject teachers who guide Class 11-A Science.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TeachersPage,
});

function TeachersPage() {
  const teachers = useContentSection("teachers");
  const principalRows = useContentSection("principal");
  const principal = principalRows[0];
  const ordered = [...teachers].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const hasPrincipal = Boolean(
    principal && (principal.name || principal.message || principal.introduction),
  );

  return (
    <PageShell>
      <SectionHero
        eyebrow="Faculty"
        title="Subject Teachers"
        subtitle="The people who guide Class 11-A Science"
        description="Every subject of our stream and the teacher who leads it. More teachers can be added at any time."
      />

      <Section title="Subject Teachers" hint={`${ordered.length} recorded`}>
        {ordered.length ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {ordered.map((t, i) => (
              <Reveal key={t.id} delay={i * 70}>
                <PersonCard
                  name={t.name}
                  role={t.role ? `${t.subject ?? "Subject"} · ${t.role}` : (t.subject ?? "Subject")}
                  photo={t.photo}
                  note={t.qualification ?? t.bio ?? t.quote}
                />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState label="Teacher records will appear here once added." />
        )}
      </Section>

      <Section title="Principal" hint={hasPrincipal ? undefined : "Awaiting details"}>
        {hasPrincipal ? (
          <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
            <GlassPanel className="overflow-hidden p-0">
              <div className="relative aspect-[4/5]">
                <PhotoSlot src={principal!.photo} alt={principal!.name ?? "Principal"} />
              </div>
              <div className="p-6 text-center">
                <p className="font-display text-xl font-semibold">
                  {principal!.name ?? <PlaceholderBadge label="Name awaited" />}
                </p>
                <p className="label-mono mt-2">Principal</p>
              </div>
            </GlassPanel>
            <GlassPanel className="p-6">
              <h3 className="font-display text-lg font-semibold">Message</h3>
              <div className="mt-2">
                <Field label="Introduction" value={principal!.introduction} />
                <Field label="Message" value={principal!.message} />
                <Field label="Quote" value={principal!.quote} />
              </div>
              {principal!.achievements?.length ? (
                <ul className="mt-4 space-y-2 text-sm">
                  {principal!.achievements.map((a) => (
                    <li key={a} className="flex gap-2">
                      <span className="text-primary">◆</span>
                      {a}
                    </li>
                  ))}
                </ul>
              ) : null}
            </GlassPanel>
          </div>
        ) : (
          <EmptyState label="Principal information has not been added yet." />
        )}
      </Section>
    </PageShell>
  );
}
