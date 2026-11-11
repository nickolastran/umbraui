'use client';

import { Select, SelectGroup, SelectItem, SelectSeparator } from 'umbra-ui';

export default function Demo() {
  return (
    <Select aria-label="Region" placeholder="Choose a region" style={{ width: 240 }}>
      <SelectGroup label="Americas">
        <SelectItem value="iad">Washington, D.C.</SelectItem>
        <SelectItem value="sfo">San Francisco</SelectItem>
      </SelectGroup>
      <SelectSeparator />
      <SelectGroup label="Europe">
        <SelectItem value="fra">Frankfurt</SelectItem>
        <SelectItem value="lhr">London</SelectItem>
      </SelectGroup>
    </Select>
  );
}
// ---
import type { Example, Playground } from '@/lib/demo';

const items = (
  <>
    <SelectItem value="iad">Washington, D.C.</SelectItem>
    <SelectItem value="fra">Frankfurt</SelectItem>
    <SelectItem value="gru" disabled>São Paulo (full)</SelectItem>
  </>
);
export const playground: Playground = {
  controls: { size: ['md', 'sm', 'lg'], invalid: false, disabled: false, placeholder: 'Choose a region' },
  render: (p) => <Select aria-label="Region" style={{ width: 240 }} {...p}>{items}</Select>,
};
export const examples: Example[] = [
  { title: 'With a value', render: () => <Select aria-label="Region with value" defaultValue="fra" style={{ width: 240 }}>{items}</Select> },
  { title: 'Invalid and disabled', render: () => (
    <div style={{ display: 'grid', gap: 12, width: 240 }}>
      <Select aria-label="Invalid region" invalid placeholder="Required">{items}</Select>
      <Select aria-label="Disabled region" disabled defaultValue="iad">{items}</Select>
    </div>
  ) },
];
