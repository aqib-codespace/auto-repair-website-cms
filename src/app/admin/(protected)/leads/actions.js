"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/dal";
import { requireSupabase } from "@/lib/supabase/client";
import { recordAudit } from "@/lib/actions/content-helpers";
import { TABLES } from "@/lib/supabase/tables";
import { requireSite } from "@/lib/site";
import { LEAD_STATUSES } from "@/config/site";

const VALID_STATUSES = new Set(LEAD_STATUSES.map((status) => status.value));

export async function updateLeadStatus(formData) {
  const admin = await requireAdmin();
  const supabase = requireSupabase();
  const site = await requireSite();

  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "");

  if (!Number.isInteger(id)) throw new Error("Missing request id.");
  if (!VALID_STATUSES.has(status)) throw new Error("Unknown status.");

  const { data, error } = await supabase
    .from(TABLES.leads)
    .update({ status })
    .eq("site_id", site.id)
    .eq("id", id)
    .select("name")
    .single();
  if (error) throw error;

  await recordAudit({
    admin,
    action: "lead.status",
    entityType: "lead",
    entityId: id,
    summary: `Marked ${data.name}'s request as ${status}`,
  });

  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

export async function deleteLead(formData) {
  const admin = await requireAdmin();
  const supabase = requireSupabase();
  const site = await requireSite();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("Missing request id.");

  const { data: row } = await supabase
    .from(TABLES.leads)
    .select("name")
    .eq("site_id", site.id)
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase
    .from(TABLES.leads)
    .delete()
    .eq("site_id", site.id)
    .eq("id", id);
  if (error) throw error;

  await recordAudit({
    admin,
    action: "lead.delete",
    entityType: "lead",
    entityId: id,
    summary: `Deleted ${row?.name ?? "a"} request`,
  });

  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}
