/**
 * ---------------------------------------------------------------------------
 * COLLECTION REGISTRY
 * ---------------------------------------------------------------------------
 * One entry per repeatable list (services, reviews, FAQs, gallery photos).
 * Each entry describes its table and its columns, and the admin panel derives
 * the list page, the create form, the edit form, validation, reordering, and
 * deletion from that description — there is no per-collection page or action.
 *
 * Adding "Team Members" to a future template is: add an entry here, add the
 * table to supabase/schema.sql, and read it with a query. /admin picks up the
 * routes automatically.
 *
 * `name` doubles as the form field name and the database column, so these are
 * snake_case (unlike the camelCase public component props, which the mappers in
 * lib/supabase/mappers.js produce).
 *
 * Descriptors must stay plain JSON — they are passed into a client component.
 */
export const COLLECTIONS = [
  {
    slug: "services",
    table: "services",
    label: "Services",
    singular: "Service",
    icon: "Wrench",
    description: "The service cards on the homepage grid.",
    revalidate: ["/"],
    primaryField: "title",
    fields: [
      { name: "icon", type: "icon", label: "Icon" },
      { name: "title", type: "text", label: "Title", max: 60 },
      {
        name: "description",
        type: "textarea",
        label: "Description",
        rows: 3,
        max: 240,
        help: "One or two sentences. Keep card lengths similar for a tidy grid.",
      },
    ],
  },
  {
    slug: "testimonials",
    table: "testimonials",
    label: "Reviews",
    singular: "Review",
    icon: "Quote",
    description: "Customer reviews shown in the carousel.",
    revalidate: ["/"],
    primaryField: "name",
    fields: [
      { name: "quote", type: "textarea", label: "Review", rows: 4, max: 600 },
      { name: "name", type: "text", label: "Customer name", max: 60 },
      {
        name: "vehicle",
        type: "text",
        label: "Vehicle",
        max: 60,
        help: "Shown under the name. e.g. 2019 Honda Pilot, or Fleet — 6 vehicles.",
      },
      { name: "rating", type: "number", label: "Stars", min: 1, max: 5, step: 1 },
      {
        name: "image",
        type: "image",
        column: "image_url",
        altColumn: "image_alt",
        label: "Customer photo",
        optional: true,
      },
      {
        name: "featured",
        type: "toggle",
        label: "Feature this review",
        help: "Featured reviews are shown first in the carousel.",
        optional: true,
      },
    ],
  },
  {
    slug: "faqs",
    table: "faqs",
    label: "FAQs",
    singular: "Question",
    icon: "CircleQuestionMark",
    description: "The accordion questions. These also feed FAQ search results.",
    revalidate: ["/"],
    primaryField: "question",
    fields: [
      { name: "question", type: "text", label: "Question", max: 160 },
      { name: "answer", type: "textarea", label: "Answer", rows: 5, max: 1200 },
    ],
  },
  {
    slug: "gallery",
    table: "gallery_items",
    label: "Gallery",
    singular: "Photo",
    icon: "Images",
    description: "Photos in the masonry grid.",
    revalidate: ["/"],
    primaryField: "caption",
    fields: [
      {
        name: "image",
        type: "image",
        column: "image_url",
        altColumn: "image_alt",
        label: "Photo",
      },
      { name: "caption", type: "text", label: "Caption", max: 60 },
    ],
  },
];

export function getCollection(slug) {
  return COLLECTIONS.find((collection) => collection.slug === slug) ?? null;
}
