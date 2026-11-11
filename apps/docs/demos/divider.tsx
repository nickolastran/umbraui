'use client';

import { Divider, Inline } from 'umbra-ui';

export default function Demo() {
  return (
    <Inline gap="3">
      <span>Docs</span>
      <Divider orientation="vertical" />
      <span>API</span>
      <Divider orientation="vertical" />
      <span>Changelog</span>
    </Inline>
  );
}
// ---
import { Stack } from 'umbra-ui';
import type { Example } from '@/lib/demo';

export const examples: Example[] = [{ title: 'Horizontal', render: () => <Stack gap="3" style={{ width: 240 }}><span>Usage</span><Divider /><span>Billing</span></Stack> }];
