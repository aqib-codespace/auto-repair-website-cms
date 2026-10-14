import "server-only";
import { cache } from "react";
import { requireSupabase } from "@/lib/supabase/client";
import { mapMedia, mapLead } from "@/lib/supabase/mappers";
import { requireAdmin } from "@/lib/auth/dal";
import { requireSite } from "@/lib/site";
import { COLLECTIONS } from "@/lib/admin/collections";
import { TABLES, table } from "@/lib/supabase/tables";
import { BLOCKS } from "@/lib/admin/blocks";

/**
 * Admin-only reads. Each independently re-verifies the session (defence in
 * depth on top of the calling page's requireAdmin()) — cache() collapses this
 * to one check per request either way.
 *
 * Table names always come from the registries, never from a URL segment, so a
 * crafted /admin/collections/<anything> can't reach an unintended table.
 *
 * Every read is also filtered by the active site. Unlike the public readers,
 * these throw when the site can't be resolved: showing an admin an empty list
 * would invite them to "fix" it by re-entering content that already exists.
 */

function tableFor(slug) {
  const collection = COLLECTIONS.find((entry) => entry.slug === slug);
  if (!collection) throw new Error(`Unknown collection: ${slug}`);
  return table(collection.table);
}

export const getCollectionRows = cache(async (slug) => {
  await requireAdmin();
  const supabase = requireSupabase();
  const site = await requireSite();

  const { data, error } = await supabase
    .from(tableFor(slug))
    .select("*")
    .eq("site_id", site.id)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });
  if (error) throw error;
  return data ?? [];
});

export const getCollectionRow = cache(async (slug, id) => {
  await requireAdmin();
  const supabase = requireSupabase();
  const site = await requireSite();

  const { data, error } = await supabase
    .from(tableFor(slug))
    .select("*")
    .eq("site_id", site.id)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
});

export const getContentBlockAdmin = cache(async (key) => {
  await requireAdmin();
  const supabase = requireSupabase();
  const site = await requireSite();

  const { data, error } = await supabase
    .from(TABLES.contentBlocks)
    .select("data, updated_at")
    .eq("site_id", site.id)
    .eq("key", key)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
});

export const getSiteSettingsAdmin = cache(async () => {
  await requireAdmin();
  const supabase = requireSupabase();
  const site = await requireSite();

  const { data, error } = await supabase
    .from(TABLES.siteSettings)
    .select("*")
    .eq("site_id", site.id)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
});

export const getAllMedia = cache(async () => {
  await requireAdmin();
  const supabase = requireSupabase();
  const site = await requireSite();

  const { data, error } = await supabase
    .from(TABLES.media)
    .select("*")
    .eq("site_id", site.id)
    .order("uploaded_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapMedia);
});

export const getLeads = cache(async (status) => {
  await requireAdmin();
  const supabase = requireSupabase();
  const site = await requireSite();

  let query = supabase
    .from(TABLES.leads)
    .select("*")
    .eq("site_id", site.id)
    .order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(mapLead);
});

export const getNewLeadCount = cache(async () => {
  await requireAdmin();
  const supabase = requireSupabase();
  const site = await requireSite();

  const { count, error } = await supabase
    .from(TABLES.leads)
    .select("id", { count: "exact", head: true })
    .eq("site_id", site.id)
    .eq("status", "new");
  if (error) throw error;
  return count ?? 0;
});

/** Counts for the dashboard tiles, in one round of parallel head-queries. */
export const getDashboardStats = cache(async () => {
  await requireAdmin();
  const supabase = requireSupabase();
  const site = await requireSite();

  const countOf = async (name, filter) => {
    let query = supabase
      .from(table(name))
      .select("id", { count: "exact", head: true })
      .eq("site_id", site.id);
    if (filter) query = query.eq(filter.column, filter.value);
    const { count, error } = await query;
    if (error) throw error;
    return count ?? 0;
  };

  const [newLeads, totalLeads, services, reviews, faqs, photos, media] = await Promise.all([
    countOf("leads", { column: "status", value: "new" }),
    countOf("leads"),
    countOf("services"),
    countOf("testimonials"),
    countOf("faqs"),
    countOf("gallery_items"),
    countOf("media"),
  ]);

  return { newLeads, totalLeads, services, reviews, faqs, photos, media, blocks: BLOCKS.length };
});

export const getRecentActivity = cache(async (limit = 8) => {
  await requireAdmin();
  const supabase = requireSupabase();
  const site = await requireSite();

  const { data, error } = await supabase
    .from(TABLES.auditLog)
    .select("*")
    .eq("site_id", site.id)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
});
