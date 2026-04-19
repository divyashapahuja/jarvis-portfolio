"use client";

import { useCallback, useEffect, useState } from "react";

const LINKS = [
  {
    label: "About",
    href: "#scanner",
    scrollToScanComplete: true,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    ),
  },
  {
    label: "Projects",
    href: "#projects",
    scrollToScanComplete: false,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
      </svg>
    ),
  },
  {
    label: "Experience",
    href: "#experience",
    scrollToScanComplete: false,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
      </svg>
    ),
  },
  {
    label: "Education",
    href: "#education",
    scrollToScanComplete: false,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" />
        <path d="M6 12v5c0 3 3.5 5 8 5s8-2 8-5v-5" />
      </svg>
    ),
  },
  {
    label: "Contact",
    href: "#contact",
    scrollToScanComplete: false,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <path d="M22 6l-10 7L2 6" />
      </svg>
    ),
  },
];

type NavLink = (typeof LINKS)[number];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const handleClick = useCallback((link: NavLink) => {
    if (link.scrollToScanComplete) {
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      if (isDesktop) {
        const target = 0.80 * 2.0 * window.innerHeight;
        window.scrollTo({ top: target, behavior: "smooth" });
      } else {
        const el = document.querySelector(link.href);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      const el = document.querySelector(link.href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  }, []);

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-[80] flex items-center justify-between px-4 pb-3 pt-[max(0.9rem,env(safe-area-inset-top))] sm:px-8 sm:pb-4 sm:pt-5 pointer-events-none">
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/75 via-black/45 to-transparent backdrop-blur-[2px]"
          aria-hidden
        />
        <div className="pointer-events-auto flex flex-col gap-1.5 min-w-0">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
              setMenuOpen(false);
            }}
            className="font-[Orbitron] text-xs tracking-[0.25em] text-neon/70 hover:text-neon transition-colors"
          >
            J.DOE
          </a>
          <div className="flex items-center gap-2" aria-live="polite" aria-label="System online">
            <span
              className="hud-blink h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: "var(--teal)", boxShadow: "0 0 8px rgba(0,212,200,0.65)" }}
            />
            <span
              className="text-[8px] tracking-[0.32em] text-neon/50 sm:text-[9px] truncate"
              style={{ fontFamily: "IBM Plex Mono, monospace" }}
            >
              SYSTEM ONLINE
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="lg:hidden pointer-events-auto rounded-md border border-neon/25 p-2.5 text-neon hover:bg-neon/10 transition-colors"
          aria-expanded={menuOpen}
          aria-label="Open navigation menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
          </svg>
        </button>

        <div className="hidden lg:flex items-center gap-6 xl:gap-8 pointer-events-auto">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleClick(link);
              }}
              className="group inline-flex items-center gap-1.5 font-[IBM_Plex_Mono] text-[11px] tracking-[0.2em] uppercase text-white/40 hover:text-neon transition-colors"
            >
              <span className="text-neon/50 group-hover:text-neon transition-colors shrink-0">{link.icon}</span>
              {link.label}
            </a>
          ))}
        </div>
      </nav>

      {menuOpen ? (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Site navigation">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <div
            className="absolute top-0 right-0 flex h-full w-[min(100%,320px)] flex-col border-l border-neon/20 bg-[rgba(5,5,8,0.98)] shadow-[0_0_40px_rgba(0,212,200,0.08)]"
            style={{ paddingTop: "max(1.25rem, env(safe-area-inset-top))" }}
          >
            <div className="flex items-center justify-between border-b border-neon/10 px-4 py-3">
              <span className="text-[10px] tracking-[0.3em] text-neon/50" style={{ fontFamily: "IBM Plex Mono, monospace" }}>
                NAV
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="rounded-md p-2 text-neon/70 hover:text-neon hover:bg-neon/10"
                aria-label="Close menu"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col gap-1 p-4">
              {LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleClick(link);
                  }}
                  className="flex items-center gap-3 rounded-md px-3 py-3 text-sm tracking-[0.15em] uppercase text-white/70 hover:bg-neon/10 hover:text-neon transition-colors"
                  style={{ fontFamily: "IBM Plex Mono, monospace" }}
                >
                  <span className="text-neon/60">{link.icon}</span>
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}
