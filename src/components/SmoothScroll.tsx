"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const rafCb = useRef<((time: number) => void) | null>(null);

  useEffect(() => {
    let isTouchDevice = false;
    try {
      isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    } catch {
      isTouchDevice = true;
    }
    if (isTouchDevice) {
      try {
        // Reduces pin/layout thrash when the mobile browser chrome resizes the viewport.
        ScrollTrigger.config({ ignoreMobileResize: true });
      } catch {
        /* ignore */
      }
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
      return;
    }

    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      // Let wheel events reach nested overflow:auto regions (hero scanner, modals, etc.)
      allowNestedScroll: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    rafCb.current = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(rafCb.current);
    gsap.ticker.lagSmoothing(0);

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      if (rafCb.current) gsap.ticker.remove(rafCb.current);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
