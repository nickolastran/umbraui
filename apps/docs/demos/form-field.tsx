'use client';

import { FormField, Input } from 'umbra-ui';

export default function Demo() {
  return (
    <FormField label="Project name" description="Lowercase letters, numbers and dashes." required style={{ maxWidth: 320 }}>
      <Input placeholder="acme-production" />
    </FormField>
  );
}
// ---
import { Select, SelectItem, Stack, Textarea } from 'umbra-ui';
import type { Example, Playground } from '@/lib/demo';

export const playground: Playground = {
  controls: { label: 'Project name', description: 'Lowercase letters, numbers and dashes.', error: '', required: false, disabled: false },
  render: ({ error, ...p }) => <FormField {...p} error={error || undefined} style={{ maxWidth: 320 }}><Input placeholder="acme-production" /></FormField>,
};
export const examples: Example[] = [
  { title: 'With an error', description: 'The error is announced politely and linked to the control with aria-describedby.', render: () => (
    <FormField label="Project name" error="That name is already taken." style={{ maxWidth: 320 }}><Input defaultValue="acme" /></FormField>
  ) },
  { title: 'Any control', render: () => (
    <Stack gap="5" style={{ maxWidth: 320 }}>
      <FormField label="Notes" description="Markdown is supported."><Textarea /></FormField>
      <FormField label="Region"><Select placeholder="Choose a region"><SelectItem value="iad">Washington, D.C.</SelectItem><SelectItem value="fra">Frankfurt</SelectItem></Select></FormField>
    </Stack>
  ) },
];
