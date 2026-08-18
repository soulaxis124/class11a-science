import type { IconName } from "@/components/nexus/icons";

export interface NavItem {
  label: string;
  to: string;
  icon: IconName;
  /** Short technical code used for 3D node labels and data readouts. */
  code: string;
  blurb: string;
}

export const navItems: NavItem[] = [
  { label: "Home", to: "/", icon: "nexus", code: "NX-00", blurb: "Enter the class universe" },
  { label: "Our Class", to: "/class", icon: "class", code: "CL-01", blurb: "The classroom core" },
  { label: "Teacher", to: "/teacher", icon: "teacher", code: "TC-02", blurb: "Teacher's chamber" },
  {
    label: "Students",
    to: "/students",
    icon: "students",
    code: "ST-33",
    blurb: "Student hub · 33 nodes",
  },
  { label: "Houses", to: "/houses", icon: "houses", code: "HS-04", blurb: "Four house towers" },
  {
    label: "Green Cabinet",
    to: "/green-cabinet",
    icon: "green",
    code: "GC-12",
    blurb: "Environmental division",
  },
  {
    label: "Leadership",
    to: "/monitors",
    icon: "leadership",
    code: "LD-06",
    blurb: "Class leadership",
  },
  {
    label: "Achievements",
    to: "/achievements",
    icon: "achievements",
    code: "AC-07",
    blurb: "Hall of records",
  },
  { label: "Events", to: "/events", icon: "events", code: "EV-08", blurb: "Class events" },
  { label: "Timeline", to: "/timeline", icon: "timeline", code: "TL-09", blurb: "Time tunnel" },
  { label: "Gallery", to: "/gallery", icon: "gallery", code: "GL-10", blurb: "Memory museum" },
  { label: "Projects", to: "/projects", icon: "projects", code: "PR-11", blurb: "Project gallery" },
  { label: "Science Lab", to: "/science-lab", icon: "lab", code: "LB-12", blurb: "Virtual laboratory" },
  { label: "Calendar", to: "/calendar", icon: "calendar", code: "CA-13", blurb: "Activity center" },
  { label: "Yearbook", to: "/yearbook", icon: "yearbook", code: "YB-14", blurb: "Yearbook vault" },
  { label: "About", to: "/about", icon: "about", code: "AB-15", blurb: "Website creator" },
];

/** Locations shown as clickable nodes in the 3D campus hub. */
export const campusLocations = navItems.filter((n) => n.to !== "/" && n.to !== "/events");
