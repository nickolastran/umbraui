'use client';

import { Logo3D } from 'umbra-ui/3d';

export default function Demo() {
  return <Logo3D aria-label="Umbra" style={{ width: 220 }} />;
}
// ---
import type { Example, Playground } from '@/lib/demo';

export const playground: Playground = {
  controls: { depth: ['0.18', '0.08', '0.4'], quality: ['medium', 'low', 'high'], motion: true },
  render: ({ depth, ...p }) => <Logo3D aria-label="Umbra (playground)" depth={Number(depth)} style={{ width: 220 }} {...p} />,
};
export const examples: Example[] = [
  { title: 'Custom path', render: () => <Logo3D aria-label="Diamond" path="M50 5 95 50 50 95 5 50Z M50 30 30 50 50 70 70 50Z" depth={0.3} style={{ width: 180 }} /> },
  { title: 'Static fallback', description: 'The same path as an SVG.', render: () => <Logo3D aria-label="Umbra (static)" reducedMotion="always" style={{ width: 180 }} /> },
];
