# Umbra UI — design proposal

Status: decided (per the brief: "decide, don't ask"). Anything here can be revisited; nothing is irreversible.

## Visual direction

Umbra is the darkest part of a shadow, and the library takes that literally: surfaces are stacked layers of
near-black that get one small step lighter as they rise, separated by 1px low-contrast borders rather than drop
shadows. Light is the scarce resource. A single violet-blue accent (`#5b5bd6` solid, `#a9a7ff` as text on dark) is
used for primary actions, focus rings and selection only; a cyan "neon" secondary exists purely for glows, beams and
3D rim light. Typography is Geist/Inter with a Geist Mono companion, a seven-step scale, and negative tracking that
tightens as size grows. Radii are tight (4/6/8/12), spacing sits on a 4px grid, and every interactive element has
distinct hover, active, focus-visible and disabled states. The light theme is the same system inverted: white
raised surfaces on an off-white canvas, same accent, same geometry.

## Decisions

| Area | Choice | Why |
| --- | --- | --- |
| Package | `umbra-ui` (unclaimed on npm at time of writing), CSS variable prefix `--umbra-`, class prefix `umbra-` | Matches the name; one prefix everywhere. |
| Styling | **Plain CSS + CSS variables**, no Tailwind | Consumers must not need Tailwind. Plain CSS ships as one static file with no build step on the consumer side, works in RSC, and theme switching is a single attribute flip. Tailwind would add a compile step to produce the same file and tempt hard-coded utility values. |
| CSS delivery | One file, `umbra-ui/styles.css`, covering all three entries. Components never import CSS from JS. | Keeps `sideEffects` accurate (`["**/*.css"]`) and tree-shaking clean. All selectors sit in `@layer umbra` so consumer CSS always wins without specificity fights. |
| Build | **tsup** (esbuild) → ESM + CJS + `.d.ts`, code-splitting on | Three entries plus lazy 3D chunks is exactly what tsup does with almost no config. Vite library mode needs more plugin work for dts and multi-entry CJS. |
| `"use client"` | Added as a banner to every emitted JS file | esbuild strips per-file directives when bundling. Everything in the library uses hooks, context or refs, so the whole package is a client boundary; server components can still render every component. |
| Tokens | `src/tokens/tokens.ts` is the single source. `scripts/build-tokens.ts` generates `tokens.css`; the same object is exported typed as `tokens`. | One source of truth, two outputs. A test fails if the generated CSS is stale. |
| Theme switch | `data-umbra-theme="dark" \| "light"` on `<html>` (or any subtree) | Attribute switching is SSR-friendly and lets consumers scope a theme to part of the page. |
| Radix | The unified `radix-ui` package as a regular dependency | One dependency rather than nine; tree-shakes per primitive. |
| Motion | `motion` (import `motion/react`) as an optional peer | It is the current name of Framer Motion. `framer-motion` users can alias; documented in the README. |
| 3D | `three`, `@react-three/fiber`, `@react-three/drei` as optional peers | Required by the brief. |
| Monorepo | npm workspaces (`packages/*`, `apps/*`); `examples/` is deliberately **outside** the workspace | pnpm is not installed on this machine and npm workspaces are enough. Keeping `examples/` out means it can only consume the packed tarball, like a real user. |
| Docs deploy | Next.js static export (`output: "export"`) + root `vercel.json` | The docs are fully static, so `npx vercel --prod` from the repo root works with no dashboard configuration. |
| Tooling versions | TypeScript 5.9, ESLint 9, Vitest 3, Vite 6, Storybook 8.6 | The newest majors (TS 7, ESLint 10, Vitest 5) are not yet supported by Storybook 8 / the a11y lint plugin. |

### Conflicts in the brief, and what I did about them

1. **"React 18 and 19" vs. React Three Fiber.** R3F 9 / drei 10 require React 19; R3F 8 / drei 9 require React 18.
   No single R3F version covers both. The root and `/motion` entries support React 18 and 19. `/3d` declares
   `@react-three/fiber ^8.17 || ^9` and `@react-three/drei ^9.114 || ^10` and only uses API common to both, so
   React 18 users pair it with R3F 8. Development and CI's main job run on React 19; a second CI job runs the test
   suite on React 18.
2. **Low-contrast 1px borders vs. WCAG 1.4.11 (3:1 for control boundaries).** Decorative borders (cards, dividers)
   stay low-contrast. Form controls whose border is the only thing identifying them (input, select, checkbox,
   radio, switch track) use a separate `border-control` token that meets 3:1 in both themes.
3. **"Built on Motion" vs. "Static entry must not import framer-motion".** Skeleton's pulse and the Dialog/Popover
   enter transitions in the static entry are CSS keyframes driven by the same motion tokens.

## Tokens

All values are exposed as `--umbra-<group>-<name>` and as `tokens.<group>.<name>` in TypeScript.

### Color

