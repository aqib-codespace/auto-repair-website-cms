import { Plus } from "lucide-react";
import Band from "../ui/Band";
import Kicker from "../ui/Kicker";
import Display from "../ui/Display";
import Action from "../ui/Action";
import Reveal from "@/components/ui/Reveal";
import { telHref } from "@/lib/utils";

/**
 * The accordion, still built on native <details>/<summary> so it works without
 * JavaScript and keeps its answers in the HTML for search engines — that part is
 * a correctness decision and is identical in both templates. Only the treatment
 * differs: hairlines and a serif question instead of bordered cards.
 */
export default function TorqueFaq({ intro, faqs, settings, number }) {
  return (
    <Band id="faq" frameSize="wide">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-4">
          <Reveal variant="left" className="lg:sticky lg:top-10">
            <Kicker index={number}>{intro?.eyebrow}</Kicker>
            <Display className="mt-5">{intro?.heading}</Display>
            {intro?.body && (
              <p className="mt-5 max-w-sm leading-relaxed text-clay-700">{intro.body}</p>
            )}
            <Action href={telHref(settings.phone)} variant="outline" size="md" className="mt-7">
              Call {settings.phone}
            </Action>
          </Reveal>
        </div>

        <dl className="lg:col-span-8">
          {faqs.map((faq) => (
            <details key={faq.id} className="group border-t border-clay-200">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5">
                <dt className="font-condensed text-[1.1rem] leading-snug text-clay-900">
                  {faq.question}
                </dt>
                <span className="mt-1 shrink-0 text-clay-400 transition-transform duration-300 group-open:rotate-45">
                  <Plus className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                </span>
              </summary>
              <dd className="pb-6 pr-10 text-[0.92rem] leading-[1.75] text-clay-700">
                {faq.answer}
              </dd>
            </details>
          ))}
        </dl>
      </div>
    </Band>
  );
}
