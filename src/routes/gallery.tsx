import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { X } from "lucide-react";
import { gallery, galleryCategories } from "@/data/content";
import type { GalleryItem } from "@/data/types";
import { PageShell, PhotoSlot, Section, SectionHero } from "@/components/nexus/primitives";
import { GalleryCard } from "@/components/nexus/cards";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Memory Museum — Class 11-A Science" },
      {
        name: "description",
        content:
          "A cinematic digital museum of Class 11-A Science memories: class life, events, sports, celebrations, trips and more.",
      },
      { property: "og:title", content: "Memory Museum — Class 11-A Science" },
      { property: "og:description", content: "A digital museum of our class memories." },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState<GalleryItem | null>(null);
  const items = cat === "All" ? gallery : gallery.filter((g) => g.category === cat);

  return (
    <PageShell>
      <SectionHero
        eyebrow="Memory Museum"
        title="Our Memories"
        subtitle="Every moment worth keeping"
        description="Photographs and videos of Class 11-A will be exhibited across these halls."
      />
      <Section hint={`${items.length} exhibits`}>
        <div className="mb-6 flex flex-wrap gap-2">
          {["All", ...galleryCategories].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.14em] transition-colors",
                cat === c
                  ? "border-primary/60 bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <GalleryCard key={item.id} item={item} onOpen={setOpen} />
          ))}
        </div>
      </Section>

      {open ? (
        <div
          className="fixed inset-0 z-[70] grid place-items-center bg-black/85 p-6 backdrop-blur-sm"
          onClick={() => setOpen(null)}
        >
          <div className="glass w-full max-w-3xl overflow-hidden rounded-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-video">
              <PhotoSlot src={open.media} alt={open.title ?? open.category} />
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="font-display text-sm">{open.title ?? "Untitled memory"}</p>
                <p className="label-mono mt-1">{open.category}</p>
              </div>
              <button type="button" onClick={() => setOpen(null)} aria-label="Close viewer">
                <X className="size-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}