| Token | Dark | Light | Use |
| --- | --- | --- | --- |
| `bg` | `#08090a` | `#f7f7f8` | Page canvas |
| `bg-subtle` | `#0c0d0f` | `#f1f1f3` | Inset wells, code blocks |
| `surface-1` | `#111214` | `#ffffff` | Cards, inputs |
| `surface-2` | `#17181b` | `#f4f4f6` | Popovers, hover on surface-1 |
| `surface-3` | `#1e1f23` | `#eaeaee` | Active / selected, hover on surface-2 |
| `overlay` | `rgba(4,4,6,0.72)` | `rgba(16,17,20,0.4)` | Dialog scrim |
| `border-subtle` | `#1f2024` | `#e8e8ec` | Dividers, table rows |
| `border` | `#2a2c31` | `#dcdce2` | Card and popover outlines |
| `border-strong` | `#3a3d44` | `#c4c5ce` | Hovered outlines |
| `border-control` | `#676b77` | `#7d808c` | Form control boundaries (≥ 3:1) |
| `text` | `#f4f5f7` | `#0e0f12` | Primary text |
| `text-secondary` | `#adb0b9` | `#4b4f59` | Body copy, labels |
| `text-muted` | `#8a8e99` | `#666a75` | Placeholders, captions (≥ 4.5:1 on every surface) |
| `text-disabled` | `#5b5e68` | `#a3a6b0` | Disabled (exempt from contrast) |
| `text-on-accent` | `#ffffff` | `#ffffff` | Text on solid accent / semantic fills |
| `accent` | `#5b5bd6` | `#5b5bd6` | Solid fills, focus ring base |
| `accent-hover` | `#6563de` | `#4f4ecb` | |
| `accent-active` | `#4f4ec4` | `#4543bb` | |
| `accent-text` | `#a9a7ff` | `#4a48c4` | Links, selected labels |
| `accent-subtle` | `#16163a` | `#ededfc` | Tinted backgrounds |
| `accent-border` | `#34347a` | `#c3c2f2` | Tinted borders |
| `neon` | `#5ee6ff` | `#0e8fb0` | Glows, beams, 3D rim light only |
| `focus` | `#8b89ff` | `#5b5bd6` | Focus ring |

Semantic scales — each has `solid`, `text`, `subtle`, `border`:

| Scale | Dark solid / text / subtle / border | Light solid / text / subtle / border |
| --- | --- | --- |
| `success` | `#1a7f4b` / `#4ade94` / `#0c2418` / `#17482f` | `#18794a` / `#12683e` / `#e8f7ee` / `#b3e2c6` |
| `warning` | `#9a6200` / `#f5b93f` / `#2a1e06` / `#54400f` | `#8f5a00` / `#7d4e00` / `#fdf3dc` / `#edd292` |
| `danger` (+ `hover` `#c03342`, `active` `#ad2c3a`; light `#b82a38`, `#a52431`) | `#d13b4a` / `#ff8a94` / `#2c0f13` / `#5c1f27` | `#c9303f` / `#b02533` / `#fdecee` / `#f3bcc2` |
| `info` | `#1f6fd1` / `#7cb8ff` / `#0b1c33` / `#173a69` | `#1c66c2` / `#1757a8` / `#e9f2fd` / `#b7d3f5` |

A unit test computes WCAG contrast for every text/background pairing above (text, secondary, muted, accent-text and
each semantic text on every surface; on-accent text on every solid; control borders on every surface) and fails
under 4.5:1 (text) or 3:1 (non-text). If that test forces a value to move, the token source wins and this table is
regenerated in the README.

### Typography

- Sans: `"Geist", "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif`
- Mono: `"Geist Mono", "JetBrains Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace`
- The library does not bundle font files; the stack degrades to system UI. The docs site loads Geist.

| Step | Size / line-height | Tracking | Use |
| --- | --- | --- | --- |
| `xs` | 12 / 16 | 0 | Captions, badges, kbd |
| `sm` | 13 / 20 | -0.003em | Controls, table cells |
| `md` | 14 / 22 | -0.006em | Body |
| `lg` | 16 / 24 | -0.011em | Lead text |
| `xl` | 20 / 28 | -0.017em | Card and dialog titles |
| `2xl` | 28 / 34 | -0.022em | Section headings |
| `3xl` | 40 / 44 | -0.03em | Display |

Weights: 400 regular, 500 medium, 600 semibold.

### Spacing, radii, z-index

- Spacing (4px grid): `0`, `0.5`=2, `1`=4, `1.5`=6, `2`=8, `3`=12, `4`=16, `5`=20, `6`=24, `8`=32, `10`=40, `12`=48, `16`=64
- Control heights: `sm` 28, `md` 32, `lg` 40
- Radii: `xs` 4, `sm` 6, `md` 8, `lg` 12, `full` 9999
- z-index: `base` 0, `raised` 10, `sticky` 100, `overlay` 1000, `modal` 1100, `popover` 1200, `toast` 1300, `tooltip` 1400

