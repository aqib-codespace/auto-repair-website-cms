import Link from "next/link";
import { cn } from "@/lib/utils";

const VARIANTS = {
  primary: "bg-brand text-white shadow-sm hover:bg-brand-dark disabled:hover:bg-brand",
  secondary:
    "border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50",
  danger: "border border-red-200 bg-white text-red-600 hover:border-red-300 hover:bg-red-50",
  ghost: "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
  dark: "bg-ink text-white hover:bg-ink-soft",
};

const SIZES = {
  xs: "h-8 gap-1.5 px-2.5 text-xs",
  sm: "h-9 gap-1.5 px-3 text-[0.8rem]",
  md: "h-10 gap-2 px-4 text-sm",
  lg: "h-11 gap-2 px-5 text-sm",
};

const BASE =
  "inline-flex shrink-0 items-center justify-center rounded-lg font-semibold transition-all " +
  "disabled:cursor-not-allowed disabled:opacity-60";

/**
 * Shared admin control. Renders a <Link> when `href` is given, a <label> when
 * `as="label"` (for wrapping a hidden file input), otherwise a <button> — same
 * visual language either way, so list pages never hand-roll button classes.
 */
export default function Button({
  href,
  as,
  variant = "primary",
  size = "md",
  full = false,
  className,
  children,
  ...props
}) {
  const classes = cn(BASE, VARIANTS[variant], SIZES[size], full && "w-full", className);

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  if (as === "label") {
    return (
      <label className={cn(classes, "cursor-pointer")} {...props}>
        {children}
      </label>
    );
  }

  return (
    <button type={props.type ?? "button"} className={classes} {...props}>
      {children}
    </button>
  );
}
