import type { Meta, StoryObj } from '@storybook/react';
import { Inline, Stack } from '../layout/Layout';
import { Divider } from './Divider';

const meta: Meta<typeof Divider> = {
  title: 'Static/Divider',
  component: Divider,
  args: { orientation: 'horizontal', decorative: true },
  argTypes: { orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] } },
};
export default meta;
type Story = StoryObj<typeof Divider>;

export const Playground: Story = { render: (args) => <div style={{ height: 40 }}><Divider {...args} /></div> };
export const Horizontal: Story = { render: () => <Stack gap="3"><span>Usage</span><Divider /><span>Billing</span></Stack> };
export const Vertical: Story = { render: () => <Inline gap="3"><span>Docs</span><Divider orientation="vertical" /><span>API</span><Divider orientation="vertical" /><span>Changelog</span></Inline> };
