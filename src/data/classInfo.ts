export const classInfo = {
  name: "Class 11-A",
  stream: "Science",
  identity: "Science Nexus — Class 11-A",
  primaryConcept: "One Class. Four Houses. One Scientific Journey.",
  secondaryConcept: "Where Curiosity Becomes Discovery.",
  tertiaryConcept: "33 Students. 4 Houses. 1 Class. Countless Memories.",
  intro:
    "An interactive digital universe of our class, people, achievements, memories and journey.",
  creator: "Asadullah",
};

export const teacher = {
  name: "Rachna Ma'am",
  title: "Our Class Teacher",
  photo: null as string | null,
  subjects: [] as string[],
  introduction: null as string | null,
  philosophy: null as string | null,
  message: null as string | null,
  achievements: [] as string[],
  quotes: [] as string[],
  responsibilities: [] as string[],
};

export const monitors = [
  {
    id: "boys",
    name: "Ibrahim",
    role: "Boys Monitor",
    photo: null as string | null,
    note: null as string | null,
  },
  {
    id: "girls",
    name: "Tanishka",
    role: "Girls Monitor",
    photo: null as string | null,
    note: null as string | null,
  },
];

export const classStats = [
  { value: 33, label: "Students" },
  { value: 4, label: "Houses" },
  { value: 12, label: "Green Cabinet Members" },
  { value: 2, label: "Class Monitors" },
  { value: 1, label: "Class Teacher" },
  { value: 1, label: "Class" },
];
