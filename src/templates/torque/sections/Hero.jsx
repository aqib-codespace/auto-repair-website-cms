import Image from "next/image";
import { Phone } from "lucide-react";
import Frame from "../ui/Frame";
import Display from "../ui/Display";
import Action from "../ui/Action";
import Counter from "@/components/ui/Counter";
import Icon from "@/components/ui/Icon";
import { telHref } from "@/lib/utils";

/**
 * ATELIER HERO — asymmetric editorial split.
 *
 * The same hero content Momentum renders as a full-bleed dark photograph with
 * centred type is here a light, two-column spread: type in a narrow left column,
 * a tall portrait photograph on the right, hairline rules doing the structural
 * work. No scrim, no gradient — the photograph is presented rather than used as
 * a backdrop, which is the whole difference between the two designs.
 */
export default function TorqueHero({ hero, settings, ratingLabel }) {
  return (
    <section id="top" className="bg-bone">
      <Frame size="wide">
        <div className="grid items-stretch gap-10 py-12 lg:grid-cols-12 lg:gap-14 lg:py-16">
          <div className="flex flex-col justify-center lg:col-span-6 xl:col-span-5">
            {hero.eyebrow && (
              <p className="mb-8 text-[0.68rem] uppercase tracking-[0.26em] text-clay-500">
                {hero.eyebrow}
              </p>
            )}

            <Display as="h1" size="xl">
              {hero.headline}
            </Display>

            <p className="mt-7 max-w-md text-[1.02rem] leading-relaxed text-clay-700">
              {hero.subheadline}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Action href={settings.scheduleUrl || "#contact"}>{hero.primaryCtaLabel}</Action>
              <Action href={telHref(settings.phone)} variant="quiet" className="sm:ml-3">
                <Phone className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                {/*
                 * The authored label leads and the number follows it, so editing
                 * "Call Now" in the admin changes this template too. Momentum sets
                 * the same pair side by side; only the weight differs here.
                 */}
                <span>{hero.secondaryCtaLabel}</span>
                <span className="text-clay-500">{settings.phone}</span>
              </Action>
            </div>

            {ratingLabel && (
              <p className="mt-8 border-t border-clay-200 pt-5 text-[0.78rem] italic text-clay-500">
                {ratingLabel}
              </p>
            )}
          </div>

          <div className="lg:col-span-6 xl:col-span-7">
            <div className="relative aspect-4/5 w-full overflow-hidden sm:aspect-16/10 lg:aspect-auto lg:h-full lg:min-h-[30rem]">
              <Image
                src={hero.image.src}
                alt={hero.image.alt}
                fill
                priority
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Trust indicators as a ruled strip rather than glass chips. */}
        {hero.trustIndicators?.length > 0 && (
          <ul className="grid grid-cols-2 border-t border-clay-200 sm:grid-cols-4">
            {hero.trustIndicators.map((item, index) => (
              <li
                key={item.label}
                className={
                  index > 0
                    ? "flex items-center gap-3 border-l border-clay-200 py-5 pl-5 sm:pl-6"
                    : "flex items-center gap-3 py-5"
                }
              >
                <span className="text-terra">
                  <Icon name={item.icon} className="h-4.5 w-4.5" strokeWidth={1.5} />
                </span>
                <span className="text-[0.8rem] leading-snug text-clay-700">{item.label}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Metrics: serif numerals, which read as figures in a printed report. */}
        {hero.stats?.length > 0 && (
          <dl className="grid grid-cols-2 border-t border-clay-200 sm:grid-cols-4">
            {hero.stats.map((stat, index) => (
              <div
                key={stat.label}
                className={
                  index > 0
                    ? "border-l border-clay-200 py-7 pl-5 sm:pl-6"
                    : "py-7"
                }
              >
                <dd className="font-condensed text-[1.9rem] leading-none text-clay-900 sm:text-[2.2rem]">
                  <Counter value={stat.value} />
                </dd>
                <dt className="mt-2 text-[0.7rem] uppercase tracking-[0.16em] text-clay-500">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        )}
      </Frame>
    </section>
  );
}
