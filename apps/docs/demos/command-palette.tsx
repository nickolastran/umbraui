'use client';

import { useState } from 'react';
import { Button } from 'umbra-ui';
import { CommandPalette, toast, type CommandItem } from 'umbra-ui/motion';

const items: CommandItem[] = [
  { id: 'new', label: 'New project', group: 'Projects', shortcut: 'N' },
  { id: 'import', label: 'Import Git repository', group: 'Projects', keywords: ['github', 'gitlab'] },
  { id: 'domain', label: 'Add domain', group: 'Projects', disabled: true },
  { id: 'support', label: 'Contact support', group: 'Help' },
];

export default function Demo(props: Partial<React.ComponentProps<typeof CommandPalette>>) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="soft" tone="neutral" onClick={() => setOpen(true)}>Open command palette</Button>
      {/* hotkey is off here because this site already binds ⌘K to its own search. */}
      <CommandPalette items={items} open={open} onOpenChange={setOpen} hotkey={false} onSelect={(item) => toast(`Ran: ${item.label}`)} {...props} />
    </>
  );
}
// ---
import type { Playground } from '@/lib/demo';

export const playground: Playground = {
  controls: { closeOnSelect: true, motion: true, placeholder: 'Type a command or search…' },
  render: (p) => <Demo {...p} />,
};