### Shadows, glows, gradients

| Token | Dark | Light |
| --- | --- | --- |
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.4)` | `0 1px 2px rgba(16,17,20,0.06)` |
| `shadow-md` | `0 8px 24px -8px rgba(0,0,0,0.6)` | `0 8px 24px -8px rgba(16,17,20,0.12)` |
| `shadow-lg` | `0 24px 64px -16px rgba(0,0,0,0.7)` | `0 24px 64px -16px rgba(16,17,20,0.18)` |
| `glow-accent` | `0 0 0 1px rgba(123,121,255,0.35), 0 0 24px -4px rgba(123,121,255,0.45)` | `0 0 0 1px rgba(91,91,214,0.25), 0 0 20px -6px rgba(91,91,214,0.35)` |
| `glow-neon` | `0 0 24px -4px rgba(94,230,255,0.45)` | `0 0 20px -6px rgba(14,143,176,0.35)` |
| `focus-ring-width` / `focus-ring-offset` | `2px` / `2px` (drawn as an outline in `color-focus`, so it survives forced-colors mode) | same |
| `gradient-accent` | `linear-gradient(135deg, #7b79ff 0%, #5ee6ff 100%)` | `linear-gradient(135deg, #5b5bd6 0%, #0e8fb0 100%)` |
| `gradient-surface` | `linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 100%)` | `linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 100%)` |
| `gradient-beam` | `conic-gradient(from 0deg, transparent 0deg, #7b79ff 60deg, #5ee6ff 90deg, transparent 120deg)` | same shape with light accent / neon |

### Motion

| Token | Value |
| --- | --- |
| `duration-instant` | 0ms |
| `duration-fast` | 120ms |
| `duration-base` | 200ms |
| `duration-slow` | 320ms |
| `duration-slower` | 560ms |
| `duration-loop` | 6000ms (shimmer, beam, marquee base speed) |
| `ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` |
| `ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `ease-in` | `cubic-bezier(0.7, 0, 0.84, 0)` |
| `ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` |
| `spring-snappy` | stiffness 520, damping 36, mass 1 |
| `spring-smooth` | stiffness 260, damping 30, mass 1 |
| `spring-gentle` | stiffness 120, damping 20, mass 1 |

Durations and easings exist as CSS variables and as numbers/arrays in TS (seconds and bezier tuples, the shapes
Motion expects). Springs are TS-only since CSS cannot express them.

## Repo structure

```
umbra-ui/
├─ packages/umbra-ui/          the published package
│  ├─ src/
│  │  ├─ tokens/               tokens.ts (source of truth), css generator, contrast test
│  │  ├─ theme/                ThemeProvider, ThemeScript, useTheme
│  │  ├─ components/<name>/    Name.tsx, name.css, Name.stories.tsx, Name.test.tsx
│  │  ├─ motion/<name>/        same layout; imports motion/react
│  │  ├─ three/<name>/         light wrapper + lazy scene; imports three only inside scenes
│  │  ├─ styles/               base.css, generated tokens.css, index.css (@imports everything)
│  │  ├─ index.ts              entry: umbra-ui
│  │  ├─ motion.ts             entry: umbra-ui/motion
│  │  └─ three.ts              entry: umbra-ui/3d
│  ├─ scripts/                 build-tokens.ts, build-css.ts, size.ts
│  ├─ .storybook/
│  └─ tsup.config.ts
├─ apps/docs/                  Next.js App Router + MDX docs site (static export)
├─ examples/vite/              consumer app, installs the packed tarball
├─ docs/design-proposal.md
├─ .changeset/  .github/workflows/{ci,release}.yml
└─ README.md  CONTRIBUTING.md  LICENSE
```

## Components

**`umbra-ui`** — Button, IconButton, Input, Textarea, Select, Checkbox, Radio (RadioGroup + Radio), Switch,
FormField, Card, Badge, Avatar, Tabs, Dialog, Popover, Tooltip, DropdownMenu, Table, Alert, Skeleton, Kbd, Divider,
Box, Stack, Inline, Grid, Container, plus ThemeProvider, ThemeScript, useTheme, tokens.

**`umbra-ui/motion`** — ShimmerButton, SpotlightCard, BeamBorder, TextReveal, NumberTicker, Marquee, AnimatedTabs,
Toaster + `toast()`, CommandPalette, StaggeredList, PageTransition, plus `useReducedMotion` and the motion presets.

**`umbra-ui/3d`** — TiltCard3D, HeroScene, Orb (3D button), ModelViewer, Logo3D, ParticleField.

Shared prop vocabulary across all three: `variant`, `size` (`sm | md | lg`), `tone` (`neutral | accent | success |
warning | danger | info`), `disabled`, `loading`; 3D adds `quality` (`low | medium | high`), `fallback`, and both
animated families accept `reducedMotion` (`"system" | "always" | "never"`).
