import { createElement } from "react";
import { getIcon } from "@/lib/icons";

/**
 * Renders a database-stored icon slug, so section components never import the
 * icon registry (or the icon library) directly.
 *
 * createElement rather than `const C = getIcon(name); <C />` — the component is
 * being *selected* from a fixed registry, not created, and writing it this way
 * keeps that distinction clear to both readers and the react-hooks lint rules.
 */
export default function Icon({ name, className = "h-6 w-6", strokeWidth = 1.75 }) {
  return createElement(getIcon(name), {
    className,
    strokeWidth,
    "aria-hidden": "true",
  });
}
