"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

const W = 1920;
const H = 1080;

// Graph shape
const CATEGORIES = 24;
const CLUSTER_MIN = 11;
const CLUSTER_MAX = 21;
const CROSS_LINK_PROB = 0.18;
const SUB_BRANCH_PROB = 0.18;
const SUB_BRANCH_MIN = 1;
const SUB_BRANCH_MAX = 4;

// Accent
const ACCENT_COLOR = "#1F3299";
const ACCENT_FRACTION = 0.07;

// Visuals
const BG_COLOR = "#000000";
const NODE_CENTER = "#747476";
const NODE_HUB = "#6C6D6F";
const NODE_LEAF = "#646467";
const NODE_TINY = "#4E4F52";
const LINK_COLOR = "rgba(90,91,95,0.08)";
const LINK_HOVER = "rgba(110,111,114,0.28)";
const HOVER_NODE_COLOR = "#B0B0B4";

// Sizes
const R_CENTER = 4.6;
const R_HUB = 3.4;
const R_LEAF = 2.8;
const R_TINY = 2.2;

// Forces
const LINK_DISTANCE = 42;
const LINK_STRENGTH = 0.85;
const CHARGE_STRENGTH = -28;
const VELOCITY_DECAY = 0.5;
const RADIAL_SOFT_ZONE = 290;
const RADIAL_STRENGTH = 0.05;
const RADIAL_EXPONENT = 1.6;
const CENTER_GRAVITY = 0.015;

