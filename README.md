# Auto Repair Shop Website + CMS

[![Live demo](https://img.shields.io/badge/Live_demo-auto--repair--zeta.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://auto-repair-zeta.vercel.app)

A premium, mobile-first marketing site for an independent auto repair shop, with a
full content management panel. Built to be duplicated: every word, photo, colour,
service, review, FAQ, and gallery image is editable from `/admin`, and rebranding
for a new shop is a settings change rather than a code change.

**Stack:** Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4,
JavaScript, Supabase Postgres + Storage, `jose` session cookies, and `bcryptjs`
password hashing.

The demo shop, "Meridian Auto Care", and its contact details are placeholders.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

That works immediately with **no database and no configuration**. The site renders
from `src/content/defaults.js` (preview mode) so you can see the finished design
before wiring anything up. `/admin` shows a setup notice instead of a login form.

## Enabling the admin panel

1. **Create a Supabase project** at [supabase.com](https://supabase.com).

2. **Create the schema.** Open the project's SQL editor and run
   [`supabase/schema.sql`](supabase/schema.sql).

3. **Create the storage bucket.** Storage → New bucket → name it (e.g. `media`)
   → tick **Public bucket** → Create, then put that name in
   `SUPABASE_MEDIA_BUCKET`. (The SQL alternative is at the bottom of
   `schema.sql`.)

4. **Add environment variables.** Copy the example file and fill it in:

   ```bash
   cp .env.local.example .env.local
   ```

   | Variable | Where to find it |
   | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | Project Settings → Data API → Project URL |
   | `SUPABASE_SERVICE_ROLE_KEY` | Project Settings → API Keys → `service_role` |
   | `SESSION_SECRET` | Generate: `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"` |

   Two optional variables matter only when **sharing one Supabase project
   between several sites** — see *Sharing a Supabase project* below.

5. **Seed the content and create a login:**

   ```bash
   npm run db:seed        # writes the default content into Supabase
   npm run create-admin   # prompts for email, name, password
   ```

6. Restart `npm run dev` and sign in at `/admin`.

> Setting only *some* of the three variables is treated as a misconfigured deploy
> and fails at boot with an explanatory message — that is deliberate, so a
> production site can never silently serve demo content.

### Sharing a Supabase project between several sites

Two websites do **not** need two sets of tables. Every table carries a `site_id`
referencing `sites`, and uniqueness is per site — two shops can each have a
`hero` content block and their own settings row. These variables cover the
remaining cases:

| Variable | Effect |
| --- | --- |
| `SUPABASE_TABLE_PREFIX` | Prefixes every table this app touches. Only needed to share a project with an app that is *not* site-aware and owns the same generic names. Applied in exactly one place: `src/lib/supabase/tables.js` — no query builds a name itself. Leave empty otherwise. |
| `SUPABASE_MEDIA_BUCKET` | Which storage bucket uploads go to, so each site's media library stays its own. Defaults to `media`. |

Sites are separated by `site_id`, not by duplicated tables: a hundred websites
are a hundred rows in `sites` and the same ten tables. `SITE_SLUG` selects which
one a deployment serves.

---

## Rebranding for a new client

Everything below is done in the browser, with no code changes:

| What | Where |
| --- | --- |
| Business name, tagline, logo | Settings |
| **Brand + accent colour** | Settings — every button, icon, gradient, and the generated logo mark follow |
| Phone, email, address, map, hours | Settings + Contact & Hours |
| Headline, subheadline, hero photo, trust badges, metrics | Hero |
| Services, reviews, FAQs, gallery photos | the four list screens (add / edit / reorder / delete) |
| Turning the financing section off | Settings → "Show the financing section" |
| Privacy policy and terms | Site-wide content |
| SEO title, description, site URL | Settings |

Photography is the one thing to replace properly: upload the shop's own photos in
**Media Library**, then point each section at them. See
[`public/images/CREDITS.md`](public/images/CREDITS.md) for what every placeholder
is and where it came from.

---

## How the template is put together

### The design system

`src/components/ui/` holds the primitives every section is built from —
`Section`, `Container`, `SectionHeading`, `Eyebrow`, `Button`, `Card`, `Rating`,
`Reveal`, `Counter`, `Icon`, `Logo`, `BrandMark`. Sections never set their own
padding, colours, or max-widths; they compose these instead, which is what keeps
spacing and type consistent as sections get reordered or dropped.

Colour resolves through four CSS variables in `src/app/globals.css`. Only two are
ever set by hand (`--brand`, `--accent`, injected onto `:root` at request time in
`src/app/layout.js`); every hover, tint, and gradient is derived with
`color-mix()`.

The logo is drawn in code (`BrandMark`), so it recolours itself with the brand and
stays sharp from a 16px favicon upward. `npm run icon` regenerates the favicon
from the same geometry.

### The admin panel is generated, not hand-written

Three registries describe the editable surface:

| Registry | Describes | Drives |
| --- | --- | --- |
| `src/lib/admin/blocks.js` | 15 fixed page sections | `/admin/content/[key]` |
| `src/lib/admin/collections.js` | 4 repeatable lists | `/admin/collections/[collection]` |
| `src/lib/admin/settings.js` | the settings singleton | `/admin/settings` |

From a field descriptor, the app derives the editor UI
(`components/admin/SchemaForm` + `FieldRenderer`), the validation and save
payload (`lib/admin/parse.js`), the sidebar navigation, and the audit log entry.
There is no per-section page or per-collection action to write.

**Adding a section to the site** is therefore:

1. add an entry to `blocks.js`,
2. add its defaults to `src/content/defaults.js`,
3. read it in the page with `getContentBlock("your_key")` and render it.

`/admin` picks up the new screen, its form, and its menu item automatically.

Supported field types: `text`, `textarea`, `number`, `select`, `color`, `toggle`,
`icon` (visual picker), `image` (upload + media library), `list` (repeatable
strings), `repeater` (repeatable field groups).

### Data flow

```
src/content/defaults.js     bundled content — seed source AND preview fallback
        │
supabase/schema.sql         tables; RLS on with no policies (defence in depth)
        │
src/lib/supabase/client.js  server-only service_role client (never imported by a client component)
src/lib/supabase/tables.js  the only place a table name is built (applies the prefix)
        │
src/db/queries/content.js   public reads  — cached; never throw, fall back to defaults
src/db/queries/admin.js     admin reads   — throw loudly; every one re-checks the session
        │
src/lib/supabase/mappers.js snake_case rows → camelCase props for components
```

**Failure policy.** Public readers never throw: if the database is unreachable or
a migration hasn't run, the page serves bundled content and logs the specific fix
(`[cms] content_blocks (hero) failed — serving bundled default content instead.`).
A shop's storefront going blank is worse than it serving last-known-good copy.
Admin readers take the opposite stance and surface the error, because an admin
needs to know their edits aren't landing.

### Security

- The `service_role` key is server-only and bypasses RLS by design; RLS is still
  enabled on every table so a stray anon key can reach nothing.
- `requireAdmin()` gates every protected page, every mutating action, and the
  upload route. `src/proxy.js` is an optimistic first-line check only — it never
  gates Server Function POSTs on its own.
- Table names in the generated actions always come from the registries and are
  prefixed in one central module — never taken from a URL segment or form value.
- Login throttles to 5 attempts then locks for 15 minutes, and reports the same
  message whether or not the email exists.
- The public booking form is the only unauthenticated write path: honeypot field,
  strict schema validation, explicit column mapping, and database errors are
  logged rather than shown to the customer.
- Uploads are re-encoded through `sharp`, which caps dimensions at 2400px and
  strips EXIF (including GPS from phone photos).

### Accessibility & SEO

Semantic landmarks and heading order, a skip link, visible focus rings, labelled
form controls with per-field error messages, `aria-current` on active navigation,
alt text required whenever an image is set, and every animation disabled under
`prefers-reduced-motion`. The FAQ is a native `<details>` accordion, so answers
work without JavaScript and stay in the HTML for crawlers.

`AutoRepair` + `FAQPage` JSON-LD is generated from live content, plus
`sitemap.xml`, `robots.txt`, canonical URLs, and Open Graph/Twitter metadata.

---

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | ESLint |
| `npm run db:seed` | Seed Supabase from `src/content/defaults.js` (`-- --force` replaces existing list rows) |
| `npm run create-admin` | Create an admin login |
| `npm run photos` | Re-download the placeholder photography |
| `npm run placeholders` | Generate abstract brand-tinted plates for any *missing* image (never overwrites) |
| `npm run icon` | Regenerate the favicon from the logo mark |

## Deploying

Push to Git, import the repo in Vercel, and set the three environment variables in
the project settings. Update **Settings → Site URL** to the live domain so the
sitemap and social previews point at the right host.

## Author

Built by **Muhammad Aqib**, full-stack and automation engineer.

[Portfolio](https://aqib-portfolio-mern.vercel.app) · [LinkedIn](https://www.linkedin.com/in/aqib-engineer2/) · [GitHub](https://github.com/aqib-codespace)
