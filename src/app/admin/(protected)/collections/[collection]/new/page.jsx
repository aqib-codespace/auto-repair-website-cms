import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/ui/PageHeader";
import SchemaForm from "@/components/admin/SchemaForm";
import { getCollection } from "@/lib/admin/collections";
import { getAllMedia } from "@/db/queries/admin";
import { createRow } from "../actions";

export async function generateMetadata({ params }) {
  const { collection: slug } = await params;
  const collection = getCollection(slug);
  return { title: collection ? `New ${collection.singular}` : "New" };
}

/** Defaults that make a new record immediately valid where a sensible one exists. */
const NEW_DEFAULTS = { rating: 5 };

export default async function NewCollectionRowPage({ params }) {
  const { collection: slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const mediaLibrary = await getAllMedia();

  return (
    <>
      <PageHeader
        title={`New ${collection.singular.toLowerCase()}`}
        description={`It will be added to the end of the ${collection.label.toLowerCase()} list — you can reorder it afterwards.`}
        backHref={`/admin/collections/${collection.slug}`}
        backLabel={collection.label}
      />

      <SchemaForm
        action={createRow}
        fields={collection.fields}
        defaults={NEW_DEFAULTS}
        mediaLibrary={mediaLibrary}
        submitLabel={`Add ${collection.singular.toLowerCase()}`}
        hidden={{ __collection: collection.slug }}
      />
    </>
  );
}
