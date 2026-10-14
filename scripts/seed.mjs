/**
 * Populates Supabase with the template's default content for one site — the
 * same content the site renders in preview mode, so seeding changes where the
 * words come from, not what they say.
 *
 * Multi-site aware: every row is stamped with the site_id of SITE_SLUG, and the
 * site is created if it doesn't exist yet. Running it with a different
 * SITE_SLUG onboards another shop without touching the first.
 *
 * Safe to re-run: settings and content blocks are upserted, and collections are
 * only filled when that site's are empty (so it never duplicates a shop's real
 * services). Pass --force to clear and re-seed this site's collections.
 *
 * Run with: npm run db:seed
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import {
  DEFAULT_SETTINGS,
  DEFAULT_BLOCKS,
  DEFAULT_SERVICES,
  DEFAULT_TESTIMONIALS,
  DEFAULT_FAQS,
  DEFAULT_GALLERY,
} from "../src/content/defaults.js";

const force = process.argv.includes("--force");

/** Read .env.local directly — this script runs outside Next.js. */
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
    "Missing Supabase credentials.\n" +
      "Copy .env.local.example to .env.local and fill in NEXT_PUBLIC_SUPABASE_URL and " +
      "SUPABASE_SERVICE_ROLE_KEY (Project Settings → API), then run this again.",
  );
  process.exit(1);
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

/** Mirrors src/lib/supabase/tables.js — this script runs outside Next.js. */
const prefix = env.SUPABASE_TABLE_PREFIX?.trim() ?? "";
const t = (name) => `${prefix}${name}`;

const slug = env.SITE_SLUG?.trim() || "default";

function check(label, error) {
  if (error) {
    console.error(`✗ ${label}: ${error.message}`);
    if (error.message?.includes("does not exist") || error.code === "PGRST205") {
      console.error(
        "  Run supabase/schema.sql in the Supabase SQL editor first, and check that\n" +
          "  SUPABASE_TABLE_PREFIX matches the table names it creates.",
      );
    }
    if (error.message?.includes("site_id")) {
      console.error(
        "  These tables predate multi-site support. Run\n" +
          "  supabase/migrations/001_multi_site.sql to upgrade them in place.",
      );
    }
    process.exit(1);
  }
  console.log(`✓ ${label}`);
}

// --- The site row -------------------------------------------------------------
// Everything below hangs off this id, so it is resolved (or created) first.
let siteId;
{
  const { data: existing, error: readError } = await supabase
    .from(t("sites"))
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  check(`sites (lookup "${slug}")`, readError);

  if (existing) {
    siteId = existing.id;
    console.log(`  → existing site #${siteId}`);
  } else {
    const { data: created, error: insertError } = await supabase
      .from(t("sites"))
      .insert({ slug, name: DEFAULT_SETTINGS.company })
      .select("id")
      .single();
    check(`sites (create "${slug}")`, insertError);
    siteId = created.id;
    console.log(`  → created site #${siteId}`);
  }
}

console.log(`\nSeeding site "${slug}"${prefix ? ` in ${prefix}* tables` : ""}…\n`);

// --- Settings -----------------------------------------------------------------
{
  const s = DEFAULT_SETTINGS;
  const { error } = await supabase.from(t("site_settings")).upsert(
    {
      site_id: siteId,
      company: s.company,
      tagline: s.tagline,
      logo_url: s.logoUrl || null,
      phone: s.phone,
      email: s.email,
      address_line1: s.addressLine1,
      address_line2: s.addressLine2,
      map_embed_url: s.mapEmbedUrl || null,
      schedule_url: s.scheduleUrl,
      brand_color: s.brandColor,
      accent_color: s.accentColor,
      meta_title: s.metaTitle,
      meta_description: s.metaDescription,
      site_url: s.siteUrl,
      social_links: s.socialLinks,
      financing_enabled: s.financingEnabled,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "site_id" },
  );
  check("site_settings", error);
}

// --- Content blocks -----------------------------------------------------------
{
  const rows = Object.entries(DEFAULT_BLOCKS).map(([key, data]) => ({
    site_id: siteId,
    key,
    data,
    updated_at: new Date().toISOString(),
  }));
  const { error } = await supabase
    .from(t("content_blocks"))
    .upsert(rows, { onConflict: "site_id,key" });
  check(`content_blocks (${rows.length})`, error);
}

// --- Collections --------------------------------------------------------------
async function seedCollection(name, rows) {
  const table = t(name);

  const { count, error: countError } = await supabase
    .from(table)
    .select("id", { count: "exact", head: true })
    .eq("site_id", siteId);
  check(`${table} (read)`, countError);

  if (count > 0 && !force) {
    console.log(`- ${table}: ${count} existing row(s) for this site, skipped (--force to replace)`);
    return;
  }

  if (count > 0) {
    const { error } = await supabase.from(table).delete().eq("site_id", siteId);
    check(`${table} (clear)`, error);
  }

  const { error } = await supabase
    .from(table)
    .insert(rows.map((row) => ({ ...row, site_id: siteId })));
  check(`${table} (${rows.length})`, error);
}

await seedCollection(
  "services",
  DEFAULT_SERVICES.map((service, index) => ({
    icon: service.icon,
    title: service.title,
    description: service.description,
    sort_order: (index + 1) * 10,
  })),
);

await seedCollection(
  "testimonials",
  DEFAULT_TESTIMONIALS.map((item, index) => ({
    quote: item.quote,
    name: item.name,
    vehicle: item.vehicle,
    rating: item.rating,
    image_url: item.image.src,
    image_alt: item.image.alt,
    featured: item.featured,
    sort_order: (index + 1) * 10,
  })),
);

await seedCollection(
  "faqs",
  DEFAULT_FAQS.map((item, index) => ({
    question: item.question,
    answer: item.answer,
    sort_order: (index + 1) * 10,
  })),
);

await seedCollection(
  "gallery_items",
  DEFAULT_GALLERY.map((item, index) => ({
    image_url: item.image.src,
    image_alt: item.image.alt,
    caption: item.caption,
    sort_order: (index + 1) * 10,
  })),
);

console.log(
  `\nSeed complete for site "${slug}" (#${siteId}).\n` +
    `Make sure SITE_SLUG=${slug} is set in .env.local, then run \`npm run create-admin\`.\n` +
    "Photos still point at /images/* in this repo — replace them with the shop's own\n" +
    "photography from the admin Media Library before launch.",
);
