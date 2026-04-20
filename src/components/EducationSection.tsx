"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
import { educations, type Education } from "@/lib/projects";

const HUB_VB = 120;
const HUB_C = HUB_VB / 2;
/** Extended viewBox width: dial (0–120) + connector to the right */
const HUD_VB_W = 170;
/** Connector starts on rim, rises at 45deg, then runs horizontal to node. */
const RIM_R = 52;
const CONN_SY = HUB_C;
const CONN_SX = HUB_C + RIM_R;
const CONN_SEG = 10;
const CONN_MX = CONN_SX + CONN_SEG * Math.SQRT1_2;
const CONN_MY = CONN_SY - CONN_SEG * Math.SQRT1_2;
const CONN_HX = 152;
const CONN_NODE = { x: 160, y: CONN_MY, r: 3.25 };

/** Progress arc sits between decorative rings and the dial edge so it does not cross the GPA readout. */
const GPA_ARC_R = 47.5;
const GPA_CIRC = 2 * Math.PI * GPA_ARC_R;

function gpaToPercent(gpa: number): number {
  return Math.min(100, Math.max(0, (gpa / 4) * 100));
}

function hubTicks() {
  const ticks = 48;
  const outer = 52;
  const innerLong = 46;
  const innerShort = 48.5;
  return Array.from({ length: ticks }, (_, i) => {
    const angle = (i * (360 / ticks) * Math.PI) / 180 - Math.PI / 2;
    const long = i % 6 === 0;
    const r1 = long ? innerLong : innerShort;
    const r2 = outer;
    const x1 = HUB_C + r1 * Math.cos(angle);
    const y1 = HUB_C + r1 * Math.sin(angle);
    const x2 = HUB_C + r2 * Math.cos(angle);
    const y2 = HUB_C + r2 * Math.sin(angle);
    return (
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="var(--teal)"
        strokeWidth={long ? 1 : 0.5}
        strokeOpacity={long ? 0.35 : 0.12}
      />
    );
  });
}

/** Isosceles triangle bullet (apex right); not equilateral — two equal sides from the tip. */
function ListChevronIso() {
  return (
    <svg
      className="mt-0.5 shrink-0 text-[var(--teal)]"
      width="10"
      height="12"
      viewBox="0 0 10 12"
      fill="currentColor"
      aria-hidden
    >
      <polygon points="0,1 9,6 0,11" opacity={0.95} />
    </svg>
  );
}

