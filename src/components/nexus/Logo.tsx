import { cn } from "@/lib/utils";

/**
 * SCIENCE NEXUS brand mark.
 * Geometry: a nucleus inside three orbital rings, with a hexagonal "11-A"
 * bond frame — one vertical bar pair (11) crossed by an apex (A).
 */
export function NexusMark({
  className,
  animated = false,
}: {
  className?: string | undefined;
  animated?: boolean | undefined;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn("size-9", className)}
    >
      <g
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      >
        {/* hexagonal bond frame */}
        <path d="M32 5 54 17.5v25L32 55 10 42.5v-25Z" opacity="0.45" />
        {/* orbital rings */}
        <ellipse cx="32" cy="32" rx="22" ry="9" opacity="0.55" />
        <ellipse cx="32" cy="32" rx="22" ry="9" transform="rotate(60 32 32)" opacity="0.55" />
        <ellipse cx="32" cy="32" rx="22" ry="9" transform="rotate(120 32 32)" opacity="0.55" />
        {/* hidden 11-A: two bars and an apex */}
        <path d="M24 40V26M28.5 40V26" />
        <path d="m35.5 40 4.5-14 4.5 14M36.9 35.6h6.2" />
      </g>
      <circle cx="32" cy="32" r="3.2" fill="currentColor" />
      {animated ? (
        <circle cx="54" cy="32" r="1.8" fill="currentColor">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 32 32"
            to="360 32 32"
            dur="9s"
            repeatCount="indefinite"
          />
        </circle>
      ) : null}
    </svg>
  );
}

/** Full lockup: mark + SCIENCE NEXUS / CLASS 11-A wordmark. */
export function NexusLogo({
  className,
  compact = false,
}: {
  className?: string | undefined;
  compact?: boolean | undefined;
}) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <NexusMark className={compact ? "size-8 text-primary" : "size-11 text-primary"} />
      <span className="leading-none">
        <span
          className={cn(
            "block font-display font-semibold uppercase tracking-[0.24em] text-foreground",
            compact ? "text-[0.72rem]" : "text-sm",
          )}
        >
          Science Nexus
        </span>
        <span
          className={cn(
            "mt-1.5 block font-mono uppercase tracking-[0.34em] text-gold/85",
            compact ? "text-[0.55rem]" : "text-[0.62rem]",
          )}
        >
          Class 11-A
        </span>
      </span>
    </span>
  );
}
