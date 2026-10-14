"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/dal";
import { requireSupabase } from "@/lib/supabase/client";
import { requireSite } from "@/lib/site";
import { TABLES } from "@/lib/supabase/tables";
import { getTemplate } from "@/lib/templates/registry";
import { recordAudit } from "@/lib/actions/content-helpers";

/**
 * Switches the site's template.
 *
 * The submitted id is validated against the registry before it is written, so a
 * crafted form value cannot store a template that does not exist — the render
 * path would fall back to the default, but a bad row would silently misreport
 * what the site is running.
 */
export async function setTemplate(prevState, formData) {
  const admin = await requireAdmin();
  const supabase = requireSupabase();
  const site = await requireSite();

  const id = String(formData.get("template") ?? "");
  const template = getTemplate(id);
  if (!template) return { error: "Unknown template." };

  /**
   * The choice lives in `site_settings.extras`, so it has to be merged rather
   * than assigned — writing `{ template: id }` as the whole object would discard
   * any other per-site field kept there. Read-modify-write is safe here because
   * nothing else in the admin writes `extras`, and PostgREST patches only the
   * columns named, so a concurrent Settings save cannot overwrite it either.
   */
  const { data: current, error: readError } = await supabase
    .from(TABLES.siteSettings)
    .select("extras")
    .eq("site_id", site.id)
    .single();
  if (readError) return { error: readError.message };

  const { error } = await supabase
    .from(TABLES.siteSettings)
    .update({
      extras: { ...(current?.extras ?? {}), template: id },
      updated_at: new Date().toISOString(),
    })
    .eq("site_id", site.id);
  if (error) return { error: error.message };

  await recordAudit({
    admin,
    action: "design.template",
    entityType: "site_settings",
    entityId: site.id,
    summary: `Switched the site design to ${template.name}`,
  });

  /**
   * "layout" scope, not the default: the template supplies the header, the
   * footer, and the <body> class, all of which live in layouts. Revalidating
   * only the page would leave a visitor on Momentum's chrome around Torque's
   * content until something else busted the layout cache.
   */
  revalidatePath("/", "layout");
  revalidatePath("/admin/templates");

  return { success: true, template: id };
}
