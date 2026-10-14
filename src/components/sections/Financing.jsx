import Image from "next/image";
import { Check, ArrowRight } from "lucide-react";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";

/**
 * Business-owner financing pitch — the one section on the page that speaks to
 * shop owners rather than drivers, hence the inverted dark treatment that
 * visually separates it from the consumer flow.
 *
 * REMOVABLE: page.js renders this only when Settings → "Show financing
 * section" is on, and the Financing nav/footer link disappears with it. No
 * other section references it, so shops that don't offer financing simply
 * switch it off (or delete this file and its one call site).
 */
export default function Financing({ financing }) {
  return (
    <Section id="financing" tone="ink" containerSize="wide" className="overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="surface-grid absolute inset-0 opacity-70" />
        <span className="orb bottom-[-30%] left-[-6%] h-[30rem] w-[30rem] bg-accent opacity-20" />
      </div>

      <div className="relative grid items-center gap-14 lg:grid-cols-2 xl:gap-20">
        <div>
          <Reveal variant="left">
            <SectionHeading
              eyebrow={financing.eyebrow}
              heading={financing.heading}
              body={financing.body}
              align="left"
              tone="light"
              className="max-w-none"
            />
          </Reveal>

          {financing.bullets?.length > 0 && (
            <Reveal variant="left" delay={80}>
              <ul className="mt-9 space-y-3.5">
                {financing.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                      <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                    </span>
                    <span className="text-sm leading-relaxed text-white/75">{bullet}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          <Reveal delay={120}>
            <Button href={financing.ctaHref || "#contact"} variant="accent" size="xl" className="mt-10">
              {financing.ctaLabel}
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
            </Button>
            <p className="mt-4 max-w-md text-xs leading-relaxed text-white/40">
              Financing availability, terms, and approval are determined by the lender and are
              subject to credit review.
            </p>
          </Reveal>
        </div>

        <Reveal variant="right" delay={60} className="relative">
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-[2rem] border border-white/10 shadow-lift">
            <Image
              src={financing.image.src}
              alt={financing.image.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink/70 to-transparent" />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
