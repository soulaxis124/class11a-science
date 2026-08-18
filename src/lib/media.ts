import { supabase } from "@/integrations/supabase/client";

export const MEDIA_BUCKET = "media";
const ACCEPTED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

/** Public, permanent URL for an object stored in the media library. */
export function mediaUrl(path: string) {
  return `/api/public/media/${path.split("/").map(encodeURIComponent).join("/")}`;
}

/**
 * Uploads one JPG / PNG / WEBP image to the media library and returns the
 * public URL that can be stored directly in a content record.
 */
export async function uploadImage(file: File, folder = "uploads"): Promise<string> {
  if (!ACCEPTED.includes(file.type)) {
    throw new Error("Only JPG, PNG or WEBP images are allowed.");
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error("Image is larger than 8 MB.");
  }
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const safe = file.name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 40);
  const path = `${folder}/${Date.now()}-${safe || "image"}.${ext}`;
  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, file, { cacheControl: "31536000", upsert: false, contentType: file.type });
  if (error) throw new Error(error.message);
  return mediaUrl(path);
}
