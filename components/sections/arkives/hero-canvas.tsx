"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import * as d3 from "d3";

// ── Types ─────────────────────────────────────────────────────

interface Node {
  id: number;
  level: number;
  r: number;
  color: string;
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  accent?: boolean;
  detached?: boolean;
}

interface Link {
  source: number | Node;
  target: number | Node;
}

// ── Config ────────────────────────────────────────────────────

const W = 1920;
const H = 1080;

const CATEGORIES = 24;
const CLUSTER_MIN = 11;
const CLUSTER_MAX = 21;
const CROSS_LINK_PROB = 0.18;
const SUB_BRANCH_PROB = 0.18;
const SUB_BRANCH_MIN = 1;
const SUB_BRANCH_MAX = 4;

const DETACHED_CLUSTERS = 0;
const DETACHED_MIN = 2;
const DETACHED_MAX = 7;
const DETACHED_RADIUS_MIN = 280;
const DETACHED_RADIUS_MAX = 360;

const ACCENT_COLOR = "#3E63DD";
const ACCENT_FRACTION = 0.07;

const BG_COLOR = "#000000";
const NODE_CENTER = "#E8E8EA";
const NODE_HUB = "#D8D9DD";
const NODE_LEAF = "#C8C9CD";
const NODE_TINY = "#9C9DA3";
const LINK_COLOR = "rgba(180,182,190,0.16)";
const LINK_HOVER = "rgba(220,222,228,0.55)";
const HOVER_NODE_COLOR = "#FFFFFF";

const R_CENTER = 4.6;
const R_HUB = 3.4;
const R_LEAF = 2.8;
const R_TINY = 2.2;

const LINK_DISTANCE = 42;
const LINK_STRENGTH = 0.85;
const CHARGE_STRENGTH = -28;
const VELOCITY_DECAY = 0.5;

const RADIAL_SOFT_ZONE = 290;
const RADIAL_STRENGTH = 0.05;
const RADIAL_EXPONENT = 1.6;

const CENTER_GRAVITY = 0.015;

const HOVER_RADIUS = 24;
const PICK_RADIUS = 36;

// ── Helpers ───────────────────────────────────────────────────

function makeNode(nodes: Node[], level: number): Node {
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
  const node: Node = {
    id,
    level,
    r,
    color,
    x: W / 2 + (Math.random() - 0.5) * 200,
    y: H / 2 + (Math.random() - 0.5) * 200,
  };
  nodes.push(node);
  return node;
}

function buildGraph(): { nodes: Node[]; links: Link[] } {
  const nodes: Node[] = [];
  const links: Link[] = [];

  const center = makeNode(nodes, 0);

  const categories: Node[] = [];
  for (let i = 0; i < CATEGORIES; i++) {
    const cat = makeNode(nodes, 1);
    const ang = (i / CATEGORIES) * Math.PI * 2;
    cat.x = W / 2 + Math.cos(ang) * 35;
    cat.y = H / 2 + Math.sin(ang) * 35;
    categories.push(cat);
    links.push({ source: center.id, target: cat.id });
  }

  for (const cat of categories) {
    const leafCount =
      CLUSTER_MIN + Math.floor(Math.random() * (CLUSTER_MAX - CLUSTER_MIN));
    const leaves: Node[] = [];
    for (let j = 0; j < leafCount; j++) {
      const leaf = makeNode(nodes, 2);
      leaf.x = cat.x + (Math.random() - 0.5) * 120;
      leaf.y = cat.y + (Math.random() - 0.5) * 120;
      links.push({ source: cat.id, target: leaf.id });
      leaves.push(leaf);

      if (Math.random() < SUB_BRANCH_PROB) {
        const sn =
          SUB_BRANCH_MIN +
          Math.floor(Math.random() * (SUB_BRANCH_MAX - SUB_BRANCH_MIN + 1));
        for (let k = 0; k < sn; k++) {
          const sub = makeNode(nodes, 3);
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
            .filter((l) => l.source === otherCat.id || l.target === otherCat.id)
            .map((l) => (l.source === otherCat.id ? l.target : l.source))
            .filter(
              (id) =>
                id !== center.id && (nodes[id as number] as Node).level === 2,
            );
          if (candidates.length) {
            const tgtId =
              candidates[Math.floor(Math.random() * candidates.length)];
            links.push({ source: leaf.id, target: tgtId as number });
          }
        }
      }
    }
  }

  // Detached clusters
  for (let c = 0; c < DETACHED_CLUSTERS; c++) {
    const ang = Math.random() * Math.PI * 2;
    const dist =
      DETACHED_RADIUS_MIN +
      Math.random() * (DETACHED_RADIUS_MAX - DETACHED_RADIUS_MIN);
    const cx = W / 2 + Math.cos(ang) * dist;
    const cy = H / 2 + Math.sin(ang) * dist;
    const sz =
      DETACHED_MIN +
      Math.floor(Math.random() * (DETACHED_MAX - DETACHED_MIN + 1));
    const chain: Node[] = [];
    for (let k = 0; k < sz; k++) {
      const n = makeNode(nodes, 2);
      n.x = cx + (Math.random() - 0.5) * 60;
      n.y = cy + (Math.random() - 0.5) * 60;
      n.detached = true;
      chain.push(n);
      if (k > 0) links.push({ source: chain[k - 1].id, target: n.id });
    }
  }

  // Accent
  for (const n of nodes) {
    if (n.level === 0) continue;
    if (Math.random() < ACCENT_FRACTION) {
      n.accent = true;
      n.color = ACCENT_COLOR;
      n.r *= 1.15;
    }
  }

  return { nodes, links };
}

