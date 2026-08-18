import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { students, displayName } from "@/data/students";
import { houses } from "@/data/houses";
import type { HouseId, StudentRole } from "@/data/types";
import { GlassPanel, PageShell, Section, SectionHero } from "@/components/nexus/primitives";
import { StudentCard } from "@/components/nexus/cards";
import { Scene } from "@/components/three/Scene";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/students/")({
  head: () => ({
    meta: [
      { title: "Student Hub — 33 Students | Class 11-A Science" },
      {
        name: "description",
        content:
          "Explore all 33 students of Class 11-A Science in a searchable directory and a 3D student constellation.",
      },
      { property: "og:title", content: "Student Hub — 33 Students of Class 11-A" },
      {
        property: "og:description",
        content: "A searchable directory and 3D constellation of our 33 classmates.",
      },
    ],
  }),
  component: StudentsPage,
});

const roleFilters: (StudentRole | "All")[] = [
  "All",
  "Student",
  "Boys Monitor",
  "Girls Monitor",
  "Green Cabinet",
];

function StudentsPage() {
  const [query, setQuery] = useState("");
  const [house, setHouse] = useState<HouseId | "All">("All");
  const [role, setRole] = useState<StudentRole | "All">("All");
  const [sort, setSort] = useState<"roll" | "name">("roll");
  const [showConstellation, setShowConstellation] = useState(true);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = students.filter((s) => {
      const matchesQuery =
        !q ||
        displayName(s).toLowerCase().includes(q) ||
        String(s.roll) === q ||
        String(s.roll).padStart(2, "0") === q;
      const matchesHouse = house === "All" || s.house === house;
      const matchesRole = role === "All" || s.roles.includes(role);
      return matchesQuery && matchesHouse && matchesRole;
    });
    return [...list].sort((a, b) =>
      sort === "roll" ? a.roll - b.roll : displayName(a).localeCompare(displayName(b)),
    );
  }, [query, house, role, sort]);

  return (
    <PageShell>
      <SectionHero
        eyebrow="Student Hub"
        title="Our 33 Students"
        subtitle="33 Students. 4 Houses. 1 Class."
        description="Every classmate has a permanent place here. Names, photos and houses appear as soon as they are provided."
      />

      <Section title="33-Student Constellation" hint="Hover a node · click to open a profile">
        <GlassPanel className="overflow-hidden p-0">
          <div className="relative h-[60vh] min-h-[380px]">
            {showConstellation ? (
              <Scene name="constellation" />
            ) : (
              <div className="grid h-full place-items-center p-6">
                <p className="text-sm text-muted-foreground">
                  Constellation paused for performance.
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between border-t border-border px-5 py-3">
            <p className="label-mono">33 nodes · 1 class</p>
            <button
              type="button"
              onClick={() => setShowConstellation((v) => !v)}
              className="text-xs uppercase tracking-[0.18em] text-primary"
            >
              {showConstellation ? "Pause 3D" : "Resume 3D"}
            </button>
          </div>
        </GlassPanel>
      </Section>

      <Section title="Student Directory" hint={`${filtered.length} of ${students.length}`}>
        <GlassPanel className="mb-6 p-4">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or roll number…"
                className="w-full rounded-xl border border-input bg-surface/50 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60"
              />
            </div>

            <FilterRow label="House">
              <Chip active={house === "All"} onClick={() => setHouse("All")}>
                All
              </Chip>
              {houses.map((h) => (
                <Chip
                  key={h.id}
                  active={house === h.id}
                  onClick={() => setHouse(h.id)}
                  color={`var(${h.colorVar})`}
                >
                  {h.name}
                </Chip>
              ))}
            </FilterRow>

            <FilterRow label="Role">
              {roleFilters.map((r) => (
                <Chip key={r} active={role === r} onClick={() => setRole(r)}>
                  {r}
                </Chip>
              ))}
            </FilterRow>

            <FilterRow label="Sort">
              <Chip active={sort === "roll"} onClick={() => setSort("roll")}>
                Roll Number
              </Chip>
              <Chip active={sort === "name"} onClick={() => setSort("name")}>
                Name
              </Chip>
            </FilterRow>
          </div>
        </GlassPanel>

        {filtered.length ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {filtered.map((s) => (
              <StudentCard key={s.roll} student={s} />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No students match these filters.
          </p>
        )}
      </Section>
    </PageShell>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="label-mono w-14 shrink-0">{label}</span>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
  color,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs transition-colors",
        active
          ? "border-primary/60 bg-primary/15 text-primary"
          : "border-border text-muted-foreground hover:text-foreground",
      )}
      style={active && color ? { color, borderColor: color, background: `color-mix(in oklab, ${color} 14%, transparent)` } : undefined}
    >
      {children}
    </button>
  );
}
