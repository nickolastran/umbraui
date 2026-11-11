'use client';

import { ModelViewer } from 'umbra-ui/3d';

export default function Demo(props: Partial<React.ComponentProps<typeof ModelViewer>>) {
  return <ModelViewer aria-label="Torus knot, violet" style={{ maxWidth: 520, height: 340, marginInline: 'auto' }} {...props} />;
}
// ---
import type { Example, Playground } from '@/lib/demo';

export const playground: Playground = {
  controls: { autoRotate: true, hideControls: false, quality: ['medium', 'low', 'high'], motion: true },
  render: (p) => <Demo key={String(p.autoRotate)} aria-label="Torus knot (playground)" {...p} />,
};
export const examples: Example[] = [
  { title: 'Reduced motion', description: 'Still interactive, but never moves on its own and snaps instead of easing.', render: () => <Demo aria-label="Torus knot (reduced motion)" reducedMotion="always" /> },
];
