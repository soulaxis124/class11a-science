import { useEffect, useMemo, useRef, useState } from "react";

interface Atom {
  id: string;
  label: string;
  x: number;
  y: number;
  r: number;
  tone: "core" | "accent" | "gold";
}

interface Bond {
  a: string;
  b: string;
  order: 1 | 2;
}

const atoms: Atom[] = [
  { id: "c", label: "C", x: 50, y: 50, r: 11, tone: "core" },
  { id: "o1", label: "O", x: 22, y: 30, r: 8.5, tone: "accent" },
  { id: "o2", label: "O", x: 78, y: 30, r: 8.5, tone: "accent" },
  { id: "h1", label: "H", x: 24, y: 76, r: 6.5, tone: "gold" },
  { id: "h2", label: "H", x: 76, y: 76, r: 6.5, tone: "gold" },
];

const bonds: Bond[] = [
  { a: "c", b: "o1", order: 2 },
  { a: "c", b: "o2", order: 2 },
  { a: "c", b: "h1", order: 1 },
  { a: "c", b: "h2", order: 1 },
];

/**
 * Interactive molecular bonding animation.
 * Atoms breathe along their bonds, electrons travel the bonds, and hovering
 * (or keyboard-focusing) an atom energises its bonds. Fully static when the
 * visitor prefers reduced motion.
 */
export function AtomicBond({ className }: { className?: string }) {
  const [t, setT] = useState(0);
  const [active, setActive] = useState<string | null>(null);
  const [reduced, setReduced] = useState(true);
  const frame = useRef<number>(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduced) return;
    let start: number | null = null;
    const loop = (now: number) => {
      if (start === null) start = now;
      setT((now - start) / 1000);
      frame.current = requestAnimationFrame(loop);
    };
    frame.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame.current);
  }, [reduced]);

  const positioned = useMemo(() => {
    return atoms.map((a, i) => {
      if (a.id === "c" || reduced) return a;
      const phase = t * 0.9 + i;
      const dx = Math.cos(phase) * 1.6;
      const dy = Math.sin(phase * 1.2) * 1.6;
      return { ...a, x: a.x + dx, y: a.y + dy };
    });
  }, [t, reduced]);

  const byId = (id: string) => positioned.find((a) => a.id === id)!;

  return (
    <figure className={className}>
      <svg
        viewBox="0 0 100 100"
        role="img"
        aria-label="Interactive molecular bonding diagram: a carbon centre double-bonded to two oxygen atoms and single-bonded to two hydrogen atoms."
        className="h-full w-full"
      >
        <defs>
          <radialGradient id="ab-core">
            <stop offset="0%" stopColor="oklch(var(--primary-raw, 0.72 0.11 155) / 0.95)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {bonds.map((bond) => {
          const a = byId(bond.a);
          const b = byId(bond.b);
          const energised = active === bond.a || active === bond.b;
          const offsets = bond.order === 2 ? [-1.5, 1.5] : [0];
          const nx = -(b.y - a.y);
          const ny = b.x - a.x;
          const len = Math.hypot(nx, ny) || 1;
          return offsets.map((o, oi) => {
            const ox = (nx / len) * o;
            const oy = (ny / len) * o;
            return (
              <line
                key={`${bond.a}-${bond.b}-${oi}`}
                x1={a.x + ox}
                y1={a.y + oy}
                x2={b.x + ox}
                y2={b.y + oy}
                stroke="currentColor"
                strokeWidth={energised ? 0.9 : 0.5}
                className={
                  energised ? "text-primary transition-all" : "text-foreground/25 transition-all"
                }
              />
            );
          });
        })}

        {/* Travelling electrons */}
        {!reduced &&
          bonds.map((bond, i) => {
            const a = byId(bond.a);
            const b = byId(bond.b);
            const p = ((t * 0.35 + i * 0.25) % 1);
            const x = a.x + (b.x - a.x) * p;
            const y = a.y + (b.y - a.y) * p;
            return (
              <circle key={`e-${i}`} cx={x} cy={y} r={0.9} className="fill-primary/80" />
            );
          })}

        {positioned.map((a) => {
          const isActive = active === a.id;
          const tone =
            a.tone === "core"
              ? "fill-primary/20 stroke-primary"
              : a.tone === "accent"
                ? "fill-foreground/5 stroke-foreground/50"
                : "fill-accent/10 stroke-accent";
          return (
            <g
              key={a.id}
              tabIndex={0}
              role="button"
              aria-label={`Atom ${a.label}`}
              onMouseEnter={() => setActive(a.id)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(a.id)}
              onBlur={() => setActive(null)}
              className="cursor-pointer outline-none [&:focus-visible>circle]:stroke-[1.4]"
            >
              <circle
                cx={a.x}
                cy={a.y}
                r={isActive ? a.r + 1.5 : a.r}
                strokeWidth={0.7}
                className={`${tone} transition-all duration-300`}
              />
              <text
                x={a.x}
                y={a.y + 1.8}
                textAnchor="middle"
                className="fill-foreground font-mono"
                style={{ fontSize: a.r * 0.72 }}
              >
                {a.label}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-3 text-center text-xs text-muted-foreground">
        Hover or focus an atom to energise its bonds
      </figcaption>
    </figure>
  );
}
