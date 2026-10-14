import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/ui/PageHeader";
import SchemaForm from "@/components/admin/SchemaForm";
import DeleteButton from "@/components/admin/DeleteButton";
import { getCollection } from "@/lib/admin/collections";
import { getCollectionRow, getAllMedia } from "@/db/queries/admin";
import { rowToDefaults } from "@/lib/admin/parse";
import { updateRow, deleteRow } from "../actions";

export async function generateMetadata({ params }) {
  const { collection: slug } = await params;
  const collection = getCollection(slug);
  return { title: collection ? `Edit ${collection.singular}` : "Edit" };
}

export default async function EditCollectionRowPage({ params }) {
  const { collection: slug, id } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const numericId = Number(id);
  if (!Number.isInteger(numericId)) notFound();

  const [row, mediaLibrary] = await Promise.all([
    getCollectionRow(collection.slug, numericId),
    getAllMedia(),
  ]);
  if (!row) notFound();

  const title = row[collection.primaryField] || `${collection.singular} #${row.id}`;

  return (
    <>
      <PageHeader
        title={title}
        description={`Editing a ${collection.singular.toLowerCase()}. Changes appear on the site as soon as you save.`}
        backHref={`/admin/collections/${collection.slug}`}
        backLabel={collection.label}
      />

      <SchemaForm
        action={updateRow}
        fields={collection.fields}
        defaults={rowToDefaults(collection.fields, row)}
        mediaLibrary={mediaLibrary}
        hidden={{ __collection: collection.slug, __id: row.id }}
        secondaryAction={
          <DeleteButton
            action={deleteRow}
            hidden={{ __collection: collection.slug, __id: row.id }}
            label="Delete"
            confirmMessage={`Delete “${title}”? This cannot be undone.`}
          />
        }
      />
    </>
  );
}
