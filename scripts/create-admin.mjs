/**
 * Creates an admin login for the CMS.
 *
 * There is deliberately no sign-up screen: accounts are provisioned from the
 * command line by whoever deploys the site, so a public URL can never create
 * one. Passwords are bcrypt-hashed (cost 12) and never stored or logged.
 *
 * Multi-site: an account is either scoped to one site (a shop owner, who can
 * only reach their own panel) or left unscoped (you, the operator, who can reach
 * any of them).
 *
 * Run with: npm run create-admin
 */
import { readFileSync } from "node:fs";
import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

function readEnv() {
  try {
    return Object.fromEntries(
      readFileSync(new URL("../.env.local", import.meta.url), "utf8")
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("#"))
        .map((line) => {
          const index = line.indexOf("=");
          return [line.slice(0, index).trim(), line.slice(index + 1).trim()];
        }),
    );
  } catch {
    return {};
  }
}

const env = { ...readEnv(), ...process.env };

if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "Missing Supabase credentials. Fill in .env.local (see .env.local.example) and try again.",
  );
  process.exit(1);
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

/** Mirrors src/lib/supabase/tables.js — this script runs outside Next.js. */
const prefix = env.SUPABASE_TABLE_PREFIX?.trim() ?? "";
const ADMINS = `${prefix}admins`;
const SITES = `${prefix}sites`;

const rl = readline.createInterface({ input: stdin, output: stdout });

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

try {
  const { data: sites, error: sitesError } = await supabase
    .from(SITES)
    .select("id, slug, name")
    .order("id");
  if (sitesError) throw sitesError;

  if (sites.length === 0) {
    throw new Error("No sites exist yet. Run `npm run db:seed` first.");
  }

  console.log("\nSites:");
  for (const site of sites) console.log(`  ${site.slug} — ${site.name}`);

  const defaultSlug = env.SITE_SLUG?.trim() || "";
  const answer = (
    await rl.question(
      `\nSite slug this admin manages${defaultSlug ? ` [${defaultSlug}]` : ""}` +
        `, or "all" for every site: `,
    )
  ).trim();

  const choice = answer || defaultSlug;
  if (!choice) throw new Error("Enter a site slug, or 'all'.");

  let siteId = null;
  if (choice.toLowerCase() !== "all") {
    const site = sites.find((entry) => entry.slug === choice);
    if (!site) throw new Error(`No site with slug "${choice}".`);
    siteId = site.id;
  }

  const email = (await rl.question("Admin email: ")).trim().toLowerCase();
  if (!isValidEmail(email)) throw new Error("Enter a valid email address.");

  const name = (await rl.question("Full name: ")).trim();
  if (!name) throw new Error("Name is required.");

  const password = await rl.question("Password (min 8 characters): ");
  if (password.length < 8) throw new Error("Password must be at least 8 characters.");

  // Uniqueness is per site, so the same address can administer several shops.
  let existingQuery = supabase.from(ADMINS).select("id").eq("email", email);
  existingQuery = siteId === null ? existingQuery.is("site_id", null) : existingQuery.eq("site_id", siteId);

  const { data: existing, error: fetchError } = await existingQuery.maybeSingle();
  if (fetchError) throw fetchError;
  if (existing) {
    throw new Error(`An admin with email "${email}" already exists for that scope.`);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const { error: insertError } = await supabase.from(ADMINS).insert({
    site_id: siteId,
    email,
    name,
    password_hash: passwordHash,
    created_at: new Date().toISOString(),
  });
  if (insertError) throw insertError;

  console.log(
    `\nAdmin created for ${email} (${siteId === null ? "all sites" : `site "${choice}"`}).\n` +
      "Sign in at /admin/login.",
  );
} catch (error) {
  console.error(`\n${error.message}`);
  process.exitCode = 1;
} finally {
  rl.close();
}
