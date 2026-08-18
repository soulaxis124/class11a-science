/**
 * Geometric scientific icon set — no emojis anywhere in the interface.
 * Every icon is a 24×24 line drawing that inherits currentColor.
 */
import { cn } from "@/lib/utils";

export type IconName =
  | "nexus"
  | "class"
  | "teacher"
  | "students"
  | "houses"
  | "green"
  | "leadership"
  | "achievements"
  | "events"
  | "timeline"
  | "gallery"
  | "projects"
  | "lab"
  | "calendar"
  | "yearbook"
  | "about";

const paths: Record<IconName, React.ReactNode> = {
  nexus: (
    <>
      <circle cx="12" cy="12" r="2.4" />
      <ellipse cx="12" cy="12" rx="9.5" ry="4.2" />
      <ellipse cx="12" cy="12" rx="9.5" ry="4.2" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9.5" ry="4.2" transform="rotate(120 12 12)" />
    </>
  ),
  class: (
    <>
      <path d="M3 20V9.5L12 4l9 5.5V20" />
      <path d="M8 20v-6h8v6" />
      <path d="M2 20h20" />
    </>
  ),
  teacher: (
    <>
      <circle cx="12" cy="7" r="3" />
      <path d="M4.5 20c0-4 3.4-7 7.5-7s7.5 3 7.5 7" />
      <path d="M3 4h4" />
    </>
  ),
  students: (
    <>
      <circle cx="8" cy="8" r="2.6" />
      <circle cx="16.5" cy="9.5" r="2.2" />
      <path d="M3 19c0-3.1 2.3-5.4 5-5.4s5 2.3 5 5.4" />
      <path d="M14 19c0-2.6 1.6-4.4 3.6-4.4S21 16.4 21 19" />
    </>
  ),
  houses: (
    <>
      <path d="M4 20V9l4-3 4 3 4-3 4 3v11" />
      <path d="M2 20h20" />
      <path d="M9 20v-4h6v4" />
    </>
  ),
  green: (
    <>
      <path d="M12 21V11" />
      <path d="M12 13c-4.2 0-6.5-2.6-6.5-6.5C9.7 6.5 12 8.9 12 13Z" />
      <path d="M12 15c3.6 0 5.6-2.2 5.6-5.6C14.1 9.4 12 11.5 12 15Z" />
    </>
  ),
  leadership: (
    <>
      <path d="M4 17 3 7l5 4 4-6 4 6 5-4-1 10Z" />
      <path d="M4 20h16" />
    </>
  ),
  achievements: (
    <>
      <path d="M8 4h8v5a4 4 0 0 1-8 0Z" />
      <path d="M8 5H5v2a3 3 0 0 0 3 3M16 5h3v2a3 3 0 0 1-3 3" />
      <path d="M12 13v4M9 20h6" />
    </>
  ),
  events: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 3.5v17M3.5 12h17" />
      <circle cx="12" cy="12" r="2.6" />
    </>
  ),
  timeline: (
    <>
      <path d="M12 3v18" />
      <circle cx="12" cy="7" r="2" />
      <circle cx="12" cy="17" r="2" />
      <path d="M14 7h6M4 17h6" />
    </>
  ),
  gallery: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 16 5-4 4 3 3-2 6 4" />
      <circle cx="8.5" cy="9.5" r="1.3" />
    </>
  ),
  projects: (
    <>
      <path d="M4 5h7v14H4Z" />
      <path d="M13 5h7v14h-7Z" />
      <path d="M6.5 9h2M15.5 9h2" />
    </>
  ),
  lab: (
    <>
      <path d="M10 3v6.2L4.8 18A2 2 0 0 0 6.5 21h11a2 2 0 0 0 1.7-3L14 9.2V3" />
      <path d="M9 3h6" />
      <path d="M7.6 14h8.8" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
  yearbook: (
    <>
      <path d="M5 4h9a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3Z" />
      <path d="M17 7h2v13H8" />
      <path d="M8.5 8.5h5" />
    </>
  ),
  about: (
    <>
      <path d="m12 3 9 9-9 9-9-9Z" />
      <path d="m12 7.5 4.5 4.5L12 16.5 7.5 12Z" />
    </>
  ),
};

export function NexusIcon({
  name,
  className,
}: {
  name: IconName;
  className?: string | undefined;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cn("size-5", className)}
    >
      {paths[name]}
    </svg>
  );
}

/** Configurable geometric house emblem — never an emoji. */
export function HouseEmblem({
  variant,
  color,
  className,
}: {
  variant: number;
  color?: string | undefined;
  className?: string | undefined;
}) {
  const shapes = [
    <g key="0">
      <path d="M24 4 44 24 24 44 4 24Z" />
      <path d="M24 13 35 24 24 35 13 24Z" />
    </g>,
    <g key="1">
      <circle cx="24" cy="24" r="19" />
      <path d="M24 5v38M5 24h38" />
    </g>,
    <g key="2">
      <path d="M24 5 42 15v18L24 43 6 33V15Z" />
      <circle cx="24" cy="24" r="7" />
    </g>,
    <g key="3">
      <path d="M24 4 43 38H5Z" />
      <path d="M24 18 33 34H15Z" />
    </g>,
  ];
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke={color ?? "currentColor"}
      strokeWidth="1.6"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cn("size-6", className)}
    >
      {shapes[variant % shapes.length]}
    </svg>
  );
}
