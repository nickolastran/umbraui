import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Badge } from 'umbra-ui';
import { CodeBlock } from '@/components/CodeBlock';
import { DemoPage } from '@/components/DemoPage';
import { PropsTable } from '@/components/PropsTable';
import { content } from '@/generated/content';
import sources from '@/generated/sources.json';
import { bySlug, families, registry } from '@/lib/registry';

export const dynamicParams = false;
export const generateStaticParams = () => registry.map((r) => ({ slug: r.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const entry = bySlug((await params).slug);
  return entry ? { title: entry.name, description: entry.description } : {};
}

// Demos that should fill the preview width instead of being centred at their natural size.
const WIDE = new Set(['table', 'tabs', 'alert', 'layout', 'marquee', 'animated-tabs', 'hero-scene', 'particle-field', 'model-viewer', 'tilt-card-3d', 'card', 'spotlight-card', 'form-field', 'skeleton', 'staggered-list', 'page-transition']);

export default async function ComponentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = bySlug(slug);
  if (!entry) notFound();
  const Content = content[slug];
  const { entry: from } = families[entry.family];

  return (
    <article>
      <h1 className="page-title">{entry.name}</h1>
      <p className="lead">{entry.description}</p>
      <p className="entry">
        <Badge tone="accent">{families[entry.family].title}</Badge>
        <code>{`import { ${entry.exports[0]} } from '${from}'`}</code>
      </p>

      <DemoPage slug={slug} code={(sources as Record<string, string>)[slug] ?? ''} wide={WIDE.has(slug)} />

      <section aria-labelledby="props">
        <h2 className="section-title" id="props">
          Props
        </h2>
        <PropsTable names={entry.exports} />
      </section>

      {Content ? (
        <section className="prose">
          <Content />
        </section>
      ) : null}

      <section aria-labelledby="import">
        <h2 className="section-title" id="import">
          Import
        </h2>
        <CodeBlock code={`import { ${entry.exports.join(', ')} } from '${from}';\nimport 'umbra-ui/styles.css'; // once, at the root of your app`} />
      </section>
    </article>
  );
}
