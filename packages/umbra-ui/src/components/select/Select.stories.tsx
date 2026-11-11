import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Stack } from '../layout/Layout';
import { Select, SelectGroup, SelectItem, SelectSeparator } from './Select';

const items = (
  <>
    <SelectGroup label="Americas">
      <SelectItem value="iad">Washington, D.C.</SelectItem>
      <SelectItem value="sfo">San Francisco</SelectItem>
      <SelectItem value="gru" disabled>São Paulo (full)</SelectItem>
    </SelectGroup>
    <SelectSeparator />
    <SelectGroup label="Europe">
      <SelectItem value="fra">Frankfurt</SelectItem>
      <SelectItem value="lhr">London</SelectItem>
    </SelectGroup>
  </>
);

const meta: Meta<typeof Select> = {
  title: 'Static/Select',
  component: Select,
  args: { placeholder: 'Choose a region', 'aria-label': 'Region', size: 'md', children: items },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] }, children: { control: false } },
  decorators: [(Story) => <div style={{ maxWidth: 260 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Select>;

export const Playground: Story = {};
export const Sizes: Story = {
  render: (args) => (
    <Stack gap="3">
      <Select {...args} size="sm" />
      <Select {...args} size="md" />
      <Select {...args} size="lg" />
    </Stack>
  ),
};
export const WithValue: Story = { args: { defaultValue: 'fra' } };
export const Open: Story = { args: { defaultOpen: true, defaultValue: 'fra' }, decorators: [(Story) => <div style={{ minHeight: 260 }}><Story /></div>] };
export const Invalid: Story = { args: { invalid: true } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'iad' } };
export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState('lhr');
    return <Select {...args} value={value} onValueChange={setValue} />;
  },
};
