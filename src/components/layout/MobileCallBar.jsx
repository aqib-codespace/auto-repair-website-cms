import { Phone, CalendarCheck } from "lucide-react";
import { telHref } from "@/lib/utils";

/**
 * Persistent bottom bar on small screens. Phone calls convert best for
 * urgent repairs, so it stays reachable no matter how far the visitor has
 * scrolled. Hidden from lg up, where the header CTA is always visible.
 */
export default function MobileCallBar({ settings }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg lg:hidden">
      <div className="grid grid-cols-2 gap-2 p-2.5">
        <a
          href={telHref(settings.phone)}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 text-sm font-semibold text-ink"
        >
          <Phone className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          Call Now
        </a>
        <a
          href={settings.scheduleUrl || "#contact"}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-white shadow-glow"
        >
          <CalendarCheck className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          Schedule
        </a>
      </div>
    </div>
  );
}
