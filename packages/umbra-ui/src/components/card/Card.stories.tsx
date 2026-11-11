import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../badge/Badge';
import { Button } from '../button/Button';
import { Grid } from '../layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './Card';

const body = (
  <>
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
  </>
);

const meta: Meta<typeof Card> = {
  title: 'Static/Card',
  component: Card,
  args: { variant: 'surface', size: 'md', children: body },
  argTypes: {
    variant: { control: 'inline-radio', options: ['surface', 'outline', 'ghost'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    children: { control: false },
  },
  decorators: [(Story) => <div style={{ maxWidth: 720 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Card>;

export const Playground: Story = { decorators: [(Story) => <div style={{ maxWidth: 360 }}><Story /></div>] };
export const Variants: Story = {
  render: (args) => (
    <Grid minItemWidth="220px">
      <Card {...args} variant="surface" />
      <Card {...args} variant="outline" />
      <Card {...args} variant="ghost" />
    </Grid>
  ),
};
export const Sizes: Story = {
  render: (args) => (
    <Grid minItemWidth="220px">
      <Card {...args} size="sm" />
      <Card {...args} size="md" />
      <Card {...args} size="lg" />
    </Grid>
  ),
};
export const Interactive: Story = {
  render: (args) => (
    <Card {...args} interactive asChild>
      <a href="https://example.com">
        <CardHeader>
          <CardTitle>Quickstart</CardTitle>
          <CardDescription>The whole card is one link. Hover or focus it.</CardDescription>
        </CardHeader>
      </a>
    </Card>
  ),
  decorators: [(Story) => <div style={{ maxWidth: 360 }}><Story /></div>],
};
