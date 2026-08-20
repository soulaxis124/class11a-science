import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getLockSettings, verifyLock } from "@/lib/app-lock.functions";
import { GlassPanel } from "@/components/nexus/primitives";
import { NexusLogo } from "@/components/nexus/Logo";
import { cn } from "@/lib/utils";

const STORE_KEY = "nexus:unlock";

export const lockQueryKey = ["app_lock_settings"] as const;

function storedEpoch() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORE_KEY);
  } catch {
    return null;
  }
}

/**
 * App Lock gate. The whole site renders only after a valid PIN or password.
 * The unlock marker stored locally is the server's `session_epoch`; changing a
 * credential (or "log out all sessions") bumps it and invalidates every device.
 */
export function LockGate({ children, preview = false }: { children: React.ReactNode; preview?: boolean }) {
  const load = useServerFn(getLockSettings);
  const queryClient = useQueryClient();
  const settings = useQuery({
    queryKey: lockQueryKey,
    queryFn: () => load(),
    staleTime: 60_000,
  });
  const [unlockedEpoch, setUnlockedEpoch] = useState<string | null>(() => storedEpoch());

  if (preview) return <LockCard settings={settings.data} onUnlocked={() => undefined} previewOnly />;

  // Never block rendering while the config loads or if the request fails.
  if (settings.isLoading || settings.isError) return <>{children}</>;
  if (!settings.data?.lockEnabled) return <>{children}</>;
  if (unlockedEpoch && unlockedEpoch === settings.data.sessionEpoch) return <>{children}</>;

  return (
    <LockCard
      settings={settings.data}
      onUnlocked={(epoch) => {
        try {
          window.localStorage.setItem(STORE_KEY, epoch);
        } catch {
          /* private mode — session-only unlock */
        }
        setUnlockedEpoch(epoch);
        void queryClient.invalidateQueries({ queryKey: lockQueryKey });
      }}
    />
  );
}

type Settings = Awaited<ReturnType<typeof getLockSettings>>;

export function LockCard({
  settings,
  onUnlocked,
  previewOnly = false,
}: {
  settings?: Settings | undefined;
  onUnlocked: (epoch: string) => void;
  previewOnly?: boolean;
}) {
  const verify = useServerFn(verifyLock);
  const pinEnabled = settings?.pinEnabled ?? true;
  const passwordEnabled = settings?.passwordEnabled ?? true;
  const [mode, setMode] = useState<"pin" | "password">(pinEnabled ? "pin" : "password");
  const [secret, setSecret] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (previewOnly) {
      setError("Preview only — credentials are not checked here.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await verify({ data: { secret, mode } });
      if (res.ok) onUnlocked(res.sessionEpoch);
      else setError(res.reason);
    } catch {
      setError("Could not verify right now. Please try again.");
    } finally {
      setBusy(false);
      setSecret("");
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-16">
      <GlassPanel className="w-full max-w-md p-8 sm:p-10">
        <div className="flex flex-col items-center text-center">
          {settings?.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt=""
              className="h-16 w-16 rounded-full border border-border/70 object-cover"
            />
          ) : (
            <NexusLogo />
          )}
          <p className="label-mono mt-5">Secure access</p>
          <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight">
            {settings?.title ?? "Science Nexus"}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {settings?.subtitle ?? "Enter the class access PIN or password to open the nexus."}
          </p>
        </div>

        {pinEnabled && passwordEnabled && (
          <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl border border-border/70 p-1">
            {(["pin", "password"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setError(null);
                  setSecret("");
                }}
                className={cn(
                  "rounded-lg px-3 py-2 text-xs font-medium capitalize transition-colors",
                  mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-surface/60",
                )}
              >
                {m}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={submit} className="mt-5 space-y-4">
          <label className="block">
            <span className="label-mono">{mode === "pin" ? "Access PIN" : "Password"}</span>
            <input
              type="password"
              required
              autoFocus
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              autoComplete={mode === "pin" ? "one-time-code" : "current-password"}
              className="mt-1.5 w-full rounded-xl border border-border bg-surface/60 px-3 py-2.5 text-center text-sm tracking-[0.3em] outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </label>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-60"
          >
            {busy ? "Verifying…" : "Enter the nexus"}
          </button>
        </form>
        <p className="mt-5 text-center text-[11px] leading-relaxed text-muted-foreground">
          Credentials are verified on the server and stored only as one-way hashes.
        </p>
      </GlassPanel>
    </main>
  );
}
