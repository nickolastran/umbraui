'use client';

import { AnimatedTabs, AnimatedTabsContent, AnimatedTabsList, AnimatedTabsTrigger } from 'umbra-ui/motion';

export default function Demo(props: React.ComponentProps<typeof AnimatedTabs>) {
  return (
    <AnimatedTabs defaultValue="overview" variant="pill" {...props}>
      <AnimatedTabsList aria-label={props['aria-label'] ?? 'Project sections'}>
        <AnimatedTabsTrigger value="overview">Overview</AnimatedTabsTrigger>
        <AnimatedTabsTrigger value="deployments">Deployments</AnimatedTabsTrigger>
        <AnimatedTabsTrigger value="logs">Logs</AnimatedTabsTrigger>
      </AnimatedTabsList>
      <AnimatedTabsContent value="overview">Traffic, errors and latency for the last 24 hours.</AnimatedTabsContent>
      <AnimatedTabsContent value="deployments">Every build, newest first.</AnimatedTabsContent>
      <AnimatedTabsContent value="logs">Live output from running functions.</AnimatedTabsContent>
    </AnimatedTabs>
  );
}
// ---
import type { Playground } from '@/lib/demo';

export const playground: Playground = {
  controls: { variant: ['underline', 'pill'], size: ['md', 'sm'], motion: true },
  render: (p) => <Demo aria-label="Playground sections" {...p} />,
};
