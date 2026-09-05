"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "./Icons";

/**
 * Horizontal rail with the floating arrows YouTube uses on its shelves.
 * `arrowTop` keeps the buttons centred on the thumbnail, not the whole card.
 */
export default function Carousel({
  children,
  arrowTop = "35%",
}: {
  children: ReactNode;
  arrowTop?: string;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  const sync = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const max = rail.scrollWidth - rail.clientWidth;
    setAtStart(rail.scrollLeft <= 8);
    setAtEnd(rail.scrollLeft >= max - 8);
  }, []);

  useEffect(() => {
    sync();
    const rail = railRef.current;
    if (!rail) return;
    const observer = new ResizeObserver(sync);
    observer.observe(rail);
    return () => observer.disconnect();
  }, [sync]);

  const scrollBy = (direction: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * rail.clientWidth * 0.9, behavior: "smooth" });
  };

  const arrowClass =
    "absolute z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-[#1b2135]/90 text-white shadow-lg shadow-black/40 backdrop-blur transition hover:bg-[#252c44] disabled:pointer-events-none disabled:opacity-0";

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Scroll left"
        onClick={() => scrollBy(-1)}
        disabled={atStart}
        style={{ top: arrowTop }}
        className={`${arrowClass} -left-4`}
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>

      <div
        ref={railRef}
        onScroll={sync}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth"
      >
        {children}
      </div>

      <button
        type="button"
        aria-label="Scroll right"
        onClick={() => scrollBy(1)}
        disabled={atEnd}
        style={{ top: arrowTop }}
        className={`${arrowClass} -right-4`}
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
