import type { Meta, StoryObj } from '@storybook/react';
import { Inline } from '../layout/Layout';
import { Avatar } from './Avatar';

const img =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#7b79ff"/><stop offset="1" stop-color="#5ee6ff"/></linearGradient></defs><rect width="80" height="80" fill="url(#g)"/></svg>');

const meta: Meta<typeof Avatar> = {
  title: 'Static/Avatar',
  component: Avatar,
  args: { name: 'Ada Lovelace', size: 'md', shape: 'circle' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] }, shape: { control: 'inline-radio', options: ['circle', 'square'] } },
};
export default meta;
type Story = StoryObj<typeof Avatar>;

export const Playground: Story = {};
export const WithImage: Story = { args: { src: img } };
export const Sizes: Story = { render: (args) => <Inline><Avatar {...args} size="sm" /><Avatar {...args} size="md" /><Avatar {...args} size="lg" /></Inline> };
export const Square: Story = { args: { shape: 'square' } };
export const BrokenImageFallsBack: Story = { args: { src: 'https://invalid.invalid/nope.png', name: 'Grace Hopper' } };
