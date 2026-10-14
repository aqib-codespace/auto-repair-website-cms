import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { TABLES } from "@/lib/supabase/tables";
import { getActiveSite } from "@/lib/site";
import { decrypt, getSessionToken } from "./session";

export const verifySession = cache(async () => {
  const payload = await decrypt(await getSessionToken());
  return payload?.adminId ? { adminId: payload.adminId } : null;
});

export const getCurrentAdmin = cache(async () => {
  if (!supabase) return null;

  const session = await verifySession();
  if (!session) return null;

  const { data, error } = await supabase
    .from(TABLES.admins)
    .select("id, site_id, email, name, last_login_at")
    .eq("id", session.adminId)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
});

/**
 * An account belongs to one shop, or to none (site_id null) meaning a
 * cross-site operator. A valid session for shop A must not open shop B's panel,
 * which matters as soon as two sites share a deployment or a session cookie
 * domain.
 */
async function isScopedToActiveSite(admin) {
  if (admin.site_id == null) return true;
  const site = await getActiveSite();
  return site?.id === admin.site_id;
}

/**
 * Redirects to /admin/login if unauthenticated. Called from every protected
 * page, every mutating Server Action, and the protected layout — the proxy
 * alone does not gate Server Function POSTs on excluded paths, and
 * layout-only checks don't re-run on client-side navigation between
 * sibling routes that share the layout.
 */
export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  // Thrown rather than redirected: bouncing to a login the account *can*
  // satisfy would loop forever. This is a real misconfiguration and should say so.
  if (!(await isScopedToActiveSite(admin))) {
    throw new Error(
      "This account belongs to a different site than the one being served. " +
        "Check SITE_SLUG, or sign in with an account for this site.",
    );
  }

  return admin;
}
