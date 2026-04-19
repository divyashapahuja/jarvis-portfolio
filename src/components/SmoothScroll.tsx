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
    let coarse = false;
    try {
      coarse = window.matchMedia("(pointer: coarse)").matches;
    } catch {
      coarse = true;
    }

    if (coarse) {
      try {
        ScrollTrigger.config({ ignoreMobileResize: true });
      } catch {
        /* ignore */
      }
    }

    const lenis = new Lenis({
      lerp: coarse ? 0.14 : 0.09,
      smoothWheel: true,
      allowNestedScroll: true,
      ...(coarse ? { syncTouch: true, syncTouchLerp: 0.12, touchMultiplier: 0.85 } : {}),
    });

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value?: number) {
        if (arguments.length) {
          const v = Number(value);
          if (!Number.isNaN(v)) lenis.scrollTo(v, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
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
      try {
        ScrollTrigger.scrollerProxy(document.documentElement);
        ScrollTrigger.refresh();
      } catch {
        /* ignore */
      }
    };
  }, []);

  return <>{children}</>;
}
