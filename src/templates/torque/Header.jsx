"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import Frame from "./ui/Frame";
import Action from "./ui/Action";
import { NAV_LINKS } from "@/config/site";
import { cn, telHref } from "@/lib/utils";

/**
 * Torque's chrome: a centred wordmark with the navigation beneath it, separated
 * by hairlines — a masthead rather than an app bar.
 *
 * Momentum's header is a sticky utility strip plus a nav row with a pill CTA.
 * Putting the same header on both templates would make the switch feel cosmetic,
 * so this one is structurally different: it does not stick, because an editorial
 * page wants the reader to move down it rather than always seeing chrome.
 */
export default function TorqueHeader({ content }) {
  const { settings } = content;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = NAV_LINKS.filter(
    (link) => !link.requiresFinancing || settings.financingEnabled,
  );

  return (
    <header className="border-b border-clay-200 bg-bone">
      <Frame size="wide">
        {/* Masthead */}
        <div className="flex items-center justify-between gap-6 py-5">
          <p className="hidden flex-1 text-[0.68rem] uppercase tracking-[0.2em] text-clay-500 lg:block">
            {settings.addressLine2}
          </p>

          <Link href="/" className="group flex-1 text-center" aria-label={`${settings.company} — home`}>
            <span className="block font-condensed text-[1.35rem] leading-none text-clay-900 sm:text-[1.6rem]">
              {settings.company}
            </span>
            <span className="mt-1.5 block text-[0.6rem] uppercase tracking-[0.28em] text-clay-500">
              {settings.tagline}
            </span>
          </Link>

          <div className="flex flex-1 items-center justify-end gap-4">
            <a
              href={telHref(settings.phone)}
              className="hidden text-[0.78rem] tracking-wide text-clay-700 underline decoration-clay-300 underline-offset-4 transition-colors hover:text-terra lg:inline"
            >
              {settings.phone}
            </a>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="torque-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex h-10 w-10 items-center justify-center border border-clay-300 text-clay-900 transition-colors hover:border-clay-900 lg:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Navigation rail */}
        <nav
          aria-label="Main"
          className="hidden items-center justify-center gap-8 border-t border-clay-200 py-3.5 lg:flex"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[0.7rem] uppercase tracking-[0.2em] text-clay-700 transition-colors hover:text-terra"
            >
              {link.label}
            </Link>
          ))}
          <Action href={settings.scheduleUrl || "#contact"} size="sm" className="ml-2">
            Book a visit
          </Action>
        </nav>
      </Frame>

      {/* Mobile sheet */}
      <div
        id="torque-nav"
        hidden={!open}
        className="border-t border-clay-200 bg-bone px-6 pb-10 pt-2 lg:hidden"
      >
        <nav aria-label="Mobile" className="divide-y divide-clay-200">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-4 font-condensed text-xl text-clay-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-7 space-y-2.5">
          <Action href={settings.scheduleUrl || "#contact"} full onClick={() => setOpen(false)}>
            Book a visit
          </Action>
          <Action href={telHref(settings.phone)} variant="outline" full>
            <Phone className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            {settings.phone}
          </Action>
        </div>
      </div>
    </header>
  );
}
