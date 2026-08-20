import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { defaultContent, type ContentKey, type ContentShape } from "@/lib/content-store";

export interface ContentRow {
  key: string;
  data: unknown;
  updated_at: string;
}

/** Prefix used for admin drafts that are not live on the public site yet. */
export const DRAFT_PREFIX = "draft:";

async function fetchContent(): Promise<ContentRow[]> {
  const { data, error } = await supabase.from("site_content").select("key, data, updated_at");
  if (error) throw error;
  return (data ?? []) as ContentRow[];
}

export const siteContentQueryKey = ["site_content"] as const;

/** True when the visitor asked for the unpublished preview (`?preview=1`). */
function isPreviewMode() {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("preview") === "1";
}

/** All class content: static defaults merged with anything the admin has published. */
export function useSiteContent() {
  const query = useQuery({
    queryKey: siteContentQueryKey,
    queryFn: fetchContent,
    staleTime: 30_000,
  });

  const rows = useMemo(() => query.data ?? [], [query.data]);

  const content = useMemo<ContentShape>(() => {
    const merged: ContentShape = { ...defaultContent };
    const preview = isPreviewMode();
    for (const row of rows) {
      if (!Array.isArray(row.data)) continue;
      if (row.key in merged) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (merged as any)[row.key as ContentKey] = row.data;
      }
    }
    if (preview) {
      for (const row of rows) {
        if (!Array.isArray(row.data) || !row.key.startsWith(DRAFT_PREFIX)) continue;
        const key = row.key.slice(DRAFT_PREFIX.length);
        if (key in merged) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (merged as any)[key as ContentKey] = row.data;
        }
      }
    }
    return merged;
  }, [rows]);

  /** Draft documents keyed by section — used by the admin control room. */
  const drafts = useMemo(() => {
    const map: Partial<Record<ContentKey, unknown[]>> = {};
    for (const row of rows) {
      if (!Array.isArray(row.data) || !row.key.startsWith(DRAFT_PREFIX)) continue;
      map[row.key.slice(DRAFT_PREFIX.length) as ContentKey] = row.data as unknown[];
    }
    return map;
  }, [rows]);

  return { content, drafts, rows, isLoading: query.isLoading, refetch: query.refetch };
}

/** Convenience accessor for one section. */
export function useContentSection<K extends ContentKey>(key: K): ContentShape[K] {
  const { content } = useSiteContent();
  return content[key];
}

/**
 * Editable page copy. `text("motto", "fallback")` returns the admin value when
 * present, otherwise the fallback — so pages never render an empty block.
 */
export function useClassText() {
  const rows = useContentSection("classText");
  return useMemo(() => {
    const map = new Map(rows.map((r) => [r.id, r.value] as const));
    return (id: string, fallback = "") => {
      const value = map.get(id);
      return value && value.trim() !== "" ? value : fallback;
    };
  }, [rows]);
}
