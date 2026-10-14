import { MapPin, Navigation } from "lucide-react";
import Band from "../ui/Band";
import Kicker from "../ui/Kicker";
import Display from "../ui/Display";
import Reveal from "@/components/ui/Reveal";
import ContactForm from "@/components/forms/ContactForm";
import { telHref } from "@/lib/utils";

/**
 * Booking section.
 *
 * The form itself is the SAME component Momentum uses — one validated
 * implementation, one Server Action, one set of error messages. Its appearance is
 * changed by scoped CSS under `.template-torque` in globals.css rather than by a
 * second copy of the markup, because duplicating a form is how two designs end up
 * with two different bugs.
 */
export default function TorqueContact({ contact, settings, number }) {
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    [settings.company, settings.addressLine1, settings.addressLine2].filter(Boolean).join(", "),
  )}`;

  return (
    <Band id="contact" frameSize="wide">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal variant="left">
            <Kicker index={number}>{contact?.eyebrow}</Kicker>
            <Display className="mt-5">{contact?.heading}</Display>
            <p className="mt-5 leading-relaxed text-clay-700">{contact?.body}</p>

            <dl className="mt-10 border-t border-clay-200">
              <div className="flex justify-between gap-6 border-b border-clay-200 py-3.5">
                <dt className="text-[0.72rem] uppercase tracking-[0.16em] text-clay-500">Phone</dt>
                <dd>
                  <a
                    href={telHref(settings.phone)}
                    className="font-condensed text-[1.02rem] text-clay-900 hover:text-terra"
                  >
                    {settings.phone}
                  </a>
                </dd>
              </div>
              <div className="flex justify-between gap-6 border-b border-clay-200 py-3.5">
                <dt className="text-[0.72rem] uppercase tracking-[0.16em] text-clay-500">Email</dt>
                <dd className="text-right">
                  <a
                    href={`mailto:${settings.email}`}
                    className="break-all text-[0.9rem] text-clay-700 hover:text-terra"
                  >
                    {settings.email}
                  </a>
                </dd>
              </div>
              <div className="flex justify-between gap-6 border-b border-clay-200 py-3.5">
                <dt className="text-[0.72rem] uppercase tracking-[0.16em] text-clay-500">Address</dt>
                <dd className="text-right">
                  <address className="text-[0.9rem] not-italic leading-relaxed text-clay-700">
                    {settings.addressLine1}
                    <br />
                    {settings.addressLine2}
                  </address>
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1.5 text-[0.72rem] uppercase tracking-[0.14em] text-terra hover:underline"
                  >
                    <Navigation className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
                    Directions
                  </a>
                </dd>
              </div>
              {contact?.hours?.map((entry) => (
                <div
                  key={entry.days}
                  className="flex justify-between gap-6 border-b border-clay-200 py-3.5"
                >
                  <dt className="text-[0.72rem] uppercase tracking-[0.16em] text-clay-500">
                    {entry.days}
                  </dt>
                  <dd className="text-[0.9rem] text-clay-700">{entry.hours}</dd>
                </div>
              ))}
            </dl>

            {!settings.mapEmbedUrl && (
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex items-center gap-3 border border-clay-200 bg-bone-deep px-5 py-4 transition-colors hover:border-clay-900"
              >
                <MapPin className="h-4 w-4 shrink-0 text-terra" strokeWidth={2} aria-hidden="true" />
                <span className="text-[0.85rem] text-clay-700">
                  Add a Google Maps embed URL in Settings to show the live map.
                </span>
              </a>
            )}

            {settings.mapEmbedUrl && (
              <div className="relative mt-8 aspect-16/10 w-full overflow-hidden border border-clay-200">
                <iframe
                  src={settings.mapEmbedUrl}
                  title={`Map to ${settings.company}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full border-0"
                />
              </div>
            )}
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal variant="right" delay={70}>
            <div className="border border-clay-200 bg-bone-deep p-6 sm:p-9">
              <ContactForm
                serviceOptions={contact?.serviceOptions ?? []}
                formNote={contact?.formNote}
                successMessage={contact?.successMessage}
              />
            </div>
          </Reveal>
        </div>
      </div>
    </Band>
  );
}
