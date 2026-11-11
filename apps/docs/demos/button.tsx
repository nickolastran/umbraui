'use client';

import { Button, Inline } from 'umbra-ui';

export default function Demo() {
  return (
    <Inline gap="3">
      <Button>Deploy</Button>
      <Button variant="soft" tone="neutral">Preview</Button>
      <Button variant="ghost" tone="neutral">Cancel</Button>
    </Inline>
  );
}
// ---
import { IconButton, Stack } from 'umbra-ui';
import type { Example, Playground } from '@/lib/demo';

const Plus = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
    <path d="M8 3.5v9M3.5 8h9" />
  </svg>
);

export const playground: Playground = {
  controls: { variant: ['solid', 'soft', 'outline', 'ghost'], tone: ['accent', 'neutral', 'danger'], size: ['md', 'sm', 'lg'], loading: false, disabled: false, children: 'Deploy' },
  render: (p) => <Button {...p} />,
};

export const examples: Example[] = [
  {
    title: 'Variants and tones',
    render: () => (
      <Stack gap="3">
        {(['accent', 'neutral', 'danger'] as const).map((tone) => (
          <Inline key={tone}>
            {(['solid', 'soft', 'outline', 'ghost'] as const).map((variant) => (
              <Button key={variant} tone={tone} variant={variant}>{variant}</Button>
            ))}
          </Inline>
        ))}
      </Stack>
    ),
  },
  { title: 'Sizes', render: () => <Inline><Button size="sm">Small</Button><Button size="md">Medium</Button><Button size="lg">Large</Button></Inline> },
  {
    title: 'Loading and disabled',
    description: 'A loading button keeps focus and its accessible name; it sets aria-busy and ignores clicks.',
    render: () => <Inline><Button loading>Deploying</Button><Button disabled>Disabled</Button></Inline>,
  },
  { title: 'With icons, and icon-only', render: () => <Inline><Button startIcon={<Plus />}>New project</Button><IconButton aria-label="New project" variant="soft"><Plus /></IconButton></Inline> },
  { title: 'As a link', render: () => <Button asChild variant="outline" tone="neutral"><a href="#import">Jump to import</a></Button> },
];
