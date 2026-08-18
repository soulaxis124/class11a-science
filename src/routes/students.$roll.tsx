import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getStudent, displayName } from "@/data/students";
import { getHouse, houseColor } from "@/data/houses";
import {
  Field,
  GlassPanel,
  PageShell,
  PhotoSlot,
  PlaceholderBadge,
  Section,
} from "@/components/nexus/primitives";

export const Route = createFileRoute("/students/$roll")({
  loader: ({ params }) => {
    const roll = Number(params.roll);
    const student = getStudent(roll);
    if (!student) throw notFound();
    return { student };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Student not found — Class 11-A Science" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${displayName(loaderData.student)} — Class 11-A Science`;
    return {
      meta: [
        { title },
        {
          name: "description",
          content: `Profile of roll number ${loaderData.student.roll} in Class 11-A Science.`,
        },
        { property: "og:title", content: title },
        {
          property: "og:description",
          content: `Student profile in the Class 11-A Science digital universe.`,
        },
      ],
    };
  },
  component: StudentProfile,
});

function StudentProfile() {
  const { student } = Route.useLoaderData();
  const house = getHouse(student.house);
  const accent = houseColor(student.house);

  return (
    <PageShell>
      <Section className="pt-28">
        <Link to="/students" className="label-mono transition-colors hover:text-primary">
          ← Back to Student Hub
        </Link>

        <div className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">
          <GlassPanel className="overflow-hidden p-0" style={{ borderColor: `color-mix(in oklab, ${accent} 30%, transparent)` }}>
            <div className="relative aspect-[4/5]">
              <PhotoSlot src={student.photo} alt={displayName(student)} accent={accent} />
            </div>
            <div className="p-6 text-center">
              <p className="font-mono text-xs tracking-[0.24em]" style={{ color: accent }}>
                ROLL {String(student.roll).padStart(2, "0")}
              </p>
              <h1 className="mt-2 font-display text-2xl font-semibold">{displayName(student)}</h1>
              <p className="label-mono mt-2">Class 11-A Science</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span
                  className="rounded-full px-3 py-1 text-xs"
                  style={{ color: accent, background: `color-mix(in oklab, ${accent} 14%, transparent)` }}
                >
                  {house ? house.name : "House to be assigned"}
                </span>
                {student.roles.map((r) => (
                  <span key={r} className="rounded-full bg-primary/12 px-3 py-1 text-xs text-primary">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </GlassPanel>

          <div className="space-y-6">
            <GlassPanel className="p-6">
              <h2 className="font-display text-lg font-semibold">Profile</h2>
              <div className="mt-2">
                <Field label="Introduction" value={student.intro} />
                <Field label="House" value={house?.name ?? null} />
                <Field label="Quote" value={student.quote} />
              </div>
            </GlassPanel>

            <div className="grid gap-6 md:grid-cols-3">
              <ListPanel title="Achievements" items={student.achievements} />
              <ListPanel title="Projects" items={student.projects} />
              <ListPanel title="Interests" items={student.interests} />
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <NavRoll roll={student.roll - 1} label="Previous" />
          <NavRoll roll={student.roll + 1} label="Next" align="right" />
        </div>
      </Section>
    </PageShell>
  );
}

function NavRoll({ roll, label, align }: { roll: number; label: string; align?: "right" }) {
  const student = getStudent(roll);
  if (!student) return <span />;
  return (
    <Link
      to="/students/$roll"
      params={{ roll: String(roll) }}
      className={`glass rounded-xl px-4 py-2.5 text-xs uppercase tracking-[0.16em] transition-colors hover:border-primary/50 ${align === "right" ? "text-right" : ""}`}
    >
      {label} · Roll {String(roll).padStart(2, "0")}
    </Link>
  );
}

function ListPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <GlassPanel className="p-5">
      <h3 className="font-display text-sm font-semibold uppercase tracking-wide">{title}</h3>
      {items.length ? (
        <ul className="mt-3 space-y-2 text-sm text-foreground/90">
          {items.map((i) => (
            <li key={i} className="flex gap-2">
              <span className="text-primary">◆</span>
              {i}
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-3">
          <PlaceholderBadge label="Awaiting details" />
        </div>
      )}
    </GlassPanel>
  );
}
