import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../button/Button';
import { Stack } from '../layout/Layout';
import { Alert } from './Alert';

const tones = ['info', 'success', 'warning', 'danger', 'accent', 'neutral'] as const;
const meta: Meta<typeof Alert> = {
  title: 'Static/Alert',
  component: Alert,
  args: { tone: 'info', variant: 'soft', title: 'Build queued', children: 'Your deployment starts when the current build finishes.' },
  argTypes: { tone: { control: 'inline-radio', options: tones }, variant: { control: 'inline-radio', options: ['soft', 'outline'] } },
  decorators: [(Story) => <div style={{ maxWidth: 520 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Alert>;

export const Playground: Story = {};
export const Tones: Story = {
  render: (args) => (
    <Stack gap="3">
      {tones.map((tone) => (
        <Alert key={tone} {...args} tone={tone} title={`${tone[0]!.toUpperCase()}${tone.slice(1)} message`} />
      ))}
    </Stack>
  ),
};
export const Outline: Story = { args: { variant: 'outline', tone: 'warning', title: 'Usage at 90%' } };
export const TitleOnly: Story = { args: { children: undefined, tone: 'success', title: 'Domain verified' } };
export const NoIcon: Story = { args: { icon: null } };
export const Dismissible: Story = {
  render: (args) => {
    const [open, setOpen] = useState(true);
    return open ? <Alert {...args} onDismiss={() => setOpen(false)} /> : <Button variant="soft" tone="neutral" onClick={() => setOpen(true)}>Show alert again</Button>;
  },
};
