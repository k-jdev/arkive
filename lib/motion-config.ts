// ── Motion runtime config (motion-foundations skill) ─────────────
// Gate that every animated component must consult before animating.

"use client";

import { useReducedMotion } from "motion/react";

/** Returns true when animations should be disabled entirely. */
export function shouldAnimate(): boolean {
  if (typeof window === "undefined") return true; // SSR: no animation
  return !isReducedMotion();
}

let _reducedCache: boolean | null = null;

function isReducedMotion(): boolean {
  if (_reducedCache !== null) return _reducedCache;
  if (typeof window === "undefined") return false;
  _reducedCache = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return _reducedCache;
}

/**
 * Hook: returns `true` when the user prefers reduced motion.
 * Use this to gate animations — when true, skip transforms, keep opacity-only.
 */
export function usePrefersReducedMotion(): boolean {
  const reduced = useReducedMotion();
  return reduced ?? isReducedMotion();
}

/** Low-end device detection (≤4 logical cores) */
export function isLowEndDevice(): boolean {
  return typeof navigator !== "undefined" && navigator.hardwareConcurrency <= 4;
}
