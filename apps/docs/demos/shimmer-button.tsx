'use client';

import { ShimmerButton } from 'umbra-ui/motion';

export default function Demo() {
  return <ShimmerButton size="lg">Start deploying</ShimmerButton>;
}
// ---
import { Inline } from 'umbra-ui';
import type { Example, Playground } from '@/lib/demo';

export const playground: Playground = {
  controls: { effect: ['both', 'shimmer', 'glow'], tone: ['accent', 'neutral'], size: ['lg', 'md', 'sm'], motion: true, disabled: false, children: 'Start deploying' },
  render: (p) => <ShimmerButton {...p} />,
};
export const examples: Example[] = [
  { title: 'Effects', render: () => <Inline gap="4"><ShimmerButton effect="shimmer">Shimmer</ShimmerButton><ShimmerButton effect="glow">Glow</ShimmerButton><ShimmerButton>Both</ShimmerButton></Inline> },
  { title: 'Loading and disabled', render: () => <Inline gap="4"><ShimmerButton loading>Deploying</ShimmerButton><ShimmerButton disabled>Disabled</ShimmerButton></Inline> },
  { title: 'Reduced motion', description: 'The sweep is removed; the static glow stays.', render: () => <ShimmerButton reducedMotion="always">No sweep</ShimmerButton> },
];
