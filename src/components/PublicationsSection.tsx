"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { publications } from "@/lib/projects";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PublicationsSection() {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const rows = section.current?.querySelectorAll(".pub-row");
      rows?.forEach((row) => {
        gsap.fromTo(
          row,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: row,
              start: "top 88%",
              end: "top 55%",
              scrub: 1,
            },
          },
        );
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={section}
      id="publications"
      className="relative w-full overflow-hidden py-24"
      style={{ background: "var(--background)" }}
    >
      <div className="absolute inset-0 bg-grid opacity-8" />
      <div
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          background:
            "radial-gradient(ellipse 65% 45% at 50% 15%, rgba(0,212,200,0.05) 0%, transparent 55%)",
        }}
      />

      <div className="relative z-10 mb-16 px-6 text-center">
        <p
          className="mb-3 text-[10px] uppercase tracking-[0.3em] text-neon/40"
          style={{ fontFamily: "IBM Plex Mono, monospace" }}
        >
          — Peer-Reviewed and Proceedings —
        </p>
        <h2
          className="mb-3 text-3xl font-bold text-white text-glow lg:text-5xl"
          style={{ fontFamily: "Orbitron, sans-serif" }}
        >
          Publications
        </h2>
        <p className="mx-auto max-w-xl text-sm text-white/30">
          Selected papers and proceedings. External links open in a new tab.
        </p>
      </div>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-8 px-6 md:gap-10">
        {publications.map((pub) => (
          <article
            key={pub.id}
            className="pub-row holo-card holo-scanlines relative rounded-lg p-6 md:p-7"
            style={{
              borderLeft: "3px solid rgba(0,212,200,0.35)",
              background: "linear-gradient(135deg, rgba(0,18,32,0.5), rgba(0,36,48,0.25))",
            }}
          >
            <span className="absolute left-0 top-0 h-4 w-4 rounded-tl border-l border-t border-neon/25" />
            <span className="absolute right-0 top-0 h-4 w-4 border-r border-t border-neon/25" />
            <span className="absolute bottom-0 left-0 h-4 w-4 border-l border-b border-neon/25" />
            <span className="absolute bottom-0 right-0 h-4 w-4 border-r border-b border-neon/25" />

            <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-8">
              <div
                className="shrink-0 rounded border border-neon/25 px-3 py-2 text-center md:text-left"
                style={{
                  background: "rgba(0,212,200,0.06)",
                  fontFamily: "IBM Plex Mono, monospace",
                }}
              >
                <span className="block text-lg font-bold tabular-nums text-neon text-glow" style={{ fontFamily: "Orbitron, sans-serif" }}>
                  {pub.year}
                </span>
                <span className="mt-1 block text-[9px] uppercase tracking-[0.2em] text-neon/45">{pub.dateLabel}</span>
              </div>

              <div className="min-w-0 flex-1">
                <h3
                  className="text-lg font-bold leading-snug text-white text-glow sm:text-xl"
                  style={{ fontFamily: "Orbitron, sans-serif" }}
                >
                  {pub.title}
                </h3>
                <p
                  className="mt-2 text-xs leading-relaxed text-white/55 sm:text-sm"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  {pub.venue}
                </p>
                <p
                  className="mt-3 text-xs leading-relaxed text-white/75 sm:text-sm"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  {pub.contribution}
                </p>

                <div className="mt-5">
                  {pub.href ? (
                    <a
                      href={pub.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-neon/30 bg-neon/5 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-neon transition-colors hover:border-neon/50 hover:bg-neon/10 hover:text-white"
                      style={{ fontFamily: "IBM Plex Mono, monospace" }}
                      aria-label={`Open reference for ${pub.title}`}
                    >
                      <span>Paper / reference</span>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0" aria-hidden>
                        <path
                          d="M2 10L10 2M10 2H4M10 2V8"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  ) : (
                    <span
                      className="inline-block border border-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-white/25"
                      style={{ fontFamily: "IBM Plex Mono, monospace" }}
                    >
                      Link TBD
                    </span>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div
        className="absolute bottom-16 right-6 hidden space-y-1 lg:block"
        style={{
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: "10px",
          color: "rgba(0,212,200,0.2)",
        }}
      >
        <p>PUB.DB: INDEXED</p>
        <p>RECORDS: {publications.length}</p>
        <p>STATUS: CITED</p>
      </div>
    </section>
  );
}
