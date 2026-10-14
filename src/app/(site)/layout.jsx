import { getSiteContent } from "@/db/queries/site-content";
import { resolveTemplate } from "@/lib/templates/resolve";

/**
 * Public-site chrome, supplied by whichever template the site is set to.
 *
 * The header and footer are resolved here rather than inside the page so the
 * legal pages get the same chrome as the homepage. Both come from the template,
 * because navigation and footer are exactly where two designs most need to
 * differ — a fixed shell with a swappable middle would only ever be a recolour.
 *
 * getSiteContent() is React-cache()-wrapped, so the page below reuses this
 * result instead of re-querying.
 */
export default async function SiteLayout({ children }) {
  const content = await getSiteContent();
  const template = resolveTemplate(content.settings.template);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <template.Header content={content} />
      <main id="main">{children}</main>
      <template.Footer content={content} />
    </>
  );
}
