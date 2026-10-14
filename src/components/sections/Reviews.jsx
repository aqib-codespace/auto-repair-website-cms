"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import TestimonialCard from "@/components/cards/TestimonialCard";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 6000;
const GAP_PX = 24; // matches gap-6 on the track

/**
 * Testimonial carousel built on native scroll-snap rather than a carousel
 * library: keyboard- and touch-native, degrades to a plain scrollable row
 * without JavaScript, and adds no bundle weight.
 *
 * Autoplay advances every six seconds and stops permanently the moment the
 * visitor takes control (hover, focus, drag, arrow, or dot) — an auto-advancing
 * carousel that fights the reader is worse than none.
 */
export default function Reviews({ intro, testimonials }) {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [paused, setPaused] = useState(false);

  const step = () => {
    const card = trackRef.current?.firstElementChild;
    return card ? card.offsetWidth + GAP_PX : 0;
  };

  const syncPosition = useCallback(() => {
    const track = trackRef.current;
    const card = track?.firstElementChild;
    if (!track || !card) return;

    const width = card.offsetWidth + GAP_PX;
    setActive(Math.round(track.scrollLeft / width));
    setAtStart(track.scrollLeft <= 8);
    setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 8);
  }, []);

  useEffect(() => {
    syncPosition();
    const track = trackRef.current;
    if (!track) return;

    track.addEventListener("scroll", syncPosition, { passive: true });
    window.addEventListener("resize", syncPosition);
    return () => {
      track.removeEventListener("scroll", syncPosition);
      window.removeEventListener("resize", syncPosition);
    };
  }, [syncPosition]);

  useEffect(() => {
    if (paused || testimonials.length < 2) return;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const timer = setInterval(() => {
      const track = trackRef.current;
      if (!track) return;
      const wrapped = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
      track.scrollTo({ left: wrapped ? 0 : track.scrollLeft + step(), behavior: "smooth" });
    }, AUTOPLAY_MS);

    return () => clearInterval(timer);
  }, [paused, testimonials.length]);

  function goTo(index) {
    setPaused(true);
    trackRef.current?.scrollTo({ left: index * step(), behavior: "smooth" });
  }

  return (
    <Section id="reviews" containerSize="wide">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow={intro?.eyebrow}
          heading={intro?.heading}
          body={intro?.body}
          align="left"
          className="max-w-2xl"
        />

        <div className="flex items-center gap-8">
          {intro?.ratingLabel && (
            <div className="hidden rounded-2xl border border-slate-200/80 bg-slate-50/70 px-5 py-4 sm:block">
              <p className="flex items-center gap-2 font-display text-2xl font-extrabold text-ink">
                <Star className="h-5 w-5 fill-accent text-accent" strokeWidth={0} aria-hidden="true" />
                4.9
              </p>
              <p className="mt-1 max-w-[11rem] text-xs leading-snug text-slate-500">
                {intro.ratingLabel}
              </p>
            </div>
          )}

          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => goTo(Math.max(0, active - 1))}
              disabled={atStart}
              aria-label="Previous review"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-300 bg-white text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-brand hover:text-brand hover:shadow-soft disabled:translate-y-0 disabled:opacity-30 disabled:hover:border-slate-300 disabled:hover:text-ink"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              disabled={atEnd}
              aria-label="Next review"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-300 bg-white text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-brand hover:text-brand hover:shadow-soft disabled:translate-y-0 disabled:opacity-30 disabled:hover:border-slate-300 disabled:hover:text-ink"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      <ul
        ref={trackRef}
        aria-label="Customer reviews"
        onMouseEnter={() => setPaused(true)}
        onFocusCapture={() => setPaused(true)}
        onPointerDown={() => setPaused(true)}
        className="snap-track mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-3"
      >
        {testimonials.map((testimonial) => (
          <li
            key={testimonial.id}
            className="w-[86%] min-w-[86%] snap-start sm:w-[48%] sm:min-w-[48%] lg:w-[32.5%] lg:min-w-[32.5%] xl:w-[24.5%] xl:min-w-[24.5%]"
          >
            <TestimonialCard testimonial={testimonial} />
          </li>
        ))}
      </ul>

      {testimonials.length > 1 && (
        <div className="mt-10 flex justify-center gap-2">
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial.id}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Go to review ${index + 1}`}
              aria-current={index === active ? "true" : undefined}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === active ? "w-9 bg-brand" : "w-2 bg-slate-300 hover:bg-slate-400",
              )}
            />
          ))}
        </div>
      )}
    </Section>
  );
}
