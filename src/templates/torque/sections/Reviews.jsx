import Image from "next/image";
import Band from "../ui/Band";
import Kicker from "../ui/Kicker";
import Display from "../ui/Display";
import Reveal from "@/components/ui/Reveal";

/**
 * Reviews as stacked pull-quotes rather than a carousel.
 *
 * Momentum's carousel fits more reviews into less height, but hides most of them
 * behind an interaction. This template sets every published review in full at a
 * serif size that invites reading, which suits a visitor who is still deciding.
 *
 * Every one — not a slice. A shop that publishes a sixth review expects to see a
 * sixth review, and silently truncating the list would make the two templates
 * disagree about what the site says.
 */
export default function TorqueReviews({ intro, testimonials, number }) {
  return (
    <Band id="reviews" tone="deep" frameSize="wide">
      <Reveal className="max-w-2xl">
        <Kicker index={number}>{intro?.eyebrow}</Kicker>
        <Display className="mt-5">{intro?.heading}</Display>
        {intro?.body && <p className="mt-5 leading-relaxed text-clay-700">{intro.body}</p>}
        {intro?.ratingLabel && (
          <p className="mt-4 text-[0.85rem] italic text-clay-500">{intro.ratingLabel}</p>
        )}
      </Reveal>

      <ul className="mt-14 space-y-10">
        {testimonials.map((testimonial, index) => (
          <Reveal as="li" key={testimonial.id} delay={Math.min(index, 4) * 70}>
            <figure className="grid gap-6 border-t border-clay-200 pt-8 lg:grid-cols-12 lg:gap-10">
              <figcaption className="flex items-center gap-4 lg:col-span-3 lg:block">
                {testimonial.image?.src && (
                  <Image
                    src={testimonial.image.src}
                    alt={testimonial.image.alt || ""}
                    width={56}
                    height={56}
                    className="h-14 w-14 shrink-0 object-cover lg:mb-4"
                  />
                )}
                <span>
                  <span className="block font-condensed text-[1.02rem] text-clay-900">
                    {testimonial.name}
                  </span>
                  <span className="mt-0.5 block text-[0.72rem] uppercase tracking-[0.14em] text-clay-500">
                    {testimonial.vehicle}
                  </span>
                </span>
              </figcaption>

              <blockquote className="lg:col-span-9">
                {/* Body sans, not the condensed face: condensed type is for signage, and a
                    three-line quote set in it is measurably harder to read. */}
                <p className="text-[1.05rem] leading-[1.6] text-clay-900 sm:text-[1.15rem]">
                  <span aria-hidden="true" className="text-terra">
                    “
                  </span>
                  {testimonial.quote}
                  <span aria-hidden="true" className="text-terra">
                    ”
                  </span>
                </p>
              </blockquote>
            </figure>
          </Reveal>
        ))}
      </ul>
    </Band>
  );
}
