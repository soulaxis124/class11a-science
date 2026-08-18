import type { Student } from "./types";

/**
 * Exactly 33 student records — one per roll number.
 * Only confirmed information is filled in. Everything else is `null`/empty
 * and renders as a clearly marked placeholder in the UI.
 *
 * To add a student later: set `name`, `house`, `photo`, `intro`, etc.
 */
function placeholder(roll: number): Student {
  return {
    roll,
    name: null,
    house: null,
    roles: ["Student"],
    photo: null,
    intro: null,
    quote: null,
    interests: [],
    achievements: [],
    projects: [],
  };
}

export const students: Student[] = Array.from({ length: 33 }, (_, i) => placeholder(i + 1));

// ——— Confirmed records ———
students[10] = {
  ...placeholder(11),
  name: "Asadullah",
  roles: ["Student", "Green Cabinet"],
  intro: "Student of Class 11-A Science. Designer and developer of this website.",
};

export const TOTAL_STUDENTS = students.length;

export function getStudent(roll: number): Student | undefined {
  return students.find((s) => s.roll === roll);
}

export function displayName(student: Student): string {
  return student.name ?? `Student · Roll ${String(student.roll).padStart(2, "0")}`;
}
