import "server-only";
import { createClient } from "@supabase/supabase-js";
import { env, isCmsConfigured } from "@/lib/env";

export { MEDIA_BUCKET } from "@/lib/env";

/**
 * Server-only Supabase client using the service_role key, which bypasses
 * Row Level Security. This is safe here because the app never calls
 * Supabase from the browser — every call site is a Server Component,
 * Server Action, or Route Handler already gated by requireAdmin() (for
 * writes) or deliberately public (for homepage reads). Never import this
 * module from a Client Component.
 *
 * `null` in preview mode (no env vars); callers must check before use, or
 * call requireSupabase() to fail with a readable message.
 */
export const supabase = isCmsConfigured
  ? createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;

export function requireSupabase() {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Copy .env.local.example to .env.local and " +
        "fill in NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and SESSION_SECRET.",
    );
  }
  return supabase;
}
