import { Badge, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from 'umbra-ui';
import props from '@/generated/props.json';

type Doc = { description: string; props: { name: string; type: string; required: boolean; default: string | null; description: string }[] };

/** Props tables generated from the library's TypeScript types (see scripts/generate.mjs). */
export function PropsTable({ names }: { names: string[] }) {
  return (
    <>
      {names.map((name) => {
        const doc = (props as Record<string, Doc>)[name];
        if (!doc?.props.length) return null;
        return (
          <div key={name}>
            {names.length > 1 ? <h3 className="props-table-title">{name}</h3> : null}
            <TableContainer aria-label={`${name} props`} className="props-table">
              <Table size="sm">
                <TableHeader>
                  <TableRow>
                    <TableHead>Prop</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Default</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {doc.props.map((p) => (
                    <TableRow key={p.name}>
                      <TableCell>
                        <code className="props-name">{p.name}</code> {p.required ? <Badge size="sm" tone="accent">required</Badge> : null}
                      </TableCell>
                      <TableCell>
                        <code className="props-type">{p.type}</code>
                      </TableCell>
                      <TableCell>{p.default ? <code>{p.default}</code> : '—'}</TableCell>
                      <TableCell style={{ minWidth: '16rem' }}>{p.description.replace(/\s*@default.*$/s, '')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        );
      })}
    </>
  );
}
