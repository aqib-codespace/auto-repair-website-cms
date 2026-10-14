"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { mapAdmin } from "@/lib/supabase/mappers";
import { TABLES } from "@/lib/supabase/tables";
import { getActiveSite } from "@/lib/site";
import { createSession } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validation/auth";

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

/**
 * Password sign-in with attempt throttling. Failures are always reported with
 * the same message whether the email exists or not, so the form can't be used
 * to enumerate accounts.
 */
export async function login(prevState, formData) {
  if (!supabase) {
    return {
      error:
        "The CMS isn't connected yet. Add NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, " +
        "and SESSION_SECRET to .env.local, then run the schema and seed scripts.",
    };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Enter a valid email and password." };
  }

  const { data: row, error: fetchError } = await supabase
    .from(TABLES.admins)
    .select("*")
    .eq("email", parsed.data.email)
    .maybeSingle();

  if (fetchError) {
    // Distinguish "the CMS isn't set up" from "wrong password" — the first is
    // actionable by whoever is deploying, and hiding it behind a generic
    // failure sends them hunting for a password problem that doesn't exist.
    const setupCodes = new Set(["PGRST205", "42P01"]);
    if (setupCodes.has(fetchError.code)) {
      console.error("[auth] admins table unreachable:", fetchError);
      return {
        error:
          "The database isn't ready yet: run supabase/schema.sql in the Supabase SQL editor, " +
          "and check that SUPABASE_TABLE_PREFIX matches the table names it creates.",
      };
    }
    throw fetchError;
  }

  const admin = row ? mapAdmin(row) : null;

  if (admin?.lockedUntil && new Date(admin.lockedUntil) > new Date()) {
    return { error: "Too many failed attempts. Try again in 15 minutes." };
  }

  const valid = admin
    ? await bcrypt.compare(parsed.data.password, admin.passwordHash)
    : false;

  // An account scoped to another shop is rejected exactly like a wrong
  // password: confirming that the address exists elsewhere would leak which
  // shops a given email administers.
  const site = await getActiveSite();
  const scoped = admin ? admin.siteId == null || admin.siteId === site?.id : false;

  if (!admin || !valid || !scoped) {
    if (admin) {
      const attempts = admin.failedLoginAttempts + 1;
      await supabase
        .from(TABLES.admins)
        .update({
          failed_login_attempts: attempts,
          locked_until:
            attempts >= MAX_ATTEMPTS ? new Date(Date.now() + LOCKOUT_MS).toISOString() : null,
        })
        .eq("id", admin.id);
    }
    return { error: "Invalid email or password." };
  }

  await supabase
    .from(TABLES.admins)
    .update({
      failed_login_attempts: 0,
      locked_until: null,
      last_login_at: new Date().toISOString(),
    })
    .eq("id", admin.id);

  await createSession(admin.id);
  redirect("/admin");
}