// Interaction
const HOVER_RADIUS = 14;
const PICK_RADIUS = 22;

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

  useEffect(() => {
    const canvas = canvasRef.current!;
    const container = containerRef.current!;
    const ctx = canvas.getContext("2d")!;

    const reducedMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = reducedMedia.matches;

    // High-DPI
    const DPR = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.scale(DPR, DPR);

    let mouseX = -9999;
    let mouseY = -9999;
    let hovering = false;
    let dragging = false;
    let grabbed: GraphNode | null = null;
    let hoverNode: GraphNode | null = null;

    // ── Build graph ──────────────────────────────────
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];

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
        x: W / 2 + (Math.random() - 0.5) * 200,
        y: H / 2 + (Math.random() - 0.5) * 200,
        vx: 0,
        vy: 0,
      };
      nodes.push(node);
      return node;
    }

    const center = makeNode(0);

    const categories: GraphNode[] = [];
    for (let i = 0; i < CATEGORIES; i++) {
      const cat = makeNode(1);
      const ang = (i / CATEGORIES) * Math.PI * 2;
      cat.x = W / 2 + Math.cos(ang) * 35;
      cat.y = H / 2 + Math.sin(ang) * 35;
      categories.push(cat);
      links.push({ source: center.id, target: cat.id });
    }

    for (const cat of categories) {
      const leafCount =
        CLUSTER_MIN + Math.floor(Math.random() * (CLUSTER_MAX - CLUSTER_MIN));
      const leaves: GraphNode[] = [];
      for (let j = 0; j < leafCount; j++) {
        const leaf = makeNode(2);
        leaf.x = cat.x + (Math.random() - 0.5) * 120;
        leaf.y = cat.y + (Math.random() - 0.5) * 120;
        links.push({ source: cat.id, target: leaf.id });
        leaves.push(leaf);

        if (Math.random() < SUB_BRANCH_PROB) {
          const sn =
            SUB_BRANCH_MIN +
            Math.floor(Math.random() * (SUB_BRANCH_MAX - SUB_BRANCH_MIN + 1));
          for (let k = 0; k < sn; k++) {
            const sub = makeNode(3);
            sub.x = leaf.x + (Math.random() - 0.5) * 50;
            sub.y = leaf.y + (Math.random() - 0.5) * 50;
            links.push({ source: leaf.id, target: sub.id });
          }
        }
      }

      for (const leaf of leaves) {
        if (Math.random() < CROSS_LINK_PROB) {
          const otherCat =
            categories[Math.floor(Math.random() * categories.length)];
          if (otherCat !== cat) {
            const candidates = links
              .filter(
                (l) =>
                  (typeof l.source === "number" && l.source === otherCat.id) ||
                  (typeof l.target === "number" && l.target === otherCat.id),
              )
              .map((l) =>
                (typeof l.source === "number" ? l.source : l.source.id) ===
                otherCat.id
                  ? typeof l.target === "number"
                    ? l.target
                    : l.target.id
                  : typeof l.source === "number"
                    ? l.source
                    : l.source.id,
              )
              .filter(
                (id) =>
                  id !== center.id && (nodes[id] as GraphNode).level === 2,
              );
            if (candidates.length) {
              const tgtId =
                candidates[Math.floor(Math.random() * candidates.length)];
              links.push({ source: leaf.id, target: tgtId });
            }
          }
        }
      }
    }

    // Accent
    for (const n of nodes) {
      if (n === center) continue;
      if (Math.random() < ACCENT_FRACTION) {
        n.accent = true;
        n.color = ACCENT_COLOR;
        n.r *= 1.15;
      }
    }

    // ── Forces ───────────────────────────────────────
    function radialPullBack(alpha: number) {
      const cx = W / 2;
      const cy = H / 2;
      for (const n of nodes) {
        if (n.fx !== null && n.fx !== undefined) continue;
        const dx = cx - n.x;
        const dy = cy - n.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 0.001) continue;

        if (!n.detached) {
          n.vx += (dx / d) * CENTER_GRAVITY * d * alpha;
          n.vy += (dy / d) * CENTER_GRAVITY * d * alpha;
        }

        const softZone = n.detached ? RADIAL_SOFT_ZONE + 40 : RADIAL_SOFT_ZONE;
        const excess = Math.max(0, d - softZone);
        const k =
          RADIAL_STRENGTH *
          Math.pow(excess / softZone, RADIAL_EXPONENT) *
          alpha;
        n.vx += (dx / d) * k * d;
        n.vy += (dy / d) * k * d;
      }
    }

    const sim = d3
      .forceSimulation<GraphNode>(nodes)
      .force(
        "link",
        d3
          .forceLink<GraphNode, GraphLink>(links)
          .id((d) => d.id)
          .distance((d) => {
            const src = nodes[
              typeof d.source === "number" ? d.source : d.source.id
            ] as GraphNode;
            if (src.level === 0) return LINK_DISTANCE * 0.55;
            if (src.level === 1) return LINK_DISTANCE * 1.0;
            return LINK_DISTANCE * 0.7;
          })
          .strength((d) => {
            const src = nodes[
              typeof d.source === "number" ? d.source : d.source.id
            ] as GraphNode;
            if (src.level === 0) return 1.0;
            return LINK_STRENGTH;
          }),
      )
      .force("charge", d3.forceManyBody().strength(CHARGE_STRENGTH))
      .force("radial", radialPullBack)
      .force(
        "collide",
        d3.forceCollide((d) => (d as GraphNode).r + 2),
      )
      .velocityDecay(VELOCITY_DECAY)
      .alpha(1)
      .alphaDecay(0.02);

    center.fx = W / 2;
    center.fy = H / 2;

    // ── Picking ──────────────────────────────────────
    function pickNode(x: number, y: number, radius: number): GraphNode | null {
      let best: GraphNode | null = null;
      let bestD = radius * radius;
      for (const n of nodes) {
        const dx = n.x - x;
        const dy = n.y - y;
        const d2 = dx * dx + dy * dy;
        if (d2 < bestD) {
          bestD = d2;
          best = n;
        }
      }
      return best;
    }

    function mouseFromEvent(e: MouseEvent) {
      const r = canvas.getBoundingClientRect();
      if (r.width <= 0) return;
      mouseX = (e.clientX - r.left) * (W / r.width);
      mouseY = (e.clientY - r.top) * (H / r.height);
    }

    // ── Events ───────────────────────────────────────
    function onMouseEnter() {
      hovering = true;
    }
    function onMouseLeave() {
      hovering = false;
      if (grabbed && grabbed !== center) {
        grabbed.fx = null;
        grabbed.fy = null;
      }
      grabbed = null;
      hoverNode = null;
      dragging = false;
      container.style.cursor = "default";
      sim.alphaTarget(0);
    }
    function onGlobalMove(e: MouseEvent) {
      mouseFromEvent(e);
      if (!dragging) hoverNode = pickNode(mouseX, mouseY, HOVER_RADIUS);
    }
    function onMouseDown(e: MouseEvent) {
      mouseFromEvent(e);
      const target = pickNode(mouseX, mouseY, PICK_RADIUS);
      if (target) {
        dragging = true;
        grabbed = target;
        grabbed.fx = mouseX;
        grabbed.fy = mouseY;
        container.style.cursor = "grabbing";
        sim.alphaTarget(0.3).restart();
      }
      e.preventDefault();
    }
    function onMouseUp() {
      if (grabbed && grabbed !== center) {
        grabbed.fx = null;
        grabbed.fy = null;
      }
      grabbed = null;
      dragging = false;
      container.style.cursor = "default";
      sim.alphaTarget(0);
    }

    container.addEventListener("mouseenter", onMouseEnter);
    container.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("mousemove", onGlobalMove);
    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    // Static render for reduced motion
    if (reduced) {
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, W, H);
      for (const n of nodes) {
        ctx.fillStyle = n.color;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      return () => {
        container.removeEventListener("mouseenter", onMouseEnter);
        container.removeEventListener("mouseleave", onMouseLeave);
        window.removeEventListener("mousemove", onGlobalMove);
        container.removeEventListener("mousedown", onMouseDown);
        window.removeEventListener("mouseup", onMouseUp);
      };
    }

    // ── Render loop ──────────────────────────────────
    function isLinkHighlighted(
      l: d3.SimulationLinkDatum<GraphNode>,
      node: GraphNode | null,
    ): boolean {
      if (!node) return false;
      return (
        l.source === node ||
        l.target === node ||
        (l.source as GraphNode).id === node.id ||
        (l.target as GraphNode).id === node.id
      );
    }

    let rafId: number;
    function render() {
      if (dragging && grabbed) {
        grabbed.fx = mouseX;
        grabbed.fy = mouseY;
      }

      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, W, H);

      const linkForce = sim.force<d3.ForceLink<GraphNode, GraphLink>>("link");
      if (linkForce) {
        const resolvedLinks = linkForce.links();
        ctx.lineWidth = 0.8;
        for (const l of resolvedLinks) {
          const hl = isLinkHighlighted(l, hoverNode || grabbed);
          ctx.strokeStyle = hl ? LINK_HOVER : LINK_COLOR;
          ctx.beginPath();
          ctx.moveTo((l.source as GraphNode).x, (l.source as GraphNode).y);
          ctx.lineTo((l.target as GraphNode).x, (l.target as GraphNode).y);
          ctx.stroke();
        }
      }

      for (const n of nodes) {
        const isHovered = n === hoverNode || n === grabbed;
        ctx.fillStyle = isHovered ? HOVER_NODE_COLOR : n.color;
        ctx.beginPath();
        ctx.arc(n.x, n.y, isHovered ? n.r * 1.4 : n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(render);
    }
    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener("mouseenter", onMouseEnter);
      container.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("mousemove", onGlobalMove);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />
    </div>
  );
}
