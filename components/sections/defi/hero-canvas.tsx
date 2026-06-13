"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import p5 from "p5";

// ── Pattern matrices ──────────────────────────────────────────

const BW: number[][][] = [
  [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [1, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [1, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 0],
  ],
  [
    [1, 0, 0, 0],
    [0, 0, 1, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 1],
  ],
  [
    [1, 0, 1, 0],
    [0, 0, 0, 0],
    [0, 1, 0, 1],
    [1, 0, 0, 0],
  ],
  [
    [1, 0, 1, 0],
    [0, 1, 0, 1],
    [1, 0, 1, 0],
    [0, 1, 0, 1],
  ],
  [
    [1, 1, 0, 1],
    [1, 0, 1, 1],
    [0, 1, 1, 0],
    [1, 1, 0, 1],
  ],
  [
    [1, 1, 1, 0],
    [1, 0, 1, 1],
    [1, 1, 0, 1],
    [0, 1, 1, 1],
  ],
  [
    [1, 1, 1, 1],
    [1, 0, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 0, 1],
  ],
  [
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
  ],
];

const BLUE_PAT: number[][][] = [
  [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [0, 0, 1, 0],
    [0, 0, 0, 0],
    [1, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [0, 0, 1, 0],
    [1, 0, 0, 0],
    [0, 0, 0, 0],
    [1, 0, 0, 0],
  ],
  [
    [0, 1, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [0, 0, 0, 1],
  ],
  [
    [0, 1, 0, 1],
    [1, 0, 1, 0],
    [0, 1, 0, 1],
    [1, 0, 1, 0],
  ],
  [
    [0, 0, 1, 0],
    [0, 1, 0, 0],
    [1, 0, 0, 1],
    [0, 0, 1, 0],
  ],
  [
    [0, 0, 0, 1],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [1, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 1, 0],
  ],
  [
    [0, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 1],
  ],
];

// ── Config ────────────────────────────────────────────────────

const TARGET_SLOT = 53;
const PIXEL = 4;
const FPS = 30;

// ── Pre-computed RGB triples for each pattern cell ─────────────

type RGB = [number, number, number];

// tileCache[level][row][col] = [r,g,b] or null (black)
const tileCacheBW: (RGB | null)[][][] = BW.map((pat) =>
  pat.map((row) => row.map((v) => (v ? ([255, 255, 255] as RGB) : null))),
);

const tileCacheBlue: (RGB | null)[][][] = BLUE_PAT.map((pat) =>
  pat.map((row) => row.map((v) => (v ? ([7, 8, 255] as RGB) : null))),
);

// ── Helpers ───────────────────────────────────────────────────

function rand01(i: number): number {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

// ── Component ─────────────────────────────────────────────────

export default function DefiHeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sketchRef = useRef<p5 | null>(null);
  const [mounted, setMounted] = useState(false);

  const sketch = useCallback((p: p5) => {
    let W = 0,
      H = 0,
      CEILING = 0,
      AVAIL_H = 0,
      MAX_COL_H = 0,
      MIN_COL_H = 0;

    interface Col {
      x: number;
      w: number;
      baseH: number;
      currentH: number;
      phaseOffset: number;
      breathAmp: number;
      accentType: number;
      prevH: number;
    }

    let cols: Col[] = [];
    let mouseX = 0;
    let mouseActive = false;
    let mouseIdleFrames = 0;
    let breathT = 0;
    let lastMouseX = -1;

    // Reusable image data
    let imageData: ImageData | null = null;
    let pixels: Uint8ClampedArray | null = null;
    let frameSkip = 0;

    function computeDims() {
      W = window.innerWidth;
      H = window.innerHeight;
      CEILING = Math.floor(H / 3);
      AVAIL_H = H - CEILING;
      MAX_COL_H = AVAIL_H;
      MIN_COL_H = Math.floor(AVAIL_H * 0.04);
    }

    function buildCols() {
      cols = [];
      const numCols = Math.max(1, Math.round(W / TARGET_SLOT));
      const slotW = W / numCols;
      for (let i = 0; i < numCols; i++) {
        const r = rand01(i);
        const r2 = rand01(i + 100);
        const t = i / Math.max(1, numCols - 1);
        let profile = 0.3 + 0.7 * Math.pow(Math.sin(t * Math.PI), 0.4);
        profile += (r - 0.5) * 0.35;
        profile = Math.max(0.12, Math.min(1.0, profile));
        const baseH = MIN_COL_H + (MAX_COL_H - MIN_COL_H) * profile;
        const xStart = Math.round(i * slotW);
        const xEnd = i === numCols - 1 ? W : Math.round((i + 1) * slotW);
        const cw = Math.max(PIXEL, xEnd - xStart);
        let accentType = 0;
        if (r2 < 0.15) accentType = 2;
        else if (r2 < 0.42) accentType = 1;
        cols.push({
          x: xStart,
          w: cw,
          baseH,
          currentH: baseH,
          prevH: baseH,
          phaseOffset: r * Math.PI * 2,
          breathAmp: 0.01 + r * 0.015,
          accentType,
        });
      }
    }

    p.setup = function () {
      computeDims();
      p.createCanvas(W, H);
      p.pixelDensity(1);
      p.frameRate(FPS);
      mouseX = W / 2;
      buildCols();
    };

    p.windowResized = function () {
      computeDims();
      p.resizeCanvas(W, H);
      imageData = null; // force realloc
      buildCols();
    };

    // ── Fast pixel writer ────────────────────────────────────

    function writeBlock(
      px: number,
      py: number,
      r: number,
      g: number,
      b: number,
    ) {
      if (!pixels) return;
      const rowBase = py * W * 4 + px * 4;
      const stride = W * 4;
      for (let dy = 0; dy < PIXEL; dy++) {
        const off = rowBase + dy * stride;
        for (let dx = 0; dx < PIXEL; dx++) {
          const i = off + dx * 4;
          pixels[i] = r;
          pixels[i + 1] = g;
          pixels[i + 2] = b;
          pixels[i + 3] = 255;
        }
      }
    }

    // ── Draw ─────────────────────────────────────────────────

    p.draw = function () {
      // Frame skipping — only render every other frame when idle
      frameSkip++;
      if (!mouseActive && frameSkip < 2) return; // 15fps when idle
      frameSkip = 0;

      breathT += 0.014; // doubled to match 30fps

      // Mouse tracking
      if (p.mouseX !== lastMouseX && p.mouseX >= 0 && p.mouseX <= W) {
        lastMouseX = p.mouseX;
        mouseX = p.mouseX;
        mouseActive = true;
        mouseIdleFrames = 0;
      } else if (mouseActive) {
        mouseIdleFrames++;
        if (mouseIdleFrames > 60) mouseActive = false; // 2s at 30fps
      }

      // Allocate image buffer
      const ctx = p.drawingContext as CanvasRenderingContext2D;
      if (!imageData || imageData.width !== W || imageData.height !== H) {
        imageData = ctx.createImageData(W, H);
        pixels = imageData.data;
      }

      // Clear to black
      pixels!.fill(0);

      // Draw columns
      for (let ci = 0; ci < cols.length; ci++) {
        const col = cols[ci];
        const colCenterX = col.x + col.w * 0.5;

        // Target height
        let targetH: number;
        if (mouseActive) {
          const dist = Math.abs(colCenterX - mouseX);
          const t = Math.min(dist / (W * 0.5), 1.0);
          const influence = Math.pow(1.0 - t, 4);
          const restFloor = col.baseH * 0.5;
          targetH = restFloor + (col.baseH - restFloor) * influence;
        } else {
          const phase = breathT * 0.9 - colCenterX * 0.006;
          const wave = Math.sin(phase);
          const swell = Math.sin(
            breathT * 0.4 - colCenterX * 0.0022 + col.phaseOffset,
          );
          const amp = 0.08 + 0.04 * swell;
          targetH = col.baseH * (1.0 + wave * amp);
        }

        col.prevH = col.currentH;
        col.currentH += (targetH - col.currentH) * 0.06;
        const colH = Math.max(
          MIN_COL_H,
          Math.min(MAX_COL_H, Math.round(col.currentH)),
        );

        // Skip if too small
        if (colH <= MIN_COL_H) continue;

        const colTop = H - colH;

        // Number of bands
        const heightRatio = (colH - MIN_COL_H) / (MAX_COL_H - MIN_COL_H);
        const numBands = Math.max(
          2,
          Math.round(2 + (BW.length - 2) * heightRatio),
        );

        // Accent range
        let accentStart = 0,
          accentEnd = 0;
        if (col.accentType === 1) {
          accentStart = 0;
          accentEnd = Math.floor(numBands * 0.35);
        } else if (col.accentType === 2) {
          accentStart = Math.floor(numBands * 0.65);
          accentEnd = numBands;
        }

        // Draw bands
        for (let bi = 0; bi < numBands; bi++) {
          const levelT = bi / (numBands - 1);
          let lvl = Math.round(levelT * (BW.length - 1));
          lvl = Math.max(0, Math.min(BW.length - 1, lvl));

          const bandTop = colTop + Math.floor((bi * colH) / numBands);
          const bandBot =
            bi === numBands - 1
              ? H
              : colTop + Math.floor(((bi + 1) * colH) / numBands);

          const useAccent =
            col.accentType !== 0 && bi >= accentStart && bi < accentEnd;

          const bwTile = tileCacheBW[lvl];
          const blueTile = useAccent ? tileCacheBlue[lvl] : null;

          const btAligned = Math.floor(bandTop / PIXEL) * PIXEL;
          const bbAligned = Math.ceil(bandBot / PIXEL) * PIXEL;

          for (let py = btAligned; py < bbAligned; py += PIXEL) {
            const row = Math.floor(py / PIXEL) & 3;

            for (let px = col.x; px < col.x + col.w; px += PIXEL) {
              const col4 = Math.floor(px / PIXEL) & 3;
              // Blue overrides white (same as original: if blue → blue, else if white → white)
              if (blueTile) {
                const b = blueTile[row][col4];
                if (b) {
                  writeBlock(px, py, b[0], b[1], b[2]);
                  continue;
                }
              }
              const w = bwTile[row][col4];
              if (w) {
                writeBlock(px, py, w[0], w[1], w[2]);
              }
            }
          }
        }
      }

      ctx.putImageData(imageData!, 0, 0);

      // Black ceiling overlay
      p.fill(0);
      p.noStroke();
      p.rect(0, 0, W, CEILING);
    };
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;
    sketchRef.current = new p5(sketch, containerRef.current);
    return () => {
      sketchRef.current?.remove();
    };
  }, [mounted, sketch]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
    />
  );
}