// ── Component ─────────────────────────────────────────────────

export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef<d3.Simulation<Node, Link> | null>(null);
  const nodesRef = useRef<Node[]>([]);
  const linksRef = useRef<Link[]>([]);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const draggingRef = useRef(false);
  const grabbedRef = useRef<Node | null>(null);
  const hoverRef = useRef<Node | null>(null);
  const hoveringRef = useRef(false);
  const sizeRef = useRef({ w: W, h: H });
  const [isDragging, setIsDragging] = useState(false);

  // ── Pick ──────────────────────────────────────────────────

  const pickNode = useCallback(
    (x: number, y: number, radius: number): Node | null => {
      let best: Node | null = null;
      let bestD = radius * radius;
      for (const n of nodesRef.current) {
        const dx = n.x - x;
        const dy = n.y - y;
        const d2 = dx * dx + dy * dy;
        if (d2 < bestD) {
          bestD = d2;
          best = n;
        }
      }
      return best;
    },
    [],
  );

  // ── Rendering ─────────────────────────────────────────────

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Track dragged node with mouse
    if (draggingRef.current && grabbedRef.current) {
      grabbedRef.current.fx = mouseRef.current.x;
      grabbedRef.current.fy = mouseRef.current.y;
    }

    const { w, h } = sizeRef.current;

    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, w, h);

    ctx.lineWidth = 0.8;
    for (const l of linksRef.current) {
      const s = l.source as Node;
      const t = l.target as Node;
      const hl =
        s === hoverRef.current ||
        t === hoverRef.current ||
        s === grabbedRef.current ||
        t === grabbedRef.current;
      ctx.strokeStyle = hl ? LINK_HOVER : LINK_COLOR;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(t.x, t.y);
      ctx.stroke();
    }

    for (const n of nodesRef.current) {
      const isHovered = n === hoverRef.current || n === grabbedRef.current;
      ctx.fillStyle = isHovered ? HOVER_NODE_COLOR : n.color;
      ctx.beginPath();
      ctx.arc(n.x, n.y, isHovered ? n.r * 1.4 : n.r, 0, Math.PI * 2);
      ctx.fill();
    }

    rafRef.current = requestAnimationFrame(render);
  }, []);

  // ── Setup ─────────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const { nodes, links } = buildGraph();
    nodesRef.current = nodes;
    linksRef.current = links;

    // High-DPI
    const dpr = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.minWidth = `${W}px`;
    canvas.style.minHeight = `${H}px`;

    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    sizeRef.current = { w: W, h: H };

    // Radial pull-back
    function radialPullBack(alpha: number) {
      const cx = W / 2;
      const cy = H / 2;
      for (const n of nodes) {
        if (n.fx != null) continue;
        const dx = cx - n.x;
        const dy = cy - n.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 0.001) continue;

        if (!n.detached) {
          n.vx = (n.vx ?? 0) + (dx / d) * CENTER_GRAVITY * d * alpha;
          n.vy = (n.vy ?? 0) + (dy / d) * CENTER_GRAVITY * d * alpha;
        }

        const softZone = n.detached
          ? DETACHED_RADIUS_MAX + 40
          : RADIAL_SOFT_ZONE;
        const excess = Math.max(0, d - softZone);
        const k =
          RADIAL_STRENGTH *
          Math.pow(excess / softZone, RADIAL_EXPONENT) *
          alpha;
        n.vx = (n.vx ?? 0) + (dx / d) * k * d;
        n.vy = (n.vy ?? 0) + (dy / d) * k * d;
      }
    }

    const sim = d3
      .forceSimulation<Node>(nodes)
      .force(
        "link",
        d3
          .forceLink<Node, Link>(links)
          .id((d) => d.id)
          .distance((d) => {
            const src = nodes[(d.source as Node).id];
            if (src.level === 0) return LINK_DISTANCE * 0.55;
            if (src.level === 1) return LINK_DISTANCE * 1.0;
            return LINK_DISTANCE * 0.7;
          })
          .strength((d) => {
            const src = nodes[(d.source as Node).id];
            if (src.level === 0) return 1.0;
            return LINK_STRENGTH;
          }),
      )
      .force("charge", d3.forceManyBody().strength(CHARGE_STRENGTH))
      .force("radial", radialPullBack)
      .force(
        "collide",
        d3.forceCollide((d: Node) => d.r + 2),
      )
      .velocityDecay(VELOCITY_DECAY)
      .alpha(1)
      .alphaDecay(0.02);

    const center = nodes[0];
    center.fx = W / 2;
    center.fy = H / 2;

    simRef.current = sim;

    // ── Mouse handlers ─────────────────────────────────────

    function mouseFromEvent(e: MouseEvent) {
      const r = canvas!.getBoundingClientRect();
      if (r.width <= 0) return;
      mouseRef.current.x = (e.clientX - r.left) * (W / r.width);
      mouseRef.current.y = (e.clientY - r.top) * (H / r.height);
    }

    function onMouseEnter() {
      hoveringRef.current = true;
    }

    function onMouseLeave() {
      hoveringRef.current = false;
      const g = grabbedRef.current;
      if (g && g !== center) {
        g.fx = null;
        g.fy = null;
      }
      grabbedRef.current = null;
      hoverRef.current = null;
      draggingRef.current = false;
      setIsDragging(false);
      container!.classList.remove("dragging");
      sim.alphaTarget(0);
    }

    function onMouseMove(e: MouseEvent) {
      mouseFromEvent(e);
      if (!draggingRef.current) {
        hoverRef.current = pickNode(
          mouseRef.current.x,
          mouseRef.current.y,
          HOVER_RADIUS,
        );
      }
    }

    function onMouseDown(e: MouseEvent) {
      mouseFromEvent(e);
      const target = pickNode(
        mouseRef.current.x,
        mouseRef.current.y,
        PICK_RADIUS,
      );
      if (target) {
        draggingRef.current = true;
        setIsDragging(true);
        grabbedRef.current = target;
        target.fx = mouseRef.current.x;
        target.fy = mouseRef.current.y;
        container!.classList.add("dragging");
        sim.alphaTarget(0.3).restart();
      }
      e.preventDefault();
    }

    function onMouseUp() {
      const g = grabbedRef.current;
      if (g && g !== center) {
        g.fx = null;
        g.fy = null;
      }
      grabbedRef.current = null;
      draggingRef.current = false;
      setIsDragging(false);
      container!.classList.remove("dragging");
      sim.alphaTarget(0);
    }

    container.addEventListener("mouseenter", onMouseEnter);
    container.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      sim.stop();
      container.removeEventListener("mouseenter", onMouseEnter);
      container.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [render, pickNode]);

  return (
    <div
      ref={containerRef}
      className="absolute -top-[10%] md:top-0 left-1/2 -translate-x-1/2 overflow-hidden bg-black select-none pointer-events-auto"
      style={{
        cursor: isDragging ? "grabbing" : "grab",
        opacity: 0.5,
        width: `${W}px`,
        height: `${H}px`,
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block pointer-events-auto"
      />
    </div>
  );
}
