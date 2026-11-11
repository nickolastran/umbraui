'use client';

import { Inline, Skeleton } from 'umbra-ui';

export default function Demo() {
  return (
    <Inline role="status" aria-busy="true" aria-label="Loading profile" gap="3" wrap={false} align="start" style={{ maxWidth: 340 }}>
      <Skeleton variant="circle" width={40} height={40} />
      <div style={{ flex: 1 }}>
        <Skeleton width="40%" />
        <Skeleton />
        <Skeleton width="75%" />
      </div>
    </Inline>
  );
}
// ---
import type { Playground } from '@/lib/demo';

export const playground: Playground = {
  controls: { variant: ['rect', 'text', 'circle'], animated: true },
  render: (p) => <div style={{ width: 240 }}><Skeleton {...p} /></div>,
};
