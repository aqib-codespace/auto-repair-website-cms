/**
 * Dumps every row of every table in the Supabase project to timestamped JSON.
 *
 * Run this before any migration. Restoring is a plain insert of the saved rows,
 * and having the "before" state on disk is what makes a schema change on a live
 * project a reversible decision rather than a one-way door.
 *
 * Usage:  node scripts/backup-tables.mjs [outputDir]
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { readFileSync } from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

function readEnv() {
  return Object.fromEntries(
    readFileSync(new URL("../.env.local", import.meta.url), "utf8")
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("#"))
      .map((l) => {
        const i = l.indexOf("=");
        return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
      }),
  );
}

const env = { ...readEnv(), ...process.env };
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// Listed explicitly so the backup is a deliberate inventory rather than
// whatever introspection happens to return.
//
// Every site in the project shares these tables, separated by site_id, so one
// backup covers all of them.
const TABLES = [
  // The main registry, plus the platform tables every site uses.
  "sites",
  "admins",
  "content_blocks",
  "site_settings",
  "media",
  "audit_log",
  // Auto repair template collections.
  "services",
  "testimonials",
  "faqs",
  "gallery_items",
  "leads",
  // Coaching template collections.
  "categories",
  // Retired copies from the platform merge — still worth capturing until they
  // are dropped. Missing tables are reported and skipped, not fatal.
  "zz_migrated_ar_content_blocks",
  "zz_migrated_ar_testimonials",
  "zz_migrated_ar_site_settings",
  "zz_migrated_ar_media",
  "zz_migrated_ar_audit_log",
  "zz_migrated_ar_admins",
];

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const outDir = process.argv[2] ?? path.join("backups", stamp);
mkdirSync(outDir, { recursive: true });

const summary = [];

for (const table of TABLES) {
  const { data, error } = await supabase.from(table).select("*");

  if (error) {
    summary.push({ table, rows: null, error: error.message });
    console.warn(`- ${table}: ${error.message}`);
    continue;
  }

  writeFileSync(path.join(outDir, `${table}.json`), JSON.stringify(data, null, 2), "utf8");
  summary.push({ table, rows: data.length });
  console.log(`✓ ${table}: ${data.length} rows`);
}

writeFileSync(
  path.join(outDir, "_manifest.json"),
  JSON.stringify({ takenAt: new Date().toISOString(), tables: summary }, null, 2),
  "utf8",
);

const total = summary.reduce((sum, entry) => sum + (entry.rows ?? 0), 0);
console.log(`\n${total} rows written to ${outDir}`);
