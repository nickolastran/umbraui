import type { Meta, StoryObj } from '@storybook/react';
import { Button, IconButton } from '../button/Button';
import { SearchIcon } from '../internal/icons';
import { Kbd } from '../kbd/Kbd';
import { Tooltip } from './Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Static/Tooltip',
  component: Tooltip,
  args: { content: 'Search the docs', side: 'top', delay: 400 },
  argTypes: { side: { control: 'inline-radio', options: ['top', 'right', 'bottom', 'left'] }, children: { control: false } },
  decorators: [(Story) => <div style={{ padding: 60 }}><Story /></div>],
  render: (args) => (
    <Tooltip {...args}>
      <IconButton aria-label="Search">
        <SearchIcon />
      </IconButton>
    </Tooltip>
  ),
};
export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Playground: Story = {};
export const Open: Story = { args: { open: true } };
export const WithShortcut: Story = { args: { open: true, content: <>Search <Kbd size="sm">⌘K</Kbd></> } };
export const OnButton: Story = {
  render: (args) => (
    <Tooltip {...args} content="Promotes this build to production" side="right" open>
      <Button variant="soft" tone="neutral">Promote</Button>
    </Tooltip>
  ),
};
