"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase/client";
import { TABLES } from "@/lib/supabase/tables";
import { getActiveSite } from "@/lib/site";
import { leadSchema } from "@/lib/validation/lead";

/**
 * Public (unauthenticated) appointment request handler — the only write path
 * on the site that isn't behind requireAdmin(). Defences, in order: a
 * honeypot field bots fill and humans can't see, strict schema validation,
 * and fixed column mapping so nothing user-supplied reaches the query
 * builder as an identifier.
 */
export async function submitLead(prevState, formData) {
  // Bots fill every field they find; real users never see this one.
  if (String(formData.get("company_website") ?? "").trim()) {
    return { success: true };
  }

  const parsed = leadSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    vehicleMake: formData.get("vehicleMake"),
    vehicleModel: formData.get("vehicleModel"),
    serviceNeeded: formData.get("serviceNeeded"),
    preferredDate: formData.get("preferredDate"),
    comments: formData.get("comments"),
  });

  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  if (!supabase) {
    return {
      error:
        "This site is running in preview mode, so requests aren't being saved yet. " +
        "Please call us instead — or connect Supabase to start collecting appointment requests.",
    };
  }

  // A request that cannot be attributed to a shop is worse than no request:
  // it would sit in a table nobody's inbox reads.
  const site = await getActiveSite();
  if (!site) {
    console.error("[leads] No active site; refusing to store an unattributable request.");
    return {
      error: "Something went wrong on our end. Please call us and we'll get you booked.",
    };
  }

  const d = parsed.data;
  const { error } = await supabase.from(TABLES.leads).insert({
    site_id: site.id,
    name: d.name,
    phone: d.phone,
    email: d.email || null,
    vehicle_make: d.vehicleMake,
    vehicle_model: d.vehicleModel,
    service_needed: d.serviceNeeded,
    preferred_date: d.preferredDate || null,
    comments: d.comments || null,
    status: "new",
    created_at: new Date().toISOString(),
  });

  if (error) {
    // Never surface a database message to a customer.
    console.error("Failed to save lead:", error);
    return {
      error: "Something went wrong on our end. Please call us and we'll get you booked.",
    };
  }

  revalidatePath("/admin/leads");
  return { success: true };
}
