"use client";

import { useEffect, useRef } from "react";
import p5 from "p5";

export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<p5 | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sketch = (p: p5) => {
      let W = 0;
      let H = 0;
      let CEILING = 0;
      let AVAIL_H = 0;
      let MAX_COL_H = 0;
      let MIN_COL_H = 0;

      const TARGET_SLOT = 53;
      const PIXEL = 4;

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
        breathAmp: number;
        accentType: number;
      }

      let cols: Col[] = [];
      let mouseX = 0;
      let mouseActive = false;
      let mouseIdleFrames = 0;
      let breathT = 0;
      let lastMouseX = -1;

      function rand01(i: number): number {
        const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
        return s - Math.floor(s);
      }

      function computeDims() {
        W = container.clientWidth;
        H = container.clientHeight;
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
        p.noSmooth();
        mouseX = W / 2;
        buildCols();
      };

      p.windowResized = function () {
        computeDims();
        p.resizeCanvas(W, H);
        buildCols();
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

        const ctx = p.drawingContext as CanvasRenderingContext2D;

        // Fast native clear
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, W, H);

        for (let ci = 0; ci < cols.length; ci++) {
          const col = cols[ci];
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

          let accentBandStart = 0;
          let accentBandEnd = 0;
          if (col.accentType === 1) {
            accentBandStart = 0;
            accentBandEnd = Math.floor(numBands * 0.35);
          } else if (col.accentType === 2) {
            accentBandStart = Math.floor(numBands * 0.65);
            accentBandEnd = numBands;
          }

          const colEnd = Math.min(col.x + col.w, W);

          for (let bi = 0; bi < numBands; bi++) {
            const levelT = bi / (numBands - 1);
            let levelIdx = Math.round(levelT * (BW.length - 1));
            levelIdx = Math.max(0, Math.min(BW.length - 1, levelIdx));
            const bwPat = BW[levelIdx];
            const bluePat = BLUE_PAT[levelIdx];

            const bandTop = colTop + Math.floor((bi * colH) / numBands);
            const bandBot =
              bi === numBands - 1
                ? H
                : colTop + Math.floor(((bi + 1) * colH) / numBands);

            const useAccent =
              col.accentType !== 0 &&
              bi >= accentBandStart &&
              bi < accentBandEnd;

            for (let py = bandTop; py < bandBot; py += PIXEL) {
              for (let px = col.x; px < colEnd; px += PIXEL) {
                const row = ((py / PIXEL) | 0) % 4;
                const col4 = ((px / PIXEL) | 0) % 4;
                if (useAccent && bluePat[row][col4]) {
                  ctx.fillStyle = "#0708ff";
                  ctx.fillRect(px, py, PIXEL, PIXEL);
                } else if (bwPat[row][col4]) {
                  ctx.fillStyle = "#ffffff";
                  ctx.fillRect(px, py, PIXEL, PIXEL);
                }
              }
            }
          }
        }
      };
    };

    instanceRef.current = new p5(sketch, container);

    return () => {
      instanceRef.current?.remove();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0" />;
}
