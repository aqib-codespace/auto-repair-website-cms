"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts a statistic up when it scrolls into view.
 *
 * Values are authored as free text in the admin panel ("25+", "40k+", "4.9★"),
 * so the numeric part is extracted and animated while any prefix/suffix is
 * preserved verbatim. Anything without a number renders as-is, and
 * reduced-motion users get the final value immediately.
 */
export default function Counter({ value, className, duration = 1400 }) {
  const text = String(value ?? "");

  // Thousands separators are part of the number, not a suffix. Without this,
  // "1,200+" parsed as the number 1 with the suffix ",200+" and rendered
  // "0,200+" while counting.
  const match = text.match(/^(\D*)([\d,]*\d(?:\.\d+)?)(.*)$/s);
  const digits = match ? match[2].replace(/,/g, "") : null;
  const target = digits === null ? null : Number(digits);
  const decimals = digits?.includes(".") ? digits.split(".")[1].length : 0;
  const grouped = Boolean(match && match[2].includes(","));

  const ref = useRef(null);

  /**
   * `null` means "not animating — render the authored text as-is".
   *
   * That is deliberately the initial state, so the server-rendered HTML
   * contains "25+" rather than "0+". Starting at zero would mean crawlers and
   * anyone without JavaScript saw a shop advertising 0 years in business.
   */
  const [display, setDisplay] = useState(null);

  useEffect(() => {
    if (target === null) return;

    const node = ref.current;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // Leave `display` null: the final value is already on screen.
    if (!node || reduced || typeof IntersectionObserver === "undefined") return;

    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();

        const start = performance.now();
        const tick = (now) => {
          const progress = Math.min(1, (now - start) / duration);
          // easeOutExpo — fast start, settles precisely on the target.
          const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          setDisplay(target * eased);
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target, duration]);

  if (target === null || display === null) {
    return (
      <span ref={ref} className={className}>
        {text}
      </span>
    );
  }

  const rendered = grouped
    ? display.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    : display.toFixed(decimals);

  return (
    <span ref={ref} className={className}>
      {match[1]}
      {rendered}
      {match[3]}
    </span>
  );
}
