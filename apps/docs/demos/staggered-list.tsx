'use client';

import { Box } from 'umbra-ui';
import { StaggeredList } from 'umbra-ui/motion';

const steps = ['Install the package', 'Import the stylesheet', 'Wrap the app in ThemeProvider', 'Ship'];

export default function Demo(props: React.ComponentProps<typeof StaggeredList>) {
  return (
    <StaggeredList as="ol" style={{ maxWidth: 360, marginInline: 'auto' }} {...props}>
      {steps.map((step) => (
        <Box key={step} padding="3" surface="surface-1" radius="md" bordered>{step}</Box>
      ))}
    </StaggeredList>
  );
}
// ---
import type { Playground } from '@/lib/demo';

export const playground: Playground = {
  controls: { gap: ['2', '1', '3', '4'], motion: true },
  render: (p) => <Demo key={JSON.stringify(p)} trigger="mount" {...p} />,
};
