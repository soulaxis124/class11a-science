import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * One-time admin bootstrap. The access code lives ONLY in a server-side secret
 * (ADMIN_SETUP_CODE) — never in the client bundle.
 */
export const claimAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ code: z.string().min(1) }).parse(data))
  .handler(async ({ data, context }) => {
    const expected = process.env["ADMIN_SETUP_CODE"];
    if (!expected) throw new Error("Admin setup is not configured.");
    if (data.code !== expected) throw new Error("Invalid access code.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: context.userId, role: "admin" }, { onConflict: "user_id,role" });
    if (error) throw new Error(error.message);
    return { ok: true } as const;
  });

/** Whether the signed-in caller is an admin. */
export const getMyAdminStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { isAdmin: Boolean(data) };
  });
