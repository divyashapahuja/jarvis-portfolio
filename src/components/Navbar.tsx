"use client";

import { useCallback } from "react";

const LINKS = [
  { label: "About", href: "#scanner", scrollToScanComplete: true },
  { label: "Projects", href: "#projects", scrollToScanComplete: false },
  { label: "Contact", href: "#contact", scrollToScanComplete: false },
];

type NavLink = (typeof LINKS)[number];

export default function Navbar() {
  const handleClick = useCallback((link: NavLink) => {
    if (link.scrollToScanComplete) {
      const target = 0.84 * 2.8 * window.innerHeight;
      window.scrollTo({ top: target, behavior: "smooth" });
    } else {
      const el = document.querySelector(link.href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 pointer-events-none">
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="pointer-events-auto font-[Orbitron] text-xs tracking-[0.25em] text-neon/70 hover:text-neon transition-colors"
      >
        J.DOE
      </a>

      <div className="flex items-center gap-8 pointer-events-auto">
        {LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={(e) => {
              e.preventDefault();
              handleClick(link);
            }}
            className="font-[IBM_Plex_Mono] text-[11px] tracking-[0.2em] uppercase text-white/40 hover:text-neon transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
