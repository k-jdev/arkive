"use client";

import { useEffect, useRef } from "react";
import p5 from "p5";

const TARGET_SLOT = 53;
const PIXEL = 4;
const TILE_SIZE = PIXEL * 4;

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

interface Col {
  x: number;
  w: number;
  baseH: number;
  currentH: number;
  phaseOffset: number;
  accentType: number;
}

function srnd(i: number): number {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sketch = (p: p5) => {
      let W = 0,
        H = 0,
        CEILING = 0,
        MAX_COL_H = 0,
        MIN_COL_H = 0;
      let cols: Col[] = [];
      let mouseX = 0,
        mouseActive = false,
        mouseIdleFrames = 0;
      let breathT = 0,
        lastMouseX = -1;
      let bwTiles: p5.Graphics[] = [];
      let blueTiles: p5.Graphics[] = [];
      let lastH: Float64Array | null = null;

      function computeDims() {
        if (!container) return;
        W = container.clientWidth;
        H = container.clientHeight;
        CEILING = Math.floor(H / 3);
        MAX_COL_H = H - CEILING;
        MIN_COL_H = Math.floor(MAX_COL_H * 0.04);
      }

      function makeTile(pat: number[][], color: string): p5.Graphics {
        const g = p.createGraphics(TILE_SIZE, TILE_SIZE);
        g.noSmooth();
        g.fill(color);
        g.noStroke();
        for (let r = 0; r < 4; r++)
          for (let c = 0; c < 4; c++)
            if (pat[r][c]) g.rect(c * PIXEL, r * PIXEL, PIXEL, PIXEL);
        return g;
      }

      function buildCols() {
        cols = [];
        const numCols = Math.max(1, Math.round(W / TARGET_SLOT));
        const slotW = W / numCols;

        for (let i = 0; i < numCols; i++) {
          const r = srnd(i),
            r2 = srnd(i + 100);
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
            phaseOffset: r * Math.PI * 2,
            accentType,
          });
        }
      }

      function dirty(): boolean {
        if (!lastH || lastH.length !== cols.length) return true;
        for (let i = 0; i < cols.length; i++)
          if (Math.abs(cols[i].currentH - lastH[i]) > 0.3) return true;
        return false;
      }

      function saveHeights() {
        if (!lastH || lastH.length !== cols.length)
          lastH = new Float64Array(cols.length);
        for (let i = 0; i < cols.length; i++) lastH[i] = cols[i].currentH;
      }

      p.setup = function () {
        computeDims();
        p.createCanvas(W, H);
        p.pixelDensity(1);
        p.noSmooth();
        p.frameRate(30);
        mouseX = W / 2;

        bwTiles = BW.map((pt) => makeTile(pt, "#ffffff"));
        blueTiles = BLUE_PAT.map((pt) => makeTile(pt, "#0708ff"));

        buildCols();
      };

      p.windowResized = function () {
        computeDims();
        p.resizeCanvas(W, H);
        buildCols();
        lastH = null;
      };

      p.draw = function () {
        breathT += 0.007;

        if (p.mouseX !== lastMouseX && p.mouseX >= 0 && p.mouseX <= W) {
          lastMouseX = p.mouseX;
          mouseX = p.mouseX;
          mouseActive = true;
          mouseIdleFrames = 0;
        } else if (mouseActive) {
          mouseIdleFrames++;
          if (mouseIdleFrames > 120) mouseActive = false;
        }

        for (const col of cols) {
          const colCenterX = col.x + col.w * 0.5;
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
          col.currentH += (targetH - col.currentH) * 0.06;
        }

        if (!dirty()) return;
        saveHeights();

        const ctx = (
          p as unknown as { drawingContext: CanvasRenderingContext2D }
        ).drawingContext;
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, W, H);

        for (const col of cols) {
          const colH = Math.max(
            MIN_COL_H,
            Math.min(MAX_COL_H, Math.round(col.currentH)),
          );
          const colTop = H - colH;
          const heightRatio = (colH - MIN_COL_H) / (MAX_COL_H - MIN_COL_H);
          const numBands = Math.max(
            2,
            Math.round(2 + (BW.length - 2) * heightRatio),
          );

          let accentBandStart = 0,
            accentBandEnd = 0;
          if (col.accentType === 1) {
            accentBandStart = 0;
            accentBandEnd = Math.floor(numBands * 0.35);
          } else if (col.accentType === 2) {
            accentBandStart = Math.floor(numBands * 0.65);
            accentBandEnd = numBands;
          }

          for (let bi = 0; bi < numBands; bi++) {
            const levelT = bi / (numBands - 1);
            let levelIdx = Math.round(levelT * (BW.length - 1));
            levelIdx = Math.max(0, Math.min(BW.length - 1, levelIdx));
            const bandTop = colTop + Math.floor((bi * colH) / numBands);
            const bandBot =
              bi === numBands - 1
                ? H
                : colTop + Math.floor(((bi + 1) * colH) / numBands);
            const useAccent =
              col.accentType !== 0 &&
              bi >= accentBandStart &&
              bi < accentBandEnd;

            // Clamp column right edge to W to prevent gaps
            const colRight = Math.min(col.x + col.w, W);

            // Draw white pixels from BW (always)
            const bwEl = bwTiles[levelIdx].elt as HTMLCanvasElement;
            for (let py = bandTop; py < bandBot; py += TILE_SIZE) {
              const dh = Math.min(TILE_SIZE, bandBot - py);
              for (let px = col.x; px < colRight; px += TILE_SIZE) {
                ctx.drawImage(
                  bwEl,
                  px,
                  py,
                  Math.min(TILE_SIZE, colRight - px),
                  dh,
                );
              }
            }

            // Draw blue pixels from BLUE_PAT on top (accent bands only)
            if (useAccent) {
              const blueEl = blueTiles[levelIdx].elt as HTMLCanvasElement;
              for (let py = bandTop; py < bandBot; py += TILE_SIZE) {
                const dh = Math.min(TILE_SIZE, bandBot - py);
                for (let px = col.x; px < colRight; px += TILE_SIZE) {
                  ctx.drawImage(
                    blueEl,
                    px,
                    py,
                    Math.min(TILE_SIZE, colRight - px),
                    dh,
                  );
                }
              }
            }
          }
        }

        // Ceiling cover — exactly like original p.fill(0); p.rect(0, 0, W, CEILING);
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, W, CEILING);
      };

      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            p.loop();
            lastH = null;
          } else {
            p.noLoop();
          }
        },
        { threshold: 0 },
      );
      io.observe(container);

      (p as unknown as Record<string, unknown>).__cleanup = () =>
        io.disconnect();
    };

    const instance = new p5(sketch, container!);

    return () => {
      const cleanup = (instance as unknown as Record<string, unknown>)
        .__cleanup;
      if (typeof cleanup === "function") cleanup();
      instance.remove();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0" />;
}
