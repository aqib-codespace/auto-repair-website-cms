import { cn } from "@/lib/utils";

/**
 * Numbered section marker: "01 — Our Services".
 *
 * Momentum uses a coloured pill for the same job. Torque uses a numeral, an em
 * rule and letterspaced small caps, which is the editorial equivalent and gives
 * the page a table-of-contents logic as you scroll.
 */
export default function Kicker({ index, children, tone = "dark", className }) {
  if (!children) return null;
  const light = tone === "light";

  return (
    <p
      className={cn(
        "flex items-center gap-3 text-[0.7rem] font-medium uppercase tracking-[0.24em]",
        light ? "text-bone/70" : "text-terra",
        className,
      )}
    >
      {index != null && (
        <span className={cn("tabular-nums", light ? "text-bone/50" : "text-clay-300")}>
          {String(index).padStart(2, "0")}
        </span>
      )}
      <span aria-hidden="true" className={cn("h-px w-7", light ? "bg-bone/40" : "bg-terra/50")} />
      {children}
    </p>
  );
}
