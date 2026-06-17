"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

const SPACING = 60;
const BASE_R = 1.6;
const MAX_R = 5.5;
const INFLUENCE = 260;
const NEAREST_K = 10;
const LINE_REACH = 360;
const LINK_DISTANCE = SPACING;
const LINK_STRENGTH = 0.9;
const LINK_ITERATIONS = 10;
const HOME_STRENGTH = 0.06;
const VELOCITY_DECAY = 0.32;
const ALPHA_TARGET_DRAG = 0.35;
const BG_COLOR = "#000000";
const NODE_DIM = 70;
const NODE_BRIGHT = 255;
const LINE_ALPHA = 210;
const CURSOR_R = 7;

interface SimNode extends d3.SimulationNodeDatum {
  x: number;
  y: number;
  rx: number;
  ry: number;
  vx: number;
  vy: number;
  fx?: number | null;
  fy?: number | null;
}

interface SimLink {
  source: SimNode;
  target: SimNode;
}

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const DPR = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
    const reducedMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = reducedMedia.matches;

    let mouseXs = 0;
    let mouseYs = 0;
    let targetX = 0;
    let targetY = 0;
    let hovering = false;
    let dragging = false;
    let grabbed: SimNode | null = null;
    let rafId: number;

    let sim: d3.Simulation<SimNode, undefined> | null = null;
    let nodes: SimNode[] = [];
    let linkForce: d3.ForceLink<SimNode, SimLink> | undefined;
    let linkDefs: { source: number; target: number }[] = [];

    function buildScene(w: number, h: number) {
      nodes = [];
      linkDefs = [];

      const cols = Math.floor(w / SPACING);
      const rows = Math.floor(h / SPACING);
      const offsetX = (w - cols * SPACING) / 2 + SPACING / 2;
      const offsetY = (h - rows * SPACING) / 2 + SPACING / 2;

      const idxFn = (i: number, j: number) => i * (rows + 1) + j;

      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const rx = offsetX + i * SPACING;
          const ry = offsetY + j * SPACING;
          nodes.push({ x: rx, y: ry, rx, ry, vx: 0, vy: 0 });
        }
      }

      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          if (i < cols)
            linkDefs.push({ source: idxFn(i, j), target: idxFn(i + 1, j) });
          if (j < rows)
            linkDefs.push({ source: idxFn(i, j), target: idxFn(i, j + 1) });
        }
      }

      mouseXs = w / 2;
      mouseYs = h / 2;
      targetX = w / 2;
      targetY = h / 2;
    }

    function homeForce(alpha: number) {
      const k = HOME_STRENGTH * alpha;
      for (const n of nodes) {
        if (n.fx !== null && n.fx !== undefined) continue;
        n.vx += (n.rx - n.x) * k;
        n.vy += (n.ry - n.y) * k;
      }
    }

    function createSim() {
      if (sim) sim.stop();

      sim = d3
        .forceSimulation<SimNode>(nodes)
        .force(
          "link",
          d3
            .forceLink<SimNode, { source: number; target: number }>(linkDefs)
            .distance(LINK_DISTANCE)
            .strength(LINK_STRENGTH)
            .iterations(LINK_ITERATIONS),
        )
        .force("home", homeForce)
        .velocityDecay(VELOCITY_DECAY)
        .alpha(0)
        .alphaDecay(0.02)
        .stop();

      sim.on("tick", () => {});
      linkForce = sim.force<d3.ForceLink<SimNode, SimLink>>("link");
    }

    function resize() {
      if (!container || !canvas || !ctx) return;
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (w === 0 || h === 0) return;

      canvas.width = w * DPR;
      canvas.height = h * DPR;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      buildScene(w, h);

      if (reduced) {
        ctx.fillStyle = BG_COLOR;
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = `rgba(255,255,255,${NODE_DIM / 255})`;
        for (const n of nodes) {
          ctx.beginPath();
          ctx.arc(n.rx, n.ry, BASE_R, 0, Math.PI * 2);
          ctx.fill();
        }
        return;
      }

      createSim();
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    if (reduced) {
      return () => ro.disconnect();
    }

    function updateMouseFromEvent(e: MouseEvent) {
      if (!canvas) return;
      const r = canvas.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return;
      targetX = (e.clientX - r.left) * (canvas.width / DPR / r.width);
      targetY = (e.clientY - r.top) * (canvas.height / DPR / r.height);
    }

    function onMouseEnter() {
      hovering = true;
    }
    function onMouseLeave() {
      hovering = false;
      if (grabbed) {
        grabbed.fx = null;
        grabbed.fy = null;
        grabbed = null;
      }
      dragging = false;
      if (container) container.style.cursor = "grab";
      if (sim) sim.alphaTarget(0);
    }
    function onMouseMove(e: MouseEvent) {
      updateMouseFromEvent(e);
    }
    function onMouseDown(e: MouseEvent) {
      updateMouseFromEvent(e);
      dragging = true;
      if (container) container.style.cursor = "grabbing";

      let best: SimNode | null = null;
      let bestD = Infinity;
      for (const n of nodes) {
        const dx = n.x - targetX;
        const dy = n.y - targetY;
        const d2 = dx * dx + dy * dy;
        if (d2 < bestD) {
          bestD = d2;
          best = n;
        }
      }
      grabbed = best;
      if (grabbed) {
        grabbed.fx = targetX;
        grabbed.fy = targetY;
      }
      if (sim) sim.alphaTarget(ALPHA_TARGET_DRAG).restart();
      e.preventDefault();
    }
    function onMouseUp() {
      dragging = false;
      if (container) container.style.cursor = "grab";
      if (grabbed) {
        grabbed.fx = null;
        grabbed.fy = null;
        grabbed = null;
      }
      if (sim) sim.alphaTarget(0);
    }

    container.addEventListener("mouseenter", onMouseEnter);
    container.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    function render() {
      if (!sim || !ctx || !canvas || nodes.length === 0) {
        rafId = requestAnimationFrame(render);
        return;
      }

      const w = canvas.width / DPR;
      const h = canvas.height / DPR;

      sim.tick();

      mouseXs += (targetX - mouseXs) * 0.22;
      mouseYs += (targetY - mouseYs) * 0.22;

      if (dragging && grabbed) {
        grabbed.fx = mouseXs;
        grabbed.fy = mouseYs;
      }

      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, w, h);

      if (hovering && !dragging) {
        const dists = nodes.map((n, i) => {
          const dx = n.x - mouseXs;
          const dy = n.y - mouseYs;
          return { i, d: Math.sqrt(dx * dx + dy * dy) };
        });
        dists.sort((a, b) => a.d - b.d);
        const nearest = dists
          .slice(0, NEAREST_K)
          .filter((d) => d.d <= LINE_REACH);

        ctx.lineWidth = 0.9;
        for (const { i, d } of nearest) {
          const n = nodes[i];
          const t = 1 - d / LINE_REACH;
          const a = Math.pow(Math.max(t, 0), 1.2) * (LINE_ALPHA / 255);
          ctx.strokeStyle = `rgba(255,255,255,${a})`;
          ctx.beginPath();
          ctx.moveTo(mouseXs, mouseYs);
          ctx.lineTo(n.x, n.y);
          ctx.stroke();
        }
      }

      const meshAlpha = dragging
        ? 1
        : Math.min(1, Math.max(0, (sim.alpha() - 0.02) * 14));

      if (meshAlpha > 0.001 && linkForce) {
        const resolvedLinks = linkForce.links() as unknown as SimLink[];
        ctx.lineWidth = 0.7;
        for (const l of resolvedLinks) {
          const s = l.source as SimNode;
          const t = l.target as SimNode;
          const dx = t.x - s.x;
          const dy = t.y - s.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const stretch = Math.min(
            1,
            Math.abs(len - LINK_DISTANCE) / LINK_DISTANCE,
          );
          const a = (0.1 + stretch * 0.55) * meshAlpha;
          if (a < 0.01) continue;
          ctx.strokeStyle = `rgba(255,255,255,${a})`;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(t.x, t.y);
          ctx.stroke();
        }
      }

      for (const n of nodes) {
        let r = BASE_R;
        let a = NODE_DIM;
        if (hovering && !dragging) {
          const dx = n.x - mouseXs;
          const dy = n.y - mouseYs;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < INFLUENCE) {
            const tt = 1 - d / INFLUENCE;
            r = BASE_R + (MAX_R - BASE_R) * Math.pow(tt, 1.2);
            a = NODE_DIM + (NODE_BRIGHT - NODE_DIM) * Math.pow(tt, 0.9);
          }
        } else if (dragging) {
          a = 110;
        }
        ctx.fillStyle = `rgba(255,255,255,${a / 255})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (hovering) {
        ctx.fillStyle = "rgba(255,255,255,1)";
        ctx.beginPath();
        ctx.arc(mouseXs, mouseYs, CURSOR_R, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "rgba(255,255,255,0.14)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(mouseXs, mouseYs, CURSOR_R * 2, 0, Math.PI * 2);
        ctx.stroke();
      }

      rafId = requestAnimationFrame(render);
    }

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      if (sim) sim.stop();
      ro.disconnect();
      container.removeEventListener("mouseenter", onMouseEnter);
      container.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      style={{ cursor: "grab", background: BG_COLOR }}
    >
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Interactive particle network visualization"
        className="block w-full h-full"
        style={{ display: "block" }}
      />
    </div>
  );
}
