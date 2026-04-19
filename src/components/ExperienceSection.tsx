"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
import { experiences } from "@/lib/projects";

/** Mobile-only: vertical spine with horizontal weave (x in 0–100 viewBox units). */
function mobileWeavePathD(n: number, H: number): string {
  const mid = 50;
  const sway = 5;
  if (n <= 0) return `M ${mid} 0 L ${mid} ${H}`;
  const seg = H / n;
  let d = `M ${mid} 0`;
  for (let i = 0; i < n; i++) {
    const y0 = i * seg;
    const y1 = i * seg + seg * 0.22;
    const y2 = i * seg + seg * 0.5;
    const y3 = i * seg + seg * 0.78;
    const y4 = (i + 1) * seg;
    const dx = i % 2 === 0 ? -sway : sway;
    d += ` L ${mid} ${y1}`;
    d += ` L ${mid + dx} ${y2}`;
    d += ` L ${mid} ${y3}`;
    d += ` L ${mid} ${y4}`;
  }
  d += ` L ${mid} ${H}`;
  return d;
}

export default function ExperienceSection() {
  const section = useRef<HTMLElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const weaveRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const drawStroke = (el: SVGGeometryElement | null) => {
        if (!el) return;
        const len = el.getTotalLength();
        el.style.strokeDasharray = `${len}`;
        el.style.strokeDashoffset = `${len}`;
        gsap.to(el, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top 70%",
            end: "bottom 50%",
            scrub: 1,
          },
        });
      };

      drawStroke(lineRef.current);
      drawStroke(weaveRef.current);

      // Animate each card in
      const cards = section.current?.querySelectorAll(".exp-card");
      const lgUp = typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches;
      cards?.forEach((card, i) => {
        const isLeft = i % 2 === 0;
        gsap.fromTo(
          card,
          lgUp ? { opacity: 0, x: isLeft ? -60 : 60 } : { opacity: 0, y: 28 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              end: "top 60%",
              scrub: 1,
            },
          },
        );
      });

      // Animate year markers
      const markers = section.current?.querySelectorAll(".year-marker");
      markers?.forEach((m) => {
        gsap.fromTo(m,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: m,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const lineHeight = experiences.length * 280 + 80;
  const weaveD = mobileWeavePathD(experiences.length, lineHeight);

  return (
    <section
      ref={section}
      id="experience"
      className="relative w-full py-24 overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      <div className="absolute inset-0 bg-grid opacity-8" />

      {/* Section header */}
      <div className="text-center mb-20">
        <p
          className="text-[10px] tracking-[0.3em] uppercase text-neon/40 mb-3"
          style={{ fontFamily: "IBM Plex Mono, monospace" }}
        >
          — Mission Logs —
        </p>
        <h2
          className="text-3xl lg:text-5xl font-bold text-white text-glow mb-3"
          style={{ fontFamily: "Orbitron, sans-serif" }}
        >
          Experience
        </h2>
      </div>

      {/* Timeline */}
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
        {/* Mobile: woven path under panels (z-0). Desktop: simple vertical line (centered). */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 z-0 w-full max-w-4xl -translate-x-1/2 max-lg:px-4"
          style={{ height: lineHeight }}
          aria-hidden
        >
          <svg
            width="100%"
            height={lineHeight}
            viewBox={`0 0 100 ${lineHeight}`}
            preserveAspectRatio="none"
            className="absolute inset-x-0 top-0 h-full w-full overflow-visible lg:hidden"
          >
            <path
              ref={weaveRef}
              d={weaveD}
              fill="none"
              stroke="var(--teal)"
              strokeWidth="1.15"
              strokeOpacity="0.38"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <div className="absolute left-1/2 top-0 hidden h-full -translate-x-1/2 lg:block">
            <svg width="2" height={lineHeight} className="overflow-visible">
              <line
                ref={lineRef}
                x1="1" y1="0" x2="1" y2={lineHeight}
                stroke="var(--teal)"
                strokeWidth="1"
                strokeOpacity="0.3"
              />
            </svg>
          </div>
        </div>

        {/* Experience entries */}
        <div className="relative z-[1]" style={{ minHeight: lineHeight }}>
          {experiences.map((exp, i) => {
            const isLeft = i % 2 === 0;

            return (
              <div
                key={`${exp.company}-${i}`}
                className="relative mb-[60px] flex flex-col items-center max-lg:gap-2 lg:flex-row lg:items-start"
              >
                {/* Year marker — above panel on mobile, on rail at lg */}
                <div
                  className="year-marker relative z-20 flex flex-col items-center justify-center max-lg:order-1 max-lg:mb-1 lg:absolute lg:left-1/2 lg:top-2 lg:z-10 lg:-translate-x-1/2"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      background: "var(--teal)",
                      boxShadow: "0 0 10px rgba(0,212,200,0.5)",
                    }}
                  />
                  <span
                    className="mt-1 text-[9px] tracking-[0.15em] text-neon/50"
                    style={{ fontFamily: "Orbitron, sans-serif" }}
                  >
                    {exp.year}
                  </span>
                </div>

                {/* Card — full width on mobile (line weaves behind), alternating on lg */}
                <div
                  className={`exp-card relative z-10 w-full max-lg:order-2 max-lg:mx-auto max-lg:max-w-lg max-lg:pl-0 lg:w-[calc(50%-30px)] lg:pl-4 ${isLeft ? "lg:mr-auto" : "lg:ml-auto"}`}
                >
                  <div
                    className="relative border border-neon/15 bg-[rgba(0,212,200,0.03)] p-5 max-lg:bg-[rgba(5,5,8,0.9)] max-lg:backdrop-blur-md"
                  >
                    {/* Corner brackets */}
                    <span className="absolute top-0 left-0 w-2 h-2 border-l border-t border-neon/30" />
                    <span className="absolute top-0 right-0 w-2 h-2 border-r border-t border-neon/30" />
                    <span className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-neon/30" />
                    <span className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-neon/30" />

                    <p
                      className="text-[9px] tracking-[0.2em] uppercase text-neon/40 mb-1"
                      style={{ fontFamily: "IBM Plex Mono, monospace" }}
                    >
                      {exp.period}
                    </p>
                    <h3
                      className="text-lg font-bold text-white text-glow mb-1"
                      style={{ fontFamily: "Orbitron, sans-serif" }}
                    >
                      {exp.company}
                    </h3>
                    <p
                      className="text-xs text-neon/60 mb-3"
                      style={{ fontFamily: "IBM Plex Mono, monospace" }}
                    >
                      {exp.role}
                    </p>
                    <ul className="space-y-1.5">
                      {exp.description.map((d, j) => (
                        <li
                          key={j}
                          className="text-white/40 text-xs leading-relaxed flex gap-2"
                          style={{ fontFamily: "IBM Plex Mono, monospace" }}
                        >
                          <span className="text-neon/30 mt-0.5">▸</span>
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* HUD decorations */}
      <div
        className="absolute top-20 right-6 space-y-1 hidden lg:block"
        style={{
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: "10px",
          color: "rgba(0,212,200,0.2)",
        }}
      >
        <p>EXP.LOG: ACTIVE</p>
        <p>ENTRIES: {experiences.length}</p>
        <p>STATUS: VERIFIED</p>
      </div>
    </section>
  );
}
