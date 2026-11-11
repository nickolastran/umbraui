'use client';

import { Badge, Table, TableBody, TableCaption, TableCell, TableContainer, TableHead, TableHeader, TableRow } from 'umbra-ui';

const rows = [
  { id: 'dpl_9f2', branch: 'main', status: 'Ready', tone: 'success', ms: '412 ms' },
  { id: 'dpl_9f1', branch: 'feat/tokens', status: 'Building', tone: 'info', ms: '—' },
  { id: 'dpl_9f0', branch: 'fix/focus-ring', status: 'Failed', tone: 'danger', ms: '1,288 ms' },
] as const;

export default function Demo({ size, interactive }: { size?: 'sm' | 'md'; interactive?: boolean }) {
  return (
    <TableContainer aria-label="Recent deployments">
      <Table size={size} interactive={interactive}>
        <TableCaption>Recent deployments</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Deployment</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead>Status</TableHead>
            <TableHead numeric>Build time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id}>
              <TableCell><code>{r.id}</code></TableCell>
              <TableCell>{r.branch}</TableCell>
              <TableCell><Badge tone={r.tone} dot>{r.status}</Badge></TableCell>
              <TableCell numeric>{r.ms}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
// ---
import type { Playground } from '@/lib/demo';

export const playground: Playground = { controls: { size: ['md', 'sm'], interactive: true }, render: (p) => <Demo {...p} /> };
