import type { Meta, StoryObj } from '@storybook/react';
import { Inline, Stack } from '../layout/Layout';
import { Badge } from './Badge';

const tones = ['neutral', 'accent', 'success', 'warning', 'danger', 'info'] as const;
const meta: Meta<typeof Badge> = {
  title: 'Static/Badge',
  component: Badge,
  args: { children: 'Beta', variant: 'soft', tone: 'neutral', size: 'md' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['soft', 'solid', 'outline'] },
    tone: { control: 'inline-radio', options: tones },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const Playground: Story = {};
export const Tones: Story = {
  render: () => (
    <Stack gap="3">
      {(['soft', 'solid', 'outline'] as const).map((variant) => (
        <Inline key={variant}>
          {tones.map((tone) => (
            <Badge key={tone} variant={variant} tone={tone}>{tone}</Badge>
          ))}
        </Inline>
      ))}
    </Stack>
  ),
};
export const Sizes: Story = { render: () => <Inline><Badge size="sm">Small</Badge><Badge size="md">Medium</Badge></Inline> };
export const WithDot: Story = { args: { dot: true, tone: 'success', children: 'Operational' } };
