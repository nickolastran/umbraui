import { build } from 'esbuild';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));

// 1. Bundle src/styles/index.css (which @imports tokens, base and every component sheet) into one file.
await build({
  entryPoints: [fileURLToPath(new URL('../src/styles/index.css', import.meta.url))],
  outfile: `${dist}styles.css`,
  bundle: true,
  minify: true,
  target: ['chrome111', 'firefox113', 'safari16.4'],
  logLevel: 'warning',
});

// 2. Make "use client" the first statement of every emitted module. The bundler either strips it or
//    (for CJS) places it after other statements, where it is no longer a directive.
//
// 3. Make unused components tree-shakeable. Bundlers must assume a top-level call such as
//    `var Select = forwardRef(...)` or a property read such as `var DialogTrigger = Dialog.Trigger` has side
//    effects, so they would keep every component (and the Radix primitive behind it) in any app that imports
//    one of them. Marking those initialisers pure lets `import { Button }` drop everything else.
const pureCalls = /^var (\w+) = ((?:forwardRef|createContext|lazy|part)\d*)\(/gm;
const pureReads = /^var (\w+) = ([A-Za-z_$][\w$]*)\.(\w+);$/gm;
const DIRECTIVE = '"use client";';
let patched = 0;
for (const file of readdirSync(dist).filter((f) => /\.(js|cjs)$/.test(f))) {
  let body = readFileSync(dist + file, 'utf8').replace(/^"use client";\s*/, '');
  if (file.endsWith('.js')) {
    body = body.replace(pureCalls, 'var $1 = /* @__PURE__ */ $2(').replace(pureReads, 'var $1 = /* @__PURE__ */ (() => $2.$3)();');
  }
  writeFileSync(dist + file, `${DIRECTIVE}\n${body.replace(/(?<=^"use strict";)\s*"use client";/, '')}`);
  patched++;
}
console.log(`css → dist/styles.css; "use client" on ${patched} modules`);
