/**
 * ---------------------------------------------------------------------------
 * CONTENT BLOCK REGISTRY
 * ---------------------------------------------------------------------------
 * One entry per fixed page section. Each entry describes its fields, and the
 * admin panel generates the editor, the validation, and the save payload from
 * that description — there is no per-section page or action to write.
 *
 * Adding a section to the site is therefore three steps: add a block here,
 * add its defaults to src/content/defaults.js, and read it in the page with
 * getContentBlock("your_key"). /admin picks it up automatically.
 *
 * Descriptors must stay plain JSON (no components, no functions): they are
 * passed from Server Components into the client-side form renderer.
 *
 * Field types: text · textarea · icon · image · list · repeater
 * Every field is required unless `optional: true`.
 */

const EYEBROW = {
  name: "eyebrow",
  type: "text",
  label: "Eyebrow",
  help: "Small uppercase line above the heading.",
  max: 60,
  optional: true,
};

const HEADING = { name: "heading", type: "text", label: "Heading", max: 120 };

const BODY = {
  name: "body",
  type: "textarea",
  label: "Supporting text",
  rows: 3,
  max: 400,
};

/** Standard eyebrow + heading + body intro used by several sections. */
const introFields = (bodyOverrides = {}) => [EYEBROW, HEADING, { ...BODY, ...bodyOverrides }];

const ICON_FIELD = { name: "icon", type: "icon", label: "Icon" };

