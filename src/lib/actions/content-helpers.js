import "server-only";
import { revalidatePath } from "next/cache";
import { requireSupabase } from "@/lib/supabase/client";
import { TABLES } from "@/lib/supabase/tables";
import { requireSite } from "@/lib/site";

/**
 * Shared write path for every admin mutation: persist, record an audit entry,
 * then bust the caches of both the public page and the admin screen that was
 * editing it. Kept in one place because ~20 generated actions reuse this exact
 * sequence.
 */
export async function recordAudit({ admin, action, entityType, entityId, summary }) {
  const supabase = requireSupabase();
  const site = await requireSite();

  const { error } = await supabase.from(TABLES.auditLog).insert({
    site_id: site.id,
    admin_id: admin.id,
    action,
    entity_type: entityType,
    entity_id: entityId != null ? String(entityId) : null,
    summary,
    created_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function saveContentBlock({ admin, key, data, label }) {
  const supabase = requireSupabase();
  const site = await requireSite();

  // Upsert rather than update: a block added to the registry after the initial
  // seed has no row yet, and saving it should create one instead of silently
  // matching zero rows. The conflict target is (site_id, key) — the same key
  // exists once per shop.
  const { error } = await supabase.from(TABLES.contentBlocks).upsert(
    { site_id: site.id, key, data, updated_at: new Date().toISOString() },
    { onConflict: "site_id,key" },
  );
  if (error) throw error;

  await recordAudit({
    admin,
    action: "content.update",
    entityType: "content_block",
    entityId: key,
    summary: `Updated ${label}`,
  });

  revalidatePath("/");
  revalidatePath("/privacy");
  revalidatePath("/terms");
  revalidatePath(`/admin/content/${key}`);
}

export function revalidatePaths(paths = []) {
  for (const path of paths) revalidatePath(path);
}
