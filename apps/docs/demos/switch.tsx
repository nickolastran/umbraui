'use client';

import { Switch } from 'umbra-ui';

export default function Demo() {
  return <Switch defaultChecked>Automatic deployments</Switch>;
}
// ---
import { Stack } from 'umbra-ui';
import type { Example, Playground } from '@/lib/demo';

export const playground: Playground = {
  controls: { size: ['md', 'sm'], disabled: false, children: 'Automatic deployments' },
  render: (p) => <Switch {...p} />,
};
export const examples: Example[] = [
  { title: 'States', render: () => (
    <Stack gap="3">
      <Switch>Off</Switch>
      <Switch defaultChecked>On</Switch>
      <Switch size="sm" defaultChecked>Small</Switch>
      <Switch disabled defaultChecked>Disabled</Switch>
    </Stack>
  ) },
];
