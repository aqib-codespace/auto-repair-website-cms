import { Phone, ArrowRight, Clock } from "lucide-react";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { telHref } from "@/lib/utils";

/**
 * Mid-page conversion band on a saturated brand gradient. Deliberately short —
 * it exists to catch visitors who have read enough and want to act before they
 * reach the form.
 */
export default function CtaBand({ ctaBand, settings }) {
  return (
    <Section tone="brand" size="compact" containerSize="wide" className="overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="surface-grid absolute inset-0 opacity-40" />
        <span className="orb right-[-8%] top-[-40%] h-[26rem] w-[26rem] bg-white opacity-15" />
      </div>

      <Reveal className="flex flex-col items-start gap-9 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white">
            <Clock className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
            Most inspections booked within 24 hours
          </p>
          <h2 className="text-balance font-display text-2xl font-extrabold leading-tight tracking-[-0.02em] text-white sm:text-3xl xl:text-4xl">
            {ctaBand?.heading}
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-white/80">{ctaBand?.body}</p>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row">
          <Button href={settings.scheduleUrl || "#contact"} variant="white" size="xl" className="group">
            {ctaBand?.primaryCtaLabel}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={2.5}
              aria-hidden="true"
            />
          </Button>
          <Button href={telHref(settings.phone)} variant="outline-light" size="xl">
            <Phone className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
            {ctaBand?.secondaryCtaLabel}
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
