import Image from "next/image";
import { BadgeCheck, ArrowRight } from "lucide-react";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import Counter from "@/components/ui/Counter";

/**
 * Shop story. Two columns on desktop with the photo stack on the left and the
 * narrative plus animated metrics on the right; single column below lg with the
 * photo first so mobile visitors still get the visual anchor.
 */
export default function About({ about, scheduleUrl }) {
  return (
    <Section id="about" containerSize="wide">
      <div className="grid items-center gap-14 lg:grid-cols-12 xl:gap-20">
        <Reveal variant="left" className="lg:col-span-6">
          <div className="relative">
            {/* Offset frame behind the photo — depth without another asset. */}
            <div
              aria-hidden="true"
              className="absolute -bottom-5 -left-5 -z-10 h-full w-full rounded-[2rem] border-2 border-brand/15"
            />
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-[2rem] shadow-card">
              <Image
                src={about.image.src}
                alt={about.image.alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>

            <div className="glass-light mx-4 -mt-12 rounded-2xl p-5 sm:mx-10 lg:absolute lg:-bottom-10 lg:-right-8 lg:mx-0 lg:mt-0 lg:max-w-[16rem]">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-white shadow-glow">
                <BadgeCheck className="h-5.5 w-5.5" strokeWidth={2} aria-hidden="true" />
              </span>
              <p className="mt-3.5 font-display text-[0.95rem] font-bold text-ink">
                ASE Certified Technicians
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Factory-level training, renewed every single year.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="lg:col-span-6">
          <Reveal variant="right">
            <SectionHeading
              eyebrow={about.eyebrow}
              heading={about.heading}
              align="left"
              className="max-w-none"
            />
            <div className="mt-7 space-y-5">
              {about.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="text-pretty leading-relaxed text-slate-600">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>

          {about.stats?.length > 0 && (
            <Reveal variant="right" delay={100}>
              <dl className="mt-11 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-slate-200 pt-9 sm:grid-cols-4">
                {about.stats.map((stat) => (
                  <div key={stat.label}>
                    <dd className="font-display text-2xl font-extrabold tracking-tight text-brand sm:text-3xl">
                      <Counter value={stat.value} />
                    </dd>
                    <dt className="mt-1.5 text-xs leading-snug text-slate-500">{stat.label}</dt>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}

          {about.ctaLabel && (
            <Reveal variant="right" delay={160}>
              <Button href={scheduleUrl || "#contact"} variant="dark" className="group mt-10">
                {about.ctaLabel}
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
              </Button>
            </Reveal>
          )}
        </div>
      </div>
    </Section>
  );
}
