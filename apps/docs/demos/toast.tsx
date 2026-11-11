'use client';

import { Button, Inline } from 'umbra-ui';
import { toast } from 'umbra-ui/motion';

// <Toaster /> is mounted once in the app root.
export default function Demo() {
  return (
    <Inline>
      <Button variant="soft" tone="neutral" onClick={() => toast({ title: 'Deployment ready', description: 'acme-production is live.', tone: 'success' })}>
        Show toast
      </Button>
      <Button variant="soft" tone="neutral" onClick={() => toast({ title: 'Project archived', action: { label: 'Undo', onClick: () => toast('Project restored') } })}>
        With action
      </Button>
    </Inline>
  );
}
// ---
import type { Example } from '@/lib/demo';

const tones = ['neutral', 'success', 'info', 'warning', 'danger'] as const;
export const examples: Example[] = [
  { title: 'Tones', description: 'Danger toasts are announced assertively; the rest politely.', render: () => (
    <Inline>{tones.map((tone) => <Button key={tone} size="sm" variant="soft" tone="neutral" onClick={() => toast({ title: `A ${tone} toast`, tone })}>{tone}</Button>)}</Inline>
  ) },
  { title: 'Sticky', description: 'duration: Infinity keeps a toast until it is dismissed.', render: () => (
    <Inline>
      <Button size="sm" variant="soft" tone="neutral" onClick={() => toast({ title: 'Build failed', description: 'Type error in app/page.tsx.', tone: 'danger', duration: Infinity })}>Show sticky toast</Button>
      <Button size="sm" variant="ghost" tone="neutral" onClick={() => toast.dismiss()}>Dismiss all</Button>
    </Inline>
  ) },
];
