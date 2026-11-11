'use client';

import { Textarea } from 'umbra-ui';

export default function Demo() {
  return <Textarea aria-label="Release notes" placeholder="What changed in this release?" style={{ maxWidth: 360 }} />;
}
// ---
import type { Example, Playground } from '@/lib/demo';

export const playground: Playground = {
  controls: { resize: ['vertical', 'none', 'both'], invalid: false, disabled: false, placeholder: 'What changed in this release?' },
  render: (p) => <Textarea aria-label="Release notes" style={{ maxWidth: 360 }} {...p} />,
};
export const examples: Example[] = [
  { title: 'Invalid', render: () => <Textarea aria-label="Invalid notes" invalid defaultValue="Too short" style={{ maxWidth: 360 }} /> },
  { title: 'Disabled', render: () => <Textarea aria-label="Locked notes" disabled defaultValue="Locked while the release is publishing." style={{ maxWidth: 360 }} /> },
];
