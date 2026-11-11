'use client';

import { Button, FormField, Input, Popover, PopoverClose, PopoverContent, PopoverTrigger, Stack } from 'umbra-ui';

export default function Demo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="soft" tone="neutral">Rename branch</Button>
      </PopoverTrigger>
      <PopoverContent>
        <Stack gap="3">
          <FormField label="Branch name">
            <Input defaultValue="feat/tokens" />
          </FormField>
          <PopoverClose asChild>
            <Button size="sm">Save name</Button>
          </PopoverClose>
        </Stack>
      </PopoverContent>
    </Popover>
  );
}
// ---
import type { Playground } from '@/lib/demo';

export const playground: Playground = {
  controls: { side: ['bottom', 'top', 'left', 'right'], align: ['center', 'start', 'end'], arrow: true },
  render: (p) => (
    <Popover>
      <PopoverTrigger asChild><Button variant="soft" tone="neutral">Toggle popover</Button></PopoverTrigger>
      <PopoverContent {...p}>Anchored to the trigger; flips to stay on screen.</PopoverContent>
    </Popover>
  ),
};
