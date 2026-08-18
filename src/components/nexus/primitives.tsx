import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function GlassPanel({
  className,
  children,
  hover = false,
  style,
}: {
  className?: string | undefined;
  children: ReactNode;
  hover?: boolean | undefined;
  style?: React.CSSProperties | undefined;
}) {
  return (
    <div
      style={style}
      className={cn("glass rounded-2xl", hover && "glass-hover", className)}
    >
      {children}
    </div>
  );
}

export function PlaceholderBadge({ label = "Coming soon" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
      <span className="size-1.5 rounded-full bg-muted-foreground/70" />
      {label}
    </span>
  );
}

export function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="border-b border-border/60 py-3 last:border-b-0">
      <p className="label-mono">{label}</p>
      <div className="mt-1.5 text-sm text-foreground/90">
        {value ?? <PlaceholderBadge label="Awaiting details" />}
      </div>
    </div>
  );
}

export function SectionHero({
  eyebrow,
  title,
  subtitle,
  description,
  accent,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string | undefined;
  description?: string | undefined;
  accent?: string | undefined;
}) {
  return (
    <header className="relative mx-auto max-w-5xl px-6 pb-10 pt-28 text-center sm:pt-32">
      <p className="label-mono animate-fade-up">{eyebrow}</p>
      <h1
        className="animate-fade-up mt-4 text-4xl font-semibold uppercase tracking-tight sm:text-6xl"
        style={{ animationDelay: "60ms", color: accent }}
      >
        {title}
      </h1>
      {subtitle ? (
        <p
          className="animate-fade-up mt-4 font-display text-base text-primary/90 sm:text-lg"
          style={{ animationDelay: "120ms" }}
        >
          {subtitle}
        </p>
      ) : null}
      {description ? (
        <p
          className="animate-fade-up mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground"
          style={{ animationDelay: "180ms" }}
        >
          {description}
        </p>
      ) : null}
    </header>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return <main className="relative z-10 min-h-screen pb-28">{children}</main>;
}

export function Section({
  title,
  hint,
  children,
  className,
}: {
  title?: string | undefined;
  hint?: string | undefined;
  children: ReactNode;
  className?: string | undefined;
}) {
  return (
    <section className={cn("mx-auto w-full max-w-6xl px-6 py-10", className)}>
      {title ? (
        <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
          <h2 className="font-display text-xl font-semibold uppercase tracking-wide sm:text-2xl">
            {title}
          </h2>
          {hint ? <p className="label-mono">{hint}</p> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

/** Elegant photo placeholder / real photo slot. */
export function PhotoSlot({
  src,
  alt,
  className,
  accent,
}: {
  src: string | null;
  alt: string;
  className?: string | undefined;
  accent?: string | undefined;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }
  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-surface/60",
        className,
      )}
    >
      <div className="grid-field absolute inset-0 opacity-40" />
      <svg
        viewBox="0 0 64 64"
        className="relative size-12 opacity-45"
        fill="none"
        stroke={accent ?? "currentColor"}
        strokeWidth="1.5"
        aria-hidden
      >
        <circle cx="32" cy="22" r="11" />
        <path d="M10 58c0-12 10-20 22-20s22 8 22 20" />
      </svg>
      <p className="relative mt-3 text-[0.6rem] uppercase tracking-[0.22em] text-muted-foreground">
        Photo coming soon
      </p>
    </div>
  );
}

export function StatCounter({
  value,
  label,
  delay = 0,
}: {
  value: number;
  label: string;
  delay?: number | undefined;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) setSeen(true);
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!seen) return;
    let frame = 0;
    const duration = 1200;
    const start = performance.now() + delay;
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / duration));
      setDisplay(Math.round(value * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [seen, value, delay]);

  return (
    <div ref={ref} className="glass rounded-2xl px-5 py-6 text-center">
      <p className="font-display text-4xl font-semibold text-primary text-glow tabular-nums">
        {display}
      </p>
      <p className="label-mono mt-2">{label}</p>
    </div>
  );
}

export function EmptyState({ label }: { label: string }) {
  return (
    <div className="glass flex flex-col items-center gap-3 rounded-2xl border-dashed px-6 py-12 text-center">
      <span className="font-display text-2xl text-muted-foreground">◌</span>
      <p className="text-sm text-muted-foreground">{label}</p>
      <PlaceholderBadge label="Awaiting content" />
    </div>
  );
}
