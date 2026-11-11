'use client';

import { Box, Grid, Inline, Stack } from 'umbra-ui';

const Cell = ({ children }: { children: React.ReactNode }) => (
  <Box padding="3" surface="surface-2" radius="sm" bordered>
    {children}
  </Box>
);

export default function Demo() {
  return (
    <Stack gap="4">
      <Inline gap="2">
        <Cell>Inline</Cell>
        <Cell>wraps</Cell>
        <Cell>its children</Cell>
      </Inline>
      <Grid minItemWidth="140px" gap="3">
        <Cell>Grid</Cell>
        <Cell>fits columns</Cell>
        <Cell>to the width</Cell>
      </Grid>
    </Stack>
  );
}
// ---
import type { Playground } from '@/lib/demo';

export const playground: Playground = {
  controls: { gap: ['4', '1', '2', '3', '6', '8'], align: ['stretch', 'start', 'center', 'end'] },
  render: (p) => <Stack {...p} style={{ width: 260 }}><Cell>One</Cell><Cell>Two</Cell><Cell>Three</Cell></Stack>,
};
