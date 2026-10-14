"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/dal";
import { requireSupabase, MEDIA_BUCKET } from "@/lib/supabase/client";
import { recordAudit } from "@/lib/actions/content-helpers";
import { TABLES } from "@/lib/supabase/tables";
import { requireSite } from "@/lib/site";

/**
 * Removes a file from Storage and its row from the media table.
 *
 * Sections that still reference the URL are deliberately left alone rather than
 * blanked: silently emptying a hero image because a file was tidied up is worse
 * than a broken thumbnail the admin can see and fix.
 */
export async function deleteMedia(formData) {
  const admin = await requireAdmin();
  const supabase = requireSupabase();
  const site = await requireSite();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("Missing media id.");

  const { data: row, error: fetchError } = await supabase
    .from(TABLES.media)
    .select("filename")
    .eq("site_id", site.id)
    .eq("id", id)
    .maybeSingle();
  if (fetchError) throw fetchError;
  if (!row) return;

  const { error: storageError } = await supabase.storage
    .from(MEDIA_BUCKET)
    .remove([row.filename]);
  if (storageError) throw storageError;

  const { error } = await supabase
    .from(TABLES.media)
    .delete()
    .eq("site_id", site.id)
    .eq("id", id);
  if (error) throw error;

  await recordAudit({
    admin,
    action: "media.delete",
    entityType: "media",
    entityId: id,
    summary: `Deleted image ${row.filename}`,
  });

  revalidatePath("/admin/media");
}
