import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { houses, getHouse } from "@/data/houses";
import { students } from "@/data/students";
import type { HouseId } from "@/data/types";
import {
  EmptyState,
  Field,
  GlassPanel,
  PageShell,
  Section,
  SectionHero,
} from "@/components/nexus/primitives";
import { StudentCard } from "@/components/nexus/cards";

const validIds = houses.map((h) => h.id) as string[];

export const Route = createFileRoute("/houses/$house")({
  loader: ({ params }) => {
    if (!validIds.includes(params.house)) throw notFound();
    const house = getHouse(params.house as HouseId)!;
    return { house };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "House not found — Class 11-A Science" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.house.name} House — Class 11-A Science`;
    return {
      meta: [
        { title },
        {
          name: "description",
          content: `${loaderData.house.name} House of Class 11-A Science — members, captains, points and achievements.`,
        },
        { property: "og:title", content: title },
        {
          property: "og:description",
          content: `Inside the ${loaderData.house.name} tower of the Class 11-A Science universe.`,
        },
      ],
    };
  },
  component: HousePage,
});

function HousePage() {
  const { house } = Route.useLoaderData();
  const accent = `var(${house.colorVar})`;
  const members = students.filter((s) => s.house === house.id);

  return (
    <PageShell>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[500px]"
        style={{
          background: `radial-gradient(60% 60% at 50% 0%, color-mix(in oklab, ${accent} 22%, transparent), transparent 70%)`,
        }}
      />
      <SectionHero
        eyebrow={`${house.emblem} House Tower`}
        title={house.name}
        subtitle={house.motto ?? "Motto to be added"}
        description={house.description ?? "House details will appear here once provided."}
        accent={accent}
      />

      <Section>
        <div className="mb-6 flex flex-wrap gap-2">
          {houses.map((h) => (
            <Link
              key={h.id}
              to="/houses/$house"
              params={{ house: h.id }}
              className="rounded-full border border-border px-4 py-1.5 text-xs uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ style: { color: `var(${h.colorVar})`, borderColor: `var(${h.colorVar})` } }}
            >
              {h.name}
            </Link>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <GlassPanel className="p-6" style={{ borderColor: `color-mix(in oklab, ${accent} 30%, transparent)` }}>
            <h2 className="font-display text-lg font-semibold">House Details</h2>
            <div className="mt-2">
              <Field label="House Teacher" value={house.teacher} />
              <Field label="Captain" value={house.captain} />
              <Field label="Vice Captain" value={house.viceCaptain} />
              <Field label="Motto" value={house.motto} />
            </div>
          </GlassPanel>

          <GlassPanel className="flex flex-col items-center justify-center p-8 text-center">
            <span className="font-display text-6xl" style={{ color: accent }}>
              {house.emblem}
            </span>
            <p className="label-mono mt-5">House Points</p>
            <p className="font-display text-5xl font-semibold tabular-nums" style={{ color: accent }}>
              {house.points}
            </p>
            <Link to="/houses" className="mt-5 text-xs uppercase tracking-[0.16em] text-primary">
              View championship →
            </Link>
          </GlassPanel>
        </div>
      </Section>

      <Section title="House Members" hint={`${members.length} assigned`}>
        {members.length ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {members.map((s) => (
              <StudentCard key={s.roll} student={s} />
            ))}
          </div>
        ) : (
          <EmptyState label={`No students have been assigned to ${house.name} yet. Add a house to any student record and they will appear here.`} />
        )}
      </Section>

      <Section title="Achievements & Competitions">
        <div className="grid gap-4 md:grid-cols-2">
          <ListPanel title="Achievements" items={house.achievements} />
          <ListPanel title="Events & Competitions" items={house.events} />
        </div>
      </Section>

      <Section title="House Media">
        <EmptyState label={`Photos and videos from ${house.name} activities will be displayed here.`} />
      </Section>
    </PageShell>
  );
}

function ListPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <GlassPanel className="p-6">
      <h3 className="font-display text-base font-semibold">{title}</h3>
      {items.length ? (
        <ul className="mt-4 space-y-2 text-sm">
          {items.map((i) => (
            <li key={i} className="flex gap-2">
              <span className="text-primary">◆</span>
              {i}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">Awaiting details.</p>
      )}
    </GlassPanel>
  );
}
