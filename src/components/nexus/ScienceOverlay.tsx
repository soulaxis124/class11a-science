import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** True when the visitor asked for reduced motion. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

/** Normalised pointer position (-1..1) with smoothing, used for parallax depth. */
function usePointer(disabled: boolean) {
  const ref = useRef({ x: 0, y: 0 });
  const [p, setP] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (disabled) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      ref.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };
    const tick = () => {
      setP((prev) => ({
        x: prev.x + (ref.current.x - prev.x) * 0.06,
        y: prev.y + (ref.current.y - prev.y) * 0.06,
      }));
      frame = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [disabled]);
  return p;
}

const FORMULAS = [
  "E = mc²",
  "F = ma",
  "PV = nRT",
  "λ = h / p",
  "∮ E·dA = q/ε₀",
  "ΔG = ΔH − TΔS",
  "a² + b² = c²",
  "∫ f(x) dx",
  "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O",
  "Ψ(x,t)",
  "sin²θ + cos²θ = 1",
  "pH = −log[H⁺]",
];

/**
 * Layered scientific instrumentation backdrop: engraved graph paper, orbital
 * paths, waveforms, molecular lattice, DNA thread and faint formulas.
 * Three depth planes translate at different rates with the pointer.
 */
export function ScienceOverlay({
  className,
  intensity = 1,
}: {
  className?: string;
  intensity?: number;
}) {
  const reduced = useReducedMotion();
  const p = usePointer(reduced);

  const plane = (depth: number) => ({
    transform: `translate3d(${p.x * depth * -18}px, ${p.y * depth * -12}px, 0)`,
  });

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      style={{ opacity: 0.9 * intensity }}
    >
      {/* far plane — orbital paths + waveform */}
      <svg
        className="absolute inset-0 h-full w-full text-primary/25"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        style={plane(0.35)}
      >
        <g fill="none" stroke="currentColor" strokeWidth="0.8">
          <ellipse cx="600" cy="400" rx="430" ry="150" opacity="0.5" />
          <ellipse cx="600" cy="400" rx="430" ry="150" opacity="0.4" transform="rotate(60 600 400)" />
          <ellipse cx="600" cy="400" rx="430" ry="150" opacity="0.3" transform="rotate(-60 600 400)" />
          <path
            className={reduced ? undefined : "animate-dash-flow"}
            d="M0 620 Q 75 560 150 620 T 300 620 T 450 620 T 600 620 T 750 620 T 900 620 T 1050 620 T 1200 620"
            opacity="0.55"
          />
          <path
            className={reduced ? undefined : "animate-dash-flow"}
            style={{ animationDuration: "70s" }}
            d="M0 660 Q 50 620 100 660 T 200 660 T 300 660 T 400 660 T 500 660 T 600 660 T 700 660 T 800 660 T 900 660 T 1000 660 T 1100 660 T 1200 660"
            opacity="0.35"
          />
          {/* mathematical axes + curve */}
          <path d="M80 720 V420 M80 720 H420" opacity="0.4" />
          <path d="M80 700 C 180 700 220 470 420 440" opacity="0.5" />
          {/* physics vectors */}
          <path d="M980 200 l90 -46 M1070 154 l-18 2 M1070 154 l-4 -17" opacity="0.5" />
          <path d="M980 200 l64 66 M1044 266 l-17 -5 M1044 266 l3 -17" opacity="0.35" />
        </g>
      </svg>

      {/* mid plane — molecular lattice + DNA thread */}
      <svg
        className="absolute inset-0 h-full w-full text-eco/30"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        style={plane(0.7)}
      >
        <g stroke="currentColor" fill="none" strokeWidth="0.9">
          <g className={reduced ? undefined : "animate-float"} opacity="0.7">
            <path d="M200 200 l70 -40 70 40 v80 l-70 40 -70 -40Z" />
            <path d="M340 200 l70 -40 70 40" opacity="0.6" />
            <circle cx="200" cy="200" r="4" fill="currentColor" />
            <circle cx="270" cy="160" r="4" fill="currentColor" />
            <circle cx="340" cy="200" r="4" fill="currentColor" />
            <circle cx="340" cy="280" r="4" fill="currentColor" />
            <circle cx="270" cy="320" r="4" fill="currentColor" />
            <circle cx="200" cy="280" r="4" fill="currentColor" />
          </g>
          <g opacity="0.55" className={reduced ? undefined : "animate-breathe"}>
            {Array.from({ length: 16 }, (_, i) => {
              const y = 120 + i * 36;
              const w = Math.sin(i * 0.55) * 42;
              return (
                <g key={i}>
                  <line x1={1010 - w} y1={y} x2={1010 + w} y2={y} />
                  <circle cx={1010 - w} cy={y} r="3" fill="currentColor" />
                  <circle cx={1010 + w} cy={y} r="3" fill="currentColor" />
                </g>
              );
            })}
          </g>
        </g>
      </svg>

      {/* near plane — engraved formulas */}
      <div className="absolute inset-0" style={plane(1.15)}>
        {FORMULAS.map((f, i) => (
          <span
            key={f}
            className={cn(
              "absolute font-mono text-[0.62rem] tracking-[0.18em] text-silver/20",
              !reduced && "animate-float",
            )}
            style={{
              left: `${(i * 37 + 6) % 92}%`,
              top: `${(i * 53 + 11) % 88}%`,
              animationDelay: `${i * 1.3}s`,
              animationDuration: `${11 + (i % 5) * 3}s`,
            }}
          >
            {f}
          </span>
        ))}
      </div>
    </div>
  );
}

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  layer: number;
};

/**
 * Canvas particle field — three depth layers of molecular points with
 * proximity bonds. Density scales down on small screens; disabled entirely
 * for reduced motion.
 */
export function ParticleField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let particles: Particle[] = [];
    const pointer = { x: -9999, y: -9999 };

    function build() {
      // clientWidth can be 0 on the very first frame — fall back to the viewport
      w = canvas!.clientWidth || window.innerWidth;
      h = canvas!.clientHeight || window.innerHeight;
      canvas!.width = Math.max(1, Math.round(w * dpr));
      canvas!.height = Math.max(1, Math.round(h * dpr));
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const density = w < 768 ? 14000 : 9000;
      const count = Math.min(140, Math.max(40, Math.round((w * h) / density)));
      particles = Array.from({ length: count }, () => {
        const layer = Math.floor(Math.random() * 3) + 1;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.12 * layer,
          vy: (Math.random() - 0.5) * 0.12 * layer,
          r: 0.5 + layer * 0.45,
          layer,
        };
      });
    }

    build();
    const onResize = () => build();
    const observer = new ResizeObserver(() => build());
    observer.observe(canvas);
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });


    let frame = 0;
    const render = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 18000) {
          const f = (1 - d2 / 18000) * 0.35 * p.layer;
          p.x += (dx / Math.sqrt(d2 || 1)) * f;
          p.y += (dy / Math.sqrt(d2 || 1)) * f;
        }
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;
      }

      // molecular bonds between nearby particles of similar depth
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]!;
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j]!;
          if (Math.abs(a.layer - b.layer) > 1) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > 15000) continue;
          const alpha = (1 - d2 / 15000) * 0.11;
          ctx.strokeStyle = `rgba(168, 200, 178, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      for (const p of particles) {
        ctx.beginPath();
        ctx.fillStyle =
          p.layer === 3
            ? "rgba(224, 224, 214, 0.42)"
            : p.layer === 2
              ? "rgba(150, 190, 168, 0.34)"
              : "rgba(120, 150, 138, 0.22)";
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
    };

  }, [reduced]);

  if (reduced) return null;
  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    />
  );
}
