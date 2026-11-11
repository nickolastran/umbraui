import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../badge/Badge';
import { Table, TableBody, TableCaption, TableCell, TableContainer, TableHead, TableHeader, TableRow } from './Table';

const rows = [
  { id: 'dpl_9f2', branch: 'main', status: 'Ready', tone: 'success', ms: 412 },
  { id: 'dpl_9f1', branch: 'feat/tokens', status: 'Building', tone: 'info', ms: 0 },
  { id: 'dpl_9f0', branch: 'fix/focus-ring', status: 'Failed', tone: 'danger', ms: 1288 },
] as const;

const meta: Meta<typeof Table> = {
  title: 'Static/Table',
  component: Table,
  args: { size: 'md', interactive: false },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md'] } },
  render: (args) => (
    <TableContainer aria-label="Recent deployments">
      <Table {...args}>
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
          {rows.map((r, i) => (
            <TableRow key={r.id} selected={args.interactive && i === 0 ? true : undefined}>
              <TableCell><code>{r.id}</code></TableCell>
              <TableCell>{r.branch}</TableCell>
              <TableCell><Badge tone={r.tone} dot>{r.status}</Badge></TableCell>
              <TableCell numeric>{r.ms ? `${r.ms} ms` : '—'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ),
};
export default meta;
type Story = StoryObj<typeof Table>;

export const Playground: Story = {};
export const Compact: Story = { args: { size: 'sm' } };
export const InteractiveWithSelection: Story = { args: { interactive: true } };
