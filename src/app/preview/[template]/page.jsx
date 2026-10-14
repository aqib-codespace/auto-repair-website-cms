import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye } from "lucide-react";
import { getSiteContent } from "@/db/queries/site-content";
import { resolveTemplate, templateBodyClass } from "@/lib/templates/resolve";
import { getTemplate } from "@/lib/templates/registry";
import { verifySession } from "@/lib/auth/dal";
import { cn } from "@/lib/utils";

/**
 * Renders the live site in a template WITHOUT changing what visitors see.
 *
 * This is a separate route rather than a `?template=` parameter on the homepage
 * for a specific reason: reading searchParams would make `/` dynamic and cost the
 * real homepage its static rendering. Isolating preview here keeps `/` fast and
 * makes "previewing" an explicit, unmistakable surface.
 *
 * Deliberately excluded from the (site) group, because this page supplies the
 * template's own chrome — including the body-level typography and page colour
 * that would otherwise come from the saved template in the root layout.
 */
export const metadata = {
  title: "Template preview",
  robots: { index: false, follow: false },
};

export default async function TemplatePreviewPage({ params }) {
  const { template: id } = await params;
  if (!getTemplate(id)) notFound();

  const [content, session] = await Promise.all([getSiteContent(), verifySession()]);
  const template = resolveTemplate(id);
  const meta = getTemplate(id);

  return (
    <div className={cn(templateBodyClass(id), "min-h-screen")}>
      {/*
       * A persistent banner so a preview can never be mistaken for the live site
       * — including if the URL is shared or left open in a tab.
       */}
      <div className="sticky top-0 z-100 flex flex-wrap items-center justify-between gap-3 bg-ink px-4 py-2.5 text-white">
        <p className="flex items-center gap-2.5 text-[0.8rem]">
          <Eye className="h-4 w-4 shrink-0 text-amber-400" strokeWidth={2} aria-hidden="true" />
          <span>
            Previewing <span className="font-semibold">{meta.name}</span> — not live.
          </span>
        </p>
        {session ? (
          <Link
            href="/admin/templates"
            className="inline-flex items-center gap-1.5 text-[0.78rem] font-semibold underline decoration-white/40 underline-offset-4 hover:decoration-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
            Back to Templates
          </Link>
        ) : (
          <Link
            href="/"
            className="text-[0.78rem] font-semibold underline decoration-white/40 underline-offset-4 hover:decoration-white"
          >
            Go to the live site
          </Link>
        )}
      </div>

      {/* Mirrors the real (site) layout so the preview is faithful down to the a11y affordances. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <template.Header content={content} />
      <main id="main">
        <template.Home content={content} />
      </main>
      <template.Footer content={content} />
    </div>
  );
}
