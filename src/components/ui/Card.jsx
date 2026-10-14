import Link from "next/link";
import { cn } from "@/lib/utils";

const TONES = {
  white: "border-slate-200/80 bg-white",
  muted: "border-slate-200/80 bg-slate-50/80",
  ink: "border-white/10 bg-white/[0.04] backdrop-blur-sm",
};

/**
 * The shared card surface: rounded corners, hairline border, soft shadow,
 * and an optional lift on hover. Every card-shaped thing on the site
 * (services, features, steps, testimonials, gallery tiles) builds on this
 * rather than repeating the surface treatment.
 */
export default function Card({
  as: Tag = "div",
  href,
  tone = "white",
  interactive = false,
  className,
  children,
  ...props
}) {
  const classes = cn(
    "relative rounded-2xl border shadow-soft transition-all duration-300",
    TONES[tone],
    interactive &&
      (tone === "ink"
        ? "hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.07]"
        : "hover:-translate-y-1 hover:border-brand/30 hover:shadow-card"),
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <Tag className={classes} {...props}>
      {children}
    </Tag>
  );
}
