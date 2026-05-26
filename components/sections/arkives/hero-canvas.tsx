"use client";

import { useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";

// Base design dimensions
const BASE_W = 1920;
const BASE_H = 1080;

// Graph shape — optimized but dense
const CATEGORIES = 20;
const CLUSTER_MIN = 8;
const CLUSTER_MAX = 16;
const CROSS_LINK_PROB = 0.15;
const SUB_BRANCH_PROB = 0.15;
const SUB_BRANCH_MIN = 1;
const SUB_BRANCH_MAX = 3;

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

// Perf thresholds
const ALPHA_IDLE = 0.003; // stop rAF when sim settles below this
const RESIZE_DEBOUNCE = 300; // ms

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

    const reducedMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = reducedMedia.matches;

    // DPR capped at 2 for perf
    const DPR = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
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
    for (let i = 0; i < CATEGORIES; i++) {
      const cat = makeNode(1);
      const ang = (i / CATEGORIES) * Math.PI * 2;
      cat.x = cx + Math.cos(ang) * 35 * scale;
      cat.y = cy + Math.sin(ang) * 35 * scale;
      categories.push(cat);
      links.push({ source: center.id, target: cat.id });
    }

    for (const cat of categories) {
      const leafCount =
        CLUSTER_MIN + Math.floor(Math.random() * (CLUSTER_MAX - CLUSTER_MIN));
      const leaves: GraphNode[] = [];
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

      // Cross-links — sampled, not exhaustive
      for (const leaf of leaves) {
        if (Math.random() >= CROSS_LINK_PROB) continue;
        const otherCat =
          categories[Math.floor(Math.random() * categories.length)];
        if (otherCat === cat) continue;
        // Pick a random leaf from other cat (fast: pick any link that touches it)
        const otherLinks = links.filter(
          (l) =>
            (typeof l.source === "number"
              ? l.source
              : (l.source as GraphNode).id) === otherCat.id ||
            (typeof l.target === "number"
              ? l.target
              : (l.target as GraphNode).id) === otherCat.id,
        );
        if (!otherLinks.length) continue;
        const picked =
          otherLinks[Math.floor(Math.random() * otherLinks.length)];
        const tgtId =
          (typeof picked.source === "number"
            ? picked.source
            : (picked.source as GraphNode).id) === otherCat.id
            ? typeof picked.target === "number"
              ? picked.target
              : (picked.target as GraphNode).id
            : typeof picked.source === "number"
              ? picked.source
              : (picked.source as GraphNode).id;
        if (tgtId !== center.id) {
          links.push({ source: leaf.id, target: tgtId });
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
      .force("charge", d3.forceManyBody().strength(CHARGE_STRENGTH))
      .force("radial", radialPullBack)
      .force(
        "collide",
        d3.forceCollide((d) => (d as GraphNode).r + 2 * scale),
      )
      .velocityDecay(VELOCITY_DECAY)
      .alpha(1)
      .alphaDecay(0.02)
      .stop(); // Stop d3's internal timer — we tick manually in rAF

    center.fx = cx;
    center.fy = cy;

    // ── Picking ──────────────────────────────────────
    function pickNode(x: number, y: number, radius: number): GraphNode | null {
      let best: GraphNode | null = null,
        bestD = radius * radius;
      for (const n of nodes) {
        const dx = n.x - x,
          dy = n.y - y,
          d2 = dx * dx + dy * dy;
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

    // ── Events ───────────────────────────────────────
    function isInsideBounds(x: number, y: number) {
      return x >= 0 && x <= W && y >= 0 && y <= H;
    }

    function wake() {
      if (sim.alpha() < ALPHA_IDLE && !dragging && !hovering) {
        sim.alpha(0.05);
        sim.alphaTarget(0);
        // rAF will restart because simAlpha > ALPHA_IDLE
      }
    }

    function onMouseEnter() {
      hovering = true;
      wake();
    }
    function onMouseLeave() {
      hovering = false;
      // Don't reset drag — let mouseup handle it
      if (!dragging) {
        hoverNode = null;
        container.style.cursor = "default";
        sim.alphaTarget(0);
      }
    }
    function onGlobalMove(e: MouseEvent) {
      mouseFromCachedRect(e);
      // Check if mouse is actually over the canvas
      const rect = cachedRect;
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      if (mx >= 0 && mx <= W && my >= 0 && my <= H) {
        if (!hovering) {
          hovering = true;
        }
      } else {
        if (hovering) {
          hovering = false;
        }
      }
      wake();
    }
    function onGlobalMouseDown(e: MouseEvent) {
      mouseFromCachedRect(e);
      if (!isInsideBounds(pendingMouseX, pendingMouseY)) return;
      const target = pickNode(pendingMouseX, pendingMouseY, PICK_RADIUS);
      if (target) {
        dragging = true;
        grabbed = target;
        grabbed.fx = pendingMouseX;
        grabbed.fy = pendingMouseY;
        container.style.cursor = "grabbing";
        sim.alpha(0.3);
        sim.alphaTarget(0.1);
      }
      e.preventDefault();
    }
    function onGlobalMouseUp() {
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
    window.addEventListener("mousedown", onGlobalMouseDown);
    window.addEventListener("mouseup", onGlobalMouseUp);

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
      cleanupRef.current = () => {
        container.removeEventListener("mouseenter", onMouseEnter);
        container.removeEventListener("mouseleave", onMouseLeave);
        window.removeEventListener("mousemove", onGlobalMove);
        window.removeEventListener("mousedown", onGlobalMouseDown);
        window.removeEventListener("mouseup", onGlobalMouseUp);
      };
      return;
    }

    // ── Render loop (adaptive) ───────────────────────
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

    let rafId = 0;
    let running = true;
    const linkForce = sim.force<d3.ForceLink<GraphNode, GraphLink>>("link")!;

    function render() {
      if (!running) return;

      // Tick the simulation manually — sync with rAF
      sim.tick();

      // Process pending mouse position
      if (mouseDirty) {
        mouseX = pendingMouseX;
        mouseY = pendingMouseY;
        mouseDirty = false;
        if (!dragging) hoverNode = pickNode(mouseX, mouseY, HOVER_RADIUS);
      }

      if (dragging && grabbed) {
        grabbed.fx = mouseX;
        grabbed.fy = mouseY;
        // Boost link strength during drag so connected nodes trail more
        sim.force<d3.ForceLink<GraphNode, GraphLink>>("link")?.strength(0.95);
      } else {
        // Restore normal strength
        sim
          .force<d3.ForceLink<GraphNode, GraphLink>>("link")
          ?.strength(LINK_STRENGTH);
      }

      const simActive = sim.alpha() > ALPHA_IDLE;

      // Only redraw if something changed
      if (simActive || dragging || hovering) {
        ctx.fillStyle = BG_COLOR;
        ctx.fillRect(0, 0, W, H);

        const resolvedLinks = linkForce.links();
        ctx.lineWidth = Math.max(0.5, 0.8 * scale);
        for (const l of resolvedLinks) {
          const hl = isLinkHighlighted(l, hoverNode || grabbed);
          ctx.strokeStyle = hl ? LINK_HOVER : LINK_COLOR;
          ctx.beginPath();
          ctx.moveTo((l.source as GraphNode).x, (l.source as GraphNode).y);
          ctx.lineTo((l.target as GraphNode).x, (l.target as GraphNode).y);
          ctx.stroke();
        }

        for (const n of nodes) {
          const isHovered = n === hoverNode || n === grabbed;
          ctx.fillStyle = isHovered ? HOVER_NODE_COLOR : n.color;
          ctx.beginPath();
          ctx.arc(n.x, n.y, isHovered ? n.r * 1.4 : n.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Stop loop if nothing is happening
      if (!simActive && !dragging && !hovering) {
        rafId = 0;
        return;
      }
      rafId = requestAnimationFrame(render);
    }
    rafId = requestAnimationFrame(render);

    // Update cached rect on resize (called from ResizeObserver)
    function onResize() {
      updateCachedRect();
    }

    cleanupRef.current = () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
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
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />
    </div>
  );
}
