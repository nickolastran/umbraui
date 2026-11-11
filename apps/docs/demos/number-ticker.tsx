'use client';

import { NumberTicker } from 'umbra-ui/motion';

export default function Demo() {
  return <NumberTicker value={128430} locale="en-US" style={{ fontSize: 'var(--umbra-text-3xl-size)', fontWeight: 600, letterSpacing: 'var(--umbra-text-3xl-tracking)' }} />;
}
// ---
import { Inline } from 'umbra-ui';
import type { Example, Playground } from '@/lib/demo';

const big = { fontSize: 'var(--umbra-text-2xl-size)', fontWeight: 600 };
export const playground: Playground = {
  controls: { value: ['128430', '0', '999', '2500000'], motion: true },
  render: ({ value, ...p }) => <NumberTicker value={Number(value)} locale="en-US" style={big} {...p} />,
};
export const examples: Example[] = [
  { title: 'Formats', render: () => (
    <Inline gap="8">
      <NumberTicker value={0.9998} locale="en-US" format={{ style: 'percent', minimumFractionDigits: 2 }} style={big} />
      <NumberTicker value={4820} locale="en-US" format={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }} style={big} />
      <NumberTicker value={38} locale="en-US" format={{ style: 'unit', unit: 'millisecond' }} style={big} />
    </Inline>
  ) },
];
