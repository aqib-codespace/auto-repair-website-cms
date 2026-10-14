"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const VARIANTS = {
  up: "",
  left: "reveal-left",
  right: "reveal-right",
  scale: "reveal-scale",
};

/**
 * Reveals its children the first time they scroll into view. Direction comes
 * from `variant` and stagger from `delay`, so a grid can cascade in without
 * every section hand-rolling an observer. Styling lives in globals.css;
 * reduced-motion users see content immediately.
 */
export default function Reveal({
  as: Tag = "div",
  variant = "up",
  delay = 0,
  className,
  children,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn("reveal", VARIANTS[variant], visible && "reveal-visible", className)}
    >
      {children}
    </Tag>
  );
}
