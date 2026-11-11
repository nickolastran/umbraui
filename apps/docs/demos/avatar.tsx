'use client';

import { Avatar, Inline } from 'umbra-ui';

export default function Demo() {
  return (
    <Inline gap="3">
      <Avatar name="Ada Lovelace" size="sm" />
      <Avatar name="Grace Hopper" />
      <Avatar name="Katherine Johnson" size="lg" shape="square" />
    </Inline>
  );
}
// ---
import type { Example, Playground } from '@/lib/demo';

export const playground: Playground = {
  controls: { size: ['md', 'sm', 'lg'], shape: ['circle', 'square'], name: 'Ada Lovelace' },
  render: (p) => <Avatar {...p} />,
};
export const examples: Example[] = [
  { title: 'Broken image falls back to initials', render: () => <Avatar name="Grace Hopper" src="/missing.png" size="lg" /> },
];
