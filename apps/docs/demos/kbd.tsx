'use client';

import { Inline, Kbd } from 'umbra-ui';

export default function Demo() {
  return (
    <Inline gap="1">
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </Inline>
  );
}
// ---
import type { Playground } from '@/lib/demo';

export const playground: Playground = { controls: { size: ['md', 'sm'], children: 'Esc' }, render: (p) => <Kbd {...p} /> };
