import { cn } from "@/lib/utils";

/** Small uppercase kicker above a heading, with a short brand rule. */
export default function Eyebrow({ children, tone = "brand", className }) {
  if (!children) return null;

  return (
    <p
      className={cn(
        "flex items-center gap-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em]",
        tone === "brand" ? "text-brand" : "text-white/70",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "h-px w-6 shrink-0",
          tone === "brand" ? "bg-brand/50" : "bg-white/40",
        )}
      />
      {children}
    </p>
  );
}
