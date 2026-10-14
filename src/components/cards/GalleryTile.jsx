import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * One masonry tile. Aspect ratio is supplied by the parent (rotating through a
 * few ratios) rather than read from the file, so uploaded photos of any
 * dimensions still produce a tidy, gap-free grid.
 */
export default function GalleryTile({ item, ratio = "aspect-4/3", priority = false }) {
  return (
    <figure
      className={cn(
        "group relative w-full overflow-hidden rounded-3xl bg-slate-100 shadow-soft ring-1 ring-slate-900/[0.04] transition-shadow duration-500 hover:shadow-card",
        ratio,
      )}
    >
      <Image
        src={item.image.src}
        alt={item.image.alt || item.caption || ""}
        fill
        priority={priority}
        sizes="(min-width: 1440px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-95"
      />

      {item.caption && (
        <figcaption className="absolute inset-x-0 bottom-0 translate-y-1 p-5 transition-transform duration-500 group-hover:translate-y-0">
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-accent">
            Our shop
          </span>
          <span className="mt-1 block font-display text-base font-bold text-white">
            {item.caption}
          </span>
        </figcaption>
      )}
    </figure>
  );
}
