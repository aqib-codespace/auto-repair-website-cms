import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import GalleryTile from "@/components/cards/GalleryTile";
import GalleryPromoTile from "@/components/cards/GalleryPromoTile";

/**
 * Masonry gallery. Ratios rotate through a fixed pattern so the grid keeps its
 * staggered rhythm no matter what dimensions get uploaded, and the column count
 * steps up to four on large displays rather than stretching three wide.
 *
 * A copy tile is injected partway through the sequence: CSS columns distribute
 * items by height, so an odd photo count would otherwise leave a visible hole
 * at the bottom of a column.
 */
const RATIOS = [
  "aspect-4/5",
  "aspect-4/3",
  "aspect-square",
  "aspect-3/4",
  "aspect-4/3",
  "aspect-5/4",
];

const PROMO_AFTER = 3;

export default function Gallery({ intro, items, scheduleUrl }) {
  return (
    <Section id="gallery" tone="muted" containerSize="wide">
      <Reveal>
        <SectionHeading eyebrow={intro?.eyebrow} heading={intro?.heading} body={intro?.body} />
      </Reveal>

      <div className="masonry mt-16">
        {items.flatMap((item, index) => {
          const tile = (
            <Reveal key={item.id} variant="scale" delay={Math.min(index, 6) * 60}>
              <GalleryTile item={item} ratio={RATIOS[index % RATIOS.length]} />
            </Reveal>
          );

          if (index !== PROMO_AFTER) return tile;

          return [
            <Reveal key="promo" variant="scale" delay={60}>
              <GalleryPromoTile
                heading={intro?.promoHeading}
                body={intro?.promoBody}
                ctaLabel={intro?.promoCtaLabel}
                href={scheduleUrl || "#contact"}
              />
            </Reveal>,
            tile,
          ];
        })}
      </div>
    </Section>
  );
}
