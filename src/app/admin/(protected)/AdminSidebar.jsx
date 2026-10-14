"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ExternalLink, LogOut } from "lucide-react";
import BrandMark from "@/components/ui/BrandMark";
import NavIcon from "@/components/admin/ui/NavIcon";
import { cn } from "@/lib/utils";
import { logout } from "./actions";

function NavLink({ link, onNavigate }) {
  const pathname = usePathname();

  /**
   * `exact` keeps the dashboard from matching every /admin/* route. Links with a
   * hash never highlight on their own — the page they point into owns the active
   * state, so a sub-item cannot look selected while a different one is live.
   */
  const target = link.href.split("#")[0];
  const isActive = link.href.includes("#")
    ? false
    : link.exact
      ? pathname === target
      : pathname === target || pathname.startsWith(`${target}/`);

  return (
    <Link
      href={link.href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group flex items-center gap-2.5 rounded-lg py-2 pr-2 text-[0.82rem] transition-colors",
        link.nested ? "pl-8" : "pl-2.5",
        isActive
          ? "bg-white/10 font-semibold text-white"
          : "text-white/55 hover:bg-white/5 hover:text-white",
      )}
    >
      <NavIcon
        name={link.icon}
        className={cn(
          "h-4 w-4 shrink-0 transition-colors",
          isActive ? "text-accent" : "text-white/40 group-hover:text-white/70",
        )}
      />
      <span className="truncate">{link.label}</span>
      {link.note && (
        <span className="ml-auto shrink-0 rounded-full bg-green-400/15 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-green-300">
          {link.note}
        </span>
      )}
      {link.badge > 0 && (
        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[0.65rem] font-bold text-ink">
          {link.badge}
        </span>
      )}
    </Link>
  );
}

/**
 * Admin navigation: a permanent dark rail on desktop, a slide-in sheet on
 * mobile. Nav data is passed in as plain objects (icons by name) so the server
 * layout can build it from the same registries that generate the forms.
 */
export default function AdminSidebar({ sections, admin, company, site }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const nav = (
    <>
      <div className="mb-5 flex items-center gap-3 px-1.5">
        <BrandMark className="h-9 w-9" />
        <div className="min-w-0">
          <p className="truncate text-[0.85rem] font-semibold text-white">{company}</p>
          <p className="truncate text-[0.7rem] text-white/40">{admin.email}</p>
        </div>
      </div>

      {/*
       * Which shop is being edited. Essential once one panel can serve many:
       * an operator account with access to every site must never have to guess
       * whose content is on screen.
       */}
      {site && (
        <div className="mb-6 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-white/35">
            Editing site
          </p>
          <p className="mt-0.5 truncate text-[0.78rem] font-semibold text-accent">{site.slug}</p>
        </div>
      )}

      <nav className="flex-1 space-y-6 overflow-y-auto pb-4">
        {sections.map((section) => (
          <div key={section.heading}>
            <p className="mb-1.5 px-2.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white/30">
              {section.heading}
            </p>
            <ul className="space-y-0.5">
              {section.links.map((link) => (
                <li key={link.href}>
                  <NavLink link={link} onNavigate={close} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="space-y-0.5 border-t border-white/10 pt-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 rounded-lg py-2 pl-2.5 pr-3 text-[0.82rem] text-white/55 transition-colors hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="h-4 w-4 shrink-0 text-white/40" strokeWidth={2} aria-hidden="true" />
          View live site
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-lg py-2 pl-2.5 pr-3 text-[0.82rem] text-white/55 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4 shrink-0 text-white/40" strokeWidth={2} aria-hidden="true" />
            Sign out
          </button>
        </form>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <span className="flex items-center gap-2.5">
          <BrandMark className="h-8 w-8" />
          <span className="text-sm font-semibold text-slate-900">Admin</span>
        </span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open admin menu"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile sheet */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={close}
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
          />
          <div className="surface-ink absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col px-4 py-5">
            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            {nav}
          </div>
        </div>
      )}

      {/* Desktop rail */}
      <aside className="surface-ink sticky top-0 hidden h-screen w-72 shrink-0 flex-col px-4 py-6 lg:flex">
        {nav}
      </aside>
    </>
  );
}
