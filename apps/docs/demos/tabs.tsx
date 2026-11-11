'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from 'umbra-ui';

export default function Demo() {
  return (
    <Tabs defaultValue="overview">
      <TabsList aria-label="Project sections">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="deployments">Deployments</TabsTrigger>
        <TabsTrigger value="logs">Logs</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Traffic, errors and latency for the last 24 hours.</TabsContent>
      <TabsContent value="deployments">Every build, newest first.</TabsContent>
      <TabsContent value="logs">Live output from running functions.</TabsContent>
    </Tabs>
  );
}
// ---
import type { Example, Playground } from '@/lib/demo';

const parts = (label: string) => (
  <>
    <TabsList aria-label={label}>
      <TabsTrigger value="a">Overview</TabsTrigger>
      <TabsTrigger value="b">Logs</TabsTrigger>
      <TabsTrigger value="c" disabled>Billing</TabsTrigger>
    </TabsList>
    <TabsContent value="a">Overview panel.</TabsContent>
    <TabsContent value="b">Logs panel.</TabsContent>
  </>
);
export const playground: Playground = {
  controls: { variant: ['underline', 'pill'], size: ['md', 'sm'], orientation: ['horizontal', 'vertical'] },
  render: (p) => <Tabs defaultValue="a" {...p}>{parts('Playground sections')}</Tabs>,
};
export const examples: Example[] = [{ title: 'Pill', render: () => <Tabs defaultValue="a" variant="pill">{parts('Pill sections')}</Tabs> }];
