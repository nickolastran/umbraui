// Generates everything the docs derive from source:
//  - generated/props.json   props tables, read from the library's TypeScript types
//  - generated/content.ts   static import map of content/*.mdx
//  - generated/demos.ts     lazy import map of demos/*.tsx
//  - generated/sources.json demo source shown in the "Code" tab
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import docgen from 'react-docgen-typescript';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const lib = join(root, '../../packages/umbra-ui');
const out = join(root, 'generated');
mkdirSync(out, { recursive: true });

const parser = docgen.withCustomConfig(join(lib, 'tsconfig.json'), {
  savePropValueAsString: true,
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  // Document the library's own props; inherited DOM / Radix props are summarised in prose instead.
  propFilter: (prop) => !prop.parent || !prop.parent.fileName.includes('node_modules'),
});
const props = {};
for (const entry of ['src/index.ts', 'src/motion.ts', 'src/three.ts']) {
  for (const doc of parser.parse(join(lib, entry))) {
    props[doc.displayName] = {
      description: doc.description,
      props: Object.values(doc.props)
        .map((p) => ({
          name: p.name,
          type: p.type.name === 'enum' && p.type.value ? p.type.value.map((v) => v.value).join(' | ') : p.type.name,
          required: p.required,
          default: p.defaultValue?.value ?? null,
          description: p.description,
        }))
        .sort((a, b) => Number(b.required) - Number(a.required) || a.name.localeCompare(b.name)),
    };
  }
}
writeFileSync(join(out, 'props.json'), JSON.stringify(props, null, 1));

const slugs = (dir, ext) => readdirSync(join(root, dir)).filter((f) => f.endsWith(ext)).map((f) => f.slice(0, -ext.length)).sort();
const id = (s) => `c_${s.replace(/-/g, '_')}`;

const content = slugs('content', '.mdx');
writeFileSync(
  join(out, 'content.ts'),
  `${content.map((s) => `import ${id(s)} from '../content/${s}.mdx';`).join('\n')}\n\nexport const content: Record<string, React.ComponentType> = { ${content.map((s) => `'${s}': ${id(s)}`).join(', ')} };\n`,
);

const demos = slugs('demos', '.tsx');
writeFileSync(
  join(out, 'demos.ts'),
  `import type { DemoModule } from '../lib/demo';\n\nexport const demos: Record<string, () => Promise<DemoModule>> = {\n${demos.map((s) => `  '${s}': () => import('../demos/${s}'),`).join('\n')}\n};\n`,
);
// The Code tab shows the main demo only: everything above the "// ---" marker, minus the client directive.
const sources = Object.fromEntries(
  demos.map((s) => [s, readFileSync(join(root, 'demos', `${s}.tsx`), 'utf8').split('\n// ---')[0].replace(/^'use client';\n+/, '').trim()]),
);
writeFileSync(join(out, 'sources.json'), JSON.stringify(sources));

console.log(`generated: ${Object.keys(props).length} props tables, ${content.length} content pages, ${demos.length} demos`);
