'use client';

import { Radio, RadioGroup } from 'umbra-ui';

export default function Demo() {
  return (
    <RadioGroup aria-label="Plan" defaultValue="pro">
      <Radio value="hobby">Hobby</Radio>
      <Radio value="pro">Pro</Radio>
      <Radio value="enterprise" disabled>Enterprise (contact sales)</Radio>
    </RadioGroup>
  );
}
// ---
import type { Example, Playground } from '@/lib/demo';

export const playground: Playground = {
  controls: { orientation: ['vertical', 'horizontal'], disabled: false, invalid: false },
  render: (p) => (
    <RadioGroup aria-label="Plan (playground)" defaultValue="hobby" {...p}>
      <Radio value="hobby">Hobby</Radio>
      <Radio value="pro">Pro</Radio>
    </RadioGroup>
  ),
};
export const examples: Example[] = [
  { title: 'Horizontal', render: () => (
    <RadioGroup aria-label="Billing period" orientation="horizontal" defaultValue="year">
      <Radio value="month">Monthly</Radio>
      <Radio value="year">Yearly</Radio>
    </RadioGroup>
  ) },
];
