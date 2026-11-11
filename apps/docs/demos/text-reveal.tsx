'use client';

import { TextReveal } from 'umbra-ui/motion';

export default function Demo() {
  return (
    <TextReveal as="h2" trigger="inView" style={{ margin: 0, fontSize: 'var(--umbra-text-2xl-size)', letterSpacing: 'var(--umbra-text-2xl-tracking)' }}>
      Interfaces that come out of the dark
    </TextReveal>
  );
}
// ---
import type { Example, Playground } from '@/lib/demo';

const style = { margin: 0, fontSize: 'var(--umbra-text-xl-size)', fontWeight: 600 };
export const playground: Playground = {
  controls: { by: ['word', 'char'], motion: true, children: 'Interfaces that come out of the dark' },
  render: (p) => <TextReveal key={JSON.stringify(p)} style={style} {...p} />,
};
export const examples: Example[] = [
  { title: 'Reduced motion', description: 'The whole line fades in at once.', render: () => <TextReveal reducedMotion="always" trigger="inView" style={style}>No movement, just a fade</TextReveal> },
];
