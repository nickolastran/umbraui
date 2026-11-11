'use client';

import { Button } from 'umbra-ui';
import { HeroScene } from 'umbra-ui/3d';

export default function Demo(props: React.ComponentProps<typeof HeroScene>) {
  return (
    <HeroScene style={{ minHeight: 360, borderRadius: 'var(--umbra-radius-md)' }} {...props}>
      <div style={{ display: 'grid', placeItems: 'center', alignContent: 'center', gap: 16, minHeight: 360 }}>
        <strong style={{ fontSize: 'var(--umbra-text-2xl-size)', letterSpacing: 'var(--umbra-text-2xl-tracking)' }}>Out of the dark</strong>
        <Button>Get started</Button>
      </div>
    </HeroScene>
  );
}
// ---
import type { Example, Playground } from '@/lib/demo';

export const playground: Playground = { controls: { quality: ['medium', 'low', 'high'], motion: true }, render: (p) => <Demo {...p} /> };
export const examples: Example[] = [
  { title: 'Static fallback', description: 'Rendered without WebGL or under reduced motion: gradients only, no canvas.', render: () => <Demo reducedMotion="always" /> },
];
