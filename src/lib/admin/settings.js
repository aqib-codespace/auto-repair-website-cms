/**
 * Site settings, described the same way as blocks and collections so the
 * Settings screen reuses the generated form. Names are the site_settings
 * columns (mode "row").
 *
 * Brand colour and accent colour are the two values that rebrand the entire
 * template: they are injected onto :root in src/app/layout.js and every other
 * shade in globals.css is derived from them with color-mix().
 */
export const SETTINGS_FIELDS = [
  { name: "company", type: "text", label: "Business name", max: 80 },
  {
    name: "tagline",
    type: "text",
    label: "Tagline",
    help: "Small line under the logo. Keep it under about five words.",
    max: 60,
  },
  {
    name: "logo",
    type: "image",
    column: "logo_url",
    label: "Logo",
    noAlt: true,
    optional: true,
    help: "Leave empty to use the generated brand mark, which follows your brand colour.",
  },

  { name: "phone", type: "text", label: "Phone", max: 40 },
  { name: "email", type: "text", label: "Email", max: 120 },
  { name: "address_line1", type: "text", label: "Address line 1", max: 120 },
  {
    name: "address_line2",
    type: "text",
    label: "Address line 2",
    help: "City, state, and ZIP.",
    max: 120,
  },
  {
    name: "map_embed_url",
    type: "text",
    label: "Google Maps embed URL",
    help: "Maps → Share → Embed a map → copy the src=\"…\" URL. Leave empty to show a directions link instead.",
    max: 800,
    optional: true,
  },
  {
    name: "schedule_url",
    type: "text",
    label: "\"Schedule Service\" link",
    help: "Use #contact to scroll to the form, or paste a full booking-system URL.",
    max: 400,
  },

  {
    name: "brand_color",
    type: "color",
    label: "Brand colour",
    help: "Buttons, links, icons, and the generated logo all derive from this.",
    max: 20,
  },
  {
    name: "accent_color",
    type: "color",
    label: "Accent colour",
    help: "Used sparingly: stars, highlights, and the financing call to action.",
    max: 20,
  },

  { name: "meta_title", type: "text", label: "Page title (SEO)", max: 120 },
  {
    name: "meta_description",
    type: "textarea",
    label: "Meta description (SEO)",
    rows: 3,
    max: 320,
    help: "Around 150–160 characters shows in full on Google.",
  },
  {
    name: "site_url",
    type: "text",
    label: "Site URL",
    help: "The public address, e.g. https://meridianautocare.com — used for sitemaps and social previews.",
    max: 300,
  },

  {
    name: "social_links",
    type: "repeater",
    label: "Social links",
    itemLabel: "Link",
    optional: true,
    maxItems: 8,
    fields: [
      {
        name: "platform",
        type: "text",
        label: "Platform",
        max: 40,
        help: "Facebook, Instagram, YouTube, LinkedIn, X, TikTok get their icon automatically.",
      },
      { name: "url", type: "text", label: "URL", max: 400 },
    ],
  },

  {
    name: "financing_enabled",
    type: "toggle",
    label: "Show the financing section",
    help: "Turns off the business-owner financing band and removes it from the menu and footer.",
    optional: true,
  },
];
