'use client';

import { useState } from 'react';
import { Box, Button, Inline, Stack } from 'umbra-ui';
import { PageTransition } from 'umbra-ui/motion';

const pages = ['Overview', 'Deployments', 'Settings'];

export default function Demo(props: Partial<React.ComponentProps<typeof PageTransition>>) {
  const [page, setPage] = useState(0);
  return (
    <Stack gap="4" style={{ maxWidth: 420, marginInline: 'auto' }}>
      <Inline>
        {pages.map((name, i) => (
          <Button key={name} size="sm" variant={i === page ? 'soft' : 'ghost'} tone="neutral" aria-pressed={i === page} onClick={() => setPage(i)}>
            {name}
          </Button>
        ))}
      </Inline>
      <div style={{ minHeight: 88 }}>
        <PageTransition transitionKey={page} {...props}>
          <Box padding="5" surface="surface-1" radius="lg" bordered>
            <strong>{pages[page]}</strong>
          </Box>
        </PageTransition>
      </div>
    </Stack>
  );
}
// ---
import type { Playground } from '@/lib/demo';

export const playground: Playground = {
  controls: { variant: ['slide', 'fade', 'scale'], mode: ['wait', 'sync'], motion: true },
  render: (p) => <Demo {...p} />,
};
