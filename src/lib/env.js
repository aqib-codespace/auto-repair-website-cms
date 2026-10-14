import "server-only";
import { z } from "zod";

/**
 * The template runs in one of two modes:
 *
 *   Preview mode  — no Supabase env vars set. The public site renders from
 *                   src/content/defaults.js so a fresh clone works with
 *                   nothing but `npm install && npm run dev`. /admin shows a
 *                   setup notice instead of a login form.
 *   CMS mode      — all three vars set. Content comes from Supabase and the
 *                   admin panel is live.
 *
 * A *partial* configuration is always a mistake (e.g. a deploy that forgot
 * SESSION_SECRET), so that case throws loudly rather than silently falling
 * back to demo content in production.
 */
const CMS_VARS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SESSION_SECRET",
];

const present = CMS_VARS.filter((key) => Boolean(process.env[key]));

export const isCmsConfigured = present.length === CMS_VARS.length;

/**
 * Where this site's tables and uploads live inside the Supabase project.
 *
 * Both default to what a dedicated project would use. Set them when sharing one
 * Supabase project between several sites: the prefix keeps identically-named
 * tables (content_blocks, site_settings, testimonials, admins, media,
 * audit_log) from colliding, and a separate bucket keeps each site's media
 * library its own.
 *
 * The prefix must match the table names in supabase/schema.sql. It is applied
 * in exactly one place — src/lib/supabase/tables.js — so no query builds a
 * table name itself.
 */
export const TABLE_PREFIX = process.env.SUPABASE_TABLE_PREFIX?.trim() ?? "";
export const MEDIA_BUCKET = process.env.SUPABASE_MEDIA_BUCKET?.trim() || "media";

function buildEnv() {
  if (present.length === 0) {
    return {
      NEXT_PUBLIC_SUPABASE_URL: null,
      SUPABASE_SERVICE_ROLE_KEY: null,
      SESSION_SECRET: null,
    };
  }

  try {
    return z
      .object({
        SESSION_SECRET: z
          .string()
          .min(32, "SESSION_SECRET must be at least 32 characters."),
        NEXT_PUBLIC_SUPABASE_URL: z.url(
          "NEXT_PUBLIC_SUPABASE_URL must be a valid URL.",
        ),
        SUPABASE_SERVICE_ROLE_KEY: z
          .string()
          .min(1, "SUPABASE_SERVICE_ROLE_KEY is required."),
      })
      .parse({
        SESSION_SECRET: process.env.SESSION_SECRET,
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      });
  } catch (err) {
    // Convert Zod errors into a concise, helpful message for production logs.
    const issues = err?.issues ?? err?.errors;
    if (issues) {
      const messages = issues.map((e) => `${e.path.join(".")}: ${e.message}`);
      throw new Error(
        `Environment validation failed: ${messages.join("; ")}. ` +
          "Set SESSION_SECRET (>=32 chars), NEXT_PUBLIC_SUPABASE_URL, and " +
          "SUPABASE_SERVICE_ROLE_KEY in .env.local or your hosting provider — " +
          "or unset all three to run in preview mode.",
      );
    }
    throw err;
  }
}

export const env = buildEnv();
