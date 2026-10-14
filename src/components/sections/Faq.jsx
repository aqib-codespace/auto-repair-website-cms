import { Plus, Phone, MessageCircle } from "lucide-react";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { telHref } from "@/lib/utils";

/**
 * Accordion built on native <details>/<summary>: keyboard accessible, works
 * with JavaScript disabled, and leaves the answers in the HTML for search
 * engines (they also feed the FAQPage structured data on the homepage).
 */
export default function Faq({ intro, faqs, settings }) {
  return (
    <Section id="faq" containerSize="wide">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5 xl:col-span-4">
          <Reveal variant="left" className="lg:sticky lg:top-32">
            <SectionHeading
              eyebrow={intro?.eyebrow}
              heading={intro?.heading}
              body={intro?.body}
              align="left"
              className="max-w-none"
            />

            <div className="mt-9 rounded-3xl border border-slate-200/80 bg-slate-50/70 p-6">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-white shadow-glow">
                <MessageCircle className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
              </span>
              <p className="mt-4 font-display text-base font-bold text-ink">
                Still have a question?
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                Talk to a service advisor — no phone tree, no callback queue.
              </p>
              <Button href={telHref(settings.phone)} variant="dark" size="md" className="mt-5" full>
                <Phone className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
                {settings.phone}
              </Button>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7 xl:col-span-8">
          <Reveal variant="right">
            <dl className="space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft transition-colors duration-300 open:border-brand/25 hover:border-slate-300"
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-5 p-6 xl:p-7">
                    <dt className="font-display text-[1.02rem] font-bold tracking-tight text-ink xl:text-lg">
                      {faq.question}
                    </dt>
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-light text-brand transition-all duration-300 group-open:rotate-45 group-open:bg-brand group-open:text-white">
                      <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
                    </span>
                  </summary>
                  <dd className="px-6 pb-7 pr-16 text-[0.95rem] leading-relaxed text-slate-600 xl:px-7 xl:pr-20">
                    {faq.answer}
                  </dd>
                </details>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
