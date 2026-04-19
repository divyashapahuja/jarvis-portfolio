"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
import { experiences } from "@/lib/projects";

export default function ExperienceSection() {
  const section = useRef<HTMLElement>(null);
  const lineRef = useRef<SVGLineElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Draw the center timeline line on scroll
      if (lineRef.current) {
        const len = lineRef.current.getTotalLength();
        lineRef.current.style.strokeDasharray = `${len}`;
        lineRef.current.style.strokeDashoffset = `${len}`;

        gsap.to(lineRef.current, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top 70%",
            end: "bottom 50%",
            scrub: 1,
          },
        });
      }

      // Animate each card in
      const cards = section.current?.querySelectorAll(".exp-card");
      cards?.forEach((card, i) => {
        const isLeft = i % 2 === 0;
        gsap.fromTo(card,
          { opacity: 0, x: isLeft ? -60 : 60 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              end: "top 60%",
              scrub: 1,
            },
          }
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
        {/* Vertical line — left rail on mobile, centered on lg */}
        <div
          className="absolute left-4 top-0 lg:left-1/2 lg:-translate-x-1/2"
          style={{ height: lineHeight }}
        >
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

        {/* Experience entries */}
        <div className="relative" style={{ minHeight: lineHeight }}>
          {experiences.map((exp, i) => {
            const isLeft = i % 2 === 0;

            return (
              <div
                key={`${exp.company}-${i}`}
                className="relative flex items-start"
                style={{ marginBottom: "60px" }}
              >
                {/* Year marker */}
                <div
                  className="year-marker absolute left-4 z-10 flex -translate-x-1/2 flex-col items-center lg:left-1/2"
                  style={{ top: "8px" }}
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

                {/* Card — full width on mobile, alternating on lg */}
                <div
                  className={`exp-card w-full pl-11 lg:w-[calc(50%-30px)] lg:pl-4 ${isLeft ? "lg:mr-auto" : "lg:ml-auto"}`}
                >
                  <div
                    className="relative p-5"
                    style={{
                      border: "1px solid rgba(0,212,200,0.15)",
                      background: "rgba(0,212,200,0.03)",
                    }}
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
