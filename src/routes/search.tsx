import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSiteContent } from "@/hooks/useSiteContent";
import { GlassPanel } from "@/components/nexus/primitives";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search the Class Universe — Class 11-A Science" },
      {
        name: "description",
        content:
          "Search everything in Class 11-A Science: students, houses, teachers, achievements, events, projects, photos, timeline, lab work and yearbook memories.",
      },
      { property: "og:title", content: "Search — Class 11-A Science" },
      {
        property: "og:description",
        content: "One search box for students, houses, teachers, achievements, events and memories.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SearchPage,
});

interface Hit {
  key: string;
  group: string;
  title: string;
  sub: string;
  href: string;
  haystack: string;
}

function SearchPage() {
  const { content } = useSiteContent();
  const [query, setQuery] = useState("");

  const index = useMemo<Hit[]>(() => {
    const hits: Hit[] = [];
    const houseName = new Map(content.houses.map((h) => [h.id, h.name] as const));
    const push = (h: Omit<Hit, "haystack"> & { extra?: (string | number | null)[] }) => {
      const { extra = [], ...rest } = h;
      hits.push({
        ...rest,
        haystack: [rest.title, rest.sub, rest.group, ...extra]
          .filter(Boolean)
          .join(" ")
          .toLowerCase(),
      });
    };

    content.students.forEach((s) =>
      push({
        key: `student-${s.roll}`,
        group: "Students",
        title: s.name ?? `Roll ${s.roll} — name not added yet`,
        sub: `Roll ${String(s.roll).padStart(2, "0")} · ${
          (s.house ? houseName.get(s.house) : null) ?? "House not assigned"
        }`,
        href: `/students/${s.roll}`,
        extra: [s.roll, s.house, ...s.roles],
      }),
    );

    content.houses.forEach((h) =>
      push({
        key: `house-${h.id}`,
        group: "Houses",
        title: h.name,
        sub: h.motto ?? "House of Class 11-A",
        href: `/houses/${h.id}`,
        extra: [h.id, h.emblem],
      }),
    );

    content.houseMembers.forEach((m, i) =>
      push({
        key: `house-member-${m.id ?? i}`,
        group: "House members",
        title: m.name ?? "Member",
        sub: `${(m.house ? houseName.get(m.house) : null) ?? "House"}${m.notes ? ` · ${m.notes}` : ""}`,
        href: m.house ? `/houses/${m.house}` : "/houses",
        extra: [m.roll, m.notes],
      }),
    );

    content.teachers.forEach((t) =>
      push({
        key: `teacher-${t.id}`,
        group: "Teachers",
        title: t.name ?? t.subject ?? "Teacher",
        sub: t.subject ?? "Subject teacher",
        href: "/teachers",
        extra: [t.quote ?? null],
      }),
    );

    content.principal.forEach((p) =>
      push({
        key: `principal-${p.id}`,
        group: "Principal",
        title: p.name ?? "Principal",
        sub: p.message ?? "Principal of the school",
        href: "/teachers",
      }),
    );

    content.greenCabinet.forEach((m) =>
      push({
        key: `green-${m.slot}`,
        group: "Green Cabinet",
        title: m.name ?? `Slot ${m.slot}`,
        sub: m.role ?? m.responsibility ?? "Green Cabinet member",
        href: "/green-cabinet",
        extra: [m.roll, m.responsibility],
      }),
    );

    content.leadership.forEach((l) =>
      push({
        key: `lead-${l.id}`,
        group: "Leadership",
        title: l.name ?? l.role,
        sub: l.role,
        href: "/monitors",
        extra: [l.note],
      }),
    );

    content.achievements.forEach((a) =>
      push({
        key: `ach-${a.id}`,
        group: "Achievements",
        title: a.title ?? "Achievement",
        sub: [a.category, a.holder, a.date].filter(Boolean).join(" · "),
        href: "/achievements",
        extra: [a.description],
      }),
    );

    content.events.forEach((e) =>
      push({
        key: `event-${e.id}`,
        group: "Events",
        title: e.title ?? "Event",
        sub: [e.date, e.type].filter(Boolean).join(" · "),
        href: "/events",
        extra: [e.description],
      }),
    );

    content.projects.forEach((p) =>
      push({
        key: `project-${p.id}`,
        group: "Projects",
        title: p.title ?? "Project",
        sub: [p.subject, p.team].filter(Boolean).join(" · "),
        href: "/projects",
        extra: [p.description],
      }),
    );

    content.gallery.forEach((g) =>
      push({
        key: `photo-${g.id}`,
        group: "Photos",
        title: g.caption ?? "Photo",
        sub: g.album ?? "Gallery",
        href: "/gallery",
      }),
    );

    content.timeline.forEach((t) =>
      push({
        key: `timeline-${t.id}`,
        group: "Timeline",
        title: t.title ?? "Milestone",
        sub: t.date ?? "Class journey",
        href: "/timeline",
        extra: [t.description],
      }),
    );

    content.labSections.forEach((s) => {
      push({
        key: `lab-${s.id}`,
        group: "Science Lab",
        title: s.name,
        sub: s.tagline,
        href: "/science-lab",
        extra: [s.symbol],
      });
      s.entries.forEach((e) =>
        push({
          key: `lab-${s.id}-${e.id}`,
          group: "Science Lab",
          title: e.title ?? "Lab entry",
          sub: `${s.name} · experiment`,
          href: "/science-lab",
          extra: [e.note],
        }),
      );
    });

    content.yearbookEntries.forEach((y) =>
      push({
        key: `yearbook-${y.id}`,
        group: "Yearbook",
        title: y.title ?? "Memory",
        sub: y.date ?? "Yearbook memory",
        href: "/yearbook",
        extra: [y.description],
      }),
    );

    return hits;
  }, [content]);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matched = q ? index.filter((h) => h.haystack.includes(q)) : index;
    const map = new Map<string, Hit[]>();
    for (const hit of matched) {
      const list = map.get(hit.group) ?? [];
      list.push(hit);
      map.set(hit.group, list);
    }
    return Array.from(map.entries());
  }, [index, query]);

  const total = groups.reduce((n, [, list]) => n + list.length, 0);

  return (
    <main className="relative min-h-screen px-4 pb-24 pt-28">
      <div className="mx-auto w-full max-w-4xl">
        <p className="label-mono">Universal search</p>
        <h1 className="mt-1 font-display text-3xl font-semibold sm:text-4xl">
          Search the class universe
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Students, houses, teachers, Green Cabinet, achievements, events, projects, photos,
          timeline, lab work and yearbook memories.
        </p>

        <label className="mt-6 block">
          <span className="sr-only">Search everything</span>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Ashish, 12, Chanakya, physics, sports day"
            className="w-full rounded-2xl border border-border bg-surface/60 px-4 py-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-primary sm:text-sm"
          />
        </label>

        <p className="label-mono mt-4">
          {total} {total === 1 ? "result" : "results"}
          {query.trim() ? ` for “${query.trim()}”` : " across the whole site"}
        </p>

        {total === 0 ? (
          <GlassPanel className="mt-4 p-8 text-center text-sm text-muted-foreground">
            Nothing matches “{query}” yet.
          </GlassPanel>
        ) : (
          <div className="mt-4 space-y-8">
            {groups.map(([group, list]) => (
              <section key={group}>
                <h2 className="label-mono">
                  {group} · {list.length}
                </h2>
                <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                  {list.map((hit) => (
                    <li key={hit.key}>
                      <a
                        href={hit.href}
                        className="block rounded-2xl border border-border/70 bg-surface/40 p-4 transition-colors hover:bg-surface/70"
                      >
                        <span className="block truncate text-sm">{hit.title}</span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {hit.sub}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
