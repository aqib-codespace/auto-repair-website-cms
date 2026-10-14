import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Five-star rating. Renders the numeric value as accessible text so screen
 * readers get "Rated 5 out of 5" instead of five decorative glyphs.
 */
export default function Rating({ value = 5, size = "md", className }) {
  const filled = Math.max(0, Math.min(5, Math.round(Number(value) || 0)));
  const starSize = size === "sm" ? "h-3.5 w-3.5" : size === "lg" ? "h-5 w-5" : "h-4 w-4";

  return (
    <div className={cn("inline-flex items-center gap-0.5", className)}>
      <span className="sr-only">{`Rated ${filled} out of 5`}</span>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          className={cn(
            starSize,
            index < filled ? "fill-accent text-accent" : "fill-slate-200 text-slate-200",
          )}
          strokeWidth={0}
        />
      ))}
    </div>
  );
}
