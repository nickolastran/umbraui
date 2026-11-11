'use client';

import { Badge } from 'umbra-ui';
import { Marquee } from 'umbra-ui/motion';

const teams = ['Northwind', 'Kestrel', 'Halcyon', 'Tessellate', 'Obsidian Labs', 'Parallax', 'Quanta'];

export default function Demo(props: React.ComponentProps<typeof Marquee>) {
  return (
    <Marquee role="group" aria-label="Teams using Umbra" {...props}>
      {teams.map((name) => (
        <Badge key={name} variant="outline">{name}</Badge>
      ))}
    </Marquee>
  );
}
// ---
import type { Example, Playground } from '@/lib/demo';

export const playground: Playground = {
  controls: { direction: ['left', 'right'], pauseOnHover: true, paused: false, fade: true, motion: true },
  render: (p) => <Demo aria-label="Teams (playground)" {...p} />,
};
export const examples: Example[] = [
  { title: 'Reduced motion', description: 'Items wrap in place and nothing moves or is duplicated.', render: () => <Demo aria-label="Teams (static)" reducedMotion="always" /> },
];
