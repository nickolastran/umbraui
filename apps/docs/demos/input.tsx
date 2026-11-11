'use client';

import { Input } from 'umbra-ui';

export default function Demo() {
  return <Input aria-label="Project name" placeholder="acme-production" style={{ maxWidth: 280 }} />;
}
// ---
import { Stack } from 'umbra-ui';
import type { Example, Playground } from '@/lib/demo';

export const playground: Playground = {
  controls: { size: ['md', 'sm', 'lg'], invalid: false, disabled: false, readOnly: false, placeholder: 'acme-production' },
  render: (p) => <Input aria-label="Project name" style={{ maxWidth: 280 }} {...p} />,
};
export const examples: Example[] = [
  { title: 'Sizes', render: () => <Stack gap="3" style={{ width: 280 }}>{(['sm', 'md', 'lg'] as const).map((s) => <Input key={s} size={s} aria-label={`Size ${s}`} placeholder={s} />)}</Stack> },
  { title: 'Invalid, disabled and read-only', render: () => (
    <Stack gap="3" style={{ width: 280 }}>
      <Input aria-label="Invalid" invalid defaultValue="not a slug!" />
      <Input aria-label="Disabled" disabled defaultValue="acme-production" />
      <Input aria-label="Read-only" readOnly defaultValue="acme-production" />
    </Stack>
  ) },
];
