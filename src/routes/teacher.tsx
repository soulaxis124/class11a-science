import { createFileRoute } from "@tanstack/react-router";
import { teacher } from "@/data/classInfo";
import {
  Field,
  GlassPanel,
  PageShell,
  PhotoSlot,
  PlaceholderBadge,
  Section,
  SectionHero,
} from "@/components/nexus/primitives";

export const Route = createFileRoute("/teacher")({
  head: () => ({
    meta: [
      { title: "Our Class Teacher — Rachna Ma'am | Class 11-A Science" },
      {
        name: "description",
        content:
          "The teacher's chamber of Class 11-A Science — a profile space for Rachna Ma'am, our class teacher.",
      },
      { property: "og:title", content: "Our Class Teacher — Rachna Ma'am" },
      {
        property: "og:description",
        content: "The teacher's chamber of Class 11-A Science.",
      },
    ],
  }),
  component: TeacherPage,
});

function TeacherPage() {
  return (
    <PageShell>
      <SectionHero
        eyebrow="Teacher's Chamber"
        title="Our Class Teacher"
        subtitle={teacher.name}
        description="An academic space dedicated to the teacher who guides Class 11-A Science."
      />

      <Section>
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <GlassPanel className="overflow-hidden p-0">
            <div className="relative aspect-[4/5]">
              <PhotoSlot src={teacher.photo} alt={teacher.name} />
            </div>
            <div className="p-6 text-center">
              <p className="font-display text-2xl font-semibold">{teacher.name}</p>
              <p className="label-mono mt-2">Class Teacher · 11-A Science</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {teacher.subjects.length ? (
                  teacher.subjects.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-primary/12 px-3 py-1 text-xs text-primary"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <PlaceholderBadge label="Subjects awaited" />
                )}
              </div>
            </div>
          </GlassPanel>

          <div className="space-y-6">
            <GlassPanel className="p-6">
              <h2 className="font-display text-lg font-semibold">Profile</h2>
              <div className="mt-2">
                <Field label="Introduction" value={teacher.introduction} />
                <Field label="Teaching Philosophy" value={teacher.philosophy} />
                <Field label="Message for the Class" value={teacher.message} />
              </div>
            </GlassPanel>

            <div className="grid gap-6 md:grid-cols-2">
              <ListPanel title="Achievements" items={teacher.achievements} />
              <ListPanel title="Responsibilities" items={teacher.responsibilities} />
            </div>

            <GlassPanel className="p-6">
              <h2 className="font-display text-lg font-semibold">Important Quotes</h2>
              {teacher.quotes.length ? (
                <ul className="mt-4 space-y-3">
                  {teacher.quotes.map((q) => (
                    <li key={q} className="border-l-2 border-primary/50 pl-4 text-sm italic">
                      {q}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">
                  Quotes will appear here once provided. <PlaceholderBadge />
                </p>
              )}
            </GlassPanel>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}

function ListPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <GlassPanel className="p-6">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      {items.length ? (
        <ul className="mt-4 space-y-2 text-sm text-foreground/90">
          {items.map((i) => (
            <li key={i} className="flex gap-2">
              <span className="text-primary">◆</span>
              {i}
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4">
          <PlaceholderBadge label="Awaiting details" />
        </div>
      )}
    </GlassPanel>
  );
}
