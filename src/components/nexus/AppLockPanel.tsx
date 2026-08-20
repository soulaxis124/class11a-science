import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getLockSettings, updateLockSettings } from "@/lib/app-lock.functions";
import { GlassPanel } from "@/components/nexus/primitives";
import { ImageField } from "@/components/nexus/ImageField";
import { lockQueryKey, LockCard } from "@/components/nexus/LockScreen";

/**
 * Admin panel for the site-wide App Lock: toggles, lock-screen copy/logo and
 * credential rotation. Credentials are only ever sent to the server, which
 * stores salted one-way hashes.
 */
export function AppLockPanel({ onStatus }: { onStatus: (msg: string | null) => void }) {
  const load = useServerFn(getLockSettings);
  const save = useServerFn(updateLockSettings);
  const queryClient = useQueryClient();
  const settings = useQuery({ queryKey: lockQueryKey, queryFn: () => load() });

  const [lockEnabled, setLockEnabled] = useState(false);
  const [pinEnabled, setPinEnabled] = useState(true);
  const [passwordEnabled, setPasswordEnabled] = useState(true);
  const [title, setTitle] = useState("Science Nexus");
  const [subtitle, setSubtitle] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [newPin, setNewPin] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const d = settings.data;
    if (!d) return;
    setLockEnabled(d.lockEnabled);
    setPinEnabled(d.pinEnabled);
    setPasswordEnabled(d.passwordEnabled);
    setTitle(d.title);
    setSubtitle(d.subtitle);
    setLogoUrl(d.logoUrl);
  }, [settings.data]);

  async function commit(extra: { logoutAllSessions?: boolean } = {}) {
    setBusy(true);
    onStatus(null);
    try {
      await save({
        data: {
          lockEnabled,
          pinEnabled,
          passwordEnabled,
          title,
          subtitle,
          logoUrl,
          ...(newPin ? { newPin } : {}),
          ...(newPassword ? { newPassword } : {}),
          ...extra,
        },
      });
      setNewPin("");
      setNewPassword("");
      await queryClient.invalidateQueries({ queryKey: lockQueryKey });
      onStatus(extra.logoutAllSessions ? "All devices signed out." : "App Lock saved.");
    } catch (err) {
      onStatus(err instanceof Error ? err.message : "Could not save App Lock.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <GlassPanel className="p-6">
        <p className="label-mono">Security</p>
        <h2 className="mt-1 font-display text-xl font-semibold">App Lock</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          When enabled, every visitor must enter the access PIN or password before the site opens.
        </p>

        <div className="mt-5 space-y-3">
          {(
            [
              ["Lock the whole site", lockEnabled, setLockEnabled],
              ["Allow PIN unlock", pinEnabled, setPinEnabled],
              ["Allow password unlock", passwordEnabled, setPasswordEnabled],
            ] as const
          ).map(([label, value, set]) => (
            <label
              key={label}
              className="flex items-center justify-between gap-4 rounded-xl border border-border/70 px-4 py-3 text-sm"
            >
              <span>{label}</span>
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => set(e.target.checked)}
                className="size-4 accent-[hsl(var(--primary))]"
              />
            </label>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="label-mono">Lock screen title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-surface/60 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </label>
          <label className="block">
            <span className="label-mono">Subtitle</span>
            <input
              value={subtitle ?? ""}
              onChange={(e) => setSubtitle(e.target.value === "" ? null : e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-surface/60 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </label>
          <ImageField
            label="Lock screen logo"
            value={logoUrl}
            folder="app-lock"
            onChange={setLogoUrl}
            className="sm:col-span-2"
          />
          <label className="block">
            <span className="label-mono">New PIN (leave blank to keep)</span>
            <input
              type="password"
              autoComplete="new-password"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-surface/60 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </label>
          <label className="block">
            <span className="label-mono">New password (leave blank to keep)</span>
            <input
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-surface/60 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </label>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={() => void commit()}
            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {busy ? "Saving…" : "Save App Lock"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void commit({ logoutAllSessions: true })}
            className="rounded-xl border border-destructive/50 px-4 py-2.5 text-sm text-destructive disabled:opacity-60"
          >
            Log out all sessions
          </button>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          Changing a credential also signs out every device. Credentials are stored as salted one-way
          hashes and never sent back to the browser.
        </p>
      </GlassPanel>

      <div className="pointer-events-none origin-top scale-[0.82] overflow-hidden rounded-2xl border border-border/70">
        <LockCard
          settings={
            settings.data
              ? { ...settings.data, lockEnabled, pinEnabled, passwordEnabled, title, subtitle, logoUrl }
              : undefined
          }
          onUnlocked={() => undefined}
          previewOnly
        />
      </div>
    </div>
  );
}
