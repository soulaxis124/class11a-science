import { Link } from "@tanstack/react-router";
import type { Achievement, GalleryItem, House, Project, Student, TimelineEntry } from "@/data/types";
import { houseColor, getHouse } from "@/data/houses";
import { HouseCrest } from "@/components/nexus/HouseCrest";
import { NexusIcon } from "@/components/nexus/icons";
import { displayName } from "@/data/students";
import { GlassPanel, PhotoSlot, PlaceholderBadge } from "./primitives";

export function StudentCard({ student }: { student: Student }) {
  const house = getHouse(student.house);
  const accent = houseColor(student.house);
  return (
    <Link
      to="/students/$roll"
      params={{ roll: String(student.roll) }}
      className="group block"
    >
      <GlassPanel hover className="h-full overflow-hidden p-0">
        <div className="relative aspect-[4/5] overflow-hidden">
          <PhotoSlot src={student.photo} alt={displayName(student)} accent={accent} />
          <span
            className="absolute left-3 top-3 rounded-lg border border-white/15 bg-black/55 px-2 py-1 font-mono text-[0.65rem] tracking-[0.14em] text-white/90 backdrop-blur-md"
            style={{ borderColor: `color-mix(in oklab, ${accent} 45%, transparent)` }}
          >
            {String(student.roll).padStart(2, "0")}
          </span>
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 to-transparent" />
        </div>
        <div className="p-4">
          <p className="truncate font-display text-sm font-medium group-hover:text-primary">
            {displayName(student)}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span
              className="rounded-full px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.16em]"
              style={{
                color: accent,
                background: `color-mix(in oklab, ${accent} 14%, transparent)`,
              }}
            >
              {house ? house.name : "House TBA"}
            </span>
            {student.roles
              .filter((r) => r !== "Student")
              .map((r) => (
                <span
                  key={r}
                  className="rounded-full bg-primary/12 px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.16em] text-primary"
                >
                  {r}
                </span>
              ))}
          </div>
        </div>
      </GlassPanel>
    </Link>
  );
}

export function HouseCard({ house, position }: { house: House; position?: number }) {
  const accent = `var(${house.colorVar})`;
  const deep = `var(${house.colorVar2})`;
  return (
    <Link to="/houses/$house" params={{ house: house.id }} className="group block">
      <GlassPanel
        hover
        className="depth-card relative h-full overflow-hidden p-6"
        style={{ borderColor: `color-mix(in oklab, ${accent} 30%, transparent)` }}
      >
        <div
          className="absolute -right-10 -top-10 size-40 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-90"
          style={{ background: `color-mix(in oklab, ${accent} 32%, transparent)`, opacity: 0.5 }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-24 opacity-40"
          style={{ background: `linear-gradient(to top, color-mix(in oklab, ${deep} 45%, transparent), transparent)` }}
        />
        <div className="relative">
          <div className="flex items-start justify-between">
            <HouseCrest id={house.id} className="size-16" />
            {position ? (
              <span className="label-mono">Rank #{position}</span>
            ) : null}
          </div>
          <h3 className="mt-4 font-display text-xl font-semibold uppercase tracking-wide">
            {house.name}
          </h3>
          <p className="mt-2 min-h-10 text-sm text-muted-foreground">
            {house.motto ?? "Motto to be added."}
          </p>
          <div className="mt-5 flex items-end justify-between border-t border-border/60 pt-4">
            <div>
              <p className="label-mono">Points</p>
              <p className="font-display text-2xl font-semibold tabular-nums" style={{ color: accent }}>
                {house.points}
              </p>
            </div>
            <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground group-hover:text-primary">
              Enter tower →
            </span>
          </div>
        </div>
      </GlassPanel>
    </Link>
  );
}

export function AchievementCard({ item }: { item: Achievement }) {
  return (
    <GlassPanel hover className="h-full p-5">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-primary/12 px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.18em] text-primary">
          {item.category}
        </span>
        <NexusIcon name="achievements" className="size-4 text-gold" />
      </div>
      <h3 className="mt-4 font-display text-base font-medium">
        {item.title ?? <span className="text-muted-foreground">Achievement slot</span>}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {item.description ?? "Details will appear here once provided."}
      </p>
      <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
        <span className="label-mono">{item.holder ?? "Holder TBA"}</span>
        <span className="label-mono">{item.date ?? "Date TBA"}</span>
      </div>
    </GlassPanel>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <GlassPanel hover className="h-full overflow-hidden p-0">
      <div className="relative aspect-video">
        <PhotoSlot src={project.media} alt={project.title ?? "Project"} />
      </div>
      <div className="p-5">
        <span className="rounded-full bg-primary/12 px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.18em] text-primary">
          {project.subject}
        </span>
        <h3 className="mt-3 font-display text-base font-medium">
          {project.title ?? <span className="text-muted-foreground">Project slot</span>}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {project.description ?? "Project description coming soon."}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
          <span className="label-mono">{project.team ?? "Team TBA"}</span>
          <span className="label-mono">{project.date ?? "Date TBA"}</span>
        </div>
      </div>
    </GlassPanel>
  );
}

export function GalleryCard({
  item,
  onOpen,
}: {
  item: GalleryItem;
  onOpen: (item: GalleryItem) => void;
}) {
  return (
    <button type="button" onClick={() => onOpen(item)} className="group block w-full text-left">
      <GlassPanel hover className="overflow-hidden p-0">
        <div className="relative aspect-[4/3]">
          <PhotoSlot src={item.media} alt={item.title ?? item.category} />
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <span className="truncate text-xs text-foreground/85">
            {item.title ?? "Untitled memory"}
          </span>
          <span className="label-mono shrink-0">{item.category}</span>
        </div>
      </GlassPanel>
    </button>
  );
}

export function TimelineCard({ entry, index }: { entry: TimelineEntry; index: number }) {
  const left = index % 2 === 0;
  return (
    <div className={`relative flex w-full ${left ? "md:justify-start" : "md:justify-end"}`}>
      <span className="absolute left-4 top-6 size-3 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_18px_var(--primary)] md:left-1/2" />
      <GlassPanel hover className="ml-10 w-full p-5 md:ml-0 md:w-[calc(50%-2.5rem)]">
        <span className="label-mono">{entry.tag}</span>
        <h3 className="mt-2 font-display text-base font-medium">
          {entry.title ?? <span className="text-muted-foreground">Moment slot</span>}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {entry.description ?? "This chapter of our journey will be written here."}
        </p>
        <p className="label-mono mt-3">{entry.date ?? "Date TBA"}</p>
      </GlassPanel>
    </div>
  );
}

export function PersonCard({
  name,
  role,
  photo,
  note,
  accent,
}: {
  name: string | null;
  role: string;
  photo: string | null;
  note?: string | null;
  accent?: string;
}) {
  return (
    <GlassPanel hover className="h-full overflow-hidden p-0">
      <div className="relative aspect-[4/5]">
        <PhotoSlot src={photo} alt={name ?? role} accent={accent} />
      </div>
      <div className="p-5">
        <p className="font-display text-lg font-medium">
          {name ?? <PlaceholderBadge label="Name awaited" />}
        </p>
        <p className="label-mono mt-2">{role}</p>
        {note ? <p className="mt-3 text-sm text-muted-foreground">{note}</p> : null}
      </div>
    </GlassPanel>
  );
}
