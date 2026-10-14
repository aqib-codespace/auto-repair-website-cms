import Image from "next/image";
import { Quote } from "lucide-react";
import Rating from "@/components/ui/Rating";

/** One review. Used by the carousel and reusable anywhere a quote is needed. */
export default function TestimonialCard({ testimonial }) {
  return (
    <figure className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-8 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:border-brand/20 hover:shadow-card xl:p-9">
      <span
        aria-hidden="true"
        className="absolute -right-4 -top-6 font-display text-[7rem] font-extrabold leading-none text-slate-50 transition-colors duration-500 group-hover:text-brand-light"
      >
        &rdquo;
      </span>

      <Quote
        className="relative mb-6 h-9 w-9 text-brand/25"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <Rating value={testimonial.rating} className="relative mb-5" />

      <blockquote className="relative flex-1 text-pretty text-[1.02rem] leading-relaxed text-slate-700">
        {testimonial.quote}
      </blockquote>

      <figcaption className="relative mt-8 flex items-center gap-4 border-t border-slate-100 pt-6">
        {testimonial.image?.src ? (
          <Image
            src={testimonial.image.src}
            alt={testimonial.image.alt || ""}
            width={56}
            height={56}
            className="h-14 w-14 rounded-full object-cover ring-2 ring-white outline outline-2 outline-brand/15"
          />
        ) : (
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-light font-display text-lg font-bold text-brand">
            {testimonial.name?.[0] ?? "?"}
          </span>
        )}
        <span>
          <span className="block font-display text-[0.95rem] font-bold text-ink">
            {testimonial.name}
          </span>
          <span className="mt-0.5 block text-xs text-slate-500">{testimonial.vehicle}</span>
        </span>
      </figcaption>
    </figure>
  );
}
