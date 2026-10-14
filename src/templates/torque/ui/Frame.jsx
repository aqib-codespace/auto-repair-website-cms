import { cn } from "@/lib/utils";

/**
 * Torque's measure. Narrower than Momentum's on purpose: this template is a
 * reading layout, and editorial columns stay legible by keeping line length
 * short rather than filling the viewport.
 */
const SIZES = {
  text: "max-w-3xl",
  default: "max-w-6xl",
  wide: "max-w-[82rem]",
};

export default function Frame({ as: Tag = "div", size = "default", className, children }) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-6 sm:px-10 lg:px-14",
        SIZES[size] ?? SIZES.default,
        className,
      )}
    >
      {children}
    </Tag>
  );
}
