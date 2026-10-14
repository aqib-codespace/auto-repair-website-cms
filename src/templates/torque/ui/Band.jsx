import Frame from "./Frame";
import { cn } from "@/lib/utils";

const TONES = {
  bone: "bg-bone text-clay-900",
  deep: "bg-bone-deep text-clay-900",
  /**
   * The one band that is not dark. On a site this black, a solid safety-orange
   * block is a harder stop than any darker panel could be — which is exactly what
   * a mid-page call to action needs. Its text is the page ground, not white.
   */
  ink: "bg-terra text-bone",
  terra: "bg-terra text-bone",
};

const SIZES = {
  flush: "py-0",
  compact: "py-14 sm:py-16",
  default: "py-20 sm:py-24 lg:py-28",
};

/**
 * A horizontal band. Sections alternate between two near-black grounds with a
 * hairline between them, so the page reads as stacked steel panels rather than
 * as a document — the seam is the structure.
 */
export default function Band({
  id,
  tone = "bone",
  size = "default",
  frameSize,
  ruled = true,
  className,
  frameClassName,
  children,
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative",
        TONES[tone],
        SIZES[size] ?? SIZES.default,
        ruled && "border-t border-clay-200",
        className,
      )}
    >
      <Frame size={frameSize} className={frameClassName}>
        {children}
      </Frame>
    </section>
  );
}
