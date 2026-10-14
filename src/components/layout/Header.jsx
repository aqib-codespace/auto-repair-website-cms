"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Phone, Clock, MapPin, ArrowRight } from "lucide-react";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { NAV_LINKS } from "@/config/site";
import { cn, telHref } from "@/lib/utils";

/**
 * Sticky site header: a slim utility bar (hours, address, phone) that scrolls
 * away to reclaim height, a condensing nav bar with a scroll-progress hairline,
 * and a full-height mobile sheet that ends in the same two CTAs as the hero — so
 * booking is never more than one tap away from any scroll position.
 */
export default function Header({ settings, hoursSummary }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(window.scrollY > 12);
      setProgress(scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent the page behind the mobile sheet from scrolling.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = NAV_LINKS.filter(
    (link) => !link.requiresFinancing || settings.financingEnabled,
  );
  const phoneHref = telHref(settings.phone);

  return (
    /**
     * `sticky`, not `fixed`. A fixed header takes no layout space, so every page
     * had to guess its height and pad for it by hand — which silently put the
     * hero's eyebrow and the legal pages' first paragraph underneath it. Sticky
     * behaves identically once you scroll (it stays pinned, z-50 keeps it above
     * the page) but occupies its own height in flow, so nothing can slide under
     * it and `min-h-[calc(100svh - header)]` below means what it says.
     */
    <header className="sticky inset-x-0 top-0 z-50">
      <div
        className={cn(
          "hidden overflow-hidden bg-ink text-white/65 transition-all duration-500 lg:block",
          scrolled ? "max-h-0 opacity-0" : "max-h-12 opacity-100",
        )}
      >
        <Container size="wide" className="flex items-center justify-between gap-6 py-2.5 text-xs">
          <div className="flex items-center gap-7">
            <span className="inline-flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-accent" strokeWidth={2} aria-hidden="true" />
              {hoursSummary}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-accent" strokeWidth={2} aria-hidden="true" />
              {settings.addressLine1}
              {settings.addressLine2 ? `, ${settings.addressLine2}` : ""}
            </span>
          </div>
          <a
            href={phoneHref}
            className="group inline-flex items-center gap-2 font-semibold text-white transition-colors hover:text-accent"
          >
            <Phone className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            {settings.phone}
          </a>
        </Container>
      </div>

      <div
        className={cn(
          "relative border-b transition-all duration-300",
          scrolled
            ? "border-slate-200/70 bg-white/85 shadow-soft backdrop-blur-xl"
            : "border-transparent bg-white",
        )}
      >
        <Container size="wide" className="flex items-center justify-between gap-6 py-3.5">
          <Logo settings={settings} />

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-brand"
              >
                {link.label}
                {/* Underline grows from the centre on hover. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-4 bottom-1 h-0.5 origin-center scale-x-0 rounded-full bg-brand transition-transform duration-300 group-hover:scale-x-100"
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <a
              href={phoneHref}
              className="hidden items-center gap-2.5 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-ink transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:text-brand xl:inline-flex"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-light text-brand">
                <Phone className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
              </span>
              {settings.phone}
            </a>
            <Button
              href={settings.scheduleUrl || "#contact"}
              size="md"
              className="group hidden sm:inline-flex"
            >
              Schedule Service
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={2.5}
                aria-hidden="true"
              />
            </Button>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-ink transition-colors hover:bg-slate-50 lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </Container>

        {/* Reading-progress hairline. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-linear-to-r from-brand to-accent transition-transform duration-150"
          style={{ transform: `scaleX(${progress / 100})` }}
        />
      </div>

      <div
        id="mobile-nav"
        hidden={!open}
        className="h-[calc(100dvh-4.5rem)] overflow-y-auto border-b border-slate-200 bg-white px-5 pb-12 pt-3 lg:hidden"
      >
        <nav aria-label="Mobile" className="divide-y divide-slate-100">
          {links.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between py-4 font-display text-lg font-bold tracking-tight text-ink"
            >
              {link.label}
              <span className="font-sans text-xs font-medium text-slate-300">
                {String(index + 1).padStart(2, "0")}
              </span>
            </Link>
          ))}
        </nav>

        <div className="mt-8 space-y-3">
          <Button href={settings.scheduleUrl || "#contact"} full onClick={() => setOpen(false)}>
            Schedule Service
          </Button>
          <Button href={phoneHref} variant="outline" full>
            <Phone className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            {settings.phone}
          </Button>
        </div>

        <dl className="mt-9 space-y-3.5 text-sm text-slate-500">
          <div className="flex gap-3">
            <dt className="sr-only">Hours</dt>
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={2} aria-hidden="true" />
            <dd>{hoursSummary}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="sr-only">Address</dt>
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={2} aria-hidden="true" />
            <dd>
              {settings.addressLine1}
              {settings.addressLine2 ? <>, {settings.addressLine2}</> : null}
            </dd>
          </div>
        </dl>
      </div>
    </header>
  );
}
