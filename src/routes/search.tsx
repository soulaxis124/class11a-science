import { useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useContentSection } from "@/hooks/useSiteContent";
import { GlassPanel } from "@/components/nexus/primitives";
import { houses } from "@/data/houses";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Find a Student — Class 11-A Science" },
      {
        name: "description",
        content:
          "Search Class 11-A Science students by name, roll number or house and open their profile page.",
      },
      { property: "og:title", content: "Find a Student — Class 11-A Science" },
      {
        property: "og:description",
        content: "Search students of Class 11-A Science by name, roll number or house.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const students = useContentSection("students");
  const [query, setQuery] = useState("");

  const houseName = useMemo(() => new Map(houses.map((h) => [h.id, h.name] as const)), []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => {
      const house = s.house ? `${s.house} ${houseName.get(s.house) ?? ""}` : "";
      return (
        (s.name ?? "").toLowerCase().includes(q) ||
        String(s.roll).includes(q) ||
        house.toLowerCase().includes(q) ||
        s.roles.some((r) => r.toLowerCase().includes(q))
      );
    });
  }, [students, query, houseName]);

  return (
    <main className="relative min-h-screen px-4 pb-24 pt-28">
      <div className="mx-auto w-full max-w-4xl">
        <p className="label-mono">Directory search</p>
        <h1 className="mt-1 font-display text-3xl font-semibold sm:text-4xl">Find a student</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Search by name, roll number, house or role.
        </p>

        <label className="mt-6 block">
          <span className="sr-only">Search students</span>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Ashish, 12, Chanakya, monitor"
            className="w-full rounded-2xl border border-border bg-surface/60 px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </label>

        <p className="label-mono mt-4">
          {results.length} {results.length === 1 ? "match" : "matches"}
        </p>

        {results.length === 0 ? (
          <GlassPanel className="mt-4 p-8 text-center text-sm text-muted-foreground">
            No student matches “{query}”.
          </GlassPanel>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {results.map((s) => (
              <li key={s.roll}>
                <Link
                  to="/students/$roll"
                  params={{ roll: String(s.roll) }}
                  className="flex items-center gap-4 rounded-2xl border border-border/70 bg-surface/40 p-4 transition-colors hover:bg-surface/70"
                >
                  <span className="label-mono w-10 shrink-0">
                    {String(s.roll).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm">{s.name ?? "Name not added yet"}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {(s.house ? houseName.get(s.house) : null) ?? "House not assigned"}
                      {s.roles.length > 1 ? ` · ${s.roles.filter((r) => r !== "Student").join(", ")}` : ""}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
