import { cn } from "@/lib/utils";

const TONES = {
  brand: "bg-brand-light text-brand-dark ring-brand/15",
  green: "bg-green-50 text-green-700 ring-green-600/15",
  amber: "bg-amber-50 text-amber-700 ring-amber-600/15",
  red: "bg-red-50 text-red-700 ring-red-600/15",
  gray: "bg-slate-100 text-slate-600 ring-slate-500/15",
};

export default function Badge({ tone = "gray", className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.7rem] font-semibold ring-1 ring-inset",
        TONES[tone] ?? TONES.gray,
        className,
      )}
    >
      {children}
    </span>
  );
}
