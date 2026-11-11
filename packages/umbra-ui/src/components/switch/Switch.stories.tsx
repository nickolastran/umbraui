import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Stack } from '../layout/Layout';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Static/Switch',
  component: Switch,
  args: { children: 'Automatic deployments', size: 'md' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md'] } },
};
export default meta;
type Story = StoryObj<typeof Switch>;

export const Playground: Story = {};
export const States: Story = {
  render: () => (
    <Stack gap="3">
      <Switch>Off</Switch>
      <Switch defaultChecked>On</Switch>
      <Switch size="sm" defaultChecked>Small</Switch>
      <Switch disabled>Disabled</Switch>
      <Switch disabled defaultChecked>Disabled, on</Switch>
    </Stack>
  ),
};
export const Controlled: Story = {
  render: () => {
    const [on, setOn] = useState(true);
    return <Switch checked={on} onCheckedChange={setOn}>Maintenance mode is {on ? 'on' : 'off'}</Switch>;
  },
};
