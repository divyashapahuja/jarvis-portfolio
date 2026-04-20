"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
import { contactLinks } from "@/lib/projects";

const CX = 350;
const CY = 350;
const OUTER_R = 220;
const ELBOW_EXT = 30;
const ARM_LEN = 60;

const R = (n: number) => Math.round(n * 1e4) / 1e4;

function pt(angleDeg: number, r: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: R(CX + r * Math.cos(rad)), y: R(CY + r * Math.sin(rad)) };
}

function arc(r: number, startDeg: number, endDeg: number) {
  const s = pt(startDeg, r);
  const e = pt(endDeg, r);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

function dotArc(r: number, startDeg: number, endDeg: number, count: number) {
  const dots = [];
  for (let i = 0; i < count; i++) {
    const a = startDeg + (endDeg - startDeg) * (i / (count - 1));
    dots.push(pt(a, r));
  }
  return dots;
}

function ticks(r: number, count: number, len: number) {
  return Array.from({ length: count }, (_, i) => {
    const a = (360 / count) * i;
    const inner = pt(a, r - len / 2);
    const outer = pt(a, r + len / 2);
    return { x1: inner.x, y1: inner.y, x2: outer.x, y2: outer.y };
  });
}

function connectorPath(angle: number) {
  const ringPt = pt(angle, OUTER_R);
  const elbowPt = pt(angle, OUTER_R + ELBOW_EXT);
  const isRight = Math.cos((angle * Math.PI) / 180) >= 0;
  const endPt = { x: R(elbowPt.x + (isRight ? ARM_LEN : -ARM_LEN)), y: elbowPt.y };
  return { ringPt, elbowPt, endPt, isRight };
}

export default function ContactSection() {
  const section = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const rings = svgRef.current?.querySelectorAll(".hud-ring");
      const arcs = svgRef.current?.querySelectorAll(".hud-arc");
      const connectors = svgRef.current?.querySelectorAll(".elbow-line");
      const dots = svgRef.current?.querySelectorAll(".endpoint");
      const labels = svgRef.current?.querySelectorAll(".node-label");
      const hudDots = svgRef.current?.querySelectorAll(".hud-dot");
      const hudTicks = svgRef.current?.querySelectorAll(".hud-tick");
      const brackets = svgRef.current?.querySelectorAll(".bracket");

      if (!rings || !connectors || !dots || !labels) return;

      rings.forEach((el) => {
        const c = el as SVGCircleElement;
        const len = 2 * Math.PI * parseFloat(c.getAttribute("r") || "0");
        c.style.strokeDasharray = `${len}`;
        c.style.strokeDashoffset = `${len}`;
      });

      arcs?.forEach((el) => {
        const path = el as SVGPathElement;
        const len = path.getTotalLength();
        path.style.strokeDasharray = `${len}`;
        path.style.strokeDashoffset = `${len}`;
      });

      connectors.forEach((el) => {
        const path = el as SVGPolylineElement;
        const len = path.getTotalLength();
        path.style.strokeDasharray = `${len}`;
        path.style.strokeDashoffset = `${len}`;
      });

      const isPhone =
        typeof window !== "undefined" &&
        window.matchMedia("(max-width: 767px)").matches;

      const buildHudTimeline = () => {
        const tl = gsap.timeline({ paused: true });
        tl.to(rings, { strokeDashoffset: 0, duration: 0.25, stagger: 0.04 }, 0);
        if (arcs) tl.to(arcs, { strokeDashoffset: 0, duration: 0.2, stagger: 0.03 }, 0.05);
        if (hudTicks) tl.fromTo(hudTicks, { opacity: 0 }, { opacity: 0.5, duration: 0.1, stagger: 0.005 }, 0.1);
        if (hudDots) tl.fromTo(hudDots, { opacity: 0, scale: 0, transformOrigin: "center" }, { opacity: 1, scale: 1, duration: 0.08, stagger: 0.005 }, 0.15);
        if (brackets) tl.fromTo(brackets, { opacity: 0 }, { opacity: 1, duration: 0.15, stagger: 0.05 }, 0.1);
        tl.to(connectors, { strokeDashoffset: 0, duration: 0.2, stagger: 0.03 }, 0.3);
        tl.fromTo(dots, { scale: 0, transformOrigin: "center" }, { scale: 1, duration: 0.12, stagger: 0.03, ease: "back.out(2)" }, 0.45);
        tl.fromTo(labels, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.12, stagger: 0.03 }, 0.55);
        return tl;
      };

      if (isPhone) {
        const tl = buildHudTimeline();
        ScrollTrigger.create({
          trigger: section.current,
          start: "top 78%",
          once: true,
          onEnter: () => {
            tl.timeScale(1.2).play(0);
          },
        });
      } else {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section.current,
            start: "top 65%",
            end: "top 5%",
            scrub: 1,
          },
        });
        tl.to(rings, { strokeDashoffset: 0, duration: 0.25, stagger: 0.04 }, 0);
        if (arcs) tl.to(arcs, { strokeDashoffset: 0, duration: 0.2, stagger: 0.03 }, 0.05);
        if (hudTicks) tl.fromTo(hudTicks, { opacity: 0 }, { opacity: 0.5, duration: 0.1, stagger: 0.005 }, 0.1);
        if (hudDots) tl.fromTo(hudDots, { opacity: 0, scale: 0, transformOrigin: "center" }, { opacity: 1, scale: 1, duration: 0.08, stagger: 0.005 }, 0.15);
        if (brackets) tl.fromTo(brackets, { opacity: 0 }, { opacity: 1, duration: 0.15, stagger: 0.05 }, 0.1);
        tl.to(connectors, { strokeDashoffset: 0, duration: 0.2, stagger: 0.03 }, 0.3);
        tl.fromTo(dots, { scale: 0, transformOrigin: "center" }, { scale: 1, duration: 0.12, stagger: 0.03, ease: "back.out(2)" }, 0.45);
        tl.fromTo(labels, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.12, stagger: 0.03 }, 0.55);
      }

      gsap.to(svgRef.current, { rotation: 360, duration: 140, ease: "none", repeat: -1, transformOrigin: "center center" });
      gsap.to(".core-pulse", { opacity: 0.9, scale: 1.2, duration: 2.5, ease: "sine.inOut", repeat: -1, yoyo: true, transformOrigin: "center" });
    }, section);

    return () => ctx.revert();
  }, []);

  const tick1 = ticks(60, 24, 6);
  const tick2 = ticks(130, 48, 8);
  const tick3 = ticks(190, 60, 5);
  const dArc1 = dotArc(165, -60, 120, 28);
  const dArc2 = dotArc(210, 100, 310, 32);
  const dArc3 = dotArc(110, 200, 350, 18);

  return (
    <section ref={section} id="contact" className="relative flex min-h-[100dvh] w-full max-w-full flex-col items-center justify-center overflow-x-clip py-16 sm:py-20" style={{ background: "var(--background)" }}>
      <div className="absolute inset-0 bg-grid opacity-8" />

      <p className="text-[10px] tracking-[0.5em] uppercase text-neon/40 mb-10" style={{ fontFamily: "IBM Plex Mono, monospace" }}>Contact</p>

      <div className="relative aspect-square w-full max-w-[min(700px,92vw)] overflow-hidden rounded-sm">
        <svg ref={svgRef} viewBox="0 0 700 700" className="h-full w-full" fill="none">
          {/* Core */}
          <circle className="core-pulse" cx={CX} cy={CY} r={35} fill="rgba(0,212,200,0.1)" />
          <circle cx={CX} cy={CY} r={18} fill="rgba(0,212,200,0.15)" />
          <text x={CX} y={CY + 2} textAnchor="middle" dominantBaseline="middle" fill="var(--teal)" fontSize="13" fontWeight="600" fontFamily="IBM Plex Mono, monospace" letterSpacing="4" opacity="1" style={{ filter: "drop-shadow(0 0 8px rgba(0,212,200,0.6))" }}>CONNECT</text>

          {/* Rings */}
          <circle className="hud-ring" cx={CX} cy={CY} r={45} stroke="var(--teal)" strokeWidth={1.2} strokeOpacity={0.5} />
          <circle className="hud-ring" cx={CX} cy={CY} r={80} stroke="var(--teal)" strokeWidth={0.6} strokeOpacity={0.2} />
          <circle className="hud-ring" cx={CX} cy={CY} r={105} stroke="var(--teal)" strokeWidth={0.8} strokeOpacity={0.3} />
          <circle className="hud-ring" cx={CX} cy={CY} r={130} stroke="var(--teal)" strokeWidth={0.5} strokeOpacity={0.15} strokeDasharray="4 4" />
          <circle className="hud-ring" cx={CX} cy={CY} r={155} stroke="var(--teal)" strokeWidth={1} strokeOpacity={0.35} />
          <circle className="hud-ring" cx={CX} cy={CY} r={190} stroke="var(--teal)" strokeWidth={0.5} strokeOpacity={0.15} />
          <circle className="hud-ring" cx={CX} cy={CY} r={OUTER_R} stroke="var(--teal)" strokeWidth={0.8} strokeOpacity={0.25} />

          {/* Arcs */}
          <path className="hud-arc" d={arc(95, -40, 80)} stroke="var(--teal)" strokeWidth={2} strokeOpacity={0.4} />
          <path className="hud-arc" d={arc(95, 140, 220)} stroke="var(--teal)" strokeWidth={2} strokeOpacity={0.3} />
          <path className="hud-arc" d={arc(145, 20, 160)} stroke="var(--teal)" strokeWidth={1.5} strokeOpacity={0.25} />
          <path className="hud-arc" d={arc(145, 200, 340)} stroke="var(--teal)" strokeWidth={1.5} strokeOpacity={0.2} />
          <path className="hud-arc" d={arc(175, -80, 50)} stroke="var(--teal)" strokeWidth={1} strokeOpacity={0.3} />
          <path className="hud-arc" d={arc(175, 160, 280)} stroke="var(--teal)" strokeWidth={1} strokeOpacity={0.2} />
          <path className="hud-arc" d={arc(240, 30, 130)} stroke="var(--teal)" strokeWidth={0.8} strokeOpacity={0.15} />
          <path className="hud-arc" d={arc(240, 220, 320)} stroke="var(--teal)" strokeWidth={0.8} strokeOpacity={0.15} />

          {/* Ticks */}
          {tick1.map((t, i) => <line key={`t1-${i}`} className="hud-tick" x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="var(--teal)" strokeWidth={0.8} strokeOpacity={0} />)}
          {tick2.map((t, i) => <line key={`t2-${i}`} className="hud-tick" x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="var(--teal)" strokeWidth={0.5} strokeOpacity={0} />)}
          {tick3.map((t, i) => <line key={`t3-${i}`} className="hud-tick" x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="var(--teal)" strokeWidth={0.4} strokeOpacity={0} />)}

          {/* Dot arcs */}
          {dArc1.map((d, i) => <circle key={`d1-${i}`} className="hud-dot" cx={d.x} cy={d.y} r={2.5} fill="var(--teal)" fillOpacity={0.7} />)}
          {dArc2.map((d, i) => <circle key={`d2-${i}`} className="hud-dot" cx={d.x} cy={d.y} r={2} fill="var(--teal)" fillOpacity={0.5} />)}
          {dArc3.map((d, i) => <circle key={`d3-${i}`} className="hud-dot" cx={d.x} cy={d.y} r={1.8} fill="var(--teal)" fillOpacity={0.6} />)}

          {/* Brackets */}
          <g className="bracket"><polyline points="50,80 50,50 80,50" stroke="var(--teal)" strokeWidth={1.5} strokeOpacity={0.4} fill="none" /></g>
          <g className="bracket"><polyline points="620,80 620,50 590,50" stroke="var(--teal)" strokeWidth={1.5} strokeOpacity={0.4} fill="none" /></g>
          <g className="bracket"><polyline points="50,620 50,650 80,650" stroke="var(--teal)" strokeWidth={1.5} strokeOpacity={0.4} fill="none" /></g>
          <g className="bracket"><polyline points="620,620 620,650 590,650" stroke="var(--teal)" strokeWidth={1.5} strokeOpacity={0.4} fill="none" /></g>

          {/* Elbow connectors from outer ring */}
          {contactLinks.map((link) => {
            const { ringPt, elbowPt, endPt } = connectorPath(link.angle);
            return (
              <g key={link.label}>
                {/* Elbow polyline: outer ring → radial extension → horizontal arm */}
                <polyline
                  className="elbow-line"
                  points={`${ringPt.x},${ringPt.y} ${elbowPt.x},${elbowPt.y} ${endPt.x},${endPt.y}`}
                  stroke="var(--teal)"
                  strokeWidth={1}
                  strokeOpacity={0.45}
                  fill="none"
                />
                {/* Small circle at elbow joint */}
                <circle cx={elbowPt.x} cy={elbowPt.y} r={2.5} fill="var(--teal)" fillOpacity={0.5} />
                {/* Endpoint node */}
                <circle className="endpoint" cx={endPt.x} cy={endPt.y} r={6} fill="var(--teal)" fillOpacity={0.8} style={{ filter: "drop-shadow(0 0 6px rgba(0,212,200,0.5))" }} />
                <circle cx={endPt.x} cy={endPt.y} r={10} stroke="var(--teal)" strokeWidth={0.5} strokeOpacity={0.25} fill="none" />
              </g>
            );
          })}
        </svg>

        {/* Labels positioned at connector endpoints */}
        {contactLinks.map((link) => {
          const { endPt, isRight } = connectorPath(link.angle);
          const pctX = R((endPt.x / 700) * 100);
          const pctY = R((endPt.y / 700) * 100);

          return (
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
              className="node-label absolute whitespace-nowrap text-[10px] text-neon/80 opacity-0 transition-colors hover:text-neon sm:text-xs md:text-sm"
              style={{
                fontFamily: "IBM Plex Mono, monospace",
                left: `${pctX}%`,
                top: `${pctY}%`,
                transform: `translate(${isRight ? "16px" : "calc(-100% - 16px)"}, -50%)`,
              }}>
              {link.label}
            </a>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-16 text-center space-y-1" style={{ fontFamily: "IBM Plex Mono, monospace" }}>
        <p className="text-[10px] text-neon/25 tracking-[0.2em]">SYS.VERSION: 1.0.0</p>
        <p className="text-[10px] text-white/20 tracking-[0.15em]">&copy; 2026 JANE DOE &mdash; ALL RIGHTS RESERVED</p>
      </div>
    </section>
  );
}