function EduGpaHub({ edu }: { edu: Education }) {
  const hasGpa = edu.gpa != null && !Number.isNaN(edu.gpa);
  const pct = hasGpa ? gpaToPercent(edu.gpa!) : 0;

  /** Render height of the HUD (dial + elbow share one viewBox). */
  const dialPx = 82;
  const displayW = dialPx * (HUD_VB_W / HUB_VB);
  const textClipPct = (HUB_VB / HUD_VB_W) * 100;

  return (
    <div
      className="edu-hud-gpa relative shrink-0"
      style={{
        width: displayW,
        height: dialPx,
        marginTop: "-6px",
        filter: "drop-shadow(0 0 10px rgba(0,212,200,0.22))",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${HUD_VB_W} ${HUB_VB}`}
        className="pointer-events-none absolute inset-0 block"
        preserveAspectRatio="xMinYMid meet"
      >
        <circle
          cx={HUB_C}
          cy={HUB_C}
          r={52}
          fill="none"
          stroke="var(--teal)"
          strokeWidth={2.5}
          strokeOpacity={0.45}
          strokeDasharray="14 10 18 8 22 12"
          strokeLinecap="round"
          transform={`rotate(-8 ${HUB_C} ${HUB_C})`}
          style={{ filter: "drop-shadow(0 0 3px rgba(0,212,200,0.4))" }}
        />
        <circle cx={HUB_C} cy={HUB_C} r={46} fill="none" stroke="rgba(0,212,200,0.12)" strokeWidth={1} />
        <circle
          cx={HUB_C}
          cy={HUB_C}
          r={44}
          fill="none"
          stroke="rgba(0,212,200,0.08)"
          strokeWidth={1}
          strokeDasharray="4 6"
        />
        {hubTicks()}
        {/* Track + fill live in outer annulus so strokes never sit over the GPA numerals */}
        <circle
          cx={HUB_C}
          cy={HUB_C}
          r={GPA_ARC_R}
          fill="none"
          stroke="rgba(0,212,200,0.12)"
          strokeWidth={2}
        />
        <circle
          className="edu-gpa-arc"
          cx={HUB_C}
          cy={HUB_C}
          r={GPA_ARC_R}
          stroke="var(--teal)"
          strokeWidth={2.25}
          fill="none"
          strokeLinecap="round"
          transform={`rotate(-90 ${HUB_C} ${HUB_C})`}
          data-circ={GPA_CIRC}
          data-pct={hasGpa ? pct : 0}
          style={{
            strokeDasharray: GPA_CIRC,
            strokeDashoffset: GPA_CIRC,
            filter: "drop-shadow(0 0 4px rgba(0,212,200,0.4))",
          }}
        />
        <circle
          cx={HUB_C}
          cy={HUB_C}
          r={34}
          fill="rgba(0,212,200,0.06)"
          stroke="rgba(0,212,200,0.14)"
          strokeWidth={1}
        />
        {/* Connector: 45deg up, then horizontal toward university label */}
        <polyline
          points={`${CONN_SX},${CONN_SY} ${CONN_MX},${CONN_MY} ${CONN_HX},${CONN_MY}`}
          stroke="var(--teal)"
          strokeWidth={1}
          strokeOpacity={0.52}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx={CONN_NODE.x}
          cy={CONN_NODE.y}
          r={CONN_NODE.r}
          fill="var(--teal)"
          fillOpacity={0.85}
          style={{ filter: "drop-shadow(0 0 4px rgba(0,212,200,0.45))" }}
        />
      </svg>
      <div
        className="relative z-10 flex h-full flex-col items-center justify-center px-2"
        style={{ width: `${textClipPct}%` }}
      >
        {hasGpa ? (
          <div className="flex flex-col items-center justify-center leading-none">
            <span
              className="tabular-nums text-sm font-bold leading-none text-neon text-glow md:text-base"
              style={{ fontFamily: "Orbitron, sans-serif" }}
            >
              {edu.gpa!.toFixed(2)}
            </span>
            <span className="mt-1 text-[8px] text-neon/50" style={{ fontFamily: "IBM Plex Mono, monospace" }}>
              / 4.0
            </span>
          </div>
        ) : (
          <span
            className="text-sm font-semibold tracking-widest text-neon/35"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            N/A
          </span>
        )}
      </div>
    </div>
  );
}

export default function EducationSection() {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const touchCoarse =
        typeof window !== "undefined" &&
        window.matchMedia("(max-width: 1023px)").matches;
      const rows = section.current?.querySelectorAll(".edu-hud-row");
      rows?.forEach((row) => {
        gsap.fromTo(
          row,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: touchCoarse ? 0.5 : 0.75,
            ease: "power2.out",
            scrollTrigger: touchCoarse
              ? {
                  trigger: row,
                  start: "top 90%",
                  toggleActions: "play none none reverse",
                }
              : {
                  trigger: row,
                  start: "top 88%",
                  end: "top 22%",
                  scrub: 1,
                },
          },
        );

        const arc = row.querySelector(".edu-gpa-arc") as SVGCircleElement | null;
        if (!arc) return;
        const C = parseFloat(arc.getAttribute("data-circ") || String(GPA_CIRC));
        const pct = parseFloat(arc.getAttribute("data-pct") || "0");
        if (pct <= 0) {
          gsap.set(arc, { strokeDashoffset: C });
          return;
        }
        const endOffset = C * (1 - pct / 100);
        if (touchCoarse) {
          gsap.fromTo(
            arc,
            { strokeDashoffset: C },
            {
              strokeDashoffset: endOffset,
              ease: "power2.out",
              duration: 0.75,
              scrollTrigger: {
                trigger: row,
                start: "top 88%",
                toggleActions: "play none none reverse",
              },
            },
          );
        } else {
          gsap.fromTo(
            arc,
            { strokeDashoffset: C },
            {
              strokeDashoffset: endOffset,
              ease: "none",
              scrollTrigger: {
                trigger: row,
                start: "top 85%",
                end: "top 15%",
                scrub: 1,
              },
            },
          );
        }
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={section}
      id="education"
      className="relative w-full py-24 overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      <div className="absolute inset-0 bg-grid opacity-8" />
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(0,212,200,0.04) 0%, transparent 55%)",
        }}
      />

      <div className="mb-16 px-6 text-center">
        <p
          className="mb-3 text-[10px] uppercase tracking-[0.3em] text-neon/40"
          style={{ fontFamily: "IBM Plex Mono, monospace" }}
        >
          — Academic Record —
        </p>
        <h2
          className="mb-3 text-3xl font-bold text-white text-glow lg:text-5xl"
          style={{ fontFamily: "Orbitron, sans-serif" }}
        >
          Education
        </h2>
        <p className="mx-auto max-w-xl text-sm text-white/30">
          Degrees, programs, and formative coursework — the foundation behind the build.
        </p>
      </div>

      <div className="relative mx-auto flex max-w-5xl flex-col gap-10 px-6 md:gap-12">
        {educations.map((edu) => (
          <article
            key={`${edu.school}-${edu.year}`}
            className="edu-hud-row edu-card holo-card holo-scanlines relative rounded-lg p-6 md:p-7"
            style={{
              borderLeft: "3px solid rgba(0,212,200,0.35)",
              background: "linear-gradient(135deg, rgba(0,18,32,0.5), rgba(0,36,48,0.25))",
            }}
          >
            <span className="absolute left-0 top-0 h-4 w-4 rounded-tl border-l border-t border-neon/25" />
            <span className="absolute right-0 top-0 h-4 w-4 border-r border-t border-neon/25" />
            <span className="absolute bottom-0 left-0 h-4 w-4 border-l border-b border-neon/25" />
            <span className="absolute bottom-0 right-0 h-4 w-4 border-r border-b border-neon/25" />

            {/* Dial + compact elbow + school on one band; details full width underneath (not shoved right) */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
                <EduGpaHub edu={edu} />
                <div className="min-w-0 max-w-[min(100%,28rem)]">
                  <h3
                    className="text-lg font-bold leading-tight text-white text-glow sm:text-xl md:text-2xl"
                    style={{ fontFamily: "Orbitron, sans-serif" }}
                  >
                    {edu.school}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-neon/75" style={{ fontFamily: "IBM Plex Mono, monospace" }}>
                    {edu.degree}
                  </p>
                </div>
              </div>

              <div className="w-full max-w-none">
                <p className="mb-4 text-xs leading-relaxed text-white/55" style={{ fontFamily: "IBM Plex Mono, monospace" }}>
                  {edu.field}
                </p>
                <ul className="space-y-2.5">
                  {edu.highlights.map((h, j) => (
                    <li
                      key={j}
                      className="flex gap-2.5 text-xs leading-relaxed text-white/80"
                      style={{ fontFamily: "IBM Plex Mono, monospace" }}
                    >
                      <ListChevronIso />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div
        className="absolute bottom-16 left-6 hidden space-y-1 lg:block"
        style={{
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: "10px",
          color: "rgba(0,212,200,0.2)",
        }}
      >
        <p>EDU.DB: INDEXED</p>
        <p>RECORDS: {educations.length}</p>
        <p>STATUS: ARCHIVED</p>
      </div>
    </section>
  );
}
