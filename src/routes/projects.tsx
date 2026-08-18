import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { projects } from "@/data/content";
import { PageShell, Section, SectionHero } from "@/components/nexus/primitives";
import { ProjectCard } from "@/components/nexus/cards";
import { cn } from "@/lib/utils";

const subjects = ["All", "Physics", "Chemistry", "Biology", "Mathematics", "Interdisciplinary"];

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Project Gallery — Class 11-A Science" },
      {
        name: "description",
        content:
          "Science projects, models and investigations built by the students of Class 11-A Science.",
      },
      { property: "og:title", content: "Project Gallery — Class 11-A Science" },
      { property: "og:description", content: "Projects and models built by our class." },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const [subject, setSubject] = useState("All");
  const list = subject === "All" ? projects : projects.filter((p) => p.subject === subject);

  return (
    <PageShell>
      <SectionHero
        eyebrow="Project Gallery"
        title="Our Projects"
        subtitle="Where curiosity becomes discovery"
        description="Each project of Class 11-A gets its own showcase card here."
      />
      <Section hint={`${list.length} projects`}>
        <div className="mb-6 flex flex-wrap gap-2">
          {subjects.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSubject(s)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.14em] transition-colors",
                subject === s
                  ? "border-primary/60 bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
