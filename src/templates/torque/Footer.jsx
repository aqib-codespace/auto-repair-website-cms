import Link from "next/link";
import Frame from "./ui/Frame";
import SocialIcon from "@/components/ui/SocialIcon";
import { NAV_LINKS, LEGAL_LINKS } from "@/config/site";
import { telHref } from "@/lib/utils";

/**
 * Torque's footer: a colophon rather than a sitemap. Three narrow columns, the
 * shop name set in serif, and hairlines throughout — no dark band, no grid
 * texture, no glow.
 */
export default function TorqueFooter({ content }) {
  const { settings, blocks, collections } = content;
  const links = NAV_LINKS.filter(
    (link) => !link.requiresFinancing || settings.financingEnabled,
  );

  return (
    <footer className="border-t border-clay-200 bg-bone">
      <Frame size="wide" className="py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-condensed text-[1.4rem] leading-none text-clay-900">
              {settings.company}
            </p>
            <p className="mt-2 text-[0.66rem] uppercase tracking-[0.26em] text-clay-500">
              {settings.tagline}
            </p>
            <p className="mt-6 max-w-sm text-[0.88rem] leading-relaxed text-clay-700">
              {blocks.footer?.about}
            </p>

            {settings.socialLinks?.length > 0 && (
              <ul className="mt-7 flex flex-wrap gap-2">
                {settings.socialLinks.map((social) => (
                  <li key={`${social.platform}-${social.url}`}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.platform}
                      className="inline-flex h-9 w-9 items-center justify-center border border-clay-200 text-clay-500 transition-colors hover:border-clay-900 hover:text-clay-900"
                    >
                      <SocialIcon platform={social.platform} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <nav aria-label="Sections" className="lg:col-span-2">
            <h2 className="text-[0.66rem] uppercase tracking-[0.22em] text-clay-500">
              {blocks.footer?.quickLinksHeading ?? "Sections"}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[0.88rem] text-clay-700 transition-colors hover:text-terra"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Services" className="lg:col-span-2">
            <h2 className="text-[0.66rem] uppercase tracking-[0.22em] text-clay-500">
              {blocks.footer?.servicesHeading ?? "Services"}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {collections.services.slice(0, 6).map((service) => (
                <li key={service.id}>
                  <Link
                    href="#services"
                    className="text-[0.88rem] text-clay-700 transition-colors hover:text-terra"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className="text-[0.66rem] uppercase tracking-[0.22em] text-clay-500">
              {blocks.footer?.connectHeading ?? "Contact"}
            </h2>
            <ul className="mt-4 space-y-2.5 text-[0.88rem] text-clay-700">
              <li>
                <a href={telHref(settings.phone)} className="hover:text-terra">
                  {settings.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.email}`} className="[overflow-wrap:anywhere] hover:text-terra">
                  {settings.email}
                </a>
              </li>
              <li>
                <address className="not-italic leading-relaxed">
                  {settings.addressLine1}
                  <br />
                  {settings.addressLine2}
                </address>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-clay-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.72rem] text-clay-500">
            © {new Date().getFullYear()} {settings.company}
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[0.72rem] text-clay-500 transition-colors hover:text-clay-900"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {blocks.footer?.legalNote && (
          <p className="mt-5 max-w-3xl text-[0.68rem] leading-relaxed text-clay-300">
            {blocks.footer.legalNote}
          </p>
        )}
      </Frame>
    </footer>
  );
}
