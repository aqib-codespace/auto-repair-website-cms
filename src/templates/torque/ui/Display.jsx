import { cn } from "@/lib/utils";

/**
 * Condensed display heading — the strongest signal that this is a different
 * design and not a recolour of the first: Momentum sets its headlines in a wide
 * geometric sans, this one narrows and stacks them like signage. Sizes use
 * clamp() so the scale holds from a phone to a wide desktop with no breakpoints.
 */
const SIZES = {
  xl: "text-[clamp(2.75rem,6.2vw,5rem)] leading-[0.94] uppercase",
  lg: "text-[clamp(2rem,3.8vw,3.15rem)] leading-[1] uppercase",
  md: "text-[clamp(1.5rem,2.3vw,2.1rem)] leading-[1.08] uppercase",
  sm: "text-[clamp(1.1rem,1.5vw,1.3rem)] leading-[1.15]",
};

export default function Display({
  as: Tag = "h2",
  size = "lg",
  tone = "dark",
  className,
  children,
}) {
  return (
    <Tag
      className={cn(
        "font-condensed font-medium tracking-[0.005em]",
        SIZES[size] ?? SIZES.lg,
        tone === "light" ? "text-bone" : "text-clay-900",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
