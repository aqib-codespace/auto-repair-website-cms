import { notFound } from "next/navigation";
import Link from "next/link";
import { Plus, ChevronUp, ChevronDown, Pencil, Star } from "lucide-react";
import PageHeader from "@/components/admin/ui/PageHeader";
import Panel from "@/components/admin/ui/Panel";
import Button from "@/components/admin/ui/Button";
import Badge from "@/components/admin/ui/Badge";
import EmptyState from "@/components/admin/ui/EmptyState";
import DeleteButton from "@/components/admin/DeleteButton";
import Icon from "@/components/ui/Icon";
import { getCollection } from "@/lib/admin/collections";
import { getNavIcon } from "@/lib/admin/nav-icons";
import { getCollectionRows } from "@/db/queries/admin";
import { deleteRow, moveRow } from "./actions";

export async function generateMetadata({ params }) {
  const { collection: slug } = await params;
  return { title: getCollection(slug)?.label ?? "List" };
}

/** Small square preview: the row's photo, its icon, or its position number. */
function RowThumb({ collection, row, index }) {
  const imageField = collection.fields.find((field) => field.type === "image");
  const iconField = collection.fields.find((field) => field.type === "icon");

  const imageUrl = imageField ? row[imageField.column ?? `${imageField.name}_url`] : null;

  if (imageUrl) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element -- admin thumbnail of an arbitrary upload */
      <img
        src={imageUrl}
        alt=""
        className="h-11 w-11 shrink-0 rounded-lg object-cover ring-1 ring-slate-200"
      />
    );
  }

  if (iconField) {
    return (
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-light text-brand">
        <Icon name={row[iconField.name]} className="h-5 w-5" />
      </span>
    );
  }

  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-400">
      {String(index + 1).padStart(2, "0")}
    </span>
  );
}

export default async function CollectionListPage({ params }) {
  const { collection: slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const rows = await getCollectionRows(collection.slug);
  const EmptyIcon = getNavIcon(collection.icon);

  // First long-form field doubles as the list's secondary line.
  const summaryField = collection.fields.find((field) => field.type === "textarea");

  return (
    <>
      <PageHeader
        title={collection.label}
        description={collection.description}
        actions={
          <Button href={`/admin/collections/${collection.slug}/new`}>
            <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
            Add {collection.singular.toLowerCase()}
          </Button>
        }
      />

      {rows.length === 0 ? (
        <EmptyState
          icon={EmptyIcon}
          title={`No ${collection.label.toLowerCase()} yet`}
          description={`Add your first ${collection.singular.toLowerCase()} and it will appear on the website immediately.`}
          action={
            <Button href={`/admin/collections/${collection.slug}/new`}>
              <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
              Add {collection.singular.toLowerCase()}
            </Button>
          }
        />
      ) : (
        <Panel
          padded={false}
          description={`${rows.length} item${rows.length === 1 ? "" : "s"} · shown on the site in this order`}
          title="Order"
        >
          <ul className="divide-y divide-slate-100">
            {rows.map((row, index) => (
              <li key={row.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/70">
                <RowThumb collection={collection} row={row} index={index} />

                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 truncate text-[0.88rem] font-semibold text-slate-900">
                    {row[collection.primaryField] || `Untitled ${collection.singular.toLowerCase()}`}
                    {row.featured && <Badge tone="brand">Featured</Badge>}
                    {typeof row.rating === "number" && (
                      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-slate-400">
                        <Star className="h-3 w-3 fill-accent text-accent" strokeWidth={0} aria-hidden="true" />
                        {row.rating}
                      </span>
                    )}
                  </p>
                  {summaryField && (
                    <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                      {row[summaryField.column ?? summaryField.name]}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  {/* Reorder: two tiny forms rather than client state, so order is persisted immediately. */}
                  {["up", "down"].map((direction) => (
                    <form action={moveRow} key={direction}>
                      <input type="hidden" name="__collection" value={collection.slug} />
                      <input type="hidden" name="__id" value={row.id} />
                      <input type="hidden" name="__direction" value={direction} />
                      <button
                        type="submit"
                        disabled={direction === "up" ? index === 0 : index === rows.length - 1}
                        aria-label={`Move ${direction}`}
                        className="flex h-9 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-25 disabled:hover:bg-transparent"
                      >
                        {direction === "up" ? (
                          <ChevronUp className="h-4 w-4" strokeWidth={2.5} />
                        ) : (
                          <ChevronDown className="h-4 w-4" strokeWidth={2.5} />
                        )}
                      </button>
                    </form>
                  ))}

                  <Link
                    href={`/admin/collections/${collection.slug}/${row.id}`}
                    aria-label={`Edit ${row[collection.primaryField] ?? "item"}`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-brand-light hover:text-brand"
                  >
                    <Pencil className="h-4 w-4" strokeWidth={2} />
                  </Link>

                  <DeleteButton
                    action={deleteRow}
                    compact
                    hidden={{ __collection: collection.slug, __id: row.id }}
                    label={`Delete ${collection.singular.toLowerCase()}`}
                    confirmMessage={`Delete “${
                      row[collection.primaryField] ?? "this item"
                    }”? This cannot be undone.`}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </>
  );
}
