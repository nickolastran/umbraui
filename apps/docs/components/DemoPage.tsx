'use client';

import { use, useMemo, useState, Suspense } from 'react';
import { FormField, Input, Select, SelectItem, Skeleton, Switch, Tabs, TabsContent, TabsList, TabsTrigger } from 'umbra-ui';
import { demos } from '@/generated/demos';
import type { Controls, DemoModule, Playground } from '@/lib/demo';
import { CodeBlock } from './CodeBlock';

const cache = new Map<string, Promise<DemoModule>>();
const load = (slug: string) => {
  if (!cache.has(slug)) cache.set(slug, demos[slug]!());
  return cache.get(slug)!;
};

const initial = (controls: Controls) =>
  Object.fromEntries(Object.entries(controls).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])) as Record<string, string | boolean>;

const label = (name: string) => name.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());

function PlaygroundView({ playground }: { playground: Playground }) {
  const [values, setValues] = useState(() => initial(playground.controls));
  const set = (k: string, v: string | boolean) => setValues((s) => ({ ...s, [k]: v }));
  // `motion` is a docs-level control: it maps onto every animated component's `reducedMotion` prop.
  const props = useMemo(() => {
    const { motion, ...rest } = values;
    return motion === undefined ? rest : { ...rest, reducedMotion: motion ? 'never' : 'always' };
  }, [values]);
  return (
    <div className="playground">
      <div className="preview">{playground.render(props)}</div>
      <form className="playground__controls" aria-label="Playground controls" onSubmit={(e) => e.preventDefault()}>
        {Object.entries(playground.controls).map(([name, control]) =>
          Array.isArray(control) ? (
            <FormField key={name} label={label(name)}>
              <Select size="sm" value={values[name] as string} onValueChange={(v) => set(name, v)}>
                {control.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </Select>
            </FormField>
          ) : typeof control === 'boolean' ? (
            <Switch key={name} size="sm" checked={values[name] as boolean} onCheckedChange={(v) => set(name, v)}>
              {label(name)}
            </Switch>
          ) : (
            <FormField key={name} label={label(name)}>
              <Input size="sm" value={values[name] as string} onChange={(e) => set(name, e.target.value)} />
            </FormField>
          ),
        )}
      </form>
    </div>
  );
}

function Loaded({ slug, code, wide }: { slug: string; code: string; wide: boolean }) {
  const mod = use(load(slug));
  const Demo = mod.default;
  return (
    <>
      <Tabs defaultValue="preview">
        <TabsList aria-label="Preview or code">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <div className={wide ? 'preview preview--wide' : 'preview'}>
            <Demo />
          </div>
        </TabsContent>
        <TabsContent value="code">
          <CodeBlock code={code} label="Demo source" />
        </TabsContent>
      </Tabs>

      {mod.playground ? (
        <section aria-labelledby="playground">
          <h2 className="section-title" id="playground">
            Playground
          </h2>
          <PlaygroundView playground={mod.playground} />
        </section>
      ) : null}

      {mod.examples?.length ? (
        <section aria-labelledby="examples">
          <h2 className="section-title" id="examples">
            Variants and states
          </h2>
          {mod.examples.map((ex) => (
            <div className="example" key={ex.title}>
              <h3>{ex.title}</h3>
              {ex.description ? <p>{ex.description}</p> : null}
              <div className={wide ? 'preview preview--wide' : 'preview'}>{ex.render()}</div>
            </div>
          ))}
        </section>
      ) : null}
    </>
  );
}

/** Live preview with a Code tab, the playground and the variant examples for one component. */
export function DemoPage(props: { slug: string; code: string; wide: boolean }) {
  return (
    <Suspense fallback={<Skeleton variant="rect" height="14rem" />}>
      <Loaded {...props} />
    </Suspense>
  );
}
