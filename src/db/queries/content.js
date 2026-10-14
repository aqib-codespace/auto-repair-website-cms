import "server-only";
import { cache } from "react";
import { supabase } from "@/lib/supabase/client";
import { TABLES } from "@/lib/supabase/tables";
import { getActiveSite } from "@/lib/site";
import { reportOnce } from "@/lib/log";
import {
  mapService,
  mapTestimonial,
  mapFaq,
  mapGalleryItem,
  mapSiteSettings,
} from "@/lib/supabase/mappers";
import {
  DEFAULT_SETTINGS,
  DEFAULT_BLOCKS,
  DEFAULT_SERVICES,
  DEFAULT_TESTIMONIALS,
  DEFAULT_FAQS,
  DEFAULT_GALLERY,
} from "@/content/defaults";

/**
 * Public, unauthenticated readers for the marketing site. Deliberately kept
 * separate from the admin query/mutation modules so this file never
 * accidentally grows a requireAdmin() call that would auth-gate the homepage.
 * Each is React-cache()-wrapped so repeated calls within one request (e.g. from
 * both the layout and the page) collapse into one query.
 *
 * ---------------------------------------------------------------------------
 * FAILURE POLICY
 * ---------------------------------------------------------------------------
 * These readers never throw. If Supabase is unconfigured, unreachable, or the
 * schema hasn't been created yet, they fall back to src/content/defaults.js and
 * log the reason once per query.
 *
 * The reasoning: a shop's website going blank is a worse outcome than it
 * serving last-known-good copy, and the most common causes here (a missing
 * migration, an unresolvable site, a paused project) are all configuration
 * mistakes that shouldn't take the storefront down. The admin panel takes the
 * opposite stance — its queries throw so the error surfaces loudly in the
 * dashboard rather than being masked by demo content.
 *
 * ---------------------------------------------------------------------------
 * SITE SCOPING
 * ---------------------------------------------------------------------------
 * Every table holds rows for many shops, so every read is filtered by the
 * active site's id. That filter is applied here, once per reader, rather than
 * being left to call sites — a forgotten `.eq("site_id", …)` would show one
 * shop another shop's content.
 */

/** Collection defaults need stable keys for React; rows get theirs from Postgres. */
const withIds = (items) => items.map((item, index) => ({ ...item, id: `default-${index}` }));

function reportFailure(label, error) {
  const hints = {
    // PostgREST: table or view not found.
    "42P01": "Run supabase/schema.sql in the Supabase SQL editor.",
    PGRST205:
      "Run supabase/schema.sql in the Supabase SQL editor, and check that SUPABASE_TABLE_PREFIX " +
      "matches the table names it creates.",
  };

  reportOnce(
    `cms:${label}`,
    `[cms] ${label} failed — serving bundled default content instead.\n` +
      `      ${error?.message ?? error}` +
      (hints[error?.code] ? `\n      Fix: ${hints[error.code]}` : ""),
  );
}

/**
 * Runs a scoped read, handing the active site's id to the query builder.
 *
 * Returns `fallback` when Supabase is absent, the site can't be resolved, or the
 * query fails — the three states that must not take a storefront down.
 */
async function read(label, fallback, run) {
  if (!supabase) return fallback;

  const site = await getActiveSite();
  if (!site) return fallback;

  try {
    const { data, error } = await run(site.id);
    if (error) throw error;
    return data;
  } catch (error) {
    reportFailure(label, error);
    return fallback;
  }
}

export const getSiteSettings = cache(async () => {
  const row = await read("site_settings", null, (siteId) =>
    supabase.from(TABLES.siteSettings).select("*").eq("site_id", siteId).maybeSingle(),
  );
  return row ? mapSiteSettings(row) : DEFAULT_SETTINGS;
});

export const getContentBlock = cache(async (key) => {
  const row = await read(`content_blocks (${key})`, null, (siteId) =>
    supabase
      .from(TABLES.contentBlocks)
      .select("data")
      .eq("site_id", siteId)
      .eq("key", key)
      .maybeSingle(),
  );
  return row?.data ?? DEFAULT_BLOCKS[key] ?? null;
});

export const getServices = cache(async () => {
  const rows = await read("services", null, (siteId) =>
    supabase
      .from(TABLES.services)
      .select("*")
      .eq("site_id", siteId)
      .order("sort_order", { ascending: true }),
  );
  return rows?.length ? rows.map(mapService) : withIds(DEFAULT_SERVICES);
});

/** Featured testimonial first, then the rest in sort order — the carousel opens on it. */
export const getTestimonials = cache(async () => {
  const rows = await read("testimonials", null, (siteId) =>
    supabase
      .from(TABLES.testimonials)
      .select("*")
      .eq("site_id", siteId)
      .order("featured", { ascending: false })
      .order("sort_order", { ascending: true }),
  );
  return rows?.length ? rows.map(mapTestimonial) : withIds(DEFAULT_TESTIMONIALS);
});

export const getFaqs = cache(async () => {
  const rows = await read("faqs", null, (siteId) =>
    supabase
      .from(TABLES.faqs)
      .select("*")
      .eq("site_id", siteId)
      .order("sort_order", { ascending: true }),
  );
  return rows?.length ? rows.map(mapFaq) : withIds(DEFAULT_FAQS);
});

export const getGalleryItems = cache(async () => {
  const rows = await read("gallery_items", null, (siteId) =>
    supabase
      .from(TABLES.galleryItems)
      .select("*")
      .eq("site_id", siteId)
      .order("sort_order", { ascending: true }),
  );
  return rows?.length ? rows.map(mapGalleryItem) : withIds(DEFAULT_GALLERY);
});
