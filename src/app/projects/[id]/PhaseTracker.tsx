"use client";

import { useEffect, useState } from "react";

export default function PhaseTracker({ phases }: { phases: readonly string[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const els = phases.map((key) => document.getElementById(`phase-${key}`));
    if (els.some((el) => !el)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = els.findIndex((el) => el === entry.target);
            if (idx !== -1) setActive(idx);
          }
        }
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );

    els.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [phases]);

  return (
    <>
      <nav
        className="scrollbar-hide sticky top-[4.5rem] z-30 -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 py-2 lg:hidden"
        style={{
          background: "linear-gradient(to bottom, rgba(5,5,8,0.95) 60%, transparent)",
          WebkitOverflowScrolling: "touch",
        }}
        aria-label="Case study phases"
      >
        {phases.map((key, i) => (
          <a
            key={key}
            href={`#phase-${key}`}
            className="shrink-0 rounded border px-3 py-1.5 text-[10px] uppercase tracking-wider transition-colors"
            style={{
              fontFamily: "IBM Plex Mono, monospace",
              borderColor: i === active ? "var(--teal)" : "rgba(0,212,200,0.2)",
              background: i === active ? "rgba(0,212,200,0.12)" : "rgba(0,212,200,0.04)",
              color: i === active ? "var(--teal)" : "rgba(255,255,255,0.45)",
            }}
          >
            {String(i + 1).padStart(2, "0")}
          </a>
        ))}
      </nav>

      <div className="hidden w-6 flex-col items-center gap-0 self-start pt-2 lg:sticky lg:top-32 lg:flex">
        {phases.map((key, i) => (
          <a key={key} href={`#phase-${key}`} className="group flex flex-col items-center">
            {i > 0 && (
              <div
                className="h-14 w-[1px] transition-colors duration-300"
                style={{ background: i <= active ? "var(--teal)" : "rgba(0,212,200,0.12)" }}
              />
            )}
            <div
              className="h-3 w-3 flex-shrink-0 rounded-full transition-all duration-300"
              style={{
                background: i === active ? "var(--teal)" : "transparent",
                border: `1.5px solid ${i <= active ? "var(--teal)" : "rgba(0,212,200,0.2)"}`,
                boxShadow: i === active ? "0 0 10px rgba(0,212,200,0.5)" : "none",
              }}
            />
          </a>
        ))}
      </div>
    </>
  );
}
