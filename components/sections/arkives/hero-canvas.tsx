"use client";

import { useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";

// Base design dimensions
const BASE_W = 1920;
const BASE_H = 1080;

// Graph shape — balanced for perf at 1920px
const CATEGORIES = 14;
const CLUSTER_MIN = 6;
const CLUSTER_MAX = 12;
const CROSS_LINK_PROB = 0.12;
const SUB_BRANCH_PROB = 0.08;
const SUB_BRANCH_MIN = 1;
const SUB_BRANCH_MAX = 2;

// Accent
const ACCENT_COLOR = "#1F3299";
const ACCENT_FRACTION = 0.07;

// Visuals
const NODE_CENTER = "#747476";
const NODE_HUB = "#6C6D6F";
const NODE_LEAF = "#646467";
const NODE_TINY = "#4E4F52";
const LINK_COLOR = "rgba(90,91,95,0.08)";
const LINK_HOVER = "rgba(110,111,114,0.28)";
const HOVER_NODE_COLOR = "#B0B0B4";

// Base sizes
const BASE_R_CENTER = 4.6;
const BASE_R_HUB = 3.4;
const BASE_R_LEAF = 2.8;
const BASE_R_TINY = 2.2;

// Forces
const BASE_LINK_DISTANCE = 42;
const LINK_STRENGTH = 0.85;
const BASE_CHARGE_STRENGTH = -28;
const VELOCITY_DECAY = 0.5;
const RADIAL_EXPONENT = 1.6;
const CENTER_GRAVITY = 0.015;

// Interaction
const BASE_HOVER_RADIUS = 14;
const BASE_PICK_RADIUS = 22;

// Perf
const RESIZE_DEBOUNCE = 300; // ms
const DPR_CAP = 1.5; // cap devicePixelRatio for perf at large viewports

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
  const cleanupRef = useRef<(() => void) | null>(null);
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const initGraph = useCallback(() => {
    const canvas = canvasRef.current!;
    const container = containerRef.current!;
    const ctx = canvas.getContext("2d")!;

    cleanupRef.current?.();

    const W = container.clientWidth;
    const H = container.clientHeight;
    if (W <= 0 || H <= 0) return;

    const scale = Math.min(W / BASE_W, H / BASE_H);
    const cx = W / 2;
    const cy = H / 2;

    const R_CENTER = BASE_R_CENTER * scale;
    const R_HUB = BASE_R_HUB * scale;
    const R_LEAF = BASE_R_LEAF * scale;
    const R_TINY = BASE_R_TINY * scale;
    const LINK_DISTANCE = BASE_LINK_DISTANCE * scale;
    const CHARGE_STRENGTH = BASE_CHARGE_STRENGTH * scale;
    const RADIAL_SOFT_ZONE = 290 * scale;
    const RADIAL_STRENGTH = 0.05;
    const HOVER_RADIUS = BASE_HOVER_RADIUS * scale;
    const PICK_RADIUS = BASE_PICK_RADIUS * scale;

    // DPR capped for perf — at 1920px, full DPR kills framerate
    const DPR = Math.min(DPR_CAP, Math.max(1, window.devicePixelRatio || 1));
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    // Cached bounding rect — updated on resize only
    let cachedRect = canvas.getBoundingClientRect();
    function updateCachedRect() {
      cachedRect = canvas.getBoundingClientRect();
    }
    updateCachedRect();

    let mouseX = -9999;
    let mouseY = -9999;
    let pendingMouseX = -9999;
    let pendingMouseY = -9999;
    let mouseDirty = false;
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
        x: cx + (Math.random() - 0.5) * 200 * scale,
        y: cy + (Math.random() - 0.5) * 200 * scale,
        vx: 0,
        vy: 0,
      };
      nodes.push(node);
      return node;
    }

    const center = makeNode(0);
    const categories: GraphNode[] = [];
    // Leaf index per category for fast cross-linking
    const catLeaves = new Map<GraphNode, GraphNode[]>();

    for (let i = 0; i < CATEGORIES; i++) {
      const cat = makeNode(1);
      const ang = (i / CATEGORIES) * Math.PI * 2;
      cat.x = cx + Math.cos(ang) * 35 * scale;
      cat.y = cy + Math.sin(ang) * 35 * scale;
      categories.push(cat);
      catLeaves.set(cat, []);
      links.push({ source: center.id, target: cat.id });
    }

    for (const cat of categories) {
      const leafCount =
        CLUSTER_MIN + Math.floor(Math.random() * (CLUSTER_MAX - CLUSTER_MIN));
      const leaves = catLeaves.get(cat)!;
      for (let j = 0; j < leafCount; j++) {
        const leaf = makeNode(2);
        leaf.x = cat.x + (Math.random() - 0.5) * 120 * scale;
        leaf.y = cat.y + (Math.random() - 0.5) * 120 * scale;
        links.push({ source: cat.id, target: leaf.id });
        leaves.push(leaf);

        if (Math.random() < SUB_BRANCH_PROB) {
          const sn =
            SUB_BRANCH_MIN +
            Math.floor(Math.random() * (SUB_BRANCH_MAX - SUB_BRANCH_MIN + 1));
          for (let k = 0; k < sn; k++) {
            const sub = makeNode(3);
            sub.x = leaf.x + (Math.random() - 0.5) * 50 * scale;
            sub.y = leaf.y + (Math.random() - 0.5) * 50 * scale;
            links.push({ source: leaf.id, target: sub.id });
          }
        }
      }

      // Cross-links — O(1) per leaf via pre-built index
      for (const leaf of leaves) {
        if (Math.random() >= CROSS_LINK_PROB) continue;
        const otherCats = categories.filter((c) => c !== cat);
        if (otherCats.length === 0) continue;
        const otherCat =
          otherCats[Math.floor(Math.random() * otherCats.length)];
        const otherLeaves = catLeaves.get(otherCat)!;
        if (otherLeaves.length === 0) continue;
        const tgt = otherLeaves[Math.floor(Math.random() * otherLeaves.length)];
        links.push({ source: leaf.id, target: tgt.id });
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
        const softZone = n.detached
          ? RADIAL_SOFT_ZONE + 40 * scale
          : RADIAL_SOFT_ZONE;
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
      .alphaDecay(0.08) // fast settle — run synchronously
      .stop();

    center.fx = cx;
    center.fy = cy;

    // ── Run simulation synchronously to completion ──
    const MAX_TICKS = 150;
    for (let i = 0; i < MAX_TICKS; i++) {
      sim.tick();
      if (sim.alpha() < 0.001) break;
    }

    const linkForce = sim.force<d3.ForceLink<GraphNode, GraphLink>>("link")!;
    const resolvedLinks = linkForce.links();

    // Precompute link index per node for O(1) highlight lookups
    const nodeLinkIndices = new Map<number, number[]>();
    for (let i = 0; i < resolvedLinks.length; i++) {
      const s = resolvedLinks[i].source as GraphNode;
      const t = resolvedLinks[i].target as GraphNode;
      if (!nodeLinkIndices.has(s.id)) nodeLinkIndices.set(s.id, []);
      nodeLinkIndices.get(s.id)!.push(i);
      if (!nodeLinkIndices.has(t.id)) nodeLinkIndices.set(t.id, []);
      nodeLinkIndices.get(t.id)!.push(i);
    }

    // Pre-bucket nodes by color for batched drawing
    const colorBuckets = new Map<string, GraphNode[]>();
    for (const n of nodes) {
      const c = n.color;
      if (!colorBuckets.has(c)) colorBuckets.set(c, []);
      colorBuckets.get(c)!.push(n);
    }

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

    function mouseFromCachedRect(e: MouseEvent) {
      if (cachedRect.width <= 0) return;
      pendingMouseX = (e.clientX - cachedRect.left) * (W / cachedRect.width);
      pendingMouseY = (e.clientY - cachedRect.top) * (H / cachedRect.height);
      mouseDirty = true;
    }

    // ── Pure draw function (zero simulation) ─────────
    const lw = Math.max(0.5, 0.8 * scale);

    function drawFrame(
      hlNode: GraphNode | null,
      grabNode: GraphNode | null,
      gx: number,
      gy: number,
    ) {
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = lw;

      // Which link indices to highlight
      const hlLinkSet = new Set<number>();
      const active = hlNode || grabNode;
      if (active) {
        const indices = nodeLinkIndices.get(active.id);
        if (indices) for (const idx of indices) hlLinkSet.add(idx);
      }

      // Normal links — one stroke (no offset needed, grabbed links are in hlLinkSet)
      ctx.strokeStyle = LINK_COLOR;
      ctx.beginPath();
      for (let i = 0; i < resolvedLinks.length; i++) {
        if (hlLinkSet.has(i)) continue;
        const s = resolvedLinks[i].source as GraphNode;
        const t = resolvedLinks[i].target as GraphNode;
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(t.x, t.y);
      }
      ctx.stroke();

      // Highlighted links — offset endpoints if grabbed
      if (hlLinkSet.size > 0) {
        ctx.strokeStyle = LINK_HOVER;
        ctx.beginPath();
        for (const i of hlLinkSet) {
          const s = resolvedLinks[i].source as GraphNode;
          const t = resolvedLinks[i].target as GraphNode;
          const sx = grabNode && s === grabNode ? gx : s.x;
          const sy = grabNode && s === grabNode ? gy : s.y;
          const tx = grabNode && t === grabNode ? gx : t.x;
          const ty = grabNode && t === grabNode ? gy : t.y;
          ctx.moveTo(sx, sy);
          ctx.lineTo(tx, ty);
        }
        ctx.stroke();
      }

      // Nodes by color batch
      for (const [color, group] of colorBuckets) {
        const visible = active ? group.filter((n) => n !== active) : group;
        if (visible.length === 0) continue;
        ctx.fillStyle = color;
        ctx.beginPath();
        for (const n of visible) {
          ctx.moveTo(n.x + n.r, n.y);
          ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        }
        ctx.fill();
      }

      // Grabbed node on top (at mouse position)
      if (grabNode) {
        ctx.fillStyle = HOVER_NODE_COLOR;
        ctx.beginPath();
        ctx.arc(gx, gy, grabNode.r * 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
      // Hovered node on top (at its original position)
      else if (hlNode && hlNode !== grabNode) {
        ctx.fillStyle = HOVER_NODE_COLOR;
        ctx.beginPath();
        ctx.arc(hlNode.x, hlNode.y, hlNode.r * 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initial static render
    drawFrame(null, null, 0, 0);

    // ── Event handlers (no wake, no sim ticks) ───────
    function isInsideBounds(x: number, y: number) {
      return x >= 0 && x <= W && y >= 0 && y <= H;
    }

    function onMouseEnter() {
      hovering = true;
    }
    function onMouseLeave() {
      hovering = false;
      if (!dragging) {
        hoverNode = null;
        container.style.cursor = "default";
        drawFrame(null, null, 0, 0);
      }
    }
    function onGlobalMove(e: MouseEvent) {
      mouseFromCachedRect(e);
      if (!mouseDirty) return;
      mouseX = pendingMouseX;
      mouseY = pendingMouseY;
      mouseDirty = false;

      const rect = cachedRect;
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      hovering = mx >= 0 && mx <= W && my >= 0 && my <= H;

      if (dragging) {
        drawFrame(null, grabbed, mouseX, mouseY);
      } else if (hovering) {
        const prev = hoverNode;
        hoverNode = pickNode(mouseX, mouseY, HOVER_RADIUS);
        if (hoverNode !== prev) drawFrame(hoverNode, null, 0, 0);
      } else if (hoverNode) {
        hoverNode = null;
        drawFrame(null, null, 0, 0);
      }
    }
    function onGlobalMouseDown(e: MouseEvent) {
      mouseFromCachedRect(e);
      if (!mouseDirty) return;
      mouseX = pendingMouseX;
      mouseY = pendingMouseY;
      mouseDirty = false;
      if (!isInsideBounds(mouseX, mouseY)) return;

      const target = pickNode(mouseX, mouseY, PICK_RADIUS);
      if (target && target !== center) {
        dragging = true;
        grabbed = target;
        container.style.cursor = "grabbing";
        drawFrame(null, grabbed, mouseX, mouseY);
      }
      e.preventDefault();
    }
    function onGlobalMouseUp() {
      if (grabbed) {
        // Snap node back to its original position
        grabbed = null;
      }
      dragging = false;
      container.style.cursor = "default";
      drawFrame(hoverNode, null, 0, 0);
    }

    container.addEventListener("mouseenter", onMouseEnter);
    container.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("mousemove", onGlobalMove);
    window.addEventListener("mousedown", onGlobalMouseDown);
    window.addEventListener("mouseup", onGlobalMouseUp);

    // Update cached rect on resize (called from ResizeObserver)
    function onResize() {
      updateCachedRect();
    }

    cleanupRef.current = () => {
      container.removeEventListener("mouseenter", onMouseEnter);
      container.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("mousemove", onGlobalMove);
      window.removeEventListener("mousedown", onGlobalMouseDown);
      window.removeEventListener("mouseup", onGlobalMouseUp);
    };

    // Expose onResize for the ResizeObserver
    (container as unknown as Record<string, unknown>).__resizeHandler =
      onResize;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let initTimer: ReturnType<typeof setTimeout> | null = null;

    const handleResize = () => {
      // Debounce: clear previous timer
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = setTimeout(() => {
        // Update cached rect in the existing instance if possible
        const handler = (container as unknown as Record<string, unknown>)
          .__resizeHandler;
        if (typeof handler === "function") handler();
        // Re-init with debounce
        initGraph();
      }, RESIZE_DEBOUNCE);
    };

    // Initial render
    initTimer = setTimeout(() => initGraph(), 50);

    const ro = new ResizeObserver(() => handleResize());
    ro.observe(container);

    return () => {
      if (initTimer) clearTimeout(initTimer);
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
      ro.disconnect();
      cleanupRef.current?.();
    };
  }, [initGraph]);

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
