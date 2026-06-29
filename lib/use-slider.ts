"use client";

import { useRef, useState, useCallback } from "react";

interface UseSliderOptions {
  slidesCount: number;
  cardWidth: number;
  cardGap: number;
  peek?: number;
}

export function useSlider({
  slidesCount,
  cardWidth,
  cardGap,
  peek = cardWidth,
}: UseSliderOptions) {
  const step = cardWidth + cardGap;
  const maxOffset = step * (slidesCount - 1) - peek;

  const [offset, setOffset] = useState(0);

  const dragStartX = useRef<number | null>(null);
  const dragBaseOffset = useRef(0);

  const clamp = useCallback(
    (val: number) => Math.max(0, Math.min(val, maxOffset)),
    [maxOffset],
  );

  const prev = useCallback(
    () => setOffset((o) => clamp(o - step)),
    [clamp, step],
  );
  const next = useCallback(
    () => setOffset((o) => clamp(o + step)),
    [clamp, step],
  );

  const onMouseDown = (clientX: number) => {
    dragStartX.current = clientX;
    dragBaseOffset.current = offset;
  };
  const onMouseMove = (clientX: number) => {
    if (dragStartX.current === null) return;
    const delta = dragStartX.current - clientX;
    setOffset(clamp(dragBaseOffset.current + delta));
  };
  const onMouseUp = (clientX: number) => {
    if (dragStartX.current === null) return;
    const delta = dragStartX.current - clientX;
    setOffset(
      clamp(Math.round((dragBaseOffset.current + delta) / step) * step),
    );
    dragStartX.current = null;
  };
  const onMouseLeave = () => {
    if (dragStartX.current === null) return;
    setOffset(clamp(Math.round(offset / step) * step));
    dragStartX.current = null;
  };

  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (clientX: number) => {
    touchStartX.current = clientX;
    dragBaseOffset.current = offset;
  };
  const onTouchMove = (clientX: number) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - clientX;
    setOffset(clamp(dragBaseOffset.current + delta));
  };
  const onTouchEnd = (clientX: number) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - clientX;
    setOffset(
      clamp(Math.round((dragBaseOffset.current + delta) / step) * step),
    );
    touchStartX.current = null;
  };

  const isDragging = dragStartX.current !== null;

  return {
    offset,
    prev,
    next,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onMouseLeave,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    isDragging,
    step,
    maxOffset,
  };
}
