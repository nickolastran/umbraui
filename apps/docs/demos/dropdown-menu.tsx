'use client';

import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from 'umbra-ui';

export default function Demo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="soft" tone="neutral">Deployment</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>acme-production</DropdownMenuLabel>
        <DropdownMenuItem shortcut="⌘O">Open preview</DropdownMenuItem>
        <DropdownMenuItem shortcut="⌘L">Copy link</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem tone="danger">Delete deployment</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
// ---
import { useState } from 'react';
import { DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem } from 'umbra-ui';
import type { Example } from '@/lib/demo';

function Options() {
  const [wrap, setWrap] = useState(true);
  const [level, setLevel] = useState('info');
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="soft" tone="neutral">Log options</Button></DropdownMenuTrigger>
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
}
export const examples: Example[] = [{ title: 'Checkbox and radio items', render: () => <Options /> }];
