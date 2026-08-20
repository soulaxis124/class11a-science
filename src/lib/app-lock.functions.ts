import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * App Lock — the whole public website sits behind a PIN / password gate.
 * Credentials are stored ONLY as salted SHA-256 hashes in the server-only
 * `app_lock` table (no anon/authenticated grants), so they never reach the
 * browser bundle or the Data API.
 */

export interface PublicLockSettings {
  lockEnabled: boolean;
  pinEnabled: boolean;
  passwordEnabled: boolean;
  title: string;
  subtitle: string | null;
  logoUrl: string | null;
  /** Bumped by "log out all sessions" — invalidates every stored unlock. */
  sessionEpoch: string;
}

/** Safe, non-secret lock configuration for the lock screen. */
export const getLockSettings = createServerFn({ method: "GET" }).handler(
  async (): Promise<PublicLockSettings> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("app_lock")
      .select("lock_enabled, pin_enabled, password_enabled, title, subtitle, logo_url, session_epoch")
      .eq("id", true)
      .maybeSingle();
    return {
      lockEnabled: data?.lock_enabled ?? false,
      pinEnabled: data?.pin_enabled ?? true,
      passwordEnabled: data?.password_enabled ?? true,
      title: data?.title ?? "Science Nexus",
      subtitle: data?.subtitle ?? null,
      logoUrl: data?.logo_url ?? null,
      sessionEpoch: data?.session_epoch ?? "0",
    };
  },
);

/** Verifies a PIN or password against the stored hash. */
export const verifyLock = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({ secret: z.string().min(1).max(200), mode: z.enum(["pin", "password"]) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { createHash } = await import("crypto");
    const { data: row } = await supabaseAdmin
      .from("app_lock")
      .select("salt, pin_hash, password_hash, pin_enabled, password_enabled, session_epoch")
      .eq("id", true)
      .maybeSingle();
    if (!row) return { ok: false as const, reason: "Lock is not configured." };
    if (data.mode === "pin" && !row.pin_enabled)
      return { ok: false as const, reason: "PIN sign-in is disabled." };
    if (data.mode === "password" && !row.password_enabled)
      return { ok: false as const, reason: "Password sign-in is disabled." };

    const expected = data.mode === "pin" ? row.pin_hash : row.password_hash;
    if (!expected) return { ok: false as const, reason: "Not configured." };
    const hash = createHash("sha256").update(`${row.salt}${data.secret}`).digest("hex");
    if (hash !== expected) return { ok: false as const, reason: "Incorrect credentials." };
    return { ok: true as const, sessionEpoch: row.session_epoch };
  });

async function assertAdmin(context: { supabase: { rpc: unknown }; userId: string }) {
  // has_role is execute-restricted, so check the role table directly as the user.
  const client = context.supabase as unknown as {
    from: (t: string) => {
      select: (c: string) => {
        eq: (a: string, b: unknown) => { eq: (a: string, b: unknown) => { maybeSingle: () => Promise<{ data: unknown }> } };
      };
    };
  };
  const { data } = await client
    .from("user_roles")
    .select("role")
    .eq("user_id", context.userId)
    .eq("role", "admin")
    .maybeSingle();
  if (!data) throw new Error("Forbidden");
}

/** Admin-only update of lock settings and credentials. */
export const updateLockSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .object({
        lockEnabled: z.boolean().optional(),
        pinEnabled: z.boolean().optional(),
        passwordEnabled: z.boolean().optional(),
        title: z.string().max(120).optional(),
        subtitle: z.string().max(300).nullable().optional(),
        logoUrl: z.string().max(2000).nullable().optional(),
        newPin: z.string().min(3).max(64).optional(),
        newPassword: z.string().min(6).max(200).optional(),
        logoutAllSessions: z.boolean().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { createHash, randomUUID } = await import("crypto");

    const { data: row } = await supabaseAdmin
      .from("app_lock")
      .select("salt")
      .eq("id", true)
      .maybeSingle();
    const salt = row?.salt ?? randomUUID();

    const patch: Record<string, unknown> = { id: true, updated_at: new Date().toISOString(), salt };
    if (data.lockEnabled !== undefined) patch["lock_enabled"] = data.lockEnabled;
    if (data.pinEnabled !== undefined) patch["pin_enabled"] = data.pinEnabled;
    if (data.passwordEnabled !== undefined) patch["password_enabled"] = data.passwordEnabled;
    if (data.title !== undefined) patch["title"] = data.title;
    if (data.subtitle !== undefined) patch["subtitle"] = data.subtitle;
    if (data.logoUrl !== undefined) patch["logo_url"] = data.logoUrl;
    if (data.newPin) patch["pin_hash"] = createHash("sha256").update(`${salt}${data.newPin}`).digest("hex");
    if (data.newPassword)
      patch["password_hash"] = createHash("sha256").update(`${salt}${data.newPassword}`).digest("hex");
    // Changing a credential or an explicit logout invalidates every stored unlock.
    if (data.newPin || data.newPassword || data.logoutAllSessions)
      patch["session_epoch"] = new Date().toISOString();

    const { error } = await supabaseAdmin.from("app_lock").upsert(patch as { id: boolean; salt: string });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
