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

The docs build to static files in `apps/docs/out`, so any static host works:

- **GitHub Pages:** in the repository settings, set Pages → Source to "GitHub Actions". `.github/workflows/pages.yml` then deploys on every push to `main` (or run it by hand from the Actions tab). The base path is picked up automatically.
- **Vercel:** `npx vercel --prod` from the repository root; `vercel.json` holds the configuration.
- **Elsewhere:** `npm run docs:build`. Set `DOCS_BASE_PATH=/sub-path` first if the site is not served from the domain root.

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT
