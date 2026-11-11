'use client';

import { Badge, Box, Stack } from 'umbra-ui';
import { BeamBorder } from 'umbra-ui/motion';

export default function Demo() {
  return (
    <BeamBorder style={{ maxWidth: 340 }}>
      <Box padding="6">
        <Stack gap="2" align="start">
          <Badge tone="accent">New</Badge>
          <strong>Edge functions, now in every region</strong>
        </Stack>
      </Box>
    </BeamBorder>
  );
}
// ---
import type { Example, Playground } from '@/lib/demo';

export const playground: Playground = {
  controls: { radius: ['lg', 'sm', 'md', 'full'], borderWidth: ['1', '2'], paused: false, motion: true },
  render: ({ borderWidth, ...p }) => <BeamBorder borderWidth={Number(borderWidth) as 1 | 2} {...p}><Box paddingX="6" paddingY="4">Beam border</Box></BeamBorder>,
};
export const examples: Example[] = [
  { title: 'Reduced motion', description: 'The beam becomes a static highlight.', render: () => <BeamBorder reducedMotion="always"><Box paddingX="6" paddingY="4">Static highlight</Box></BeamBorder> },
];
