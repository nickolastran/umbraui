'use client';

import { Orb } from 'umbra-ui/3d';
import { toast } from 'umbra-ui/motion';

export default function Demo() {
  return <Orb aria-label="Start listening" size="lg" onClick={() => toast('Listening…')} />;
}
// ---
import { Inline } from 'umbra-ui';
import type { Example, Playground } from '@/lib/demo';

export const playground: Playground = {
  controls: { size: ['lg', 'md', 'sm'], tone: ['accent', 'neon'], disabled: false, quality: ['medium', 'low', 'high'], motion: true },
  render: (p) => <Orb aria-label="Playground orb" {...p} />,
};
export const examples: Example[] = [
  { title: 'Static fallback', description: 'Still a working button.', render: () => (
    <Inline gap="6">
      <Orb aria-label="Accent fallback" reducedMotion="always" />
      <Orb aria-label="Neon fallback" tone="neon" reducedMotion="always" />
      <Orb aria-label="Disabled fallback" disabled reducedMotion="always" />
    </Inline>
  ) },
];
