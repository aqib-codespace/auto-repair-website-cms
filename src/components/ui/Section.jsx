import Container from "./Container";
import { cn } from "@/lib/utils";

const TONES = {
  white: "bg-white text-ink",
  muted: "bg-slate-50 text-ink",
  ink: "surface-ink text-white",
  brand: "surface-brand text-white",
};

const SIZES = {
  flush: "py-0",
  compact: "py-16 sm:py-20",
  default: "py-24 sm:py-28 lg:py-32",
  spacious: "py-28 sm:py-32 lg:py-40",
};

/**
 * Every band on the page is a <Section>: it owns the vertical rhythm, the
 * background tone, and the anchor id the navigation links to. Sections never
 * set their own padding, which is what keeps spacing consistent as the
 * template gets duplicated and re-ordered.
 */
export default function Section({
  id,
  tone = "white",
  size = "default",
  containerSize,
  className,
  containerClassName,
  children,
}) {
  return (
    <section
      id={id}
      className={cn("relative isolate", TONES[tone], SIZES[size] ?? SIZES.default, className)}
    >
      <Container size={containerSize} className={cn("relative", containerClassName)}>
        {children}
      </Container>
    </section>
  );
}
