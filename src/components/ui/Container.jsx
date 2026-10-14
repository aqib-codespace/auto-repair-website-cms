import { cn } from "@/lib/utils";

/**
 * The single horizontal rhythm for the whole site.
 *
 * Widths are deliberately generous — 1440px for standard content and 1664px
 * for full-bleed bands — because a 1280px column stranded in the middle of a
 * 27" display is the fastest way to make an otherwise good layout feel small.
 * Gutters scale with the viewport so the same component reads correctly from
 * 360px to ultrawide.
 */
const SIZES = {
  narrow: "max-w-3xl",
  default: "max-w-[90rem]",
  wide: "max-w-[104rem]",
  full: "max-w-none",
};

export default function Container({ as: Tag = "div", size = "default", className, children }) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-5 sm:px-8 lg:px-12 xl:px-16 2xl:px-20",
        SIZES[size] ?? SIZES.default,
        className,
      )}
    >
      {children}
    </Tag>
  );
}
