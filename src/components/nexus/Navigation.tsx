import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { navItems } from "@/data/navigation";
import { cn } from "@/lib/utils";
import { NexusIcon } from "@/components/nexus/icons";

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled ? "py-2" : "py-4",
        )}
      >
        <nav
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-2xl px-4 py-2.5 transition-all duration-500 sm:px-5",
            scrolled ? "glass mx-3" : "mx-3 border border-transparent",
          )}
        >
          <Link to="/" className="group flex items-center gap-3">
            <span className="relative flex size-9 items-center justify-center rounded-xl border border-primary/40 bg-primary/10 font-display text-sm text-primary">
              </span>
            <span className="leading-none">
              <span className="block font-display text-sm font-semibold uppercase tracking-[0.18em]">
                Class 11-A
              </span>
              <span className="mt-1 block font-mono text-[0.6rem] uppercase tracking-[0.3em] text-primary/80">
                Science Nexus
              </span>
            </span>
          </Link>

          <ul className="hidden items-center gap-0.5 xl:flex">
            {navItems.slice(1, 9).map((item) => (
              <NavLinkItem key={item.to} to={item.to} label={item.label} />
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
            className="glass flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs uppercase tracking-[0.18em] text-foreground/90 transition-colors hover:border-primary/50"
          >
            <Menu className="size-4" />
            <span className="hidden sm:inline">Menu</span>
          </button>
        </nav>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-[60] transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
        <aside
          className={cn(
            "glass absolute right-0 top-0 flex h-full w-full max-w-sm flex-col rounded-none border-y-0 border-r-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            open ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-border px-6 py-5">
            <p className="label-mono">Navigate the universe</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close navigation"
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <ul className="space-y-1">
              {navItems.map((item, i) => (
                <li key={item.to} style={{ animationDelay: `${i * 25}ms` }} className={open ? "animate-fade-up" : ""}>
                  <Link
                    to={item.to}
                    className="group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-primary/10"
                    activeProps={{ className: "bg-primary/15" }}
                    activeOptions={{ exact: item.to === "/" }}
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-surface/60 text-sm">
                      <NexusIcon name={item.icon} className="size-4 text-primary" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display text-sm font-medium">{item.label}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {item.blurb}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <p className="border-t border-border px-6 py-4 text-center text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">
            One Class · Four Houses · One Journey
          </p>
        </aside>
      </div>
    </>
  );
}

function NavLinkItem({ to, label }: { to: string; label: string }) {
  return (
    <li>
      <Link
        to={to}
        activeOptions={{ exact: to === "/" }}
        activeProps={{ className: "text-primary" }}
        className="rounded-lg px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] text-foreground/70 transition-colors hover:text-primary"
      >
        {label}
      </Link>
    </li>
  );
}

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border/60 px-6 py-10 text-center">
      <p className="font-display text-sm uppercase tracking-[0.24em] text-foreground/80">
        Class 11-A · Science
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        One Class. Four Houses. One Scientific Journey.
      </p>
      <p className="mt-4 font-mono text-[0.65rem] uppercase tracking-[0.24em] text-muted-foreground/80">
        Designed &amp; developed by Asadullah
      </p>
    </footer>
  );
}
