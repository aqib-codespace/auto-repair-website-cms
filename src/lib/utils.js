/** Join class names, dropping falsy values. */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/** "(817) 555-0142" -> "tel:+18175550142" (assumes a US number when 10 digits). */
export function telHref(phone) {
  const digits = String(phone ?? "").replace(/\D/g, "");
  if (!digits) return "tel:";
  return `tel:${digits.length === 10 ? `+1${digits}` : `+${digits}`}`;
}

/** Split a textarea value into paragraphs on blank lines. */
export function toParagraphs(text) {
  return String(text ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** "Oil Changes" -> "oil-changes" (used for anchor ids and slugs). */
export function slugify(value) {
  return String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Brand colours are admin-editable and get written into a CSS custom
 * property, so only accept literal hex values — never pass raw stored text
 * into a stylesheet.
 */
export function safeCssColor(value, fallback) {
  return /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(String(value ?? "").trim())
    ? String(value).trim()
    : fallback;
}

/** ISO timestamp -> "Jan 14, 2026, 3:04 PM" in a stable, locale-independent form. */
export function formatDateTime(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(value));
}

/** ISO date -> "Jan 14, 2026". */
export function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(value));
}
