import { cn } from "@/lib/utils";
import { houseColorTrio } from "@/data/houses";
import type { HouseId } from "@/data/types";

/**
 * Unique geometric crest per house. Every stroke uses the house's own
 * configurable palette (primary / secondary / accent) — no hard-coded colors.
 */
function Geometry({ id }: { id: HouseId }) {
  switch (id) {
    case "chanakya":
      // strategy — interlocking compass star
      return (
        <g>
          <path d="M32 6 42 32 32 58 22 32Z" stroke="var(--crest-primary)" />
          <path d="M6 32 32 22 58 32 32 42Z" stroke="var(--crest-accent)" opacity="0.85" />
          <circle cx="32" cy="32" r="20" stroke="var(--crest-secondary)" opacity="0.7" />
          <circle cx="32" cy="32" r="3.4" fill="var(--crest-accent)" stroke="none" />
        </g>
      );
    case "valmiki":
      // verse — open scroll arc over a rising quill triangle
      return (
        <g>
          <path d="M32 8 54 44H10Z" stroke="var(--crest-primary)" />
          <path d="M32 20 45 42H19Z" stroke="var(--crest-accent)" opacity="0.85" />
          <path d="M12 52c8-6 32-6 40 0" stroke="var(--crest-secondary)" />
          <circle cx="32" cy="32" r="2.8" fill="var(--crest-accent)" stroke="none" />
        </g>
      );
    case "patanjali":
      // balance — hexagonal lattice with an inner ring
      return (
        <g>
          <path d="M32 6 53 18v26L32 56 11 44V18Z" stroke="var(--crest-primary)" />
          <path d="M32 16 45 23.5v15L32 46 19 38.5v-15Z" stroke="var(--crest-secondary)" opacity="0.8" />
          <circle cx="32" cy="32" r="7" stroke="var(--crest-accent)" />
          <circle cx="32" cy="32" r="2.4" fill="var(--crest-accent)" stroke="none" />
        </g>
      );
    default:
      // discipline — layered arrow shield
      return (
        <g>
          <path d="M32 6 54 16v20c0 12-10 18-22 22-12-4-22-10-22-22V16Z" stroke="var(--crest-primary)" />
          <path d="M32 18 44 40H20Z" stroke="var(--crest-accent)" opacity="0.85" />
          <path d="M22 46h20" stroke="var(--crest-secondary)" />
          <circle cx="32" cy="32" r="2.6" fill="var(--crest-accent)" stroke="none" />
        </g>
      );
  }
}

export function HouseCrest({
  id,
  className,
  animated = true,
}: {
  id: HouseId;
  className?: string;
  animated?: boolean;
}) {
  const c = houseColorTrio(id);
  return (
    <span
      className={cn("relative inline-grid size-16 place-items-center", className)}
      style={
        {
          "--crest-primary": c.primary,
          "--crest-secondary": c.secondary,
          "--crest-accent": c.accent,
        } as React.CSSProperties
      }
    >
      {/* halo + orbiting particles */}
      <span
        className={cn("absolute inset-0 rounded-full blur-xl", animated && "animate-breathe")}
        style={{ background: `color-mix(in oklab, ${c.primary} 30%, transparent)`, opacity: 0.45 }}
      />
      <svg
        viewBox="0 0 64 64"
        aria-hidden
        className={cn("absolute inset-0 size-full", animated && "animate-spin-slower")}
        fill="none"
      >
        <circle cx="32" cy="32" r="30" stroke="var(--crest-secondary)" strokeWidth="0.6" opacity="0.5" strokeDasharray="3 7" />
        <circle cx="32" cy="2" r="1.6" fill="var(--crest-accent)" />
        <circle cx="62" cy="32" r="1.2" fill="var(--crest-primary)" opacity="0.8" />
      </svg>
      <svg
        viewBox="0 0 64 64"
        aria-hidden
        className={cn(
          "relative size-[78%] transition-transform duration-700 group-hover:scale-110",
          animated && "animate-float",
        )}
        fill="none"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <Geometry id={id} />
      </svg>
    </span>
  );
}
