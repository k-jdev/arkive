"use client";

import { useReducedMotion } from "motion/react";

export function shouldAnimate(): boolean {
  if (typeof window === "undefined") return true;
  return !isReducedMotion();
}

let _reducedCache: boolean | null = null;

function isReducedMotion(): boolean {
  if (_reducedCache !== null) return _reducedCache;
  if (typeof window === "undefined") return false;
  _reducedCache = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return _reducedCache;
}

export function usePrefersReducedMotion(): boolean {
  const reduced = useReducedMotion();
  return reduced ?? isReducedMotion();
}

export function isLowEndDevice(): boolean {
  return typeof navigator !== "undefined" && navigator.hardwareConcurrency <= 4;
}
