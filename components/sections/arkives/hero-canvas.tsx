"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

// ── Reference config (from knowledge-graph.html) ──
const CATEGORIES = 24;
const CLUSTER_MIN = 11;
const CLUSTER_MAX = 21;
const CROSS_LINK_PROB = 0.18;
const SUB_BRANCH_PROB = 0.18;
const SUB_BRANCH_MIN = 1;
const SUB_BRANCH_MAX = 4;

const ACCENT_COLOR = "#3E63DD";
const ACCENT_FRACTION = 0.07;

// Visuals — reference colors
const BG_COLOR = "#000000";
const NODE_CENTER = "#E8E8EA";
const NODE_HUB = "#D8D9DD";
const NODE_LEAF = "#C8C9CD";
const NODE_TINY = "#9C9DA3";
const LINK_COLOR = "rgba(180,182,190,0.16)";
const LINK_HOVER = "rgba(220,222,228,0.55)";
const HOVER_NODE_COLOR = "#FFFFFF";

// Sizes
const BASE_R_CENTER = 4.6;
const BASE_R_HUB = 3.4;
const BASE_R_LEAF = 2.8;
const BASE_R_TINY = 2.2;

// Forces
const BASE_LINK_DISTANCE = 42;
const LINK_STRENGTH = 0.85;
const BASE_CHARGE_STRENGTH = -28;
const VELOCITY_DECAY = 0.5;
const RADIAL_SOFT_ZONE = 290;
const RADIAL_STRENGTH = 0.05;
const RADIAL_EXPONENT = 1.6;
const CENTER_GRAVITY = 0.015;

// Interaction
const BASE_HOVER_RADIUS = 14;
const BASE_PICK_RADIUS = 22;

// Perf
const RESIZE_DEBOUNCE = 300;
const DPR_CAP = 1.5;

interface GraphNode extends d3.SimulationNodeDatum {
  id: number;
  level: number;
  r: number;
  color: string;
  accent?: boolean;
  detached?: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx?: number | null;
  fy?: number | null;
}

