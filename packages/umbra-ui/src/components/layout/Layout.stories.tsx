import type { Meta, StoryObj } from '@storybook/react';
import { Box, Container, Grid, Inline, Stack } from './Layout';

const meta: Meta = { title: 'Static/Layout' };
export default meta;

const Cell = ({ children }: { children: React.ReactNode }) => (
  <Box padding="3" surface="surface-2" radius="sm" bordered>
    {children}
  </Box>
);

export const BoxStory: StoryObj<typeof Box> = {
  name: 'Box',
  args: { padding: '4', surface: 'surface-1', radius: 'md', bordered: true, children: 'Box' },
  argTypes: {
    surface: { control: 'inline-radio', options: ['bg', 'bg-subtle', 'surface-1', 'surface-2', 'surface-3'] },
    radius: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg', 'full'] },
  },
  render: (args) => <Box {...args} />,
};
export const StackStory: StoryObj<typeof Stack> = {
  name: 'Stack',
  args: { gap: '3', align: 'stretch' },
  render: (args) => <Stack {...args}><Cell>One</Cell><Cell>Two</Cell><Cell>Three</Cell></Stack>,
};
export const InlineStory: StoryObj<typeof Inline> = {
  name: 'Inline',
  args: { gap: '2', wrap: true, justify: 'start' },
  render: (args) => <Inline {...args}>{['Design', 'Tokens', 'Motion', '3D', 'Docs'].map((t) => <Cell key={t}>{t}</Cell>)}</Inline>,
};
export const GridFixed: StoryObj<typeof Grid> = {
  args: { columns: 3, gap: '3' },
  render: (args) => <Grid {...args}>{Array.from({ length: 6 }, (_, i) => <Cell key={i}>{i + 1}</Cell>)}</Grid>,
};
export const GridResponsive: StoryObj<typeof Grid> = {
  args: { minItemWidth: '160px', gap: '3' },
  render: (args) => <Grid {...args}>{Array.from({ length: 6 }, (_, i) => <Cell key={i}>{i + 1}</Cell>)}</Grid>,
};
export const ContainerStory: StoryObj<typeof Container> = {
  name: 'Container',
  args: { size: 'sm' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl'] } },
  render: (args) => <Container {...args}><Cell>Centered, capped at the {args.size} width</Cell></Container>,
};
