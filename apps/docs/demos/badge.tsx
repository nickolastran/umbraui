'use client';

import { Badge, Inline } from 'umbra-ui';

export default function Demo() {
  return (
    <Inline>
      <Badge>Beta</Badge>
      <Badge tone="success" dot>Operational</Badge>
      <Badge tone="danger" variant="solid">3 failed</Badge>
    </Inline>
  );
}
// ---
import { Stack } from 'umbra-ui';
import type { Example, Playground } from '@/lib/demo';

const tones = ['neutral', 'accent', 'success', 'warning', 'danger', 'info'] as const;
export const playground: Playground = {
  controls: { variant: ['soft', 'solid', 'outline'], tone: [...tones], size: ['md', 'sm'], dot: false, children: 'Beta' },
  render: (p) => <Badge {...p} />,
};
export const examples: Example[] = [
  { title: 'Every tone and variant', render: () => (
    <Stack gap="3">{(['soft', 'solid', 'outline'] as const).map((v) => <Inline key={v}>{tones.map((t) => <Badge key={t} variant={v} tone={t}>{t}</Badge>)}</Inline>)}</Stack>
  ) },
];
