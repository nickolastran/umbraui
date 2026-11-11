'use client';

import { Button, Tooltip } from 'umbra-ui';

export default function Demo() {
  return (
    <Tooltip content="Promotes this build to production">
      <Button variant="soft" tone="neutral">Promote</Button>
    </Tooltip>
  );
}
// ---
import type { Playground } from '@/lib/demo';

export const playground: Playground = {
  controls: { side: ['top', 'right', 'bottom', 'left'], content: 'Promotes this build to production' },
  render: (p) => <Tooltip {...p}><Button variant="soft" tone="neutral">Hover or focus me</Button></Tooltip>,
};
