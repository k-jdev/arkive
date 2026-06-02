"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function GraphBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const heroEl = containerRef.current;
    if (!canvas || !heroEl) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rAF: number;
    let sim: d3.Simulation<any, any>;

    // -------- config --------
    const W = 1920;
    const H = 1080;

    const PRACTICES = [
      { name: 'Trading', children: ['positions', 'trades', 'strategies', 'signals', 'pnl'] },
      { name: 'Business', children: ['customers', 'decisions', 'metrics', 'pipeline', 'okrs'] },
      { name: 'Research', children: ['sources', 'claims', 'notes', 'questions'] },
      { name: 'Legal', children: ['matters', 'precedents', 'contracts', 'filings'] },
      { name: 'Health', children: ['symptoms', 'protocol', 'labs', 'sleep', 'meds'] },
      { name: 'Writing', children: ['drafts', 'ideas', 'outlines', 'edits'] },
      { name: 'Learning', children: ['courses', 'flashcards', 'highlights', 'reviews'] },
      { name: 'Personal', children: ['journal', 'goals', 'habits', 'people'] },
    ];

    const BACKLINKS = [
      ['claims', 'precedents'],
      ['decisions', 'pnl'],
      ['protocol', 'notes'],
      ['contracts', 'customers'],
      ['sources', 'signals'],
      ['metrics', 'labs'],
      ['ideas', 'questions'],
      ['highlights', 'sources'],
      ['drafts', 'matters'],
      ['journal', 'sleep'],
      ['goals', 'okrs'],
      ['flashcards', 'protocol'],
      ['people', 'customers'],
    ];

    const LEAVES_PER_SUB_MIN = 1;
    const LEAVES_PER_SUB_MAX = 3;

    const BG_COLOR = '#000000';
    const CENTER_FILL = '#0E0E10';
    const CENTER_STROKE = '#E8E8EA';
    const PRACTICE_COLOR = '#D8D9DD';
    const PRACTICE_TEXT = '#F2F2F4';
    const SUB_COLOR = '#4E4F53';
    const SUB_TEXT = '#5C5D63';
    const LEAF_COLOR = '#3D3F44';
    const LINK_PRIMARY = 'rgba(216,217,221,0.45)';
    const LINK_BRANCH = 'rgba(216,217,221,0.22)';
    const LINK_SECONDARY = 'rgba(216,217,221,0.10)';
    const LINK_BACKLINK = 'rgba(140,142,150,0.14)';
    const HOVER_COLOR = '#FFFFFF';
    const LINK_HOVER = 'rgba(255,255,255,0.7)';

    const R_CENTER = 28;
    const R_PRACTICE = 6;
    const R_SUB = 4;
    const R_LEAF = 2;

    const LINK_DISTANCE = 110;
    const VELOCITY_DECAY = 0.5;

    const RADIAL_SOFT_ZONE = 420;
    const RADIAL_STRENGTH = 0.06;
    const RADIAL_EXPONENT = 1.6;

    const FONT_PRACTICE = "600 18px 'Inter', system-ui, sans-serif";
    const FONT_SUB = "500 14px 'Inter', system-ui, sans-serif";

    const LABEL_GAP = 12;
    const HOVER_RADIUS = 18;
    const PICK_RADIUS = 30;

    const DPR = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.scale(DPR, DPR);
    ctx.textRendering = 'geometricPrecision';

    let mouseX = -9999, mouseY = -9999;
    let hovering = false;
    let dragging = false;
    let grabbed: any = null;
    let hoverNode: any = null;

    function mouseFromEvent(e: MouseEvent | TouchEvent) {
      if (!canvas) return;
      const r = canvas.getBoundingClientRect();
      if (r.width <= 0) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      mouseX = (clientX - r.left) * (W / r.width);
      mouseY = (clientY - r.top) * (H / r.height);
    }

    const nodes: any[] = [];
    const links: any[] = [];

    function makeNode(level: number, label: string | null) {
      const id = nodes.length;
      const node = {
        id, level, label: label || null,
        x: W / 2 + (Math.random() - 0.5) * 200,
        y: H / 2 + (Math.random() - 0.5) * 200,
        r: level === 0 ? R_CENTER :
          level === 1 ? R_PRACTICE :
            level === 2 ? R_SUB : R_LEAF,
        fx: null as number | null,
        fy: null as number | null,
        vx: 0,
        vy: 0
      };
      nodes.push(node);
      return node;
    }

    const center = makeNode(0, 'Arkive');
    center.fx = W / 2;
    center.fy = H / 2;

    const subByName: Record<string, any> = {};
    PRACTICES.forEach((p, i) => {
      const ang = (i / PRACTICES.length) * Math.PI * 2 - Math.PI / 2;
      const practice = makeNode(1, p.name);
      practice.x = W / 2 + Math.cos(ang) * 110;
      practice.y = H / 2 + Math.sin(ang) * 110;
      links.push({ source: center.id, target: practice.id, kind: 'primary' });

      p.children.forEach((childName, k) => {
        const sub = makeNode(2, childName);
        const childAng = ang + ((k - (p.children.length - 1) / 2) * 0.35);
        sub.x = W / 2 + Math.cos(childAng) * 380;
        sub.y = H / 2 + Math.sin(childAng) * 380;
        links.push({ source: practice.id, target: sub.id, kind: 'primary' });
        subByName[childName] = sub;

        const leafN = LEAVES_PER_SUB_MIN + Math.floor(Math.random() * (LEAVES_PER_SUB_MAX - LEAVES_PER_SUB_MIN + 1));
        for (let m = 0; m < leafN; m++) {
          const leaf = makeNode(3, null);
          const lAng = childAng + (Math.random() - 0.5) * 0.5;
          leaf.x = W / 2 + Math.cos(lAng) * 460;
          leaf.y = H / 2 + Math.sin(lAng) * 460;
          links.push({ source: sub.id, target: leaf.id, kind: 'secondary' });
        }
      });
    });

    for (const [a, b] of BACKLINKS) {
      const sa = subByName[a], sb = subByName[b];
      if (sa && sb) {
        links.push({ source: sa.id, target: sb.id, kind: 'backlink' });
      }
    }

    function radialPullBack(alpha: number) {
      const cx = W / 2, cy = H / 2;
      for (const n of nodes) {
        if (n.fx !== null && n.fx !== undefined) continue;
        const dx = cx - n.x, dy = cy - n.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 0.001) continue;
        const excess = Math.max(0, d - RADIAL_SOFT_ZONE);
        const k = RADIAL_STRENGTH * Math.pow(excess / RADIAL_SOFT_ZONE, RADIAL_EXPONENT) * alpha;
        n.vx += (dx / d) * k * d;
        n.vy += (dy / d) * k * d;
      }
    }

    sim = d3.forceSimulation(nodes)
      .force('link',
        d3.forceLink(links)
          .id((d: any) => d.id)
          .distance((d: any) => {
            const srcLvl = nodes[d.source.id ?? d.source].level;
            if (srcLvl === 0) return LINK_DISTANCE * 0.65;
            if (srcLvl === 1) return LINK_DISTANCE * 1.0;
            if (srcLvl === 2) return LINK_DISTANCE * 0.45;
            return LINK_DISTANCE;
          })
          .strength((d: any) => {
            if (d.kind === 'backlink') return 0.05;
            if (nodes[d.source.id ?? d.source].level === 0) return 1.0;
            return 0.6;
          })
      )
      .force('charge',
        d3.forceManyBody()
          .strength((d: any) => {
            if (d.level === 0) return -30;
            if (d.level === 1) return -180;
            if (d.level === 2) return -120;
            return -40;
          })
      )
      .force('collide', d3.forceCollide((d: any) => d.r + (d.level <= 2 ? 18 : 4)))
      .force('radial', radialPullBack)
      .velocityDecay(VELOCITY_DECAY)
      .alpha(1)
      .alphaDecay(0.02);

    function pickNode(x: number, y: number, radius: number) {
      let best = null, bestD = radius * radius;
      for (const n of nodes) {
        const dx = n.x - x, dy = n.y - y;
        const rad = (n.level === 0 ? R_CENTER : 0) + radius;
        const d2 = dx * dx + dy * dy;
        if (d2 < rad * rad && d2 < bestD) { bestD = d2; best = n; }
      }
      return best;
    }

    // Interaction handlers
    const onMouseEnter = () => { hovering = true; };
    const onMouseLeave = () => {
      hovering = false;
      if (grabbed && grabbed !== center) { grabbed.fx = null; grabbed.fy = null; }
      grabbed = null;
      hoverNode = null;
      dragging = false;
      document.body.style.cursor = 'default';
      sim.alphaTarget(0);
    };
    const onMouseMove = (e: MouseEvent | TouchEvent) => {
      mouseFromEvent(e);
      if (!dragging) {
        hoverNode = pickNode(mouseX, mouseY, HOVER_RADIUS);
        if (hoverNode) document.body.style.cursor = 'grab';
        else document.body.style.cursor = 'default';
      } else {
        document.body.style.cursor = 'grabbing';
      }
    };
    const onMouseDown = (e: MouseEvent | TouchEvent) => {
      mouseFromEvent(e);
      const target = pickNode(mouseX, mouseY, PICK_RADIUS);
      if (target) {
        dragging = true;
        grabbed = target;
        grabbed.fx = mouseX;
        grabbed.fy = mouseY;
        document.body.style.cursor = 'grabbing';
        sim.alphaTarget(0.3).restart();
      }
    };
    const onMouseUp = () => {
      if (grabbed && grabbed !== center) { grabbed.fx = null; grabbed.fy = null; }
      grabbed = null;
      dragging = false;
      document.body.style.cursor = hoverNode ? 'grab' : 'default';
      sim.alphaTarget(0);
    };

    heroEl.addEventListener('mouseenter', onMouseEnter);
    heroEl.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onMouseMove, { passive: true });
    heroEl.addEventListener('mousedown', onMouseDown);
    heroEl.addEventListener('touchstart', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchend', onMouseUp);

    function isLinkOnNode(l: any, node: any) {
      if (!node) return false;
      return l.source === node || l.target === node;
    }

    function render() {
      if (!ctx) return;
      if (dragging && grabbed) {
        grabbed.fx = mouseX;
        grabbed.fy = mouseY;
      }

      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, W, H);

      const order = ['backlink', 'secondary', 'primary'];
      for (const kind of order) {
        ctx.lineWidth = kind === 'primary' ? 1.2 : (kind === 'backlink' ? 1.0 : 0.9);
        for (const l of links) {
          if (l.kind !== kind) continue;
          const hl = isLinkOnNode(l, hoverNode || grabbed);
          let color;
          if (hl) {
            color = LINK_HOVER;
          } else if (kind === 'primary') {
            const srcLvl = l.source.level;
            color = srcLvl === 0 ? LINK_PRIMARY : LINK_BRANCH;
          } else if (kind === 'backlink') {
            color = LINK_BACKLINK;
          } else {
            color = LINK_SECONDARY;
          }
          ctx.strokeStyle = color;
          ctx.beginPath();
          ctx.moveTo(l.source.x, l.source.y);
          ctx.lineTo(l.target.x, l.target.y);
          ctx.stroke();
        }
      }

      for (const n of nodes) {
        if (n.level !== 3) continue;
        const isHovered = (n === hoverNode) || (n === grabbed);
        ctx.fillStyle = isHovered ? HOVER_COLOR : LEAF_COLOR;
        ctx.beginPath();
        ctx.arc(n.x, n.y, isHovered ? n.r * 1.5 : n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      for (const n of nodes) {
        if (n.level !== 2) continue;
        const isHovered = (n === hoverNode) || (n === grabbed);
        ctx.fillStyle = isHovered ? HOVER_COLOR : SUB_COLOR;
        ctx.beginPath();
        ctx.arc(n.x, n.y, isHovered ? n.r * 1.3 : n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      for (const n of nodes) {
        if (n.level !== 1) continue;
        const isHovered = (n === hoverNode) || (n === grabbed);
        ctx.fillStyle = isHovered ? HOVER_COLOR : PRACTICE_COLOR;
        ctx.beginPath();
        ctx.arc(n.x, n.y, isHovered ? n.r * 1.25 : n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // white dot (larger)
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(center.x, center.y, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.textBaseline = 'middle';

      function placeLabel(n: any, font: string, color: string, gap: number) {
        if (!ctx) return;
        ctx.font = font;
        ctx.fillStyle = color;
        const dx = n.x - W / 2;
        const dy = n.y - H / 2;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        const ox = dx / d, oy = dy / d;
        const lx = n.x + ox * (n.r + gap);
        const ly = n.y + oy * (n.r + gap);
        ctx.textAlign = ox > 0.2 ? 'left' : ox < -0.2 ? 'right' : 'center';
        const baseline = oy < -0.5 ? 'bottom' : oy > 0.5 ? 'top' : 'middle';
        ctx.textBaseline = baseline;
        ctx.fillText(n.label, lx, ly);
      }

      for (const n of nodes) {
        if (n.level !== 1) continue;
        placeLabel(n, FONT_PRACTICE, PRACTICE_TEXT, LABEL_GAP);
      }
      for (const n of nodes) {
        if (n.level !== 2) continue;
        placeLabel(n, FONT_SUB, SUB_TEXT, LABEL_GAP - 4);
      }

      rAF = requestAnimationFrame(render);
    }
    rAF = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rAF);
      sim.stop();
      heroEl.removeEventListener('mouseenter', onMouseEnter);
      heroEl.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onMouseMove);
      heroEl.removeEventListener('mousedown', onMouseDown);
      heroEl.removeEventListener('touchstart', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchend', onMouseUp);
      document.body.style.cursor = 'default';
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1920px] h-[1080px] opacity-45 z-0 pointer-events-auto"
    >
      <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
    </div>
  );
}
