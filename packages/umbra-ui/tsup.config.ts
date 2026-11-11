import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { index: 'src/index.ts', motion: 'src/motion.ts', '3d': 'src/three.ts' },
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true, // shared chunks between entries + lazy 3D scene chunks
  clean: true,
  sourcemap: true,
  target: 'es2020',
  // Everything that is a dependency or peer stays external (tsup default); listed for the subpaths.
  external: ['react', 'react-dom', 'motion', 'three', '@react-three/fiber', '@react-three/drei', 'radix-ui'],
  // "use client" is prepended to every output file by scripts/build-css.ts (bundlers strip or misplace it).
  outExtension: ({ format }) => ({ js: format === 'cjs' ? '.cjs' : '.js' }),
});
