"use client";

import { useCallback } from "react";

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
  const handleClick = useCallback((link: NavLink) => {
    if (link.scrollToScanComplete) {
      const target = 0.80 * 2.0 * window.innerHeight;
      window.scrollTo({ top: target, behavior: "smooth" });
    } else {
      const el = document.querySelector(link.href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 pointer-events-none">
      <div className="pointer-events-auto flex flex-col gap-1.5">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
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
            className="text-[8px] tracking-[0.32em] text-neon/50 sm:text-[9px]"
            style={{ fontFamily: "IBM Plex Mono, monospace" }}
          >
            SYSTEM ONLINE
          </span>
        </div>
      </div>

      <div className="flex items-center gap-8 pointer-events-auto">
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
  );
}
