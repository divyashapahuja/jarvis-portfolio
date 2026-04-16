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
    <div className="hidden lg:flex flex-col items-center gap-0 sticky top-32 self-start pt-2" style={{ width: 24 }}>
      {phases.map((key, i) => (
        <a key={key} href={`#phase-${key}`} className="flex flex-col items-center group">
          {/* Connecting line above (skip for first) */}
          {i > 0 && (
            <div
              className="w-[1px] h-14 transition-colors duration-300"
              style={{ background: i <= active ? "var(--teal)" : "rgba(0,212,200,0.12)" }}
            />
          )}
          {/* Dot */}
          <div
            className="w-3 h-3 rounded-full transition-all duration-300 flex-shrink-0"
            style={{
              background: i === active ? "var(--teal)" : "transparent",
              border: `1.5px solid ${i <= active ? "var(--teal)" : "rgba(0,212,200,0.2)"}`,
              boxShadow: i === active ? "0 0 10px rgba(0,212,200,0.5)" : "none",
            }}
          />
        </a>
      ))}
    </div>
  );
}
