'use client';

import { Checkbox } from 'umbra-ui';

export default function Demo() {
  return <Checkbox defaultChecked>Enable preview deployments</Checkbox>;
}
// ---
import { Stack } from 'umbra-ui';
import type { Example, Playground } from '@/lib/demo';

export const playground: Playground = {
  controls: { invalid: false, disabled: false, children: 'Enable preview deployments' },
  render: (p) => <Checkbox {...p} />,
};
export const examples: Example[] = [
  { title: 'States', render: () => (
    <Stack gap="3">
      <Checkbox>Unchecked</Checkbox>
      <Checkbox defaultChecked>Checked</Checkbox>
      <Checkbox checked="indeterminate">Indeterminate</Checkbox>
      <Checkbox invalid>Invalid</Checkbox>
      <Checkbox disabled defaultChecked>Disabled</Checkbox>
    </Stack>
  ) },
];
