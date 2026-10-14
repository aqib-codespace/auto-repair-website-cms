import Image from "next/image";
import Link from "next/link";
import BrandMark from "./BrandMark";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: { mark: "h-9 w-9", name: "text-[0.95rem]", tag: "text-[0.55rem]" },
  md: { mark: "h-11 w-11", name: "text-[1.15rem]", tag: "text-[0.6rem]" },
  lg: { mark: "h-14 w-14", name: "text-2xl", tag: "text-[0.68rem]" },
};

/**
 * Full logo lockup: mark + wordmark + tagline rule. Uses the shop's uploaded
 * logo when Settings has one and the generated mark otherwise, so the header
 * never renders a broken image or an empty space on a fresh install.
 */
export default function Logo({
  settings,
  tone = "dark",
  size = "md",
  href = "/",
  showTagline = true,
  className,
}) {
  const scale = SIZES[size] ?? SIZES.md;
  const light = tone === "light";

  const content = (
    <>
      {settings?.logoUrl ? (
        <Image
          src={settings.logoUrl}
          alt=""
          width={240}
          height={96}
          className={cn("w-auto max-w-[10rem] object-contain", scale.mark)}
          priority
        />
      ) : (
        <BrandMark
          className={cn(
            scale.mark,
            "transition-transform duration-500 group-hover:rotate-[8deg] group-hover:scale-[1.04]",
          )}
        />
      )}

      <span className="min-w-0">
        <span
          className={cn(
            "block truncate font-display font-extrabold leading-none tracking-[-0.03em]",
            scale.name,
            light ? "text-white" : "text-ink",
          )}
        >
          {settings?.company}
        </span>
        {showTagline && settings?.tagline && (
          <span className="mt-1.5 flex items-center gap-1.5">
            <span aria-hidden="true" className="h-px w-4 bg-accent" />
            <span
              className={cn(
                "block truncate font-semibold uppercase tracking-[0.2em]",
                scale.tag,
                light ? "text-white/55" : "text-slate-400",
              )}
            >
              {settings.tagline}
            </span>
          </span>
        )}
      </span>
    </>
  );

  const classes = cn("group flex items-center gap-3", className);

  if (!href) return <span className={classes}>{content}</span>;

  return (
    <Link href={href} className={classes} aria-label={`${settings?.company} — home`}>
      {content}
    </Link>
  );
}
