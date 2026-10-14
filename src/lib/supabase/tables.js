import { TABLE_PREFIX } from "@/lib/env";

/**
 * ---------------------------------------------------------------------------
 * THE ONLY PLACE TABLE NAMES ARE BUILT
 * ---------------------------------------------------------------------------
 * Every query goes through `TABLES.x` (fixed tables) or `table(name)` (the
 * collection registry's dynamic ones), so the deployment-specific prefix is
 * applied once rather than being interpolated at ~25 call sites.
 *
 * The prefix exists so one Supabase project can host several sites: this
 * template's `content_blocks` and another site's `content_blocks` are different
 * tables, and neither can see the other. It defaults to empty, which is what a
 * project dedicated to a single site should use.
 *
 * Anything reaching `table()` must come from a registry or from this module —
 * never from a URL segment or form value.
 */
export function table(name) {
  return `${TABLE_PREFIX}${name}`;
}

export const TABLES = {
  sites: table("sites"),
  admins: table("admins"),
  contentBlocks: table("content_blocks"),
  siteSettings: table("site_settings"),
  services: table("services"),
  testimonials: table("testimonials"),
  faqs: table("faqs"),
  galleryItems: table("gallery_items"),
  media: table("media"),
  leads: table("leads"),
  auditLog: table("audit_log"),
};
