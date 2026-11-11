'use client';

import { Alert } from 'umbra-ui';

export default function Demo() {
  return (
    <Alert tone="info" title="Build queued">
      Your deployment starts when the current build finishes.
    </Alert>
  );
}
// ---
import { Stack } from 'umbra-ui';
import type { Example, Playground } from '@/lib/demo';

const tones = ['info', 'success', 'warning', 'danger', 'accent', 'neutral'] as const;
export const playground: Playground = {
  controls: { tone: [...tones], variant: ['soft', 'outline'], title: 'Build queued', children: 'Your deployment starts when the current build finishes.' },
  render: (p) => <Alert {...p} />,
};
export const examples: Example[] = [
  { title: 'Tones', render: () => <Stack gap="3">{tones.map((t) => <Alert key={t} tone={t} title={`${t[0]!.toUpperCase()}${t.slice(1)} message`} role="note" />)}</Stack> },
  { title: 'Dismissible', render: () => <Alert tone="warning" title="Usage at 90%" role="note" onDismiss={() => {}}>Upgrade to avoid throttling.</Alert> },
];
