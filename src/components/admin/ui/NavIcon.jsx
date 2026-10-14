import { createElement } from "react";
import { getNavIcon } from "@/lib/admin/nav-icons";

/**
 * Renders a registry icon by name. Registry entries store icon *names* so they
 * stay serialisable across the server/client boundary; this is where the name
 * becomes an element.
 */
export default function NavIcon({ name, className = "h-4 w-4", strokeWidth = 2 }) {
  return createElement(getNavIcon(name), {
    className,
    strokeWidth,
    "aria-hidden": "true",
  });
}
