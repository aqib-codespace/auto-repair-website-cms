import Image from "next/image";
import Band from "../ui/Band";
import Kicker from "../ui/Kicker";
import Display from "../ui/Display";
import Action from "../ui/Action";
import Reveal from "@/components/ui/Reveal";
import Counter from "@/components/ui/Counter";

/**
 * The shop's story, set as a magazine feature: full-width photograph, then a
 * narrow text column with a drop cap on the opening paragraph and the statistics
 * as a ruled row beneath.
 *
 * Momentum puts this content in a side-by-side split with an overlapping card.
 * Same words, different reading experience.
 */
export default function TorqueAbout({ about, scheduleUrl, number }) {
  const paragraphs = about?.paragraphs ?? [];

  return (
    <Band id="about" frameSize="wide">
      <Reveal>
        <div className="relative aspect-16/9 w-full overflow-hidden sm:aspect-21/9">
          <Image
            src={about.image.src}
            alt={about.image.alt}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-4">
          <Reveal variant="left">
            <Kicker index={number}>{about?.eyebrow}</Kicker>
            <Display className="mt-5">{about?.heading}</Display>
          </Reveal>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <Reveal variant="right">
            {paragraphs.map((paragraph, index) => (
              <p
                key={paragraph}
                className={
                  index === 0
                    ? "dropcap text-[1.02rem] leading-[1.75] text-clay-700"
                    : "mt-5 text-[1.02rem] leading-[1.75] text-clay-700"
                }
              >
                {paragraph}
              </p>
            ))}

            {about?.ctaLabel && (
              <Action href={scheduleUrl || "#contact"} variant="quiet" className="mt-7">
                {about.ctaLabel}
              </Action>
            )}
          </Reveal>
        </div>
      </div>

      {about?.stats?.length > 0 && (
        <Reveal delay={80}>
          <dl className="mt-14 grid grid-cols-2 border-t border-clay-200 sm:grid-cols-4">
            {about.stats.map((stat, index) => (
              <div
                key={stat.label}
                className={index > 0 ? "border-l border-clay-200 py-7 pl-5 sm:pl-7" : "py-7"}
              >
                <dd className="font-condensed text-[1.7rem] leading-none text-terra sm:text-[2rem]">
                  <Counter value={stat.value} />
                </dd>
                <dt className="mt-2 text-[0.72rem] uppercase leading-snug tracking-[0.14em] text-clay-500">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </Reveal>
      )}
    </Band>
  );
}
