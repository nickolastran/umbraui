import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Radio, RadioGroup } from './Radio';

const meta: Meta<typeof RadioGroup> = {
  title: 'Static/Radio',
  component: RadioGroup,
  args: { 'aria-label': 'Plan', defaultValue: 'pro', orientation: 'vertical' },
  argTypes: { orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] } },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="hobby">Hobby</Radio>
      <Radio value="pro">Pro</Radio>
      <Radio value="enterprise" disabled>Enterprise (contact sales)</Radio>
    </RadioGroup>
  ),
};
export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Playground: Story = {};
export const Horizontal: Story = { args: { orientation: 'horizontal' } };
export const Disabled: Story = { args: { disabled: true } };
export const Invalid: Story = { args: { invalid: true, defaultValue: undefined } };
export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState('hobby');
    return (
      <RadioGroup {...args} value={value} onValueChange={setValue}>
        <Radio value="hobby">Hobby</Radio>
        <Radio value="pro">Pro</Radio>
      </RadioGroup>
    );
  },
};
