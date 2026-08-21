# Arkive

[![CI](https://github.com/k-jdev/arkive/actions/workflows/ci.yml/badge.svg)](https://github.com/k-jdev/arkive/actions/workflows/ci.yml)

Marketing site for **Arkive** — a universal context layer for AI models, so the same project context, decisions, and history stay understood across Claude, GPT, Gemini, and Grok instead of being re-explained every session.

**Live:** [arkive.xyz](https://www.arkive.xyz/)

## Pages

| Route | Purpose |
|---|---|
| `/` | Home — product pitch, feature overview, setup walkthrough |
| `/arkives` | "Arkives" — the journal/record concept: problems solved, model compatibility, FAQ |
| `/practices` | Practices — domains, compounding, structure of how context is built over time |
| `/project-defi` | Case study — a DeFi project built using Arkive as context source |

## Stack

- **Framework** — [Next.js 16](https://nextjs.org) (App Router, React Server Components)
- **UI** — [React 19](https://react.dev), [shadcn/ui](https://ui.shadcn.com) (`radix-maia` style) on top of [Radix UI](https://www.radix-ui.com/)
- **Styling** — [Tailwind CSS v4](https://tailwindcss.com), CSS custom properties for design tokens, `tw-animate-css`
- **Motion** — [Motion](https://motion.dev) for scroll/reveal choreography, custom `lib/animations.ts` variant library
- **Canvas / data-driven visuals** — [D3](https://d3js.org) and [p5.js](https://p5js.org) power the interactive hero canvases
- **Icons** — [Remix Icon](https://remixicon.com) via `@remixicon/react`
- **Language** — TypeScript, strict mode
- **Lint** — ESLint (`eslint-config-next`)

## Project structure

```
app/                        route segments (App Router)
  page.tsx                  home
  arkives/page.tsx
  practices/page.tsx
  project-defi/page.tsx
  layout.tsx                root layout, fonts, header/footer shell
  globals.css                design tokens as CSS variables

components/
  layout/                   header, footer — shared across all pages
  sections/
    home/                   one file per home-page section
    arkives/
    practices/
    defi/
  ui/                       shadcn primitives (button, dropdown-menu)

lib/
  animations.ts              motion variants (fade/reveal/stagger)
  motion-config.ts           reduced-motion + shared motion settings
  motion-tokens.ts           timing/easing tokens
  use-slider.ts               shared slider hook
  utils.ts                    cn() and misc helpers

public/
  sections/                  per-section imagery, organized to mirror components/sections
  icons/                     model logos (Claude, GPT, Gemini, Grok), UI icons
  fonts/                     SF Pro (self-hosted via next/font/local)
```

**Conventions:**
- One component per page section, named after what it renders — no shared "god" page files.
- Heavier below-the-fold sections (`Features`, `Slider`, canvas visuals) are loaded via `next/dynamic` to keep initial hero paint fast.
- Design tokens (color, spacing, type) are CSS custom properties (`--figma-*`) consumed directly in Tailwind arbitrary-value classes, sourced from the Figma design file.
- `usePrefersReducedMotion` gates every scroll-driven animation with a static fallback.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # serve production build
npm run lint    # ESLint
```

## License

No license granted — all rights reserved. Source is public for review purposes only; reuse requires permission.
