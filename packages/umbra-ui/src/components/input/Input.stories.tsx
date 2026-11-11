import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Stack } from '../layout/Layout';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Static/Input',
  component: Input,
  args: { placeholder: 'acme-production', 'aria-label': 'Project name', size: 'md' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  decorators: [(Story) => <div style={{ maxWidth: 320 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Playground: Story = {};
export const Sizes: Story = {
  render: (args) => (
    <Stack gap="3">
      <Input {...args} size="sm" />
      <Input {...args} size="md" />
      <Input {...args} size="lg" />
    </Stack>
  ),
};
export const Invalid: Story = { args: { invalid: true, defaultValue: 'not a slug!' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'acme-production' } };
export const ReadOnly: Story = { args: { readOnly: true, defaultValue: 'acme-production' } };
export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState('umbra');
    return <Input {...args} value={value} onChange={(e) => setValue(e.target.value.toLowerCase())} />;
  },
};
