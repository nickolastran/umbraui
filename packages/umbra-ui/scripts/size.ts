import { build } from 'esbuild';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

// Reports what each entry adds to a consumer bundle: the library's own code (shared chunks included),
// minified and gzipped, with dependencies and peers left external. Run after `npm run build`.
const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const kb = (n: number) => `${(n / 1024).toFixed(1)} kB`.padStart(9);

const measure = async (file: string) => {
  const out = await build({ entryPoints: [dist + file], bundle: true, minify: true, format: 'esm', packages: 'external', write: false, splitting: true, outdir: 'out', logLevel: 'silent' });
  // The first output is the entry plus everything it imports statically; the rest are lazy chunks.
  const [entry, ...lazy] = out.outputFiles;
  const sum = (files: typeof lazy) => files.reduce((a, f) => [a[0]! + f.contents.length, a[1]! + gzipSync(f.contents).length], [0, 0]);
  return { eager: sum([entry!]), lazy: sum(lazy) };
};

console.log('entry'.padEnd(22), 'minified'.padStart(9), 'gzipped'.padStart(9), '  lazy (min / gzip)');
for (const [name, file] of [['umbra-ui', 'index.js'], ['umbra-ui/motion', 'motion.js'], ['umbra-ui/3d', '3d.js']] as const) {
  const { eager, lazy } = await measure(file);
  console.log(name.padEnd(22), kb(eager[0]!), kb(eager[1]!), lazy[0] ? `  ${kb(lazy[0]!)} / ${kb(lazy[1]!)}` : '');
}
// Tree-shaking guard: an app that imports one component must not receive the others.
const one = await build({
  stdin: { contents: `import { Button } from './index.js'; console.log(Button);`, resolveDir: dist, loader: 'js' },
  bundle: true, minify: true, format: 'esm', packages: 'external', write: false, logLevel: 'silent',
});
const single = one.outputFiles[0]!;
console.log('  import { Button }'.padEnd(22), kb(single.contents.length), kb(gzipSync(single.contents).length));
if (/umbra-dialog|umbra-menu|umbra-tabs/.test(single.text)) {
  console.error('\nTree-shaking regression: importing only Button pulled in other components.');
  process.exit(1);
}

const css = readFileSync(dist + 'styles.css');
console.log('umbra-ui/styles.css'.padEnd(22), kb(css.length), kb(gzipSync(css).length));
console.log(`\n${readdirSync(dist).filter((f) => f.endsWith('.js')).length} ESM files in dist. Peers (react, radix-ui, motion, three, R3F, drei) are not included.`);
