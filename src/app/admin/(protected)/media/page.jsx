import { Image as ImageIcon } from "lucide-react";
import PageHeader from "@/components/admin/ui/PageHeader";
import EmptyState from "@/components/admin/ui/EmptyState";
import { getAllMedia } from "@/db/queries/admin";
import UploadWidget from "./UploadWidget";
import MediaGrid from "./MediaGrid";

export const metadata = { title: "Media Library" };

export default async function MediaPage() {
  const items = await getAllMedia();

  return (
    <>
      <PageHeader
        title="Media Library"
        description="Every image uploaded to the site. Large files are resized on upload, so you can drop photos straight off a phone or camera."
      />

      <UploadWidget />

      <div className="mt-8">
        {items.length === 0 ? (
          <EmptyState
            icon={ImageIcon}
            title="No images yet"
            description="Upload the shop's own photography here, then point each section at it from that section's editor."
          />
        ) : (
          <>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
              {items.length} image{items.length === 1 ? "" : "s"}
            </p>
            <MediaGrid items={items} />
          </>
        )}
      </div>
    </>
  );
}
