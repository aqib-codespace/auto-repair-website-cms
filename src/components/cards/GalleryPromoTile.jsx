import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A copy tile that sits inside the photo masonry.
 *
 * It does two jobs: it fills the gap an uneven photo count leaves in a CSS
 * column layout, and it turns a passive gallery into a conversion surface by
 * putting a message and a CTA where the eye is already scanning. Content is
 * editable in /admin (Gallery Intro), and leaving the heading empty removes the
 * tile entirely.
 */
export default function GalleryPromoTile({ heading, body, ctaLabel, href = "#contact", className }) {
  if (!heading) return null;

  return (
    <a
      href={href}
      className={cn(
        "surface-brand group relative flex w-full flex-col justify-between overflow-hidden rounded-3xl p-7 text-white shadow-card transition-transform duration-500 hover:-translate-y-1 xl:p-8",
        className,
      )}
    >
      <div aria-hidden="true" className="surface-grid absolute inset-0 opacity-40" />
      <span
        aria-hidden="true"
        className="orb -right-16 -top-16 h-56 w-56 bg-white opacity-15"
      />

      <div className="relative">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/70">
          Inside the shop
        </p>
        <h3 className="mt-4 text-balance font-display text-xl font-extrabold leading-tight tracking-[-0.02em] xl:text-2xl">
          {heading}
        </h3>
        {body && (
          <p className="mt-3.5 text-sm leading-relaxed text-white/80">{body}</p>
        )}
      </div>

      {ctaLabel && (
        <span className="relative mt-8 inline-flex items-center gap-2 text-sm font-bold">
          {ctaLabel}
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-all duration-300 group-hover:bg-white group-hover:text-brand">
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
          </span>
        </span>
      )}
    </a>
  );
}
