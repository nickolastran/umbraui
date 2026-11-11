# Contributing to Umbra UI

## Setup

Node 20 or newer.

```bash
npm install
npm run build        # the docs and Storybook consume the built package / source respectively
npm run storybook
```

## Checks

Run all of these before opening a pull request. CI runs the same commands.

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run build-storybook
npm run size
```

If a check fails, fix the cause. Do not loosen a test, a lint rule or a contrast threshold to make it pass.

## Adding or changing a component

Each component lives in its own folder under `packages/umbra-ui/src/components` (static), `src/motion` (animated) or `src/three` (3D).

Every component must:

- Have typed props with JSDoc on the component and on every prop, and export its props type.
- Use `forwardRef`, pass `className` through, and spread remaining props onto the root element.
- Use only design tokens. No hard-coded colours, radii or durations; ESLint rejects hex literals in component code.
- Be keyboard and screen-reader accessible to WCAG 2.1 AA with a visible focus ring.
- Support controlled and uncontrolled use where that applies.
- Have stories for each variant, size and state, including disabled, loading, error, reduced-motion and fallback states.
- Have tests for rendering, interaction, keyboard behaviour and an axe check.
- Use the shared prop vocabulary: `variant`, `size`, `tone`, `disabled`, `loading`, `reducedMotion`, `quality`, `fallback`.

Then export it from the entry file (`src/index.ts`, `src/motion.ts` or `src/three.ts`), add its stylesheet to `src/styles/index.css`, and add a docs entry: a line in `apps/docs/lib/registry.ts`, a demo in `apps/docs/demos`, and notes in `apps/docs/content`.

### Rules per entry

- `umbra-ui` must never import `motion` or `three`.
- `umbra-ui/motion` uses the presets in `src/motion/presets.ts`. Every component takes `reducedMotion` and must replace movement with an instant or opacity-only change and stop loops when it is on. Animate `transform` and `opacity`.
- `umbra-ui/3d` keeps three.js, React Three Fiber and drei inside `*.scene.tsx` files, which are only reached through `React.lazy`. The wrapper file must stay free of those imports. Create the canvas with `SceneCanvas` so the DPR cap and render-loop rules apply. Test the fallback paths and the lazy boundary, not WebGL output.

## Tokens

`packages/umbra-ui/src/tokens/tokens.ts` is the only source. `npm run tokens -w umbra-ui` regenerates `src/styles/tokens.css`; a test fails if the generated file is stale, and another fails if any text or control colour pairing drops below WCAG AA contrast.

## Releases

This repository uses [Changesets](https://github.com/changesets/changesets).

```bash
npm run changeset
```

Describe the change and pick a bump. Merging to `main` opens a "Version Packages" pull request; merging that publishes to npm. Publishing needs an `NPM_TOKEN` repository secret.
