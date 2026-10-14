import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import PageHeader from "@/components/admin/ui/PageHeader";
import Button from "@/components/admin/ui/Button";
import SchemaForm from "@/components/admin/SchemaForm";
import { getBlock } from "@/lib/admin/blocks";
import { getContentBlockAdmin, getAllMedia } from "@/db/queries/admin";
import { getContentBlock } from "@/db/queries/content";
import { formatDateTime } from "@/lib/utils";
import { updateContentBlock } from "./actions";

/** Anchor on the public page for each block, for the "view on site" link. */
const ANCHORS = {
  hero: "/#top",
  makes: "/#top",
  services_intro: "/#services",
  why_us: "/#services",
  about: "/#about",
  process: "/#about",
  reviews_intro: "/#reviews",
  cta_band: "/#reviews",
  financing: "/#financing",
  gallery_intro: "/#gallery",
  faq_intro: "/#faq",
  contact: "/#contact",
  footer: "/",
  legal_privacy: "/privacy",
  legal_terms: "/terms",
};

export async function generateMetadata({ params }) {
  const { key } = await params;
  const block = getBlock(key);
  return { title: block?.label ?? "Content" };
}

export default async function ContentBlockPage({ params }) {
  const { key } = await params;
  const block = getBlock(key);
  if (!block) notFound();

  const [row, mediaLibrary, published] = await Promise.all([
    getContentBlockAdmin(block.key),
    getAllMedia(),
    // Falls back to the bundled defaults, so a block registered after the
    // initial seed opens pre-filled instead of blank.
    getContentBlock(block.key),
  ]);

  const defaults = row?.data ?? published ?? {};

  return (
    <>
      <PageHeader
        title={block.label}
        description={block.description}
        actions={
          <>
            {row?.updated_at && (
              <span className="hidden text-xs text-slate-400 sm:block">
                Last saved {formatDateTime(row.updated_at)}
              </span>
            )}
            <Button href={ANCHORS[block.key] ?? "/"} target="_blank" variant="secondary">
              <ExternalLink className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              View on site
            </Button>
          </>
        }
      />

      <SchemaForm
        action={updateContentBlock}
        fields={block.fields}
        defaults={defaults}
        mediaLibrary={mediaLibrary}
        hidden={{ __blockKey: block.key }}
      />
    </>
  );
}
