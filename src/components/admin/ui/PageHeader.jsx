import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/** Title block for every admin screen: optional back link, title, description, actions. */
export default function PageHeader({ title, description, backHref, backLabel, actions, className }) {
  return (
    <header className={cn("mb-8", className)}>
      {backHref && (
        <Link
          href={backHref}
          className="mb-3 inline-flex items-center gap-1 text-xs font-semibold text-slate-500 transition-colors hover:text-brand"
        >
          <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
          {backLabel ?? "Back"}
        </Link>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
          {description && (
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-500">{description}</p>
          )}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}
