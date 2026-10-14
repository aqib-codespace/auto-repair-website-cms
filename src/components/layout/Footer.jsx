import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import Logo from "@/components/ui/Logo";
import SocialIcon from "@/components/ui/SocialIcon";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { NAV_LINKS, LEGAL_LINKS } from "@/config/site";
import { telHref } from "@/lib/utils";

function ColumnHeading({ children }) {
  return (
    <h2 className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/45">
      {children}
    </h2>
  );
}

function FooterLink({ href, children }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-white/65 transition-colors hover:text-white"
      >
        {children}
      </Link>
    </li>
  );
}

export default function Footer({ settings, footer, services = [], hours = [] }) {
  const links = NAV_LINKS.filter(
    (link) => !link.requiresFinancing || settings.financingEnabled,
  );

  return (
    <footer className="surface-ink relative isolate text-white">
      <div className="surface-grid">
        {/* Last-chance CTA band — the footer is still a conversion surface. */}
        <Container size="wide" className="border-b border-white/10 py-10">
          <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <p className="max-w-2xl text-balance font-display text-xl font-extrabold leading-tight tracking-[-0.02em] text-white sm:text-2xl">
              Ready when you are — book an inspection and we&apos;ll take it from there.
            </p>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Button href={settings.scheduleUrl || "#contact"} size="md">
                Schedule Service
              </Button>
              <Button href={telHref(settings.phone)} variant="outline-light" size="md">
                <Phone className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
                Call Now
              </Button>
            </div>
          </div>
        </Container>

        <Container size="wide" className="py-16 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-4">
              <Logo settings={settings} tone="light" size="lg" />
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
                {footer?.about}
              </p>

              {settings.socialLinks?.length > 0 && (
                <ul className="mt-7 flex flex-wrap gap-2.5">
                  {settings.socialLinks.map((social) => (
                    <li key={`${social.platform}-${social.url}`}>
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.platform}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/12 bg-white/[0.04] text-white/70 transition-all hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10 hover:text-white"
                      >
                        <SocialIcon platform={social.platform} />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-8">
              <nav aria-label="Quick links">
                <ColumnHeading>{footer?.quickLinksHeading ?? "Quick Links"}</ColumnHeading>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <FooterLink key={link.href} href={link.href}>
                      {link.label}
                    </FooterLink>
                  ))}
                </ul>
              </nav>

              <nav aria-label="Services">
                <ColumnHeading>{footer?.servicesHeading ?? "Services"}</ColumnHeading>
                <ul className="space-y-2.5">
                  {services.slice(0, 8).map((service) => (
                    <FooterLink key={service.id} href="#services">
                      {service.title}
                    </FooterLink>
                  ))}
                </ul>
              </nav>

              <div className="col-span-2 sm:col-span-1">
                <ColumnHeading>{footer?.connectHeading ?? "Connect"}</ColumnHeading>
                <ul className="space-y-3.5 text-sm text-white/65">
                  <li className="flex gap-2.5">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={2} aria-hidden="true" />
                    <a href={telHref(settings.phone)} className="font-semibold text-white hover:text-accent">
                      {settings.phone}
                    </a>
                  </li>
                  <li className="flex gap-2.5">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={2} aria-hidden="true" />
                    <a href={`mailto:${settings.email}`} className="break-all hover:text-white">
                      {settings.email}
                    </a>
                  </li>
                  <li className="flex gap-2.5">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={2} aria-hidden="true" />
                    <address className="not-italic">
                      {settings.addressLine1}
                      {settings.addressLine2 && (
                        <>
                          <br />
                          {settings.addressLine2}
                        </>
                      )}
                    </address>
                  </li>
                  {hours.length > 0 && (
                    <li className="flex gap-2.5">
                      <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={2} aria-hidden="true" />
                      <div className="space-y-1">
                        {hours.map((entry) => (
                          <p key={entry.days}>
                            <span className="text-white/80">{entry.days}</span>{" "}
                            <span className="text-white/55">{entry.hours}</span>
                          </p>
                        ))}
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-white/45">
              © {new Date().getFullYear()} {settings.company}. All rights reserved.
            </p>
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-white/45 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {footer?.legalNote && (
            <p className="mt-5 max-w-3xl text-[0.7rem] leading-relaxed text-white/30">
              {footer.legalNote}
            </p>
          )}
        </Container>
      </div>
    </footer>
  );
}
