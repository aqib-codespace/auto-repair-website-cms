import { cn } from "@/lib/utils";

/**
 * The template's logo mark.
 *
 * Geometry, not clip-art: a hex-nut silhouette (mechanical, premium) carrying
 * a chevron and a road bar (motion, forward). It is drawn from the live brand
 * tokens, so it re-colours itself the moment a shop changes its brand colour
 * in Settings — and because it is a single SVG it stays sharp from a 16px
 * favicon to a print-size header, with no image request.
 *
 * `variant="plain"` drops the outer ring for use on dark backgrounds.
 * A shop that has its own logo uploads it in Settings and this steps aside.
 */
export default function BrandMark({ className, variant = "tile", title }) {
  return (
    <svg
      viewBox="0 0 48 48"
      role={title ? "img" : "presentation"}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : "true"}
      className={cn("h-11 w-11 shrink-0", className)}
    >
      {/*
       * Shading is done with white/black overlays at low opacity rather than
       * colour stops, so the gradient follows `var(--brand)` on every browser
       * without relying on color-mix() support inside SVG paint servers.
       */}
      <defs>
        <linearGradient id="bm-sheen" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.34" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.34" />
        </linearGradient>
        <linearGradient id="bm-edge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.06" />
        </linearGradient>
      </defs>

      {/* Hex nut body */}
      <path d="M24 1.9 43.1 12.95v22.1L24 46.1 4.9 35.05v-22.1z" fill="var(--brand)" />
      <path d="M24 1.9 43.1 12.95v22.1L24 46.1 4.9 35.05v-22.1z" fill="url(#bm-sheen)" />
      {variant === "tile" && (
        <path
          d="M24 1.9 43.1 12.95v22.1L24 46.1 4.9 35.05v-22.1z"
          fill="none"
          stroke="url(#bm-edge)"
          strokeWidth="1.2"
        />
      )}

      {/* Inner hairline hex — adds depth without detail that muddies at 16px */}
      <path
        d="M24 7.4 38.3 15.7v16.6L24 40.6 9.7 32.3V15.7z"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.16"
        strokeWidth="1"
      />

      {/* Chevron + road bar */}
      <path
        d="M14.6 28.2 24 17.6l9.4 10.6"
        fill="none"
        stroke="#ffffff"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.4 34.4h15.2"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
