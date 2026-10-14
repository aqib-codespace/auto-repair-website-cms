/**
 * Template-level structure — the things that define *this* template rather
 * than an individual shop's content. Anything a client would want to change
 * lives in the database and is edited from /admin instead.
 */

/** Main navigation. Every href is an anchor into a homepage section. */
export const NAV_LINKS = [
  { href: "/#top", label: "Home" },
  { href: "/#services", label: "Services" },
  { href: "/#about", label: "About" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/#financing", label: "Financing", requiresFinancing: true },
  { href: "/#faq", label: "FAQ" },
  { href: "/#contact", label: "Contact" },
];

export const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
];

/** Lead pipeline states, in order. Used by the admin inbox. */
export const LEAD_STATUSES = [
  { value: "new", label: "New", tone: "brand" },
  { value: "contacted", label: "Contacted", tone: "amber" },
  { value: "scheduled", label: "Scheduled", tone: "green" },
  { value: "closed", label: "Closed", tone: "gray" },
];
