# Umbra UI

A dark-first React component library. Three families of components (static, animated and 3D) share one design-token system, so they look and behave like one product.

- **`umbra-ui`**: 27 static components built on Radix primitives. No animation or WebGL dependencies.
- **`umbra-ui/motion`**: 11 animated components built on [Motion](https://motion.dev).
- **`umbra-ui/3d`**: 6 WebGL components built on React Three Fiber and drei, lazy-loaded with static fallbacks.

Dark and light themes, WCAG 2.1 AA, SSR-safe, tree-shakeable, ESM and CJS, fully typed.

## Install

```bash
npm install umbra-ui
```

Motion and three.js are optional peers. Install them only for the entries you import:

```bash
npm install motion                                        # umbra-ui/motion
npm install three @react-three/fiber @react-three/drei    # umbra-ui/3d
```

## Quick start

```tsx
import { Button, ThemeProvider } from 'umbra-ui';
import 'umbra-ui/styles.css';

export default function App() {
  return (
    <ThemeProvider>
      <Button onClick={() => alert('Deployed')}>Deploy</Button>
    </ThemeProvider>
  );
}
```

The stylesheet is one plain CSS file covering all three entries. You do not need Tailwind or a build plugin. Every rule is in `@layer umbra`, so your own styles always take precedence.

## Entries

### `umbra-ui`

Button, IconButton, Input, Textarea, Select, Checkbox, RadioGroup / Radio, Switch, FormField, Card, Badge, Avatar, Tabs, Dialog, Popover, Tooltip, DropdownMenu, Table, Alert, Skeleton, Kbd, Divider, Box, Stack, Inline, Grid, Container, plus `ThemeProvider`, `ThemeScript`, `useTheme` and `tokens`.

```tsx
import { Dialog, DialogContent, DialogTrigger, FormField, Input, Button } from 'umbra-ui';

<Dialog>
  <DialogTrigger asChild>
    <Button>Rename</Button>
  </DialogTrigger>
  <DialogContent title="Rename project">
    <FormField label="Name" error={error}>
      <Input />
    </FormField>
  </DialogContent>
</Dialog>;
```

### `umbra-ui/motion`

ShimmerButton, SpotlightCard, BeamBorder, TextReveal, NumberTicker, Marquee, AnimatedTabs, Toaster + `toast()`, CommandPalette, StaggeredList, PageTransition, plus `transitions`, `motionTokens`, `useReducedMotion` and `MotionPreferenceProvider`.

```tsx
import { Toaster, toast, CommandPalette } from 'umbra-ui/motion';

<Toaster />; // once, near the root
toast({ title: 'Deployment ready', tone: 'success' });
```

Every animated component respects `prefers-reduced-motion`: movement becomes an instant or opacity-only transition and loops stop. Force it either way per component with `reducedMotion="always" | "never"`, or for a subtree with `MotionPreferenceProvider`.

This entry imports from `motion/react`. If your app still uses the `framer-motion` package, alias `motion/react` to `framer-motion` in your bundler.

### `umbra-ui/3d`

HeroScene, ParticleField, Orb, TiltCard3D, ModelViewer, Logo3D.

```tsx
import { HeroScene, ModelViewer } from 'umbra-ui/3d';

<HeroScene quality="medium">
  <h1>Out of the dark</h1>
</HeroScene>;

<ModelViewer aria-label="Headphones, matte black" src="/headphones.glb" />;
```

- **Lazy by default.** three.js lives in separate chunks behind `React.lazy`. Importing a 3D component adds about 6 kB gzipped to your initial bundle; the scene loads after first paint behind a token-styled placeholder.
- **Static fallbacks.** Without WebGL, if the scene fails to load, or under reduced motion, a designed CSS/SVG fallback renders. Replace it with the `fallback` prop.
- **Performance.** `quality` (`low | medium | high`) caps device pixel ratio at 1 / 1.5 / 2 and scales geometry and particle counts. Rendering stops while the component is offscreen or the tab is hidden; idle scenes render on demand; resources are disposed on unmount.
- **Accessibility.** Canvases are hidden from assistive tech. Orb is a real `<button>`; ModelViewer is a labelled group with a toolbar of buttons and keyboard shortcuts. ModelViewer keeps rendering under reduced motion (it stops auto-rotating and easing) because a still image would remove its purpose.

## Theming

Tokens are CSS custom properties (`--umbra-*`) switched by a `data-umbra-theme="dark" | "light"` attribute, and a typed TypeScript object generated from the same source.

```css
:root {
  --umbra-color-accent: #e5484d;
  --umbra-radius-sm: 2px;
}
```

```tsx
import { ThemeProvider, useTheme, tokens, cssVar } from 'umbra-ui';

<ThemeProvider defaultMode="system" overrides={{ 'radius-sm': '2px' }} />;

const { mode, resolvedTheme, setMode, toggle } = useTheme();
tokens.dark['color-accent']; // "#5b5bd6"
cssVar('space-4'); // "var(--umbra-space-4)"
```

`ThemeProvider` supports `dark` (default), `light` and `system` modes, persists the choice, and can be controlled with `mode` / `onModeChange`. The attribute also works on any element to theme a subtree. 3D materials, lights and fog read the same tokens and update on theme change.

The shipped values pass WCAG 2.1 AA in both themes (enforced by a test). If you override colours, re-check contrast.

## SSR and Next.js

Every module starts with `"use client"` and nothing touches `window` or WebGL at import time, so components can be imported into Server Components.

```tsx
// app/layout.tsx
import { ThemeProvider, ThemeScript } from 'umbra-ui';
import 'umbra-ui/styles.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript defaultMode="system" />
      </head>
      <body>
        <ThemeProvider defaultMode="system">{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

`ThemeScript` sets the theme attribute before first paint, which prevents a flash of the wrong theme. 3D components render their placeholder on the server and need no `next/dynamic` wrapper.

## React versions

| Entry | React 18 | React 19 |
| --- | --- | --- |
| `umbra-ui`, `umbra-ui/motion` | yes | yes |
| `umbra-ui/3d` | with `@react-three/fiber@8` and `@react-three/drei@9` | with `@react-three/fiber@9` and `@react-three/drei@10` |

## Repository

```
packages/umbra-ui   the published package
apps/docs           documentation site (Next.js App Router + MDX, static export)
examples/vite       a consumer app that installs the packed tarball
docs/               design proposal: tokens, decisions, trade-offs
```

```bash
npm install
npm run build            # library
npm test                 # Vitest + Testing Library + axe
npm run storybook        # component workbench
npm run docs:dev         # documentation site
npm run size             # bundle sizes per entry
```

Deploy the docs with `npx vercel --prod` from the repository root; `vercel.json` holds the configuration.

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT
