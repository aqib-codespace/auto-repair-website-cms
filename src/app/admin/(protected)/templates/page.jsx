import { ExternalLink, Info } from "lucide-react";
import PageHeader from "@/components/admin/ui/PageHeader";
import Button from "@/components/admin/ui/Button";
import { getSiteSettingsAdmin } from "@/db/queries/admin";
import { getSiteSettings } from "@/db/queries/content";
import { resolveTemplateId } from "@/lib/templates/registry";
import TemplatePicker from "./TemplatePicker";

export const metadata = { title: "Templates" };

export default async function TemplatesPage() {
  const [row, fallback] = await Promise.all([getSiteSettingsAdmin(), getSiteSettings()]);

  /**
   * `getSiteSettingsAdmin()` returns the raw row, so the choice is read straight
   * out of `extras` here; `getSiteSettings()` is the mapped public reader and
   * covers the case where no settings row exists yet.
   */
  const current = resolveTemplateId(row?.extras?.template ?? fallback.template);

  return (
    <>
      <PageHeader
        title="Templates"
        description="Choose how the website looks. Your content, photos, reviews and settings stay exactly as they are — only the layout and styling change."
        actions={
          <Button href="/" target="_blank" variant="secondary">
            <ExternalLink className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            View live site
          </Button>
        }
      />

      <div className="mb-6 flex gap-3 rounded-xl border border-brand/20 bg-brand-light/60 px-5 py-4">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand" strokeWidth={2} aria-hidden="true" />
        <p className="text-[0.85rem] leading-relaxed text-slate-700">
          <span className="font-semibold text-slate-900">Switching is safe and reversible.</span>{" "}
          Both designs read the same content, so nothing is rewritten or lost — you can switch back
          at any time and the site will look exactly as it does now. Hover a design to preview it,
          or open the full preview to see the real site before going live.
        </p>
      </div>

      <TemplatePicker current={current} />
    </>
  );
}
