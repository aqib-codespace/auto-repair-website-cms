import Eyebrow from "./Eyebrow";
import { cn } from "@/lib/utils";

/**
 * Eyebrow + heading + supporting line, used by every section so type scale and
 * measure stay identical top to bottom. `as` keeps the document outline correct
 * (h2 for page sections, h3 when nested).
 */
export default function SectionHeading({
  eyebrow,
  heading,
  body,
  as: Tag = "h2",
  align = "center",
  tone = "dark",
  rule = true,
  className,
  children,
}) {
  const centered = align === "center";
  const light = tone === "light";

  return (
    <div className={cn("max-w-3xl", centered && "mx-auto text-center", className)}>
      {eyebrow && (
        <Eyebrow tone={light ? "light" : "brand"} className={cn("mb-5", centered && "justify-center")}>
          {eyebrow}
        </Eyebrow>
      )}

      {heading && (
        <Tag
          className={cn(
            "text-balance font-display text-3xl font-extrabold leading-[1.1] tracking-[-0.03em] sm:text-4xl lg:text-[2.9rem] xl:text-[3.25rem]",
            light ? "text-white" : "text-ink",
            rule && "heading-rule",
            rule && centered && "heading-rule-center",
          )}
        >
          {heading}
        </Tag>
      )}

      {body && (
        <p
          className={cn(
            "mt-6 text-pretty text-base leading-relaxed sm:text-lg",
            light ? "text-white/65" : "text-slate-600",
          )}
        >
          {body}
        </p>
      )}

      {children}
    </div>
  );
}
