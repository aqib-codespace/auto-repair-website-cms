import { Phone } from "lucide-react";
import Band from "../ui/Band";
import Display from "../ui/Display";
import Action from "../ui/Action";
import Reveal from "@/components/ui/Reveal";
import { telHref } from "@/lib/utils";

/**
 * Mid-page call to action on solid safety orange — the only non-black band on the
 * page, which is what gives it force. Momentum uses a brand gradient here; on a
 * site this dark a flat industrial block hits harder than any gradient.
 */
export default function TorqueCtaBand({ ctaBand, settings }) {
  return (
    <Band tone="ink" size="compact" frameSize="wide" ruled={false}>
      <Reveal className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <Display tone="light" size="md">
            {ctaBand?.heading}
          </Display>
          <p className="mt-4 leading-relaxed text-bone/80">{ctaBand?.body}</p>
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <Action href={settings.scheduleUrl || "#contact"} variant="contrast">
            {ctaBand?.primaryCtaLabel}
          </Action>
          <Action href={telHref(settings.phone)} variant="outline-light">
            <Phone className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            {ctaBand?.secondaryCtaLabel}
          </Action>
        </div>
      </Reveal>
    </Band>
  );
}