interface GraphLink {
  source: number | GraphNode;
  target: number | GraphNode;
}

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simRef = useRef<d3.Simulation<GraphNode, undefined> | null>(null);
  const rafRef = useRef<number>(0);
  const nodesRef = useRef<GraphNode[]>([]);
  const linksRef = useRef<{ source: GraphNode; target: GraphNode }[]>([]);
  const centerRef = useRef<GraphNode | null>(null);

  // Mouse state
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const draggingRef = useRef(false);
  const grabbedRef = useRef<GraphNode | null>(null);
  const hoverNodeRef = useRef<GraphNode | null>(null);
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Live W/H (logical)
  const dimRef = useRef({ W: 0, H: 0, scale: 1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Capture non-null refs for closures
    const cvs = canvas;
    const cnt = container;
    const context = ctx;

    let disposed = false;

    function setup() {
      const W = cnt.clientWidth;
      const H = cnt.clientHeight;
      if (W <= 0 || H <= 0) return;

      const scale = Math.min(W / 1920, H / 1080);
      dimRef.current = { W, H, scale };

      const DPR = Math.min(DPR_CAP, Math.max(1, window.devicePixelRatio || 1));
      cvs.width = W * DPR;
      cvs.height = H * DPR;
      cvs.style.width = W + "px";
      cvs.style.height = H + "px";
      context.setTransform(DPR, 0, 0, DPR, 0, 0);

      const cx = W / 2;
      const cy = H / 2;

      const R_CENTER = BASE_R_CENTER * scale;
      const R_HUB = BASE_R_HUB * scale;
      const R_LEAF = BASE_R_LEAF * scale;
      const R_TINY = BASE_R_TINY * scale;
      const LINK_DISTANCE = BASE_LINK_DISTANCE * scale;
      const CHARGE_STRENGTH = BASE_CHARGE_STRENGTH * scale;

      // ── Build graph ──────────────────────────────
      const nodes: GraphNode[] = [];

      function makeNode(level: number): GraphNode {
        const id = nodes.length;
        let r: number, color: string;
        if (level === 0) {
          r = R_CENTER;
          color = NODE_CENTER;
        } else if (level === 1) {
          r = R_HUB;
          color = NODE_HUB;
        } else if (level === 2) {
          r = R_LEAF;
          color = NODE_LEAF;
        } else {
          r = R_TINY;
          color = NODE_TINY;
        }
        r *= 0.85 + Math.random() * 0.3;
        const node: GraphNode = {
          id,
          level,
          r,
          color,
          x: cx + (Math.random() - 0.5) * 200 * scale,
          y: cy + (Math.random() - 0.5) * 200 * scale,
          vx: 0,
          vy: 0,
        };
        nodes.push(node);
        return node;
      }

      const center = makeNode(0);
      centerRef.current = center;

      const categories: GraphNode[] = [];
      const catLeaves = new Map<GraphNode, GraphNode[]>();

      for (let i = 0; i < CATEGORIES; i++) {
        const cat = makeNode(1);
        const ang = (i / CATEGORIES) * Math.PI * 2;
        cat.x = cx + Math.cos(ang) * 35 * scale;
        cat.y = cy + Math.sin(ang) * 35 * scale;
        categories.push(cat);
        catLeaves.set(cat, []);
        linksRef.current.push({
          source: center.id,
          target: cat.id,
        } as unknown as { source: GraphNode; target: GraphNode });
      }

      for (const cat of categories) {
        const leafCount =
          CLUSTER_MIN + Math.floor(Math.random() * (CLUSTER_MAX - CLUSTER_MIN));
        const leaves: GraphNode[] = [];
        for (let j = 0; j < leafCount; j++) {
          const leaf = makeNode(2);
          leaf.x = cat.x + (Math.random() - 0.5) * 120 * scale;
          leaf.y = cat.y + (Math.random() - 0.5) * 120 * scale;
          linksRef.current.push({
            source: cat.id,
            target: leaf.id,
          } as unknown as { source: GraphNode; target: GraphNode });
          leaves.push(leaf);

          if (Math.random() < SUB_BRANCH_PROB) {
            const sn =
              SUB_BRANCH_MIN +
              Math.floor(Math.random() * (SUB_BRANCH_MAX - SUB_BRANCH_MIN + 1));
            for (let k = 0; k < sn; k++) {
              const sub = makeNode(3);
              sub.x = leaf.x + (Math.random() - 0.5) * 50 * scale;
              sub.y = leaf.y + (Math.random() - 0.5) * 50 * scale;
              linksRef.current.push({
                source: leaf.id,
                target: sub.id,
              } as unknown as { source: GraphNode; target: GraphNode });
            }
          }
        }

        for (const leaf of leaves) {
          if (Math.random() >= CROSS_LINK_PROB) continue;
          const otherCats = categories.filter((c) => c !== cat);
          if (otherCats.length === 0) continue;
          const otherCat =
            otherCats[Math.floor(Math.random() * otherCats.length)];
          const otherLeaves = catLeaves.get(otherCat)!;
          if (otherLeaves.length === 0) continue;
          const tgt =
            otherLeaves[Math.floor(Math.random() * otherLeaves.length)];
          linksRef.current.push({
            source: leaf.id,
            target: tgt.id,
          } as unknown as { source: GraphNode; target: GraphNode });
        }
      }

      for (const n of nodes) {
        if (n === center) continue;
        if (Math.random() < ACCENT_FRACTION) {
          n.accent = true;
          n.color = ACCENT_COLOR;
          n.r *= 1.15;
        }
      }

      nodesRef.current = nodes;

      // Resolve link objects after simulation
      function resolveLinks() {
        const resolved: { source: GraphNode; target: GraphNode }[] = [];
        for (const l of linksRef.current) {
          const s = typeof l.source === "number" ? nodes[l.source] : l.source;
          const t = typeof l.target === "number" ? nodes[l.target] : l.target;
          resolved.push({ source: s, target: t });
        }
        linksRef.current = resolved;
      }

      // ── Forces ──────────────────────────────────
      function radialPullBack(alpha: number) {
        for (const n of nodes) {
          if (n.fx !== null && n.fx !== undefined) continue;
          const dx = cx - n.x,
            dy = cy - n.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 0.001) continue;
          if (!n.detached) {
            n.vx += (dx / d) * CENTER_GRAVITY * d * alpha;
            n.vy += (dy / d) * CENTER_GRAVITY * d * alpha;
          }
          const softZone = RADIAL_SOFT_ZONE * scale;
          const excess = Math.max(0, d - softZone);
          const k =
            RADIAL_STRENGTH *
            Math.pow(excess / softZone, RADIAL_EXPONENT) *
            alpha;
          n.vx += (dx / d) * k * d;
          n.vy += (dy / d) * k * d;
        }
      }

      simRef.current?.stop();
      const sim = d3
        .forceSimulation<GraphNode>(nodes)
        .force(
          "link",
          d3
            .forceLink<GraphNode, GraphLink>(linksRef.current)
            .id((d) => d.id)
            .distance((d) => {
              const src = nodes[
                typeof d.source === "number"
                  ? d.source
                  : (d.source as GraphNode).id
              ] as GraphNode;
              if (src.level === 0) return LINK_DISTANCE * 0.55;
              if (src.level === 1) return LINK_DISTANCE * 1.0;
              return LINK_DISTANCE * 0.7;
            })
            .strength((d) => {
              const src = nodes[
                typeof d.source === "number"
                  ? d.source
                  : (d.source as GraphNode).id
              ] as GraphNode;
              return src.level === 0 ? 1.0 : LINK_STRENGTH;
            }),
        )
        .force(
          "charge",
          d3
            .forceManyBody()
            .strength(CHARGE_STRENGTH)
            .distanceMax(200 * scale),
        )
        .force("radial", radialPullBack)
        .force(
          "collide",
          d3.forceCollide((d) => (d as GraphNode).r + 2 * scale),
        )
        .velocityDecay(VELOCITY_DECAY)
        .alpha(1)
        .alphaDecay(0.02)
        .on("tick", () => {
          // resolved links available after first tick
        });

      center.fx = cx;
      center.fy = cy;

      simRef.current = sim;

      // Resolve links after a few ticks
      const MAX_TICKS = 20;
      for (let i = 0; i < MAX_TICKS; i++) {
        sim.tick();
      }
      resolveLinks();

      // Store resolved links for draw
      nodesRef.current = nodes;
    }

    // ── Picking ────────────────────────────────────
    function mouseToCanvas(e: MouseEvent): { x: number; y: number } | null {
      const rect = cvs.getBoundingClientRect();
      if (rect.width <= 0) return null;
      const { W, H } = dimRef.current;
      return {
        x: (e.clientX - rect.left) * (W / rect.width),
        y: (e.clientY - rect.top) * (H / rect.height),
      };
    }

    function pickNode(x: number, y: number, radius: number): GraphNode | null {
      let best: GraphNode | null = null,
        bestD = radius * radius;
      for (const n of nodesRef.current) {
        const dx = n.x - x,
          dy = n.y - y;
        const d2 = dx * dx + dy * dy;
        if (d2 < bestD) {
          bestD = d2;
          best = n;
        }
      }
      return best;
    }

    // ── Render loop (continuous, like reference) ──
    function render() {
      if (disposed) return;

      const sim = simRef.current;
      const { scale } = dimRef.current;

      // Update grabbed node position in sim
      if (draggingRef.current && grabbedRef.current) {
        grabbedRef.current.fx = mouseRef.current.x;
        grabbedRef.current.fy = mouseRef.current.y;
      }

      const HOVER_RADIUS = BASE_HOVER_RADIUS * scale;
      const PICK_RADIUS = BASE_PICK_RADIUS * scale;

      context.clearRect(0, 0, dimRef.current.W, dimRef.current.H);

      // ── 50% opacity on the whole graph ──────────
      context.globalAlpha = 0.5;

      const hoverOrGrab = hoverNodeRef.current || grabbedRef.current;

      // Links
      context.lineWidth = Math.max(0.5, 0.8 * scale);
      for (const l of linksRef.current) {
        const hl =
          hoverOrGrab && (l.source === hoverOrGrab || l.target === hoverOrGrab);
        context.strokeStyle = hl ? LINK_HOVER : LINK_COLOR;
        context.beginPath();
        context.moveTo(l.source.x, l.source.y);
        context.lineTo(l.target.x, l.target.y);
        context.stroke();
      }

      // Nodes
      for (const n of nodesRef.current) {
        const isHovered =
          n === hoverNodeRef.current || n === grabbedRef.current;
        context.fillStyle = isHovered ? HOVER_NODE_COLOR : n.color;
        context.beginPath();
        context.arc(n.x, n.y, isHovered ? n.r * 1.4 : n.r, 0, Math.PI * 2);
        context.fill();
      }

      // Restore alpha
      context.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(render);
    }

    // ── Event handlers ────────────────────────────
    function onMouseMove(e: MouseEvent) {
      const pt = mouseToCanvas(e);
      if (!pt) return;
      mouseRef.current = pt;
      if (!draggingRef.current) {
        hoverNodeRef.current = pickNode(
          pt.x,
          pt.y,
          BASE_HOVER_RADIUS * dimRef.current.scale,
        );
      }
    }

    function onMouseDown(e: MouseEvent) {
      const pt = mouseToCanvas(e);
      if (!pt) return;
      mouseRef.current = pt;

      const target = pickNode(
        pt.x,
        pt.y,
        BASE_PICK_RADIUS * dimRef.current.scale,
      );
      if (target && target !== centerRef.current) {
        draggingRef.current = true;
        grabbedRef.current = target;
        grabbedRef.current.fx = pt.x;
        grabbedRef.current.fy = pt.y;
        cnt.classList.add("dragging");
        simRef.current?.alphaTarget(0.3).restart();
      }
      e.preventDefault();
    }

    function onMouseUp() {
      if (grabbedRef.current && grabbedRef.current !== centerRef.current) {
        grabbedRef.current.fx = null;
        grabbedRef.current.fy = null;
      }
      grabbedRef.current = null;
      draggingRef.current = false;
      cnt.classList.remove("dragging");
      simRef.current?.alphaTarget(0);
    }

    function onMouseLeave() {
      if (draggingRef.current) return;
      hoverNodeRef.current = null;
    }

    // ── Init ──────────────────────────────────────
    const initTimer = setTimeout(() => {
      setup();
      rafRef.current = requestAnimationFrame(render);
    }, 50);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    container.addEventListener("mouseleave", onMouseLeave);

    const handleResize = () => {
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = setTimeout(() => {
        simRef.current?.stop();
        cancelAnimationFrame(rafRef.current);
        linksRef.current = [];
        nodesRef.current = [];
        setup();
        rafRef.current = requestAnimationFrame(render);
      }, RESIZE_DEBOUNCE);
    };

    const ro = new ResizeObserver(() => handleResize());
    ro.observe(container);

    return () => {
      disposed = true;
      clearTimeout(initTimer);
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
      cancelAnimationFrame(rafRef.current);
      simRef.current?.stop();
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden bg-black"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />
    </div>
  );
}
