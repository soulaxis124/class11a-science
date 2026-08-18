/**
 * Content store — the bridge between the static defaults in src/data/*
 * and the admin-managed documents in the `site_content` table.
 *
 * Every section is a single JSON document keyed by `ContentKey`.
 * The public site always renders defaults first, then merges admin data.
 */
import { students as defaultStudents } from "@/data/students";
import { houses as defaultHouses } from "@/data/houses";
import { greenCabinet as defaultGreenCabinet } from "@/data/greenCabinet";
import { achievements as defaultAchievements, timeline as defaultTimeline, gallery as defaultGallery, projects as defaultProjects, events as defaultEvents } from "@/data/content";
import type {
  Achievement,
  ClassEvent,
  GalleryItem,
  GreenMember,
  House,
  Project,
  Student,
  TimelineEntry,
} from "@/data/types";

export interface LeadershipEntry {
  id: string;
  role: string;
  name: string | null;
  note: string | null;
}

export const defaultLeadership: LeadershipEntry[] = [
  { id: "boys-monitor", role: "Boys Monitor", name: "Ibrahim", note: null },
  { id: "girls-monitor", role: "Girls Monitor", name: "Tanishka", note: null },
  { id: "class-teacher", role: "Class Teacher", name: "Rachna Ma'am", note: null },
];

export interface ContentShape {
  students: Student[];
  houses: House[];
  greenCabinet: GreenMember[];
  leadership: LeadershipEntry[];
  achievements: Achievement[];
  events: ClassEvent[];
  gallery: GalleryItem[];
  projects: Project[];
  timeline: TimelineEntry[];
}

export type ContentKey = keyof ContentShape;

export const contentKeys: ContentKey[] = [
  "students",
  "houses",
  "greenCabinet",
  "leadership",
  "achievements",
  "events",
  "gallery",
  "projects",
  "timeline",
];

export const defaultContent: ContentShape = {
  students: defaultStudents,
  houses: defaultHouses,
  greenCabinet: defaultGreenCabinet,
  leadership: defaultLeadership,
  achievements: defaultAchievements,
  events: defaultEvents,
  gallery: defaultGallery,
  projects: defaultProjects,
  timeline: defaultTimeline,
};

export const contentLabels: Record<ContentKey, string> = {
  students: "Students",
  houses: "Houses",
  greenCabinet: "Green Cabinet",
  leadership: "Leadership",
  achievements: "Achievements",
  events: "Events",
  gallery: "Photos",
  projects: "Projects",
  timeline: "Timeline",
};

/** Validation of an incoming JSON document for one section. */
export function validateDocument(key: ContentKey, value: unknown): string[] {
  const errors: string[] = [];
  if (!Array.isArray(value)) return [`"${key}" must be a JSON array.`];

  if (key === "students") {
    if (value.length !== 33) errors.push(`Students must contain exactly 33 entries (got ${value.length}).`);
    const rolls = new Set<number>();
    value.forEach((raw, i) => {
      const s = raw as Partial<Student>;
      if (typeof s.roll !== "number") errors.push(`Entry ${i + 1}: "roll" must be a number.`);
      else if (rolls.has(s.roll)) errors.push(`Duplicate roll number ${s.roll}.`);
      else rolls.add(s.roll);
      if (s.name !== null && typeof s.name !== "string") errors.push(`Entry ${i + 1}: "name" must be text or null.`);
    });
  }

  if (key === "greenCabinet") {
    if (value.length !== 12) errors.push(`Green Cabinet must contain exactly 12 slots (got ${value.length}).`);
    const slots = new Set<number>();
    value.forEach((raw, i) => {
      const m = raw as Partial<GreenMember>;
      if (typeof m.slot !== "number") errors.push(`Slot ${i + 1}: "slot" must be a number.`);
      else if (slots.has(m.slot)) errors.push(`Duplicate slot ${m.slot}.`);
      else slots.add(m.slot);
    });
  }

  if (key === "houses") {
    if (value.length !== 4) errors.push(`There must be exactly 4 houses (got ${value.length}).`);
    value.forEach((raw, i) => {
      const h = raw as Partial<House> & { color?: string };
      if (!h.id) errors.push(`House ${i + 1}: "id" is required.`);
      if (!h.name) errors.push(`House ${i + 1}: "name" is required.`);
      if (h.color && !/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(h.color))
        errors.push(`House ${h.name ?? i + 1}: "color" must be a hex value like #4ade80.`);
    });
  }

  if (["achievements", "events", "gallery", "projects", "timeline", "leadership"].includes(key)) {
    const ids = new Set<string>();
    value.forEach((raw, i) => {
      const item = raw as { id?: string };
      if (!item.id) errors.push(`Entry ${i + 1}: "id" is required.`);
      else if (ids.has(item.id)) errors.push(`Duplicate id "${item.id}".`);
      else ids.add(item.id);
    });
  }

  return errors;
}
