'use client';

import { ParticleField } from 'umbra-ui/3d';

export default function Demo(props: React.ComponentProps<typeof ParticleField>) {
  return (
    <ParticleField style={{ minHeight: 300, borderRadius: 'var(--umbra-radius-md)' }} {...props}>
      <div style={{ display: 'grid', placeItems: 'center', minHeight: 300 }}>
        <strong style={{ fontSize: 'var(--umbra-text-xl-size)' }}>One draw call</strong>
      </div>
    </ParticleField>
  );
}
// ---
import type { Example, Playground } from '@/lib/demo';

export const playground: Playground = {
  controls: { quality: ['medium', 'low', 'high'], speed: ['1', '0.5', '3'], motion: true },
  render: ({ speed, ...p }) => <Demo speed={Number(speed)} {...p} />,
};
export const examples: Example[] = [{ title: 'Static fallback', render: () => <Demo reducedMotion="always" /> }];
