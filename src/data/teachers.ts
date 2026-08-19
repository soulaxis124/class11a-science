import type { Principal, Teacher } from "./types";

/**
 * Subject teachers — only confirmed names. More can be added from
 * Admin → Teachers without touching this file.
 */
function t(
  id: string,
  subject: string,
  name: string,
  order: number,
  role: string | null = null,
): Teacher {
  return {
    id,
    subject,
    name,
    role,
    photo: null,
    bio: null,
    qualification: null,
    quote: null,
    order,
  };
}

export const teachers: Teacher[] = [
  t("english", "English", "Rachna Ma'am", 1, "Class Teacher"),
  t("physics", "Physics", "Mangla Ma'am", 2),
  t("chemistry", "Chemistry", "Avdesh Pandey", 3),
  t("computer-science", "Computer Science", "Mohit Sir", 4),
  t("physical-education", "Physical Education", "Praveen Sir", 5),
  t("fine-arts", "Fine Arts", "Archana Ma'am", 6),
  t("mathematics", "Mathematics", "Brijesh Sir", 7),
];

/** No principal information provided yet — structure only. */
export const principal: Principal[] = [
  {
    id: "principal",
    name: null,
    photo: null,
    introduction: null,
    message: null,
    quote: null,
    achievements: [],
  },
];
