/**
 * ---------------------------------------------------------------------------
 * TEMPLATE REGISTRY
 * ---------------------------------------------------------------------------
 * One entry per design this site can be rendered in. Content is identical across
 * templates — the same content_blocks, collections, media and settings — so a
 * template is purely a presentation choice and switching one is not a migration.
 *
 * This module is PLAIN DATA on purpose: the admin picker is a client component
 * and imports it directly. The components themselves are resolved server-side in
 * ./resolve.js, so no template's code reaches the browser unless it is the one
 * being rendered.
 */

export const DEFAULT_TEMPLATE = "momentum";

export const TEMPLATES = [
  {
    id: "momentum",
    name: "Momentum",
    tagline: "Cinematic · high-contrast · conversion-led",
    description:
      "Full-bleed dark hero over photography, rounded cards, and a warm accent. Built to make an anxious driver book within the first screen.",
    /** Shown in the admin picker so the difference is legible without a preview. */
    traits: ["Dark hero", "Rounded cards", "Sans display type", "Amber accent"],
    preview: "/templates/momentum.jpg",
    /** Swatches rendered as dots in the picker. */
    swatches: ["#0b1220", "#1a4fd1", "#f59e0b", "#ffffff"],
  },
  {
    id: "torque",
    name: "Torque",
    tagline: "Dark · industrial · performance garage",
    description:
      "Blacked-out panels, condensed signage headlines and safety-orange calls to action. Looks like a performance shop — best for a garage that wants to read specialist rather than friendly.",
    traits: ["All-dark pages", "Condensed headlines", "Safety orange", "Squared edges"],
    preview: "/templates/torque.jpg",
    swatches: ["#0e1214", "#f97316", "#f2f5f6", "#2a3338"],
  },
];

export function getTemplate(id) {
  return TEMPLATES.find((template) => template.id === id) ?? null;
}

/**
 * Resolves a stored id to a valid one. A site whose stored template was removed
 * from the registry (renamed, retired) still renders — in the default design —
 * rather than throwing on a value that used to be fine.
 */
export function resolveTemplateId(id) {
  return getTemplate(id) ? id : DEFAULT_TEMPLATE;
}
