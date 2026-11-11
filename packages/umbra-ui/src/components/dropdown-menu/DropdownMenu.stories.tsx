import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../button/Button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './DropdownMenu';

const meta: Meta<typeof DropdownMenu> = {
  title: 'Static/DropdownMenu',
  component: DropdownMenu,
  decorators: [(Story) => <div style={{ minHeight: 320 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof DropdownMenu>;

export const Playground: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger asChild>
        <Button variant="soft" tone="neutral">Deployment</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>acme-production</DropdownMenuLabel>
        <DropdownMenuItem shortcut="⌘O">Open preview</DropdownMenuItem>
        <DropdownMenuItem shortcut="⌘L">Copy link</DropdownMenuItem>
        <DropdownMenuItem disabled>Promote (already live)</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem tone="danger" shortcut="⌫">Delete deployment</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const CheckboxAndRadioItems: Story = {
  render: () => {
    const [wrap, setWrap] = useState(true);
    const [level, setLevel] = useState('info');
    return (
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger asChild>
          <Button variant="soft" tone="neutral">Log options</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked={wrap} onCheckedChange={setWrap}>Wrap lines</DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Minimum level</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={level} onValueChange={setLevel}>
            <DropdownMenuRadioItem value="debug">Debug</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="info">Info</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="error">Error</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};
