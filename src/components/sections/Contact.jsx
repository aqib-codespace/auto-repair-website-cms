import { Phone, Mail, MapPin, Clock, Navigation } from "lucide-react";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import ContactForm from "@/components/forms/ContactForm";
import { telHref } from "@/lib/utils";

function InfoRow({ icon: IconComponent, label, children }) {
  return (
    <div className="flex gap-3.5">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand">
        <IconComponent className="h-4.5 w-4.5" strokeWidth={2} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-slate-400">
          {label}
        </p>
        <div className="mt-0.5 text-sm text-ink">{children}</div>
      </div>
    </div>
  );
}

/**
 * Booking section: the form is the page's primary conversion target, and the
 * sidebar carries every alternative path to contact (call, email, walk in)
 * for visitors who don't want to fill anything out.
 */
export default function Contact({ contact, settings }) {
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    [settings.company, settings.addressLine1, settings.addressLine2].filter(Boolean).join(", "),
  )}`;

  return (
    <Section id="contact" tone="muted" containerSize="wide">
      <Reveal>
        <SectionHeading eyebrow={contact?.eyebrow} heading={contact?.heading} body={contact?.body} />
      </Reveal>

      <div className="mt-16 grid gap-8 lg:grid-cols-12 lg:gap-10">
        <Reveal variant="left" className="lg:col-span-7">
          <div className="rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-card sm:p-9 xl:p-10">
            <ContactForm
              serviceOptions={contact?.serviceOptions ?? []}
              formNote={contact?.formNote}
              successMessage={contact?.successMessage}
            />
          </div>
        </Reveal>

        <Reveal variant="right" delay={80} className="lg:col-span-5">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-soft sm:p-8">
              <h3 className="font-display text-lg font-bold text-ink">Visit the shop</h3>

              <div className="mt-6 space-y-5">
                <InfoRow icon={Phone} label="Phone">
                  <a
                    href={telHref(settings.phone)}
                    className="font-semibold transition-colors hover:text-brand"
                  >
                    {settings.phone}
                  </a>
                </InfoRow>

                <InfoRow icon={Mail} label="Email">
                  <a
                    href={`mailto:${settings.email}`}
                    className="break-all transition-colors hover:text-brand"
                  >
                    {settings.email}
                  </a>
                </InfoRow>

                <InfoRow icon={MapPin} label="Address">
                  <address className="not-italic leading-relaxed">
                    {settings.addressLine1}
                    {settings.addressLine2 && (
                      <>
                        <br />
                        {settings.addressLine2}
                      </>
                    )}
                  </address>
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
                  >
                    <Navigation className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                    Get directions
                  </a>
                </InfoRow>

                {contact?.hours?.length > 0 && (
                  <InfoRow icon={Clock} label="Business hours">
                    <dl className="space-y-1 leading-relaxed">
                      {contact.hours.map((entry) => (
                        <div key={entry.days} className="flex justify-between gap-4">
                          <dt className="text-slate-600">{entry.days}</dt>
                          <dd className="font-medium">{entry.hours}</dd>
                        </div>
                      ))}
                    </dl>
                  </InfoRow>
                )}
              </div>
            </div>

            {/* Map: a real embed when one is configured, a styled placeholder otherwise. */}
            <div className="relative aspect-4/3 overflow-hidden rounded-[2rem] border border-slate-200/80 bg-slate-100 shadow-soft sm:aspect-16/10">
              {settings.mapEmbedUrl ? (
                <iframe
                  src={settings.mapEmbedUrl}
                  title={`Map to ${settings.company}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full border-0"
                />
              ) : (
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="surface-grid group absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink/[0.03] text-center"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand shadow-soft transition-transform group-hover:-translate-y-0.5">
                    <MapPin className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
                  </span>
                  <span className="px-6">
                    <span className="block text-sm font-semibold text-ink">
                      {settings.addressLine1}
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-500">
                      Add a Google Maps embed URL in Settings to show the live map.
                    </span>
                  </span>
                </a>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
