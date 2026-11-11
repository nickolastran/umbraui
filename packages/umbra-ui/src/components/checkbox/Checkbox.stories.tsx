import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Stack } from '../layout/Layout';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = { title: 'Static/Checkbox', component: Checkbox, args: { children: 'Enable preview deployments' } };
export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Playground: Story = {};
export const States: Story = {
  render: () => (
    <Stack gap="3">
      <Checkbox>Unchecked</Checkbox>
      <Checkbox defaultChecked>Checked</Checkbox>
      <Checkbox checked="indeterminate">Indeterminate</Checkbox>
      <Checkbox invalid>Invalid</Checkbox>
      <Checkbox disabled>Disabled</Checkbox>
      <Checkbox disabled defaultChecked>Disabled, checked</Checkbox>
    </Stack>
  ),
};
export const WithoutLabel: Story = { args: { children: undefined, 'aria-label': 'Select row' } };
export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = useState<boolean | 'indeterminate'>('indeterminate');
    return <Checkbox checked={checked} onCheckedChange={setChecked}>Select all ({String(checked)})</Checkbox>;
  },
};
