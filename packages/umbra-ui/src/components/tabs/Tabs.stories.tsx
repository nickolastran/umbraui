import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Static/Tabs',
  component: Tabs,
  args: { defaultValue: 'overview', variant: 'underline', size: 'md' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['underline', 'pill'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
  },
  render: (args) => (
    <Tabs {...args}>
      <TabsList aria-label="Project sections">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="deployments">Deployments</TabsTrigger>
        <TabsTrigger value="logs">Logs</TabsTrigger>
        <TabsTrigger value="billing" disabled>Billing</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Traffic, errors and latency for the last 24 hours.</TabsContent>
      <TabsContent value="deployments">Every build, newest first.</TabsContent>
      <TabsContent value="logs">Live output from running functions.</TabsContent>
    </Tabs>
  ),
};
export default meta;
type Story = StoryObj<typeof Tabs>;

export const Playground: Story = {};
export const Pill: Story = { args: { variant: 'pill' } };
export const Small: Story = { args: { size: 'sm', variant: 'pill' } };
export const Vertical: Story = { args: { orientation: 'vertical' } };
export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState('logs');
    return (
      <Tabs {...args} value={value} onValueChange={setValue}>
        <TabsList aria-label="Project sections">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">Overview panel</TabsContent>
        <TabsContent value="logs">Logs panel (selected: {value})</TabsContent>
      </Tabs>
    );
  },
};
