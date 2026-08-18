import type {
  Achievement,
  ClassEvent,
  GalleryItem,
  LabSection,
  Project,
  TimelineEntry,
} from "./types";

const empty = <T,>(count: number, make: (i: number) => T): T[] =>
  Array.from({ length: count }, (_, i) => make(i));

export const achievements: Achievement[] = [
  ...empty<Achievement>(3, (i) => ({
    id: `ach-academic-${i + 1}`,
    title: null,
    category: "Academic",
    holder: null,
    date: null,
    description: null,
  })),
  ...empty<Achievement>(2, (i) => ({
    id: `ach-house-${i + 1}`,
    title: null,
    category: "House",
    holder: null,
    date: null,
    description: null,
  })),
  ...empty<Achievement>(2, (i) => ({
    id: `ach-sports-${i + 1}`,
    title: null,
    category: "Sports",
    holder: null,
    date: null,
    description: null,
  })),
  ...empty<Achievement>(2, (i) => ({
    id: `ach-comp-${i + 1}`,
    title: null,
    category: "Competition",
    holder: null,
    date: null,
    description: null,
  })),
  ...empty<Achievement>(1, () => ({
    id: "ach-class-1",
    title: null,
    category: "Class",
    holder: null,
    date: null,
    description: null,
  })),
  ...empty<Achievement>(2, (i) => ({
    id: `ach-individual-${i + 1}`,
    title: null,
    category: "Individual",
    holder: null,
    date: null,
    description: null,
  })),
];

export const achievementCategories = [
  "Academic",
  "House",
  "Sports",
  "Competition",
  "Class",
  "Individual",
] as const;

export const timeline: TimelineEntry[] = [
  { id: "t1", title: null, date: null, description: null, tag: "Session Begins" },
  { id: "t2", title: null, date: null, description: null, tag: "First Day" },
  { id: "t3", title: null, date: null, description: null, tag: "School Event" },
  { id: "t4", title: null, date: null, description: null, tag: "Competition" },
  { id: "t5", title: null, date: null, description: null, tag: "Celebration" },
  { id: "t6", title: null, date: null, description: null, tag: "Project" },
  { id: "t7", title: null, date: null, description: null, tag: "Sports" },
  { id: "t8", title: null, date: null, description: null, tag: "Trip" },
  { id: "t9", title: null, date: null, description: null, tag: "Achievement" },
  { id: "t10", title: null, date: null, description: null, tag: "Memory" },
];

export const galleryCategories = [
  "Class",
  "Events",
  "Sports",
  "Celebrations",
  "Competitions",
  "Projects",
  "Trips",
  "Memories",
  "Green Cabinet",
  "House Activities",
];

export const gallery: GalleryItem[] = galleryCategories.flatMap((category, ci) =>
  empty<GalleryItem>(2, (i) => ({
    id: `g-${ci}-${i}`,
    title: null,
    category,
    media: null,
    type: "image" as const,
  })),
);

export const projects: Project[] = (
  ["Physics", "Chemistry", "Biology", "Mathematics", "Interdisciplinary"] as const
).flatMap((subject, si) =>
  empty<Project>(2, (i) => ({
    id: `p-${si}-${i}`,
    title: null,
    subject,
    team: null,
    description: null,
    date: null,
    result: null,
    media: null,
  })),
);

export const events: ClassEvent[] = (
  ["Exam", "Test", "Project", "Competition", "Birthday", "School", "House"] as const
).flatMap((type, ti) =>
  empty<ClassEvent>(2, (i) => ({
    id: `e-${ti}-${i}`,
    title: null,
    date: null,
    type,
    description: null,
  })),
);

export const labSections: LabSection[] = [
  {
    id: "physics",
    name: "Physics",
    symbol: "⚛",
    tagline: "Motion, energy, waves and the laws behind them.",
    entries: empty(3, () => ({ title: null, note: null })),
  },
  {
    id: "chemistry",
    name: "Chemistry",
    symbol: "🧪",
    tagline: "Molecules, reactions and the periodic architecture of matter.",
    entries: empty(3, () => ({ title: null, note: null })),
  },
  {
    id: "biology",
    name: "Biology",
    symbol: "🧬",
    tagline: "Cells, systems and the code of living things.",
    entries: empty(3, () => ({ title: null, note: null })),
  },
  {
    id: "mathematics",
    name: "Mathematics",
    symbol: "📐",
    tagline: "Geometry, graphs and the language every science speaks.",
    entries: empty(3, () => ({ title: null, note: null })),
  },
];
