import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

/**
 * Public read-only image proxy for the private `media` bucket.
 * Anonymous reads are allowed by a narrow storage policy scoped to that bucket,
 * so uploaded photos work on the public site with stable, permanent URLs.
 */
export const Route = createFileRoute("/api/public/media/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = (params as Record<string, string>)["_splat"] ?? "";
        if (!path || path.includes("..")) return new Response("Not found", { status: 404 });

        const supabase = createClient(
          process.env["SUPABASE_URL"]!,
          process.env["SUPABASE_PUBLISHABLE_KEY"]!,
          { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
        );

        const { data, error } = await supabase.storage.from("media").download(path);
        if (error || !data) return new Response("Not found", { status: 404 });

        return new Response(await data.arrayBuffer(), {
          headers: {
            "content-type": data.type || "application/octet-stream",
            "cache-control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
