"use client";

import { Children, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/* ─────────────────────────────────────────────────────────────────────
   PhoneShowcase
   Mobile: horizontal scroll-snap row that loads centered on the middle
   phone (Report/artifact view), with peeks of phone 1 and phone 3
   on either side. Apple-style pagination dots below; active dot
   tracks the currently-snapped phone via IntersectionObserver.
   Desktop (md+): falls back to a centered flex-wrap row, dots hidden.
   ───────────────────────────────────────────────────────────────────── */

// useLayoutEffect runs server-side warning if not guarded; use isomorphic version
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function PhoneShowcase({ children }: { children: ReactNode }) {
  const childArr = Children.toArray(children);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const middleIndex = Math.floor(childArr.length / 2);
  const [activeIndex, setActiveIndex] = useState(middleIndex);

  // Center the middle phone on mount (mobile only). useLayoutEffect runs
  // synchronously before paint, so the user never sees a flash of phone 1.
  useIsomorphicLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(min-width: 768px)").matches) return;
    const middleItem = itemRefs.current[middleIndex];
    const container = containerRef.current;
    if (!middleItem || !container) return;
    const itemCenter = middleItem.offsetLeft + middleItem.offsetWidth / 2;
    const containerCenter = container.clientWidth / 2;
    container.scrollLeft = itemCenter - containerCenter;
  }, [middleIndex]);

  // Update active dot as user swipes. Whichever phone is most visible
  // becomes the active dot.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry with the highest intersection ratio above threshold
        let best: IntersectionObserverEntry | null = null;
        entries.forEach((entry) => {
          if (entry.intersectionRatio > 0.6) {
            if (!best || entry.intersectionRatio > best.intersectionRatio) {
              best = entry;
            }
          }
        });
        if (best) {
          const idx = itemRefs.current.findIndex(
            (el) => el === (best as IntersectionObserverEntry).target,
          );
          if (idx >= 0) setActiveIndex(idx);
        }
      },
      { root: container, threshold: [0.6, 0.75, 0.9, 1] },
    );
    itemRefs.current.forEach((item) => {
      if (item) observer.observe(item);
    });
    return () => observer.disconnect();
  }, [childArr.length]);

  return (
    <>
      <div
        ref={containerRef}
        className="flex items-center md:flex-wrap justify-start md:justify-center gap-6 md:gap-10 overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 pb-4 md:pb-0"
        style={{ perspective: "2000px", scrollbarWidth: "none" }}
      >
        {childArr.map((child, i) => (
          <div
            key={i}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className="snap-center shrink-0"
          >
            {child}
          </div>
        ))}
      </div>

      {/* Apple-style pagination dots — mobile only */}
      <div
        className="mt-5 flex justify-center items-center gap-1.5 md:hidden"
        aria-hidden="true"
      >
        {childArr.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ease-out ${
              i === activeIndex
                ? "w-6 bg-sprout-cream"
                : "w-1.5 bg-sprout-cream/30"
            }`}
          />
        ))}
      </div>
    </>
  );
}
