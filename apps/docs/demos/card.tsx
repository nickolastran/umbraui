'use client';

import { Badge, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from 'umbra-ui';

export default function Demo() {
  return (
    <Card style={{ maxWidth: 340 }}>
      <CardHeader>
        <CardTitle>Edge network</CardTitle>
        <CardDescription>Requests are served from the region closest to each visitor.</CardDescription>
      </CardHeader>
      <CardContent>
        <Badge tone="success" dot>Operational</Badge>
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="soft" tone="neutral">View regions</Button>
      </CardFooter>
    </Card>
  );
}
// ---
import { Grid } from 'umbra-ui';
import type { Example, Playground } from '@/lib/demo';

const body = <CardHeader><CardTitle>Edge network</CardTitle><CardDescription>Served from the closest region.</CardDescription></CardHeader>;
export const playground: Playground = {
  controls: { variant: ['surface', 'outline', 'ghost'], size: ['md', 'sm', 'lg'], interactive: false },
  render: (p) => <Card style={{ maxWidth: 340 }} {...p}>{body}</Card>,
};
export const examples: Example[] = [
  { title: 'Variants', render: () => <Grid minItemWidth="200px">{(['surface', 'outline', 'ghost'] as const).map((v) => <Card key={v} variant={v}>{body}</Card>)}</Grid> },
  { title: 'Interactive, as a link', render: () => <Card interactive asChild style={{ maxWidth: 340 }}><a href="#props">{body}</a></Card> },
];
