import { ExternalLink, Palette } from "lucide-react";
import PageHeader from "@/components/admin/ui/PageHeader";
import Button from "@/components/admin/ui/Button";
import SchemaForm from "@/components/admin/SchemaForm";
import { SETTINGS_FIELDS } from "@/lib/admin/settings";
import { getSiteSettingsAdmin, getAllMedia } from "@/db/queries/admin";
import { getSiteSettings } from "@/db/queries/content";
import { rowToDefaults } from "@/lib/admin/parse";
import { updateSettings } from "./actions";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const [row, mediaLibrary, fallback] = await Promise.all([
    getSiteSettingsAdmin(),
    getAllMedia(),
    getSiteSettings(),
  ]);

  // If the settings row hasn't been seeded, open the form pre-filled from the
  // bundled defaults so the first save writes a complete record.
  const defaults = row
    ? rowToDefaults(SETTINGS_FIELDS, row)
    : {
        company: fallback.company,
        tagline: fallback.tagline,
        logo: { src: fallback.logoUrl, alt: "" },
        phone: fallback.phone,
        email: fallback.email,
        address_line1: fallback.addressLine1,
        address_line2: fallback.addressLine2,
        map_embed_url: fallback.mapEmbedUrl,
        schedule_url: fallback.scheduleUrl,
        brand_color: fallback.brandColor,
        accent_color: fallback.accentColor,
        meta_title: fallback.metaTitle,
        meta_description: fallback.metaDescription,
        site_url: fallback.siteUrl,
        social_links: fallback.socialLinks,
        financing_enabled: fallback.financingEnabled,
      };

  return (
    <>
      <PageHeader
        title="Settings"
        description="Business identity, contact details, brand colours, and SEO. These apply across every page of the site."
        actions={
          <Button href="/" target="_blank" variant="secondary">
            <ExternalLink className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            View site
          </Button>
        }
      />

      <div className="mb-6 flex gap-3 rounded-2xl border border-brand/20 bg-brand-light/60 px-5 py-4">
        <Palette className="mt-0.5 h-5 w-5 shrink-0 text-brand" strokeWidth={2} aria-hidden="true" />
        <p className="text-[0.85rem] leading-relaxed text-slate-700">
          <span className="font-semibold text-slate-900">Rebranding for a new shop?</span> Change
          the business name, the two colours, and the logo here — every button, icon, gradient, and
          the generated logo mark across the whole site follow automatically.
        </p>
      </div>

      <SchemaForm
        action={updateSettings}
        fields={SETTINGS_FIELDS}
        defaults={defaults}
        mediaLibrary={mediaLibrary}
        submitLabel="Save settings"
      />
    </>
  );
}
