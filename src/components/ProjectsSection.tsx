"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
import { projects, type Project } from "@/lib/projects";

function HoloCard({
  project,
  index,
  position,
}: {
  project: Project;
  index: number;
  position: "left" | "center" | "right" | "hidden";
}) {
  const styles: Record<string, React.CSSProperties> = {
    left: {
      transform: "translate(-50%, -50%) translateX(-560px) rotateY(28deg) scale(0.85)",
      opacity: 0.6,
      zIndex: 1,
    },
    center: {
      transform: "translate(-50%, -50%) rotateY(0deg) scale(1)",
      opacity: 1,
      zIndex: 3,
    },
    right: {
      transform: "translate(-50%, -50%) translateX(560px) rotateY(-28deg) scale(0.85)",
      opacity: 0.6,
      zIndex: 1,
    },
    hidden: {
      transform: "translate(-50%, -50%) scale(0.5)",
      opacity: 0,
      zIndex: 0,
      pointerEvents: "none" as const,
    },
  };

  const isSide = position === "left" || position === "right";

  return (
    <div
      className="absolute top-1/2 left-1/2 transition-all duration-500 ease-out"
      style={{
        ...styles[position],
        width: "540px",
        transformStyle: "preserve-3d",
        maskImage: isSide
          ? position === "left"
            ? "linear-gradient(to right, transparent 0%, black 40%)"
            : "linear-gradient(to left, transparent 0%, black 40%)"
          : undefined,
        WebkitMaskImage: isSide
          ? position === "left"
            ? "linear-gradient(to right, transparent 0%, black 40%)"
            : "linear-gradient(to left, transparent 0%, black 40%)"
          : undefined,
      }}
    >
      <div className="holo-card holo-scanlines rounded-lg p-6 lg:p-8 h-[300px] flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon/50 to-transparent" />

        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] tracking-wider text-neon/50" style={{ fontFamily: "IBM Plex Mono, monospace" }}>
              FILE #{String(index + 1).padStart(3, "0")}
            </p>
            <h3 className="text-xl lg:text-2xl font-bold text-white mt-1.5 text-glow" style={{ fontFamily: "Orbitron, sans-serif" }}>
              {project.name}
            </h3>
          </div>
          <div className="w-3 h-3 rounded-full animate-pulse-glow flex-shrink-0" style={{ background: project.color, color: project.color }} />
        </div>

        <p className="text-white/50 text-sm leading-relaxed mt-3">{project.description}</p>

        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {project.tools.map((tool) => (
              <span key={tool} className="px-2 py-0.5 text-[10px] border border-neon/20 rounded-sm text-neon/70 bg-neon/5" style={{ fontFamily: "IBM Plex Mono, monospace" }}>
                {tool}
              </span>
            ))}
          </div>
          <Link href={`/projects/${project.id}`}
            className="inline-flex items-center gap-2 text-xs text-neon hover:text-white transition-colors group whitespace-nowrap flex-shrink-0"
            style={{ fontFamily: "IBM Plex Mono, monospace" }}>
            <span className="inline-block w-4 h-[1px] bg-neon group-hover:w-8 transition-all" />
            VIEW
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-neon">
              <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </Link>
        </div>

        <div className="absolute top-0 left-0 w-5 h-5 border-l border-t border-neon/25" />
        <div className="absolute top-0 right-0 w-5 h-5 border-r border-t border-neon/25" />
        <div className="absolute bottom-0 left-0 w-5 h-5 border-l border-b border-neon/25" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-r border-b border-neon/25" />
      </div>
    </div>
  );
}

export default function ProjectsSection() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const dragStart = useRef(0);
  const dragging = useRef(false);
  const total = projects.length;

  const applyHashTarget = useCallback((hash: string) => {
    const match = hash.match(/^#projects-(.+)$/);
    if (!match) return;
    const targetId = decodeURIComponent(match[1]);
    const idx = projects.findIndex((p) => p.id === targetId);
    if (idx >= 0) setCurrent(idx);
  }, []);

  const getPosition = useCallback(
    (index: number): "left" | "center" | "right" | "hidden" => {
      const diff = ((index - current) % total + total) % total;
      if (diff === 0) return "center";
      if (diff === 1 || (diff === total - 1 && total <= 2)) return "right";
      if (diff === total - 1) return "left";
      return "hidden";
    },
    [current, total]
  );

  const navigate = useCallback((dir: 1 | -1) => {
    setCurrent((c) => ((c + dir) % total + total) % total);
  }, [total]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragStart.current = e.clientX;
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    dragging.current = false;
    const delta = e.clientX - dragStart.current;
    if (Math.abs(delta) > 60) navigate(delta < 0 ? 1 : -1);
  }, [navigate]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(stage.current, {
        opacity: 0,
        scale: 0.95,
        y: 20,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section.current,
          start: "top 100%",
          end: "top 90%",
          scrub: 0.3,
        },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    applyHashTarget(window.location.hash);
    const onHash = () => applyHashTarget(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [applyHashTarget]);

  return (
    <section
      ref={section}
      id="projects"
      className="relative w-full flex flex-col items-center overflow-hidden"
      style={{ background: "var(--background)", paddingTop: "12px", paddingBottom: "80px" }}
    >
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(0,212,200,0.03) 0%, transparent 60%)" }} />

      <div className="text-center mb-10">
        <p className="text-[10px] tracking-[0.3em] uppercase text-neon/40 mb-3" style={{ fontFamily: "IBM Plex Mono, monospace" }}>— Project Archives —</p>
        <h2 className="text-3xl lg:text-5xl font-bold text-white text-glow mb-3" style={{ fontFamily: "Orbitron, sans-serif" }}>Holographic Display</h2>
        <p className="text-white/30 text-sm">Drag or use arrows to navigate</p>
      </div>

      <div ref={stage} className="relative w-full h-[360px] cursor-grab active:cursor-grabbing select-none" style={{ perspective: "1200px" }}
        onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
        {projects.map((project, i) => (
          <HoloCard key={project.id} project={project} index={i} position={getPosition(i)} />
        ))}
      </div>

      <div className="flex items-center gap-3 mt-6">
        {projects.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} aria-label={`Go to project ${i + 1}`}>
            <div className="w-2 h-2 rounded-full transition-all duration-300" style={{
              background: i === current ? "var(--teal)" : "rgba(255,255,255,0.15)",
              boxShadow: i === current ? "0 0 10px rgba(0,212,200,0.5)" : "none",
              transform: i === current ? "scale(1.5)" : "scale(1)",
            }} />
          </button>
        ))}
      </div>

      <button onClick={() => navigate(-1)} className="absolute left-8 top-1/2 -translate-y-1/2 text-neon/30 hover:text-neon transition-colors text-3xl" style={{ fontFamily: "monospace" }}>&#x2039;</button>
      <button onClick={() => navigate(1)} className="absolute right-8 top-1/2 -translate-y-1/2 text-neon/30 hover:text-neon transition-colors text-3xl" style={{ fontFamily: "monospace" }}>&#x203a;</button>

      <div className="absolute top-14 left-6 space-y-1 hidden lg:block" style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: "10px", color: "rgba(0,212,200,0.25)" }}>
        <p>PROJ.DB: ACTIVE</p>
        <p>ENTRIES: {projects.length}</p>
        <p>VIEW: HOLOGRAPHIC</p>
      </div>
    </section>
  );
}
