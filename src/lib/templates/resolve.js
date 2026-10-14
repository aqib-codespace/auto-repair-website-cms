import "server-only";
import { resolveTemplateId, DEFAULT_TEMPLATE } from "./registry";

import MomentumHome from "@/templates/momentum/Home";
import MomentumHeader from "@/templates/momentum/Header";
import MomentumFooter from "@/templates/momentum/Footer";

import TorqueHome from "@/templates/torque/Home";
import TorqueHeader from "@/templates/torque/Header";
import TorqueFooter from "@/templates/torque/Footer";

/**
 * Maps a template id to its components.
 *
 * Kept server-only and separate from the registry so the admin picker can import
 * template *metadata* into the browser without pulling in the markup of designs
 * that aren't being rendered.
 *
 * Each template owns its own header, footer and page composition. That is
 * deliberate: if the chrome were fixed and only the middle swapped, "switching
 * template" would mean recolouring, and the navigation and footer are exactly
 * where two designs most need to differ.
 *
 * `bodyClass` lets a template set its own typography and background at the
 * <body> level — this is how Torque gets a black page and condensed headlines
 * without Momentum's tokens leaking in.
 */
const IMPLEMENTATIONS = {
  momentum: {
    Home: MomentumHome,
    Header: MomentumHeader,
    Footer: MomentumFooter,
    bodyClass: "template-momentum bg-white font-sans text-ink",
  },
  torque: {
    Home: TorqueHome,
    Header: TorqueHeader,
    Footer: TorqueFooter,
    bodyClass: "template-torque bg-bone font-sans text-clay-700",
  },
};

export function resolveTemplate(id) {
  const resolved = resolveTemplateId(id);
  return { id: resolved, ...(IMPLEMENTATIONS[resolved] ?? IMPLEMENTATIONS[DEFAULT_TEMPLATE]) };
}

export function templateBodyClass(id) {
  return resolveTemplate(id).bodyClass;
}
