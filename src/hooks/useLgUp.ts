"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(min-width: 1024px)";

function subscribe(onChange: () => void) {
  try {
    const mq = window.matchMedia(QUERY);
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }
    // Safari fallback (older iOS): MediaQueryList uses addListener/removeListener.
    mq.addListener(onChange);
    return () => mq.removeListener(onChange);
  } catch {
    return () => {};
  }
}

function getSnapshot() {
  try {
    return window.matchMedia(QUERY).matches;
  } catch {
    return false;
  }
}

function getServerSnapshot() {
  return false;
}

/** True when viewport is Tailwind `lg` (1024px) and up. SSR defaults to false (mobile-first). */
export function useLgUp() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

const XL_QUERY = "(min-width: 1280px)";

function subscribeXl(onChange: () => void) {
  try {
    const mq = window.matchMedia(XL_QUERY);
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }
    mq.addListener(onChange);
    return () => mq.removeListener(onChange);
  } catch {
    return () => {};
  }
}

function getSnapshotXl() {
  try {
    return window.matchMedia(XL_QUERY).matches;
  } catch {
    return false;
  }
}

/** True from Tailwind `xl` (1280px). SSR defaults to false. */
export function useXlUp() {
  return useSyncExternalStore(subscribeXl, getSnapshotXl, getServerSnapshot);
}
