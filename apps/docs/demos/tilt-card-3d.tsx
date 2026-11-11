'use client';

import { Badge, Stack } from 'umbra-ui';
import { TiltCard3D } from 'umbra-ui/3d';

export default function Demo(props: React.ComponentProps<typeof TiltCard3D>) {
  return (
    <TiltCard3D style={{ maxWidth: 480, height: 220, marginInline: 'auto' }} {...props}>
      <Stack gap="3" align="start" style={{ maxWidth: 230 }}>
        <Badge tone="accent">Pro</Badge>
        <strong style={{ fontSize: 'var(--umbra-text-xl-size)' }}>Edge compute</strong>
        <span style={{ color: 'var(--umbra-color-text-secondary)' }}>The surface tilts; the shapes inside shift in depth.</span>
      </Stack>
    </TiltCard3D>
  );
}
// ---
import type { Example, Playground } from '@/lib/demo';

export const playground: Playground = {
  controls: { maxTilt: ['8', '4', '14'], glare: true, quality: ['medium', 'low', 'high'], motion: true },
  render: ({ maxTilt, ...p }) => <Demo maxTilt={Number(maxTilt)} {...p} />,
};
export const examples: Example[] = [{ title: 'Static fallback', description: 'No tilt, CSS artwork instead of the canvas.', render: () => <Demo reducedMotion="always" /> }];
