'use client';

import { CardDescription, CardHeader, CardTitle } from 'umbra-ui';
import { SpotlightCard } from 'umbra-ui/motion';

export default function Demo() {
  return (
    <SpotlightCard style={{ maxWidth: 360 }}>
      <CardHeader>
        <CardTitle>Preview deployments</CardTitle>
        <CardDescription>Every pull request gets its own URL. Move the pointer across the card.</CardDescription>
      </CardHeader>
    </SpotlightCard>
  );
}
// ---
import type { Example, Playground } from '@/lib/demo';

const body = <CardHeader><CardTitle>Preview deployments</CardTitle><CardDescription>Move the pointer across the card.</CardDescription></CardHeader>;
export const playground: Playground = {
  controls: { variant: ['surface', 'outline'], size: ['md', 'sm', 'lg'], motion: true },
  render: (p) => <SpotlightCard style={{ maxWidth: 360 }} {...p}>{body}</SpotlightCard>,
};
export const examples: Example[] = [
  { title: 'Reduced motion', description: 'The light fades in at a fixed position and does not follow the pointer.', render: () => <SpotlightCard reducedMotion="always" style={{ maxWidth: 360 }}>{body}</SpotlightCard> },
];
