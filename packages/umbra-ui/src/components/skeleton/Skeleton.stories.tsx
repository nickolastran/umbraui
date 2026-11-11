import type { Meta, StoryObj } from '@storybook/react';
import { Inline, Stack } from '../layout/Layout';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Static/Skeleton',
  component: Skeleton,
  args: { variant: 'text', animated: true },
  argTypes: { variant: { control: 'inline-radio', options: ['text', 'rect', 'circle'] } },
  decorators: [(Story) => <div style={{ maxWidth: 360 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Playground: Story = {};
export const Variants: Story = {
  render: () => (
    <Stack gap="4">
      <Skeleton variant="text" />
      <Skeleton variant="rect" height={96} />
      <Skeleton variant="circle" />
    </Stack>
  ),
};
export const LoadingCard: Story = {
  render: () => (
    <Inline aria-busy="true" aria-label="Loading profile" role="status" gap="3" wrap={false} align="start">
      <Skeleton variant="circle" width={40} height={40} />
      <div style={{ flex: 1 }}>
        <Skeleton width="40%" />
        <Skeleton />
        <Skeleton width="75%" />
      </div>
    </Inline>
  ),
};
/** Same as the pulse-free rendering under `prefers-reduced-motion: reduce`. */
export const ReducedMotion: Story = { args: { animated: false, variant: 'rect' } };