export const BLOCKS = [
  {
    key: "hero",
    label: "Hero",
    icon: "LayoutTemplate",
    group: "Homepage",
    description: "The first screen: headline, buttons, trust badges, and background photo.",
    fields: [
      { ...EYEBROW, help: "Sits in a pill above the headline. e.g. \"ASE Certified • Family Owned\"." },
      { name: "headline", type: "text", label: "Headline", max: 90 },
      { name: "subheadline", type: "textarea", label: "Subheadline", rows: 3, max: 260 },
      { name: "primaryCtaLabel", type: "text", label: "Primary button label", max: 40 },
      { name: "secondaryCtaLabel", type: "text", label: "Secondary button label", max: 40 },
      {
        name: "image",
        type: "image",
        label: "Background photo",
        help: "Full-bleed behind the headline. Darker, wider shots read best.",
      },
      {
        name: "trustIndicators",
        type: "repeater",
        label: "Trust indicators",
        help: "Shown in a row beneath the buttons. Four reads best.",
        itemLabel: "Indicator",
        minItems: 1,
        maxItems: 6,
        fields: [ICON_FIELD, { name: "label", type: "text", label: "Label", max: 40 }],
      },
      {
        name: "stats",
        type: "repeater",
        label: "Headline metrics",
        help: "The numbers strip at the bottom of the hero. Numbers count up on load.",
        itemLabel: "Metric",
        maxItems: 4,
        fields: [
          { name: "value", type: "text", label: "Value", max: 12, help: "e.g. 25+ or 4.9" },
          { name: "label", type: "text", label: "Label", max: 40 },
        ],
      },
    ],
  },
  {
    key: "makes",
    label: "Makes Strip",
    icon: "Car",
    group: "Homepage",
    description: "The scrolling band of vehicle makes directly under the hero.",
    fields: [
      { name: "heading", type: "text", label: "Lead-in line", max: 120 },
      {
        name: "items",
        type: "list",
        label: "Makes",
        help: "Eight or more keeps the scrolling band full.",
        placeholder: "Toyota",
        minItems: 1,
      },
    ],
  },
  {
    key: "services_intro",
    label: "Services Intro",
    icon: "Wrench",
    group: "Homepage",
    description: "Heading above the services grid. The cards themselves live in Services.",
    fields: introFields(),
  },
  {
    key: "why_us",
    label: "Why Choose Us",
    icon: "ShieldCheck",
    group: "Homepage",
    description: "The four-column promises row.",
    fields: [
      ...introFields(),
      {
        name: "features",
        type: "repeater",
        label: "Features",
        help: "Four items keeps the row balanced on desktop.",
        itemLabel: "Feature",
        minItems: 1,
        maxItems: 8,
        fields: [
          ICON_FIELD,
          { name: "title", type: "text", label: "Title", max: 60 },
          { name: "description", type: "textarea", label: "Description", rows: 3, max: 240 },
        ],
      },
    ],
  },
  {
    key: "about",
    label: "About",
    icon: "Building2",
    group: "Homepage",
    description: "Shop story, photo, and the headline statistics.",
    fields: [
      EYEBROW,
      HEADING,
      {
        name: "paragraphs",
        type: "list",
        label: "Paragraphs",
        help: "Each entry becomes its own paragraph.",
        placeholder: "Write one paragraph…",
        minItems: 1,
      },
      { name: "image", type: "image", label: "Photo" },
      {
        name: "stats",
        type: "repeater",
        label: "Statistics",
        itemLabel: "Stat",
        maxItems: 6,
        fields: [
          { name: "value", type: "text", label: "Value", max: 12, help: "e.g. 25+ or 4.9★" },
          { name: "label", type: "text", label: "Label", max: 40 },
        ],
      },
      { name: "ctaLabel", type: "text", label: "Button label", max: 40, optional: true },
    ],
  },
  {
    key: "process",
    label: "Process",
    icon: "Route",
    group: "Homepage",
    description: "The five-step path from booking to pickup.",
    fields: [
      ...introFields(),
      {
        name: "steps",
        type: "repeater",
        label: "Steps",
        help: "Five steps fit the desktop rail exactly.",
        itemLabel: "Step",
        minItems: 1,
        maxItems: 6,
        fields: [
          ICON_FIELD,
          { name: "title", type: "text", label: "Title", max: 40 },
          { name: "description", type: "textarea", label: "Description", rows: 2, max: 200 },
        ],
      },
    ],
  },
  {
    key: "reviews_intro",
    label: "Reviews Intro",
    icon: "Star",
    group: "Homepage",
    description: "Heading and rating summary above the review carousel.",
    fields: [
      ...introFields(),
      {
        name: "ratingLabel",
        type: "text",
        label: "Rating summary",
        help: "Also shown in the hero. e.g. \"4.9 average from 1,200+ reviews\".",
        max: 80,
        optional: true,
      },
    ],
  },
  {
    key: "cta_band",
    label: "Mid-page CTA",
    icon: "Megaphone",
    group: "Homepage",
    description: "The dark call-to-action band between reviews and financing.",
    fields: [
      HEADING,
      { ...BODY, max: 260 },
      { name: "primaryCtaLabel", type: "text", label: "Primary button label", max: 40 },
      { name: "secondaryCtaLabel", type: "text", label: "Secondary button label", max: 40 },
    ],
  },
  {
    key: "financing",
    label: "Financing",
    icon: "Landmark",
    group: "Homepage",
    description: "Business-owner financing pitch. Switch the whole section off in Settings.",
    fields: [
      EYEBROW,
      HEADING,
      { name: "body", type: "textarea", label: "Supporting text", rows: 4, max: 600 },
      {
        name: "bullets",
        type: "list",
        label: "Qualifying uses",
        placeholder: "Equipment purchases…",
        optional: true,
      },
      { name: "ctaLabel", type: "text", label: "Button label", max: 40 },
      {
        name: "ctaHref",
        type: "text",
        label: "Button link",
        help: "An anchor like #contact, or a full https:// URL to a lender's form.",
        max: 300,
      },
      { name: "image", type: "image", label: "Photo" },
    ],
  },
  {
    key: "gallery_intro",
    label: "Gallery Intro",
    icon: "Images",
    group: "Homepage",
    description: "Heading above the photo grid, plus the promo tile inside it.",
    fields: [
      ...introFields(),
      {
        name: "promoHeading",
        type: "text",
        label: "Promo tile heading",
        help: "The coloured card inside the photo grid. Leave empty to hide the card.",
        max: 80,
        optional: true,
      },
      {
        name: "promoBody",
        type: "textarea",
        label: "Promo tile text",
        rows: 3,
        max: 240,
        optional: true,
      },
      {
        name: "promoCtaLabel",
        type: "text",
        label: "Promo tile button label",
        max: 30,
        optional: true,
      },
    ],
  },
  {
    key: "faq_intro",
    label: "FAQ Intro",
    icon: "CircleQuestionMark",
    group: "Homepage",
    description: "Heading beside the FAQ accordion. Questions live in FAQs.",
    fields: introFields(),
  },
  {
    key: "contact",
    label: "Contact & Hours",
    icon: "CalendarCheck",
    group: "Homepage",
    description: "Booking section copy, business hours, and the form's service list.",
    fields: [
      ...introFields({ max: 300 }),
      {
        name: "formNote",
        type: "textarea",
        label: "Fine print under the button",
        rows: 2,
        max: 240,
        optional: true,
      },
      {
        name: "successMessage",
        type: "textarea",
        label: "Confirmation message",
        help: "Shown after a request is submitted successfully.",
        rows: 2,
        max: 240,
      },
      {
        name: "hours",
        type: "repeater",
        label: "Business hours",
        itemLabel: "Row",
        minItems: 1,
        maxItems: 8,
        fields: [
          { name: "days", type: "text", label: "Days", max: 40, help: "e.g. Monday – Friday" },
          { name: "hours", type: "text", label: "Hours", max: 40, help: "e.g. 7:30 AM – 6:00 PM" },
        ],
      },
      {
        name: "serviceOptions",
        type: "list",
        label: "\"Service Needed\" options",
        help: "The dropdown choices on the appointment form.",
        placeholder: "Brake Repair",
        minItems: 1,
      },
    ],
  },
  {
    key: "footer",
    label: "Footer",
    icon: "PanelBottom",
    group: "Site-wide",
    description: "Footer blurb, column headings, and legal note.",
    fields: [
      { name: "about", type: "textarea", label: "About blurb", rows: 3, max: 300 },
      { name: "quickLinksHeading", type: "text", label: "Quick links heading", max: 30 },
      { name: "servicesHeading", type: "text", label: "Services heading", max: 30 },
      { name: "connectHeading", type: "text", label: "Contact column heading", max: 30 },
      { name: "legalNote", type: "textarea", label: "Legal note", rows: 2, max: 300, optional: true },
    ],
  },
  {
    key: "legal_privacy",
    label: "Privacy Policy",
    icon: "Lock",
    group: "Site-wide",
    description: "The /privacy page.",
    fields: [
      HEADING,
      { name: "updatedAt", type: "text", label: "Last updated", max: 40, optional: true },
      {
        name: "body",
        type: "textarea",
        label: "Policy text",
        help: "Leave a blank line between paragraphs.",
        rows: 16,
        max: 20000,
      },
    ],
  },
  {
    key: "legal_terms",
    label: "Terms of Service",
    icon: "Scale",
    group: "Site-wide",
    description: "The /terms page.",
    fields: [
      HEADING,
      { name: "updatedAt", type: "text", label: "Last updated", max: 40, optional: true },
      {
        name: "body",
        type: "textarea",
        label: "Terms text",
        help: "Leave a blank line between paragraphs.",
        rows: 16,
        max: 20000,
      },
    ],
  },
];

export function getBlock(key) {
  return BLOCKS.find((block) => block.key === key) ?? null;
}

/** [{ heading, blocks }] for the sidebar, preserving registry order. */
export const BLOCK_GROUPS = BLOCKS.reduce((groups, block) => {
  const existing = groups.find((group) => group.heading === block.group);
  if (existing) existing.blocks.push(block);
  else groups.push({ heading: block.group, blocks: [block] });
  return groups;
}, []);
