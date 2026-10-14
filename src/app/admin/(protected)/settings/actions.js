"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/dal";
import { requireSupabase } from "@/lib/supabase/client";
import { SETTINGS_FIELDS } from "@/lib/admin/settings";
import { parseFields } from "@/lib/admin/parse";
import { recordAudit } from "@/lib/actions/content-helpers";
import { TABLES } from "@/lib/supabase/tables";
import { requireSite } from "@/lib/site";

export async function updateSettings(prevState, formData) {
  const admin = await requireAdmin();
  const supabase = requireSupabase();
  const site = await requireSite();

  const { data, errors, ok } = parseFields(SETTINGS_FIELDS, formData, { mode: "row" });
  if (!ok) return { errors };

  // One settings row per site, keyed by site_id, upserted so a shop that has
  // never saved settings self-heals instead of failing with "0 rows updated".
  const { error } = await supabase
    .from(TABLES.siteSettings)
    .upsert(
      { site_id: site.id, ...data, updated_at: new Date().toISOString() },
      { onConflict: "site_id" },
    );
  if (error) return { error: error.message };

  await recordAudit({
    admin,
    action: "settings.update",
    entityType: "site_settings",
    entityId: site.id,
    summary: "Updated site settings",
  });

  // Settings feed the layout (brand colours, metadata, header, footer), so
  // every page needs revalidating, not just the homepage.
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");

  return { success: true };
}
