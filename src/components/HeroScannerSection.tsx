"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { portfolioProfile } from "@/lib/projects";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const BIO = {
  name: portfolioProfile.name,
  location: portfolioProfile.location,
  skills: [...portfolioProfile.skills],
  about: portfolioProfile.about,
};

const CIRCLE_R = 34;
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_R;

function FolderIcon() {
  return (
    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M1 2.5V8.5C1 9.05 1.45 9.5 2 9.5H10C10.55 9.5 11 9.05 11 8.5V3.5C11 2.95 10.55 2.5 10 2.5H6L5 1H2C1.45 1 1 1.45 1 2V2.5Z" />
    </svg>
  );
}

interface BioCardProps {
  label: string;
  side: "left" | "right";
  children: React.ReactNode;
}

function BioCard({
  label,
  side,
  children,
  innerRef,
  className = "",
}: BioCardProps & { innerRef: React.Ref<HTMLDivElement>; className?: string }) {
  return (
    <div ref={innerRef} className={`relative ${className}`}>
      <div className="folder-tab">
        <FolderIcon />
        <span>{label}</span>
      </div>
      <div className="folder-body">{children}</div>
      <div className={`connector ${side === "left" ? "connector-left" : "connector-right"} hidden xl:block`} />
      <div
        className={`connector-dot ${side === "left" ? "connector-dot-end-left" : "connector-dot-end-right"} hidden xl:block`}
      />
    </div>
  );
}

export default function HeroScannerSection() {
  const section = useRef<HTMLElement>(null);
  const heroContent = useRef<HTMLDivElement>(null);
  const deskWrap = useRef<HTMLDivElement>(null);
  const deskScale = useRef<HTMLDivElement>(null);
  const scannerWrap = useRef<HTMLDivElement>(null);
  const scannerColumnRef = useRef<HTMLDivElement>(null);
  const scanLine = useRef<HTMLDivElement>(null);
  const flash = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const circleProgress = useRef<SVGCircleElement>(null);
  const scanComplete = useRef<HTMLDivElement>(null);
  const nameEl = useRef<HTMLDivElement>(null);
  const locEl = useRef<HTMLDivElement>(null);
  const skillsEl = useRef<HTMLDivElement>(null);
  const aboutEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Suppress ResizeObserver loop errors that crash Android Chrome when GSAP
    // ScrollTrigger mutates the DOM inside a ResizeObserver callback.
    const resizeHandler = (e: ErrorEvent) => {
      if (e.message?.includes("ResizeObserver")) {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    };
    window.addEventListener("error", resizeHandler);

    let rafId: number;
    let ctx: ReturnType<typeof gsap.context>;

    // Double RAF ensures browser has completed layout/paint before GSAP measures anything.
    rafId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ScrollTrigger.config({ ignoreMobileResize: true });
        ctx = gsap.context(() => {
      const lgUp = window.matchMedia("(min-width: 1024px)").matches;

      // Mobile: short pinned scroll-driven transition (hero -> scanner) so it stays in-view.
      if (!lgUp) {
        gsap.set(heroContent.current, { opacity: 1, y: 0 });
        gsap.set(deskWrap.current, { opacity: 1 });
        gsap.set(scannerWrap.current, { opacity: 0 });
        gsap.set(scannerColumnRef.current, { opacity: 1 });
        gsap.set(flash.current, { opacity: 0 });
        gsap.set(scanLine.current, { top: "100%" });
        gsap.set(counter.current, { textContent: "0" });
        if (circleProgress.current) gsap.set(circleProgress.current, { strokeDashoffset: CIRCUMFERENCE });
        const bioRefsMobile = [nameEl.current, locEl.current, skillsEl.current, aboutEl.current].filter(Boolean);
        if (bioRefsMobile.length) gsap.set(bioRefsMobile, { opacity: 1, x: 0 });
        // Bio folder tweens are not scrubbed on mobile: unpinned ST often never reached the old reveal
        // window (opacity stayed 0), and overflow-y-auto on this layer clipped folders below the fold.
        const mobileTl = gsap.timeline({
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: "+=132%",
            // Pinning the hero + opening a fixed full-screen layer reliably crashes Android Chrome
            // ("The page couldn't load"). Scrub the same timeline without pin — scroll drives progress.
            pin: false,
            scrub: 0.72,
          },
        });

        // Crossfade hero → scanner (opacity only — no layout offset).
        mobileTl.to(heroContent.current, { opacity: 0, duration: 0.26, ease: "power2.inOut" }, 0.05);
        mobileTl.to(deskWrap.current, { opacity: 0, duration: 0.28, ease: "power2.inOut" }, "<0.06");
        mobileTl.to(scannerWrap.current, { opacity: 1, duration: 0.32, ease: "power2.out" }, "<0.14");
        mobileTl.to(flash.current, { opacity: 0.14, duration: 0.08, ease: "sine.out" }, 0.18);
        mobileTl.to(flash.current, { opacity: 0, duration: 0.16, ease: "sine.in" }, 0.24);
        mobileTl.fromTo(scanLine.current, { top: "100%" }, { top: "0%", duration: 0.58, ease: "power1.inOut" }, 0.26);
        mobileTl.fromTo(counter.current, { textContent: "0" }, { textContent: "100", snap: { textContent: 1 }, duration: 0.58, ease: "power1.inOut" }, 0.26);
        if (circleProgress.current) {
          mobileTl.fromTo(
            circleProgress.current,
            { strokeDashoffset: CIRCUMFERENCE },
            { strokeDashoffset: 0, duration: 0.58, ease: "power1.inOut" },
            0.26,
          );
        }
        let t = 0.46;

        // Skills scatter on mobile — fan out toward three panel positions then fade
        const mobileSpread = Math.max(80, Math.floor(window.innerWidth * 0.28));
        const mobilePanelOffsets = [
          { dx: -mobileSpread, dy: 40 },
          { dx: 0, dy: 55 },
          { dx: mobileSpread, dy: 40 },
        ];
        const mobileTags = section.current?.querySelectorAll(".skill-tag");
        if (mobileTags) {
          mobileTags.forEach((tag, idx) => {
            const target = mobilePanelOffsets[idx % mobilePanelOffsets.length];
            mobileTl.to(
              tag,
              { x: target.dx, y: target.dy, opacity: 0, scale: 0.2, duration: 0.08, ease: "power2.in" },
              t + idx * 0.003,
            );
          });
        }

        // Fade the scanner column out once scatter completes
        if (scannerColumnRef.current) {
          mobileTl.to(scannerColumnRef.current, { opacity: 0, duration: 0.06, ease: "none" }, t + 0.12);
        }

        return;
      }

      const pinEnd = lgUp ? "+=200%" : "+=180%";

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: pinEnd,
          pin: lgUp,
          scrub: 0.5,
          anticipatePin: 1,
        },
      });

      const bioRefs = [nameEl.current, locEl.current, skillsEl.current, aboutEl.current].filter(Boolean);
      if (bioRefs.length) gsap.set(bioRefs, { opacity: lgUp ? 0 : 1, x: 0 });

      // Hero text fades out (gentle — no vertical offset).
      tl.to(heroContent.current, { opacity: 0, duration: 0.12, ease: "power2.inOut" }, 0.04);
      // Desk slowly zooms
      tl.to(deskScale.current, { scale: 1.25, ease: "power1.out", duration: 0.18 }, 0);

      // Glitch effect
      tl.to(deskScale.current, { x: -6, filter: "hue-rotate(90deg) brightness(1.5)", duration: 0.012 }, 0.18)
        .to(deskScale.current, { x: 5, y: -3, filter: "hue-rotate(200deg) brightness(2)", duration: 0.012 })
        .to(deskScale.current, { x: -3, y: 4, filter: "hue-rotate(300deg) brightness(0.5)", duration: 0.012 })
        .to(deskScale.current, { x: 0, y: 0, filter: "none", duration: 0.008 });

      // Flash + crossfade
      tl.to(flash.current, { opacity: 0.38, duration: 0.05, ease: "sine.out" }, 0.20);
      tl.to(flash.current, { opacity: 0, duration: 0.1, ease: "sine.in" }, 0.24);
      tl.to(deskWrap.current, { opacity: 0, duration: 0.1, ease: "power2.inOut" }, 0.20);
      tl.to(scannerWrap.current, { opacity: 1, duration: 0.12, ease: "power2.out" }, 0.22);

      // Scanner scan line sweeps upward
      tl.fromTo(scanLine.current, { top: "100%" }, { top: "0%", ease: "power1.inOut", duration: 0.50 }, 0.28);
      tl.fromTo(counter.current, { textContent: "0" }, { textContent: "100", snap: { textContent: 1 }, ease: "power1.inOut", duration: 0.50 }, 0.28);

      if (circleProgress.current) {
        tl.fromTo(circleProgress.current,
          { strokeDashoffset: CIRCUMFERENCE },
          { strokeDashoffset: 0, ease: "power1.inOut", duration: 0.50 },
          0.28
        );
      }

      // Bio reveals (desktop). On mobile we keep cards visible to avoid vanishing content.
      if (lgUp) {
        const revealBio = (el: HTMLDivElement | null, fromX: number, at: number) => {
          if (!el) return;
          tl.fromTo(el, { opacity: 0, x: fromX }, { opacity: 1, x: 0, duration: 0.06, ease: "power2.out" }, at);
        };
        revealBio(nameEl.current, -30, 0.355);
        revealBio(locEl.current, 30, 0.48);
        revealBio(skillsEl.current, -30, 0.605);
        revealBio(aboutEl.current, 30, 0.705);
      }

      // Scan complete flash
      const sc = scanComplete.current;
      tl.to(sc, { opacity: 1, duration: 0.008 }, 0.80);
      tl.to(sc, { opacity: 0, duration: 0.008 }, 0.81);
      tl.to(sc, { opacity: 1, duration: 0.008 }, 0.82);
      tl.to(sc, { opacity: 0, duration: 0.008 }, 0.83);
      tl.to(sc, { opacity: 1, duration: 0.008 }, 0.84);

      // Skills scatter toward project panels.
      const spread = lgUp ? 560 : Math.max(120, Math.floor(window.innerWidth * 0.35));
      const panelOffsets = lgUp
        ? [
            { dx: -spread, dy: 80 },
            { dx: 0, dy: 80 },
            { dx: spread, dy: 80 },
          ]
        : [
            { dx: -spread, dy: 48 },
            { dx: 0, dy: 56 },
            { dx: spread, dy: 48 },
          ];
      const tags = section.current?.querySelectorAll(".skill-tag");
      if (tags) {
        tags.forEach((tag, i) => {
          const target = panelOffsets[i % panelOffsets.length];
          const rect = tag.getBoundingClientRect();
          const cx = window.innerWidth / 2;
          const cy = window.innerHeight / 2;
          tl.to(
            tag,
            {
              x: cx + target.dx - rect.left - rect.width / 2,
              y: cy + target.dy - rect.top,
              opacity: 0,
              scale: 0.15,
              duration: 0.10,
              ease: "power2.in",
            },
            0.87 + i * 0.004,
          );
        });
      }

      // Fade scanner column only (image + HUD); bio cards stay visible for stacked/mobile layout
      const scanCol = scannerColumnRef.current;
      if (scanCol && lgUp) {
        tl.to(scanCol, { opacity: 0, duration: 0.08, ease: "none" }, 0.92);
      }
    }, section);
      }); // end inner RAF
    }); // end outer RAF

    return () => {
      cancelAnimationFrame(rafId);
      ctx?.revert();
      window.removeEventListener("error", resizeHandler);
    };
  }, []);

  return (
    <section
      ref={section}
      id="hero"
      className="relative h-[100svh] w-full max-w-full overflow-x-hidden max-lg:overflow-y-visible lg:overflow-y-hidden lg:h-[100dvh] lg:min-h-[100svh] xl:overflow-x-visible"
      style={{ background: "var(--background)" }}
    >
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 50%, rgba(0,212,200,0.04) 0%, transparent 55%)" }} />
      <div className="absolute inset-0 overflow-hidden opacity-15 pointer-events-none"><div className="mesh-rotate" /></div>

      {/* Flash overlay */}
      <div ref={flash} className="absolute inset-0 z-30 pointer-events-none opacity-0" style={{ background: "radial-gradient(circle, rgba(0,212,200,0.8) 0%, #050508 80%)" }} />

      {/* Hero content */}
      <div
        ref={heroContent}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none px-4 pb-32 max-lg:-translate-y-[10svh] max-lg:pb-10 sm:pb-40 lg:translate-y-0 lg:pb-[280px]"
      >
        <p className="text-[10px] tracking-[0.5em] uppercase text-neon/50 mb-4" style={{ fontFamily: "IBM Plex Mono, monospace" }}>Portfolio</p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-glow tracking-wider text-center" style={{ fontFamily: "Orbitron, sans-serif" }}>JANE DOE</h1>
        <p className="mt-3 text-xs sm:text-sm tracking-[0.3em] uppercase text-neon/60 text-center" style={{ fontFamily: "IBM Plex Mono, monospace" }}>Full Stack Developer</p>
      </div>

      {/* Desk image */}
      <div ref={deskWrap} className="absolute inset-0 z-10 flex items-end justify-center pb-6 max-lg:-translate-y-[10svh] max-lg:items-center max-lg:pb-28 sm:pb-10 lg:translate-y-0 lg:items-end lg:pb-6">
        <div className="animate-float">
          <div ref={deskScale}>
            <Image
              src="/desk.png"
              alt="Character working at desk"
              width={480}
              height={480}
              priority
              sizes="(max-width: 1023px) 72vw, 480px"
              className="h-auto w-[min(72vw,260px)] select-none sm:w-[min(80vw,380px)] lg:w-[480px]"
              draggable={false}
            />
          </div>
        </div>
      </div>

      {/* Scanner container */}
      <div
        ref={scannerWrap}
        id="scanner"
        className="pointer-events-none absolute inset-0 z-20 flex max-xl:min-h-0 max-xl:overscroll-contain items-center justify-center overflow-x-hidden opacity-0 max-lg:items-start max-lg:justify-center max-lg:overflow-y-visible max-lg:px-3 lg:overflow-y-auto xl:overflow-x-visible xl:overflow-y-visible"
      >
        <div className="relative flex w-full min-w-0 max-w-full flex-col items-center px-3 pb-4 pt-1 sm:px-4 sm:pb-8 max-lg:pt-[max(1.25rem,calc(env(safe-area-inset-top,12px)+6.5rem))] max-lg:pb-8 xl:absolute xl:inset-0 xl:max-w-none xl:justify-center xl:overflow-visible xl:pb-0 xl:pt-0 xl:px-0">
          <div
            ref={scannerColumnRef}
            className="relative w-full max-w-[380px] shrink-0 max-lg:mt-[min(44vh,20rem)] lg:mt-0 lg:pb-40 xl:absolute xl:left-1/2 xl:top-1/2 xl:max-w-none xl:w-auto xl:-translate-x-1/2 xl:-translate-y-1/2 xl:pb-0"
          >
            <div className="relative w-full max-lg:max-w-[260px] max-lg:mx-auto">
              <Image
                src="/scanner.png"
                alt="Character being scanned"
                width={520}
                height={680}
                sizes="(max-width: 1023px) 90vw, 520px"
                className="h-auto w-full max-w-full select-none xl:w-[520px]"
                draggable={false}
              />
              <div
                ref={scanLine}
                className="absolute left-0 right-0 z-10 h-[3px] pointer-events-none"
                style={{
                  top: "100%",
                  background: "linear-gradient(90deg, transparent 0%, var(--teal) 20%, var(--teal) 80%, transparent 100%)",
                  boxShadow: "var(--teal-glow-strong)",
                }}
              />
            </div>

            {/* Scan complete */}
            <div
              ref={scanComplete}
              className="pointer-events-none absolute bottom-[-26px] left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 opacity-0 sm:bottom-[-30px] sm:gap-3"
            >
              <div className="hud-blink h-2 w-2 shrink-0 rounded-full sm:h-2.5 sm:w-2.5" style={{ background: "var(--teal)", boxShadow: "0 0 10px var(--teal)" }} />
              <p
                className="whitespace-nowrap text-xs font-semibold tracking-[0.15em] sm:text-base sm:tracking-[0.2em]"
                style={{ fontFamily: "IBM Plex Mono, monospace", color: "var(--teal)" }}
              >
                SCAN COMPLETE
              </p>
              <div className="hud-blink h-2 w-2 shrink-0 rounded-full sm:h-2.5 sm:w-2.5" style={{ background: "var(--teal)", boxShadow: "0 0 10px var(--teal)" }} />
            </div>

            {/* Circular scan gauge */}
            <div className="absolute bottom-[-84px] left-1/2 -translate-x-1/2 sm:bottom-[-120px] max-lg:static max-lg:mt-3 max-lg:w-full max-lg:flex max-lg:justify-center max-lg:translate-x-0">
              <div className="relative" style={{ width: 90, height: 90 }}>
                <svg width="90" height="90" viewBox="0 0 90 90" className="absolute inset-0">
                  <circle cx="45" cy="45" r={CIRCLE_R + 8} stroke="rgba(0,212,200,0.06)" strokeWidth="1" fill="none" />
                  {Array.from({ length: 36 }, (_, i) => {
                    const angle = (i * 10 * Math.PI) / 180;
                    const isLong = i % 9 === 0;
                    const r1 = CIRCLE_R + (isLong ? 3 : 1);
                    const r2 = CIRCLE_R + (isLong ? 7 : 4);
                    const R = (n: number) => Math.round(n * 1e4) / 1e4;
                    return (
                      <line key={i}
                        x1={R(45 + r1 * Math.cos(angle - Math.PI / 2))}
                        y1={R(45 + r1 * Math.sin(angle - Math.PI / 2))}
                        x2={R(45 + r2 * Math.cos(angle - Math.PI / 2))}
                        y2={R(45 + r2 * Math.sin(angle - Math.PI / 2))}
                        stroke="var(--teal)" strokeWidth={isLong ? 1 : 0.5} strokeOpacity={isLong ? 0.4 : 0.15}
                      />
                    );
                  })}
                  <circle cx="45" cy="45" r={CIRCLE_R} stroke="rgba(0,212,200,0.1)" strokeWidth="2" fill="none" />
                  <circle
                    ref={circleProgress}
                    cx="45" cy="45" r={CIRCLE_R}
                    stroke="var(--teal)"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    transform="rotate(-90 45 45)"
                    style={{ strokeDasharray: CIRCUMFERENCE, strokeDashoffset: CIRCUMFERENCE, filter: "drop-shadow(0 0 4px rgba(0,212,200,0.5))" }}
                  />
                  <circle cx="45" cy="45" r={CIRCLE_R - 10} fill="rgba(0,212,200,0.02)" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-baseline gap-0.5">
                    <span ref={counter} className="text-lg font-bold text-neon" style={{ fontFamily: "Orbitron, sans-serif" }}>0</span>
                    <span className="text-[10px] text-neon/50" style={{ fontFamily: "Orbitron, sans-serif" }}>%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bio cards — column below ~1280px; orbit HUD only on xl+ (avoids clipping inside overflow-hidden hero) */}
          <div className="relative z-30 flex flex-col gap-3 w-full max-w-md mt-8 max-lg:grid max-lg:grid-cols-2 max-lg:gap-2 max-lg:mt-3 max-lg:pb-2 sm:max-w-lg max-xl:mt-8 xl:absolute xl:inset-0 xl:mt-0 xl:max-w-none xl:min-h-0 xl:pointer-events-none">
            {/* xl+: anchor HUD to viewport center so cards stay in-frame on laptops (old negative left/right sat off-screen) */}
            <div className="w-full xl:pointer-events-auto xl:absolute xl:bottom-[12%] xl:left-[max(0.75rem,calc(50%-31rem))] xl:w-auto xl:max-w-[min(16rem,42vw)]">
              <BioCard label="Name" side="left" innerRef={nameEl}>
                <p className="text-white max-lg:text-sm" style={{ fontFamily: "Orbitron, sans-serif", fontSize: "1.2rem" }}>{BIO.name}</p>
              </BioCard>
            </div>

            <div className="w-full xl:pointer-events-auto xl:absolute xl:bottom-[34%] xl:right-[max(0.75rem,calc(50%-31rem))] xl:w-auto xl:max-w-[min(16rem,42vw)]">
              <BioCard label="Location" side="right" innerRef={locEl}>
                <p className="text-white max-lg:text-sm" style={{ fontFamily: "Orbitron, sans-serif", fontSize: "1.2rem" }}>{BIO.location}</p>
              </BioCard>
            </div>

            <div className="w-full xl:pointer-events-auto xl:absolute xl:bottom-[52%] xl:left-[max(0.75rem,calc(50%-33rem))] xl:w-auto xl:max-w-[min(18rem,44vw)]">
              <BioCard label="Skills" side="left" innerRef={skillsEl}>
                <div className="flex flex-wrap gap-1 sm:max-w-[240px] lg:max-w-[200px] xl:max-w-none">
                  {BIO.skills.map((s) => (
                    <span key={s} className="skill-tag rounded border border-neon/20 bg-neon/5 px-1.5 py-0.5 text-[10px] text-neon/80" style={{ fontFamily: "IBM Plex Mono, monospace" }}>{s}</span>
                  ))}
                </div>
              </BioCard>
            </div>

            <div className="w-full xl:pointer-events-auto xl:absolute xl:bottom-[70%] xl:right-[max(0.75rem,calc(50%-33rem))] xl:w-auto xl:max-w-[min(18rem,44vw)]">
              <BioCard label="About" side="right" innerRef={aboutEl}>
                <p className="leading-relaxed text-white/80 max-lg:text-[0.75rem] sm:max-w-[260px] lg:max-w-[200px] xl:max-w-none" style={{ fontFamily: "Orbitron, sans-serif", fontSize: "1rem" }}>{BIO.about}</p>
              </BioCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
