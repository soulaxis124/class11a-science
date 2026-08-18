import { useRef, useState } from "react";
import { uploadImage } from "@/lib/media";
import { cn } from "@/lib/utils";

/**
 * Admin photo picker: uploads a JPG / PNG / WEBP to the media library and
 * writes the resulting public URL back into the content record. A URL can
 * still be pasted manually for images hosted elsewhere.
 */
export function ImageField({
  label,
  value,
  folder = "uploads",
  onChange,
  className,
}: {
  label: string;
  value: string | null;
  folder?: string;
  onChange: (next: string | null) => void;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pick(file: File) {
    setBusy(true);
    setError(null);
    try {
      onChange(await uploadImage(file, folder));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={cn("block", className)}>
      <span className="label-mono">{label}</span>
      <div className="mt-1.5 flex flex-wrap items-center gap-3">
        <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl border border-border bg-surface/60">
          {value ? (
            <img src={value} alt="" className="size-full object-cover" />
          ) : (
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
              none
            </span>
          )}
        </span>
        <div className="flex min-w-[9rem] flex-1 flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
              className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-surface/60 disabled:opacity-60"
            >
              {busy ? "Uploading…" : value ? "Replace photo" : "Upload photo"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange(null)}
                className="rounded-lg border border-destructive/50 px-3 py-1.5 text-xs text-destructive"
              >
                Remove
              </button>
            )}
          </div>
          <input
            value={value ?? ""}
            placeholder="or paste an image URL"
            onChange={(e) => onChange(e.target.value === "" ? null : e.target.value)}
            className="w-full rounded-lg border border-border bg-surface/60 px-3 py-2 text-xs outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void pick(file);
          e.target.value = "";
        }}
      />
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}
