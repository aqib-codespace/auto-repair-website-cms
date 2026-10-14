import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Band from "../ui/Band";
import Kicker from "../ui/Kicker";
import Display from "../ui/Display";
import Reveal from "@/components/ui/Reveal";

/**
 * A regular three-column plate grid with captions set beneath the images.
 *
 * Momentum uses a staggered masonry with captions overlaid on a gradient. Setting
 * the caption below the plate, in small caps, is the printed convention — and it
 * keeps the photographs uncropped by text.
 *
 * The same promo copy Momentum places on a brand tile inside the masonry runs
 * here as a ruled closing note under the grid. A tile would have to break the
 * three-column rhythm that gives this section its character, and the copy reads
 * better as a caption to the whole set than as one more cell in it.
 */
export default function TorqueGallery({ intro, items, number }) {
  return (
    <Band id="gallery" tone="deep" frameSize="wide">
      <Reveal className="max-w-2xl">
        <Kicker index={number}>{intro?.eyebrow}</Kicker>
        <Display className="mt-5">{intro?.heading}</Display>
        {intro?.body && <p className="mt-5 leading-relaxed text-clay-700">{intro.body}</p>}
      </Reveal>

      <ul className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <Reveal as="li" key={item.id} variant="scale" delay={Math.min(index, 6) * 45}>
            <figure>
              <div className="relative aspect-4/3 w-full overflow-hidden bg-clay-100">
                <Image
                  src={item.image.src}
                  alt={item.image.alt || item.caption || ""}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              {item.caption && (
                <figcaption className="mt-3 flex items-baseline gap-3 border-t border-clay-200 pt-3">
                  <span className="text-[0.68rem] tabular-nums text-clay-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[0.75rem] uppercase tracking-[0.16em] text-clay-700">
                    {item.caption}
                  </span>
                </figcaption>
              )}
            </figure>
          </Reveal>
        ))}
      </ul>

      {intro?.promoHeading && (
        <Reveal className="mt-14 border-t-2 border-clay-900 pt-8">
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
            <p className="text-[0.68rem] uppercase tracking-[0.26em] text-clay-500 lg:col-span-3">
              Inside the shop
            </p>
            <div className="lg:col-span-9">
              <h3 className="max-w-2xl font-condensed text-[1.5rem] leading-snug text-clay-900 sm:text-[1.75rem]">
                {intro.promoHeading}
              </h3>
              {intro.promoBody && (
                <p className="mt-4 max-w-2xl leading-relaxed text-clay-700">{intro.promoBody}</p>
              )}
              {intro.promoCtaLabel && (
                <a
                  href="#contact"
                  className="group mt-6 inline-flex items-center gap-2.5 border-b border-terra pb-1 text-[0.72rem] uppercase tracking-[0.2em] text-terra transition-colors hover:border-clay-900 hover:text-clay-900"
                >
                  {intro.promoCtaLabel}
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </a>
              )}
            </div>
          </div>
        </Reveal>
      )}
    </Band>
  );
}
