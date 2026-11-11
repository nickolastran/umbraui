# Umbra UI example (Vite)

A small app that uses all three entries the way a real project would. It is deliberately outside the npm workspace and installs the **packed tarball**, not the source.

```bash
# from the repository root
npm run build
npm pack -w umbra-ui --pack-destination packages/umbra-ui

cd examples/vite
npm install
npm run dev
```

`src/root-only.tsx` is a second entry point that imports only `umbra-ui`. `npm run build` emits it as its own bundle so you can confirm it contains no Motion or three.js code.
