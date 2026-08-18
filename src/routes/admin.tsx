import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { claimAdmin } from "@/lib/admin.functions";
import { useSiteContent, siteContentQueryKey } from "@/hooks/useSiteContent";
import {
  contentKeys,
  contentLabels,
  defaultContent,
  validateDocument,
  type ContentKey,
  type ContentShape,
} from "@/lib/content-store";
import { GlassPanel } from "@/components/nexus/primitives";
import { NexusLogo } from "@/components/nexus/Logo";
import { HouseCrest } from "@/components/nexus/HouseCrest";
import { houses } from "@/data/houses";
import { useHouseColors } from "@/lib/house-theme";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Control Room — Science Nexus Admin" },
      {
        name: "description",
        content:
          "Protected control room for Class 11-A Science: manage students, houses, Green Cabinet, achievements, events and photos.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Control Room — Science Nexus" },
      { property: "og:description", content: "Protected content management for Class 11-A Science." },
    ],
  }),
  component: AdminPage,
});

/* ------------------------------------------------------------------ */
/* session                                                             */
/* ------------------------------------------------------------------ */

function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return { session, ready };
}

/* ------------------------------------------------------------------ */
/* shell                                                               */
/* ------------------------------------------------------------------ */

function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen px-4 pb-24 pt-28">
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </main>
  );
}

function AdminPage() {
  const { session, ready } = useSession();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!session) {
      setIsAdmin(null);
      return;
    }
    supabase
      .from("user_roles")
      .select("role")
      .eq("role", "admin")
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setIsAdmin(Boolean(data));
      });
    return () => {
      cancelled = true;
    };
  }, [session]);

  if (!ready) {
    return (
      <AdminShell>
        <p className="label-mono text-center">Establishing secure link…</p>
      </AdminShell>
    );
  }

  if (!session) return <AdminShell><LoginCard /></AdminShell>;
  if (isAdmin === null)
    return (
      <AdminShell>
        <p className="label-mono text-center">Verifying clearance…</p>
      </AdminShell>
    );
  if (!isAdmin)
    return (
      <AdminShell>
        <ClaimCard email={session.user.email ?? ""} onClaimed={() => setIsAdmin(true)} />
      </AdminShell>
    );

  return (
    <AdminShell>
      <Dashboard email={session.user.email ?? ""} />
    </AdminShell>
  );
}

/* ------------------------------------------------------------------ */
/* auth cards                                                          */
/* ------------------------------------------------------------------ */

function LoginCard() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    const fn =
      mode === "signin"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/admin` },
          });
    const { error } = await fn;
    if (error) setMessage(error.message);
    else if (mode === "signup") setMessage("Account created. You can sign in now.");
    setBusy(false);
  }

  return (
    <GlassPanel className="mx-auto max-w-md p-8">
      <div className="flex flex-col items-center text-center">
        <NexusLogo />
        <p className="label-mono mt-5">Restricted area</p>
        <h1 className="mt-2 font-display text-2xl font-semibold">Control Room</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to manage Class 11-A Science content.
        </p>
      </div>
      <form onSubmit={submit} className="mt-7 space-y-4">
        <label className="block">
          <span className="label-mono">Email</span>
          <input
            type="email"
            required
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-border bg-surface/60 px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </label>
        <label className="block">
          <span className="label-mono">Password</span>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-border bg-surface/60 px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </label>
        {message && <p className="text-xs text-accent">{message}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-60"
        >
          {busy ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>
      <button
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        className="mt-4 w-full text-center text-xs text-muted-foreground underline-offset-4 hover:underline"
      >
        {mode === "signin" ? "No account yet? Create one" : "Already have an account? Sign in"}
      </button>
    </GlassPanel>
  );
}

function ClaimCard({ email, onClaimed }: { email: string; onClaimed: () => void }) {
  const claim = useServerFn(claimAdmin);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await claim({ data: { code } });
      onClaimed();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not verify the access code.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <GlassPanel className="mx-auto max-w-md p-8">
      <p className="label-mono">Clearance required</p>
      <h1 className="mt-2 font-display text-2xl font-semibold">Unlock admin access</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Signed in as {email}. Enter the class access code to grant this account admin rights.
        The code is verified on the server and never stored in the website code.
      </p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block">
          <span className="label-mono">Access code</span>
          <input
            type="password"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-border bg-surface/60 px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </label>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          {busy ? "Verifying…" : "Unlock"}
        </button>
      </form>
      <button
        onClick={() => supabase.auth.signOut()}
        className="mt-4 w-full text-center text-xs text-muted-foreground underline-offset-4 hover:underline"
      >
        Sign out
      </button>
    </GlassPanel>
  );
}

/* ------------------------------------------------------------------ */
/* dashboard                                                           */
/* ------------------------------------------------------------------ */

type Row = Record<string, unknown>;

function Dashboard({ email }: { email: string }) {
  const { content } = useSiteContent();
  const queryClient = useQueryClient();
  const [section, setSection] = useState<ContentKey | "overview">("overview");
  const [status, setStatus] = useState<string | null>(null);

  async function save(key: ContentKey, rows: unknown[]) {
    const errors = validateDocument(key, rows);
    if (errors.length) {
      setStatus(`Not saved — ${errors[0]}`);
      return false;
    }
    const { error } = await supabase
      .from("site_content")
      .upsert({ key, data: rows as never, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (error) {
      setStatus(`Not saved — ${error.message}`);
      return false;
    }
    await queryClient.invalidateQueries({ queryKey: siteContentQueryKey });
    setStatus(`${contentLabels[key]} saved and published to the website.`);
    return true;
  }

  const stats = useMemo(() => {
    const named = content.students.filter((s) => s.name).length;
    return [
      { label: "Students", value: `${named}/${content.students.length}`, note: "names filled" },
      {
        label: "Green Cabinet",
        value: `${content.greenCabinet.filter((m) => m.name).length}/${content.greenCabinet.length}`,
        note: "slots filled",
      },
      { label: "Houses", value: String(content.houses.length), note: "configured" },
      {
        label: "Achievements",
        value: String(content.achievements.filter((a) => a.title).length),
        note: "recorded",
      },
      { label: "Events", value: String(content.events.filter((e) => e.title).length), note: "logged" },
      { label: "Photos", value: String(content.gallery.filter((g) => g.media).length), note: "uploaded" },
    ];
  }, [content]);

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-mono">Control room</p>
          <h1 className="mt-1 font-display text-3xl font-semibold">Class 11-A content</h1>
          <p className="mt-1 text-sm text-muted-foreground">Signed in as {email}</p>
        </div>
        <div className="flex gap-2">
          <BulkTools content={content} onSave={save} />
          <button
            onClick={() => supabase.auth.signOut()}
            className="rounded-xl border border-border px-4 py-2 text-sm hover:bg-surface/60"
          >
            Sign out
          </button>
        </div>
      </header>

      {status && (
        <p role="status" className="mt-4 rounded-xl border border-border bg-surface/50 px-4 py-2.5 text-sm">
          {status}
        </p>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Admin sections" className="h-max lg:sticky lg:top-24">
          <ul className="flex flex-wrap gap-1.5 lg:flex-col">
            {(["overview", ...contentKeys] as const).map((key) => (
              <li key={key}>
                <button
                  onClick={() => setSection(key)}
                  aria-current={section === key ? "true" : undefined}
                  className={cn(
                    "w-full rounded-xl px-3 py-2 text-left text-sm transition-colors",
                    section === key
                      ? "bg-primary/15 text-foreground"
                      : "text-muted-foreground hover:bg-surface/60",
                  )}
                >
                  {key === "overview" ? "Dashboard" : contentLabels[key]}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          {section === "overview" ? (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {stats.map((s) => (
                  <GlassPanel key={s.label} className="p-5">
                    <p className="label-mono">{s.label}</p>
                    <p className="mt-2 font-display text-3xl font-semibold text-primary">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.note}</p>
                  </GlassPanel>
                ))}
              </div>
              <HouseColorPanel />
            </div>
          ) : (
            <SectionEditor
              key={section}
              sectionKey={section}
              rows={content[section] as unknown as Row[]}
              onSave={save}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* section editor                                                      */
/* ------------------------------------------------------------------ */

function blankFrom(rows: Row[], key: ContentKey): Row {
  const template = rows[0] ?? {};
  const blank: Row = {};
  for (const [k, v] of Object.entries(template)) {
    blank[k] = Array.isArray(v) ? [] : typeof v === "number" ? 0 : null;
  }
  if ("id" in blank) blank["id"] = `${key}-${Date.now()}`;
  return blank;
}

function SectionEditor({
  sectionKey,
  rows,
  onSave,
}: {
  sectionKey: ContentKey;
  rows: Row[];
  onSave: (key: ContentKey, rows: unknown[]) => Promise<boolean>;
}) {
  const [draft, setDraft] = useState<Row[]>(() => structuredClone(rows));
  const [jsonMode, setJsonMode] = useState(false);
  const [jsonText, setJsonText] = useState(() => JSON.stringify(rows, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [open, setOpen] = useState<number | null>(0);

  const fixedLength = sectionKey === "students" || sectionKey === "greenCabinet" || sectionKey === "houses";

  function update(index: number, field: string, raw: string, original: unknown) {
    setDraft((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;
        let value: unknown = raw;
        if (Array.isArray(original)) value = raw ? raw.split(",").map((v) => v.trim()) : [];
        else if (typeof original === "number") value = Number(raw) || 0;
        else if (raw === "") value = null;
        return { ...row, [field]: value };
      }),
    );
  }

  return (
    <GlassPanel className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold">{contentLabels[sectionKey]}</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              if (!jsonMode) setJsonText(JSON.stringify(draft, null, 2));
              setJsonMode(!jsonMode);
            }}
            className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-surface/60"
          >
            {jsonMode ? "Form editor" : "JSON editor"}
          </button>
          {!fixedLength && !jsonMode && (
            <button
              onClick={() => setDraft((prev) => [...prev, blankFrom(prev, sectionKey)])}
              className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-surface/60"
            >
              Add entry
            </button>
          )}
          <button
            onClick={() => {
              if (jsonMode) {
                try {
                  const parsed = JSON.parse(jsonText) as Row[];
                  setJsonError(null);
                  setDraft(parsed);
                  void onSave(sectionKey, parsed);
                } catch {
                  setJsonError("That is not valid JSON.");
                }
              } else {
                void onSave(sectionKey, draft);
              }
            }}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
          >
            Save &amp; publish
          </button>
          <button
            onClick={() => {
              const fresh = structuredClone(defaultContent[sectionKey]) as unknown as Row[];
              setDraft(fresh);
              setJsonText(JSON.stringify(fresh, null, 2));
            }}
            className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-surface/60"
          >
            Reset to blank template
          </button>
        </div>
      </div>

      {jsonMode ? (
        <div className="mt-4">
          <label className="label-mono" htmlFor="json-editor">
            JSON document
          </label>
          <textarea
            id="json-editor"
            value={jsonText}
            spellCheck={false}
            onChange={(e) => setJsonText(e.target.value)}
            rows={22}
            className="mt-2 w-full rounded-xl border border-border bg-surface/60 p-3 font-mono text-xs outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
          {jsonError && <p className="mt-2 text-xs text-destructive">{jsonError}</p>}
        </div>
      ) : (
        <ul className="mt-4 space-y-2">
          {draft.map((row, i) => {
            const title =
              (row["name"] as string) ||
              (row["title"] as string) ||
              (row["role"] as string) ||
              `Entry ${i + 1}`;
            const badge = row["roll"] ?? row["slot"] ?? row["id"] ?? i + 1;
            const expanded = open === i;
            return (
              <li key={i} className="rounded-xl border border-border/70">
                <button
                  onClick={() => setOpen(expanded ? null : i)}
                  aria-expanded={expanded}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                >
                  <span className="flex items-center gap-3">
                    <span className="label-mono">{String(badge)}</span>
                    <span className="text-sm">{title}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">{expanded ? "Close" : "Edit"}</span>
                </button>
                {expanded && (
                  <div className="grid gap-3 border-t border-border/70 p-4 sm:grid-cols-2">
                    {Object.entries(row).map(([field, value]) => {
                      if (value !== null && typeof value === "object" && !Array.isArray(value)) return null;
                      const display = Array.isArray(value)
                        ? value.join(", ")
                        : value === null
                          ? ""
                          : String(value);
                      const long = field === "description" || field === "intro" || field === "quote";
                      return (
                        <label key={field} className={cn("block", long && "sm:col-span-2")}>
                          <span className="label-mono">{field}</span>
                          {long ? (
                            <textarea
                              rows={3}
                              value={display}
                              onChange={(e) => update(i, field, e.target.value, value)}
                              className="mt-1.5 w-full rounded-lg border border-border bg-surface/60 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            />
                          ) : (
                            <input
                              value={display}
                              onChange={(e) => update(i, field, e.target.value, value)}
                              className="mt-1.5 w-full rounded-lg border border-border bg-surface/60 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            />
                          )}
                        </label>
                      );
                    })}
                    {!fixedLength && (
                      <div className="sm:col-span-2">
                        <button
                          onClick={() => setDraft((prev) => prev.filter((_, x) => x !== i))}
                          className="rounded-lg border border-destructive/50 px-3 py-1.5 text-xs text-destructive"
                        >
                          Delete entry
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </GlassPanel>
  );
}

/* ------------------------------------------------------------------ */
/* bulk import / export                                                */
/* ------------------------------------------------------------------ */

function BulkTools({
  content,
  onSave,
}: {
  content: ContentShape;
  onSave: (key: ContentKey, rows: unknown[]) => Promise<boolean>;
}) {
  const [importing, setImporting] = useState(false);

  function exportAll() {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `class-11a-content-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function importAll(file: File) {
    setImporting(true);
    try {
      const parsed = JSON.parse(await file.text()) as Record<string, unknown>;
      for (const key of contentKeys) {
        const value = parsed[key];
        if (Array.isArray(value)) {
          const ok = await onSave(key, value);
          if (!ok) break;
        }
      }
    } catch {
      /* invalid file — surfaced through save status */
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={exportAll}
        className="rounded-xl border border-border px-4 py-2 text-sm hover:bg-surface/60"
      >
        Export JSON
      </button>
      <label className="cursor-pointer rounded-xl border border-border px-4 py-2 text-sm hover:bg-surface/60">
        {importing ? "Importing…" : "Import JSON"}
        <input
          type="file"
          accept="application/json"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void importAll(file);
          }}
        />
      </label>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* house customization — colors are data, applied site-wide            */
/* ------------------------------------------------------------------ */

function HouseColorPanel() {
  const { map, update, reset } = useHouseColors();
  const fields = [
    { key: "primary" as const, label: "Primary" },
    { key: "secondary" as const, label: "Secondary" },
    { key: "accent" as const, label: "Accent" },
  ];

  return (
    <GlassPanel className="p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="label-mono">House customization</p>
          <h2 className="mt-1 font-display text-lg font-semibold">House colors</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            These three tones drive every emblem, card, badge, leaderboard bar, particle and 3D tower
            for that house. Changes apply instantly across the site.
          </p>
        </div>
        <button
          onClick={reset}
          className="rounded-xl border border-border px-3 py-2 text-xs hover:bg-surface/60"
        >
          Reset to defaults
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {houses.map((h) => (
          <div key={h.id} className="rounded-2xl border border-border p-4">
            <div className="flex items-center gap-3">
              <HouseCrest id={h.id} className="size-12" animated={false} />
              <div>
                <p className="font-display text-sm font-medium uppercase tracking-wide">{h.name}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  --house-{h.id}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {fields.map((f) => (
                <label key={f.key} className="block">
                  <span className="block text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    {f.label}
                  </span>
                  <span className="mt-1 flex items-center gap-2">
                    <input
                      type="color"
                      aria-label={`${h.name} ${f.label} color`}
                      value={map[h.id][f.key]}
                      onChange={(e) => update(h.id, f.key, e.target.value)}
                      className="size-8 cursor-pointer rounded-md border border-border bg-transparent"
                    />
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {map[h.id][f.key]}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}
