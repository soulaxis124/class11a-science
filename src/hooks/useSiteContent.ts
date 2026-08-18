import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { defaultContent, type ContentKey, type ContentShape } from "@/lib/content-store";

export interface ContentRow {
  key: string;
  data: unknown;
  updated_at: string;
}

async function fetchContent(): Promise<ContentRow[]> {
  const { data, error } = await supabase.from("site_content").select("key, data, updated_at");
  if (error) throw error;
  return (data ?? []) as ContentRow[];
}

export const siteContentQueryKey = ["site_content"] as const;

/** All class content: static defaults merged with anything the admin has saved. */
export function useSiteContent() {
  const query = useQuery({
    queryKey: siteContentQueryKey,
    queryFn: fetchContent,
    staleTime: 30_000,
  });

  const content = useMemo<ContentShape>(() => {
    const merged: ContentShape = { ...defaultContent };
    for (const row of query.data ?? []) {
      if (Array.isArray(row.data) && row.key in merged) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (merged as any)[row.key as ContentKey] = row.data;
      }
    }
    return merged;
  }, [query.data]);

  return { content, isLoading: query.isLoading, refetch: query.refetch };
}

/** Convenience accessor for one section. */
export function useContentSection<K extends ContentKey>(key: K): ContentShape[K] {
  const { content } = useSiteContent();
  return content[key];
}
