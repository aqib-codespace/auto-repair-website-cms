import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { supabase } from "@/lib/supabase/client";
import { TABLES } from "@/lib/supabase/tables";
import { reportOnce } from "@/lib/log";

/**
 * ---------------------------------------------------------------------------
 * WHICH SHOP AM I RENDERING?
 * ---------------------------------------------------------------------------
 * Every content row belongs to a row in `sites`, so one set of tables serves any
 * number of shops: onboarding a new one is an INSERT, not a migration.
 *
 * Resolution order:
 *
 *   1. SITE_SLUG env var — one deployment per shop (the usual fleet setup).
 *      Deterministic, and it keeps pages statically renderable.
 *   2. SITE_RESOLUTION=host — one deployment serving many domains, matched
 *      against sites.domain. This reads the Host header, which makes every page
 *      dynamic; only opt in when you actually need it.
 *   3. Single-site fallback — if exactly one site exists, use it. Keeps a fresh
 *      install working before anything is configured.
 *
 * ---------------------------------------------------------------------------
 * CONFIGURATION ERRORS THROW; OUTAGES FALL BACK
 * ---------------------------------------------------------------------------
 * A database that is briefly unreachable is an outage: returning null lets the
 * page serve bundled content and stay up.
 *
 * A site that cannot be identified — SITE_SLUG unset with several sites
 * registered, or pointing at a slug that doesn't exist — is a deployment
 * mistake, and falling back there would publish the template's demo content
 * under a real shop's domain, including its placeholder phone number. Sending
 * customers a fake number is worse than an error page, so those cases throw.
 */

const SITE_SLUG = process.env.SITE_SLUG?.trim() || "";
const RESOLVE_BY_HOST = process.env.SITE_RESOLUTION?.trim().toLowerCase() === "host";

const SELECT = "id, slug, name, domain";

/** Marks a deployment mistake, so it is never swallowed by the outage fallback. */
class MisconfiguredSiteError extends Error {
  constructor(message) {
    super(message);
    this.name = "MisconfiguredSiteError";
  }
}

export const getActiveSite = cache(async () => {
  if (!supabase) return null;

  try {
    if (SITE_SLUG) {
      const { data, error } = await supabase
        .from(TABLES.sites)
        .select(SELECT)
        .eq("slug", SITE_SLUG)
        .maybeSingle();
      if (error) throw error;
      if (!data) {
        throw new MisconfiguredSiteError(
          `No site with slug "${SITE_SLUG}". Add it to the ${TABLES.sites} table, or correct ` +
            "SITE_SLUG (in .env.local locally, or your host's environment variables).",
        );
      }
      return data;
    }

    if (RESOLVE_BY_HOST) {
      // Strip the port so localhost:3000 matches a "localhost" row.
      const host = (await headers()).get("host")?.split(":")[0]?.toLowerCase();
      const { data, error } = await supabase
        .from(TABLES.sites)
        .select(SELECT)
        .eq("domain", host ?? "")
        .maybeSingle();
      if (error) throw error;
      if (!data) {
        reportOnce(
          `site:host:${host}`,
          `[site] No site registered for host "${host}". Set its domain in the ` +
            `${TABLES.sites} table, or use SITE_SLUG instead.`,
        );
      }
      return data ?? null;
    }

    const { data, error } = await supabase.from(TABLES.sites).select(SELECT).order("id");
    if (error) throw error;

    if (data.length === 1) return data[0];

    if (data.length === 0) {
      throw new MisconfiguredSiteError(
        `The ${TABLES.sites} table is empty. Run \`npm run db:seed\` to create the first site.`,
      );
    }

    // Naming the available slugs turns a deploy failure into its own fix.
    throw new MisconfiguredSiteError(
      `SITE_SLUG is not set, and ${data.length} sites exist so the active one cannot be ` +
        `guessed. Set SITE_SLUG to one of: ${data.map((site) => site.slug).join(", ")} ` +
        "(in .env.local locally, or your host's environment variables). Alternatively set " +
        "SITE_RESOLUTION=host to match the request's Host header against sites.domain.",
    );
  } catch (error) {
    // Deployment mistakes must surface. Only transient failures fall back.
    if (error instanceof MisconfiguredSiteError) throw error;

    reportOnce("site:error", `[site] Could not resolve the active site: ${error.message ?? error}`);
    return null;
  }
});

/** Admin-side variant: fails loudly, because editing the wrong shop is worse than an error. */
export async function requireSite() {
  const site = await getActiveSite();
  if (!site) {
    throw new Error(
      "No active site could be resolved. Check that the sites table has a row and that " +
        "SITE_SLUG in .env.local matches its slug.",
    );
  }
  return site;
}
