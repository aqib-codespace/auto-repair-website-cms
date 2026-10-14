import Link from "next/link";
import { cn } from "@/lib/utils";

const VARIANTS = {
  /**
   * Safety orange on near-black: the highest-contrast pair this palette has, so
   * the one thing a visitor should click is the one thing that glows.
   */
  solid: "bg-terra text-bone font-semibold hover:bg-terra/85",
  /**
   * The shop's own brand colour, lifted for a dark ground — a rebrand in Settings
   * still moves this template. See `.template-torque` in globals.css.
   */
  brand: "bg-[var(--brand-lift)] text-clay-900 hover:bg-[var(--brand-lift-strong)]",
  terra: "bg-terra text-bone font-semibold hover:bg-terra/85",
  /** For use on the orange band, where orange-on-orange would vanish. */
  contrast: "bg-bone text-clay-900 font-semibold hover:bg-clay-100",
  outline: "border border-clay-300 text-clay-900 hover:border-terra hover:text-terra",
  "outline-light": "border border-bone/45 text-bone hover:border-bone hover:bg-bone/10",
  quiet: "text-clay-900 underline decoration-clay-300 underline-offset-[6px] hover:decoration-terra hover:text-terra",
};

const SIZES = {
  sm: "h-9 gap-2 px-4 text-[0.72rem]",
  md: "h-11 gap-2 px-6 text-[0.76rem]",
  lg: "h-12 gap-2.5 px-7 text-[0.78rem]",
};

/**
 * Square, letterspaced, small-caps action. Momentum's buttons are fully rounded
 * pills; keeping that shape here would undo the editorial character before the
 * visitor read a word.
 */
export default function Action({
  href,
  variant = "solid",
  size = "lg",
  full = false,
  className,
  children,
  ...props
}) {
  const classes = cn(
    "inline-flex shrink-0 items-center justify-center font-medium uppercase tracking-[0.14em]",
    "transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-55",
    variant === "quiet" ? "gap-2 px-0" : SIZES[size],
    VARIANTS[variant],
    full && "w-full",
    className,
  );

  if (href) {
    const external = /^(https?:|tel:|mailto:)/.test(href);
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
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
