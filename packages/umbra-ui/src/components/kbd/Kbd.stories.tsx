import type { Meta, StoryObj } from '@storybook/react';
import { Inline } from '../layout/Layout';
import { Kbd } from './Kbd';

const meta: Meta<typeof Kbd> = {
  title: 'Static/Kbd',
  component: Kbd,
  args: { children: '⌘K', size: 'md' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md'] } },
};
export default meta;
type Story = StoryObj<typeof Kbd>;

export const Playground: Story = {};
export const Sizes: Story = { render: () => <Inline><Kbd size="sm">Esc</Kbd><Kbd size="md">Esc</Kbd></Inline> };
export const Combination: Story = { render: () => <Inline gap="1"><Kbd>Ctrl</Kbd><Kbd>Shift</Kbd><Kbd>P</Kbd></Inline> };
