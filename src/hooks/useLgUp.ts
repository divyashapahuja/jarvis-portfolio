"use client";

import { useLayoutEffect, useState } from "react";

const QUERY = "(min-width: 1024px)";

function listenMq(mq: MediaQueryList, fn: () => void) {
  if (typeof mq.addEventListener === "function") {
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }
  mq.addListener(fn);
  return () => mq.removeListener(fn);
}

/** True when viewport is Tailwind `lg` (1024px) and up. SSR defaults to false (mobile-first). */
export function useLgUp() {
  const [lgUp, setLgUp] = useState(false);

  useLayoutEffect(() => {
    let mq: MediaQueryList;
    try {
      mq = window.matchMedia(QUERY);
    } catch {
      return;
    }
    const apply = () => {
      try {
        setLgUp(mq.matches);
      } catch {
        setLgUp(false);
      }
    };
    apply();
    return listenMq(mq, apply);
  }, []);

  return lgUp;
}

const XL_QUERY = "(min-width: 1280px)";

/** True from Tailwind `xl` (1280px). SSR defaults to false. */
export function useXlUp() {
  const [xlUp, setXlUp] = useState(false);

  useLayoutEffect(() => {
    let mq: MediaQueryList;
    try {
      mq = window.matchMedia(XL_QUERY);
    } catch {
      return;
    }
    const apply = () => {
      try {
        setXlUp(mq.matches);
      } catch {
        setXlUp(false);
      }
    };
    apply();
    return listenMq(mq, apply);
  }, []);

  return xlUp;
}
