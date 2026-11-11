import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Static/Textarea',
  component: Textarea,
  args: { placeholder: 'What changed in this release?', 'aria-label': 'Release notes' },
  argTypes: { resize: { control: 'inline-radio', options: ['none', 'vertical', 'both'] } },
  decorators: [(Story) => <div style={{ maxWidth: 400 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Textarea>;

export const Playground: Story = {};
export const Invalid: Story = { args: { invalid: true, defaultValue: 'Too short' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'Locked while the release is publishing.' } };
export const NoResize: Story = { args: { resize: 'none', rows: 5 } };
