import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Navigation, Footer } from "@/components/nexus/Navigation";
import { AmbientBackground } from "@/components/nexus/AmbientBackground";
import { useHouseColorSync } from "@/lib/house-theme";

function NotFoundComponent() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <div className="glass max-w-md rounded-3xl px-10 py-12 text-center">
        <p className="label-mono">Signal lost</p>
        <h1 className="mt-4 font-display text-6xl font-semibold text-primary text-glow">404</h1>
        <h2 className="mt-4 text-lg font-semibold">This sector of the universe is empty</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            Return to the class universe
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <div className="glass max-w-md rounded-3xl px-10 py-12 text-center">
        <h1 className="font-display text-xl font-semibold tracking-tight">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-input px-4 py-2 text-sm font-medium"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Science Nexus — Class 11-A Science" },
      {
        name: "description",
        content:
          "An interactive 3D digital universe of Class 11-A Science: our teacher, 33 students, four houses, Green Cabinet, achievements and memories.",
      },
      { name: "author", content: "Asadullah" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Manrope:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // Publishes the configurable house palette to CSS variables site-wide.
  useHouseColorSync();

  return (
    <QueryClientProvider client={queryClient}>
      <AmbientBackground />
      <Navigation />
      <RouteWarp routeKey={pathname}>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </RouteWarp>
      <Footer />
    </QueryClientProvider>
  );
}

/** Short cinematic route transition: depth blur + lift, then a particle sweep. */
function RouteWarp({ routeKey, children }: { routeKey: string; children: ReactNode }) {
  return (
    <div key={routeKey} className="relative">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-40 h-px animate-fade-up rule-gold"
      />
      <div className="route-warp">{children}</div>
    </div>
  );
}
