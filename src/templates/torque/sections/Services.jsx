import { ArrowRight } from "lucide-react";
import Band from "../ui/Band";
import Kicker from "../ui/Kicker";
import Display from "../ui/Display";
import Action from "../ui/Action";
import Reveal from "@/components/ui/Reveal";
import Icon from "@/components/ui/Icon";

/**
 * Services as a ruled index rather than a card grid.
 *
 * Momentum shows eight shadowed tiles; here each service is a row with a numeral,
 * a hairline above it, and the description set in a second column. It reads like
 * a price list in a workshop, which suits a shop selling craft over convenience.
 */
export default function TorqueServices({ intro, services, scheduleUrl, number }) {
  return (
    <Band id="services" frameSize="wide">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Reveal variant="left" className="lg:sticky lg:top-10">
            <Kicker index={number}>{intro?.eyebrow}</Kicker>
            <Display className="mt-5">{intro?.heading}</Display>
            <p className="mt-5 max-w-sm leading-relaxed text-clay-700">{intro?.body}</p>
            <Action href={scheduleUrl || "#contact"} variant="outline" size="md" className="mt-7">
              Book a visit
            </Action>
          </Reveal>
        </div>

        <ul className="lg:col-span-8">
          {services.map((service, index) => (
            <Reveal
              as="li"
              key={service.id}
              variant="right"
              delay={Math.min(index, 6) * 40}
              className="border-t border-clay-200 first:border-t-0 lg:first:border-t"
            >
              <a
                href={scheduleUrl || "#contact"}
                aria-label={`Book ${service.title}`}
                className="group grid gap-3 py-6 sm:grid-cols-12 sm:items-baseline sm:gap-6"
              >
                <span className="text-[0.7rem] tabular-nums tracking-[0.18em] text-clay-300 sm:col-span-1">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="flex items-center gap-3 sm:col-span-4">
                  <span className="text-terra">
                    <Icon name={service.icon} className="h-4.5 w-4.5" strokeWidth={1.5} />
                  </span>
                  <span className="font-condensed text-[1.15rem] text-clay-900 transition-colors group-hover:text-terra">
                    {service.title}
                  </span>
                </span>

                <span className="text-[0.88rem] leading-relaxed text-clay-700 sm:col-span-6">
                  {service.description}
                </span>

                <span className="hidden justify-end text-clay-300 transition-colors group-hover:text-terra sm:col-span-1 sm:flex">
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </Band>
  );
}
