-- =============================================================================
-- Auto repair website — CMS schema (multi-site)
-- =============================================================================
-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query)
-- before the admin panel is used for the first time, then create the storage
-- bucket (see the bottom of this file) and run `npm run db:seed`.
--
-- If you already ran an earlier, single-site version of this file, run
-- supabase/migrations/001_multi_site.sql instead — it upgrades in place and
-- keeps your content.
--
-- ---------------------------------------------------------------------------
-- SHAPE: ONE MAIN TABLE, EVERY OTHER TABLE REFERENCES IT
-- ---------------------------------------------------------------------------
--   sites                     one row per website
--   content_blocks(site_id)   that website's fixed page sections
--   services(site_id)         that website's service cards
--   ...and so on for every table.
--
-- One hundred shops therefore live in these same ten tables as one hundred rows
-- in sites — onboarding a shop is an INSERT, never a migration. Uniqueness is
-- per site: two shops can both have a `hero` block, and both have their own
-- settings row.
--
-- ---------------------------------------------------------------------------
-- TABLE NAMING
-- ---------------------------------------------------------------------------
-- Names are unprefixed, which is right whenever every app in the project is
-- site-aware: two websites are two rows in `sites`, not two sets of tables.
--
-- If you ever need to share a project with an app that is NOT site-aware and
-- owns these same generic names, set SUPABASE_TABLE_PREFIX in .env.local and
-- prefix the names below to match. The app applies that prefix in exactly one
-- place (src/lib/supabase/tables.js), so nothing else changes.
--
-- ---------------------------------------------------------------------------
-- ACCESS MODEL
-- ---------------------------------------------------------------------------
-- All access goes through the service_role key from server-side Next.js code
-- only (never the browser), and every protected read/write is gated by the app's
-- own admin login (requireAdmin()) plus a site_id filter. service_role bypasses
-- Row Level Security by design, so RLS is enabled below with no policies purely
-- as defence in depth: if an anon/publishable key were ever wired up somewhere,
-- these tables stay unreachable through it.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- The main table: one row per website
-- ---------------------------------------------------------------------------
create table if not exists sites (
  id bigint generated always as identity primary key,
  -- Matches SITE_SLUG in the deployment's environment.
  slug text not null unique,
  -- Internal label, shown in the admin panel.
  name text not null,
  -- Optional: set this to serve many shops from one deployment with
  -- SITE_RESOLUTION=host, which matches the request's Host header.
  domain text unique,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Admins. site_id null = a cross-site operator account (you); a value = that
-- one shop's owner, who can only reach their own panel.
-- ---------------------------------------------------------------------------
create table if not exists admins (
  id bigint generated always as identity primary key,
  site_id bigint references sites (id) on delete cascade,
  email text not null,
  password_hash text not null,
  name text not null,
  failed_login_attempts integer not null default 0,
  locked_until timestamptz,
  created_at timestamptz not null default now(),
  last_login_at timestamptz
);

-- The same address may administer different shops, but only once per shop.
create unique index if not exists admins_site_email_idx on admins (site_id, email);
-- NULLs are distinct in Postgres, so operator accounts need their own guard.
create unique index if not exists admins_global_email_idx on admins (email)
  where site_id is null;

-- ---------------------------------------------------------------------------
-- Fixed page sections. `data` mirrors the shape the matching section component
-- expects as props; its fields are described by src/lib/admin/blocks.js.
-- ---------------------------------------------------------------------------
create table if not exists content_blocks (
  id bigint generated always as identity primary key,
  site_id bigint not null references sites (id) on delete cascade,
  key text not null,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  constraint content_blocks_site_key_uniq unique (site_id, key)
);

-- ---------------------------------------------------------------------------
-- Collections. Each carries sort_order, which the admin list pages swap between
-- adjacent rows to reorder; public queries order by it.
-- ---------------------------------------------------------------------------

create table if not exists services (
  id bigint generated always as identity primary key,
  site_id bigint not null references sites (id) on delete cascade,
  icon text not null default 'wrench',
  title text not null,
  description text not null,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists testimonials (
  id bigint generated always as identity primary key,
  site_id bigint not null references sites (id) on delete cascade,
  quote text not null,
  name text not null,
  vehicle text,
  rating integer not null default 5 check (rating between 1 and 5),
  image_url text,
  image_alt text,
  featured boolean not null default false,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists faqs (
  id bigint generated always as identity primary key,
  site_id bigint not null references sites (id) on delete cascade,
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists gallery_items (
  id bigint generated always as identity primary key,
  site_id bigint not null references sites (id) on delete cascade,
  image_url text not null,
  image_alt text not null default '',
  caption text,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- One settings row per site — site_id is the primary key, so a shop cannot end
-- up with two conflicting settings rows.
-- ---------------------------------------------------------------------------
create table if not exists site_settings (
  site_id bigint primary key references sites (id) on delete cascade,
  company text not null,
  tagline text not null default '',
  logo_url text,
  phone text not null default '',
  email text not null default '',
  address_line1 text not null default '',
  address_line2 text not null default '',
  map_embed_url text,
  schedule_url text not null default '#contact',
  brand_color text not null default '#1a4fd1',
  accent_color text not null default '#f59e0b',
  meta_title text not null default '',
  meta_description text not null default '',
  site_url text not null default 'http://localhost:3000',
  social_links jsonb not null default '[]'::jsonb,
  financing_enabled boolean not null default true,
  updated_at timestamptz not null default now()
);

-- Metadata for files uploaded to the storage bucket.
create table if not exists media (
  id bigint generated always as identity primary key,
  site_id bigint not null references sites (id) on delete cascade,
  filename text not null,
  url text not null,
  alt_text text not null default '',
  width integer,
  height integer,
  size_bytes integer,
  uploaded_at timestamptz not null default now()
);

-- Appointment requests from the public booking form. This is the only table the
-- site writes to without an authenticated admin, so the insert path in
-- src/lib/actions/leads.js validates every field, stamps site_id itself, and
-- maps columns explicitly.
create table if not exists leads (
  id bigint generated always as identity primary key,
  site_id bigint not null references sites (id) on delete cascade,
  name text not null,
  phone text not null,
  email text,
  vehicle_make text,
  vehicle_model text,
  service_needed text,
  preferred_date date,
  comments text,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'scheduled', 'closed')),
  created_at timestamptz not null default now()
);

create table if not exists audit_log (
  id bigint generated always as identity primary key,
  site_id bigint not null references sites (id) on delete cascade,
  admin_id bigint not null,
  action text not null,
  entity_type text not null,
  entity_id text,
  summary text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes. Every hot query filters by site_id first, so it leads each index.
-- ---------------------------------------------------------------------------
create index if not exists services_site_order_idx on services (site_id, sort_order);
create index if not exists testimonials_site_order_idx
  on testimonials (site_id, featured desc, sort_order);
create index if not exists faqs_site_order_idx on faqs (site_id, sort_order);
create index if not exists gallery_site_order_idx on gallery_items (site_id, sort_order);
create index if not exists media_site_uploaded_idx on media (site_id, uploaded_at desc);
create index if not exists leads_site_status_idx on leads (site_id, status, created_at desc);
create index if not exists audit_site_created_idx on audit_log (site_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Row Level Security: on everywhere, with no policies. See the note at the top.
-- ---------------------------------------------------------------------------
alter table sites enable row level security;
alter table admins enable row level security;
alter table content_blocks enable row level security;
alter table services enable row level security;
alter table testimonials enable row level security;
alter table faqs enable row level security;
alter table gallery_items enable row level security;
alter table site_settings enable row level security;
alter table media enable row level security;
alter table leads enable row level security;
alter table audit_log enable row level security;

-- ---------------------------------------------------------------------------
-- Storage
-- ---------------------------------------------------------------------------
-- The admin uploader writes to the bucket named in SUPABASE_MEDIA_BUCKET and
-- stores each file's public URL, so the bucket must be public-read.
--
--   Dashboard: Storage → New bucket → name it → tick Public bucket → Create
--
--   SQL:  insert into storage.buckets (id, name, public)
--         values ('autorepair-media', 'autorepair-media', true)
--         on conflict (id) do update set public = true;
--
-- One bucket serves every site: media.site_id is what separates the
-- libraries, and filenames are UUID-prefixed so they cannot collide.
--
-- Uploads are re-encoded and capped at 2400px by /api/admin/upload before they
-- reach Storage, and next.config.mjs already allows *.supabase.co public object
-- URLs through next/image.
