import { createFileRoute, Link } from "@tanstack/react-router";
import { classInfo } from "@/data/classInfo";
import { GlassPanel, PageShell, Section, SectionHero } from "@/components/nexus/primitives";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Created by Asadullah | Class 11-A Science" },
      {
        name: "description",
        content:
          "Science Nexus was designed and developed by Asadullah as a digital representation of Class 11-A Science.",
      },
      { property: "og:title", content: "About Science Nexus — Created by Asadullah" },
      {
        property: "og:description",
        content: "A digital representation of Class 11-A Science, designed and developed by Asadullah.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PageShell>
      <SectionHero eyebrow="Website Creator" title="Created By" subtitle="Asadullah" />

      <Section>
        <GlassPanel className="mx-auto max-w-2xl px-8 py-12 text-center">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Designed and developed as a digital representation of Class 11-A Science.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Class", value: "11-A Science" },
              { label: "Roll Number", value: "11" },
              { label: "Project", value: classInfo.identity },
            ].map((f) => (
              <div key={f.label} className="rounded-xl border border-border/60 px-4 py-4">
                <p className="label-mono">{f.label}</p>
                <p className="mt-1.5 text-sm">{f.value}</p>
              </div>
            ))}
          </div>
          <Link
            to="/students/$roll"
            params={{ roll: "11" }}
            className="mt-8 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            View student profile
          </Link>
        </GlassPanel>
      </Section>
    </PageShell>
  );
}
