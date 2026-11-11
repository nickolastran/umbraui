'use client';

import { Button, Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from 'umbra-ui';

export default function Demo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button tone="danger" variant="soft">Delete project</Button>
      </DialogTrigger>
      <DialogContent title="Delete project" description="This removes all deployments and domains. It cannot be undone.">
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" tone="neutral">Cancel</Button>
          </DialogClose>
          <Button tone="danger">Delete project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
// ---
import type { Playground } from '@/lib/demo';

export const playground: Playground = {
  controls: { size: ['md', 'sm', 'lg'], hideClose: false, title: 'Invite teammates', description: 'They will get an email with a link to join.' },
  render: (p) => (
    <Dialog>
      <DialogTrigger asChild><Button variant="soft" tone="neutral">Open dialog</Button></DialogTrigger>
      <DialogContent {...p}><DialogFooter><DialogClose asChild><Button>Done</Button></DialogClose></DialogFooter></DialogContent>
    </Dialog>
  ),
};
