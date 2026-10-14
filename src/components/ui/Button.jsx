import Link from "next/link";
import { cn } from "@/lib/utils";

const VARIANTS = {
  primary:
    "bg-brand text-white shadow-glow hover:bg-brand-dark hover:shadow-lift active:translate-y-px",
  accent:
    "bg-accent text-ink shadow-soft hover:bg-accent-dark active:translate-y-px",
  dark: "bg-ink text-white hover:bg-ink-soft active:translate-y-px",
  outline:
    "border border-slate-300 bg-white text-ink hover:border-brand/40 hover:bg-brand-light hover:text-brand-dark",
  "outline-light":
    "border border-white/30 bg-white/5 text-white backdrop-blur-sm hover:border-white/60 hover:bg-white/12",
  white: "bg-white text-ink shadow-soft hover:bg-slate-100 active:translate-y-px",
  ghost: "text-brand hover:bg-brand-light",
};

const SIZES = {
  sm: "h-9 gap-1.5 px-3.5 text-sm",
  md: "h-11 gap-2 px-5 text-sm",
  lg: "h-12 gap-2 px-6 text-[0.95rem]",
  xl: "h-14 gap-2.5 px-7 text-base",
};

const BASE =
  "inline-flex shrink-0 items-center justify-center rounded-full font-semibold tracking-tight " +
  "transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0";

/**
 * The site's single call-to-action control. Renders a Next.js <Link> when
 * `href` is an internal path/anchor, a plain <a> for tel:/mailto:/external
 * URLs, and a <button> otherwise — so a section never has to branch on link
 * type or hand-roll button classes.
 */
export default function Button({
  href,
  variant = "primary",
  size = "lg",
  full = false,
  className,
  children,
  ...props
}) {
  const classes = cn(BASE, VARIANTS[variant], SIZES[size], full && "w-full", className);

  if (href) {
    const isExternal = /^(https?:|tel:|mailto:)/.test(href);
    if (isExternal) {
      return (
        <a
          href={href}
          className={classes}
          {...(href.startsWith("http")
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          {...props}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={props.type ?? "button"} className={classes} {...props}>
      {children}
    </button>
  );
}
