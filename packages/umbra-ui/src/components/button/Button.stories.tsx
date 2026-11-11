import type { Meta, StoryObj } from '@storybook/react';
import { Inline, Stack } from '../layout/Layout';
import { SearchIcon, ChevronRightIcon } from '../internal/icons';
import { Button, IconButton } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Static/Button',
  component: Button,
  args: { children: 'Deploy', variant: 'solid', tone: 'accent', size: 'md' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['solid', 'soft', 'outline', 'ghost'] },
    tone: { control: 'inline-radio', options: ['accent', 'neutral', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <Stack gap="3">
      {(['accent', 'neutral', 'danger'] as const).map((tone) => (
        <Inline key={tone}>
          {(['solid', 'soft', 'outline', 'ghost'] as const).map((variant) => (
            <Button key={variant} {...args} tone={tone} variant={variant}>
              {variant}
            </Button>
          ))}
        </Inline>
      ))}
    </Stack>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Inline>
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
      <Button {...args} size="lg">Large</Button>
    </Inline>
  ),
};

export const WithIcons: Story = { args: { startIcon: <SearchIcon />, endIcon: <ChevronRightIcon />, children: 'Search' } };
export const Loading: Story = { args: { loading: true, children: 'Deploying' } };
export const Disabled: Story = {
  render: (args) => (
    <Inline>
      {(['solid', 'soft', 'outline', 'ghost'] as const).map((variant) => (
        <Button key={variant} {...args} variant={variant} disabled>
          {variant}
        </Button>
      ))}
    </Inline>
  ),
};
export const FullWidth: Story = { args: { fullWidth: true } };
export const AsLink: Story = {
  args: { asChild: true, variant: 'outline', tone: 'neutral' },
  render: (args) => (
    <Button {...args}>
      <a href="https://example.com">Read the docs</a>
    </Button>
  ),
};

export const IconButtons: Story = {
  render: () => (
    <Inline>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <IconButton key={size} size={size} aria-label="Search">
          <SearchIcon />
        </IconButton>
      ))}
      <IconButton aria-label="Search" variant="soft">
        <SearchIcon />
      </IconButton>
      <IconButton aria-label="Search" variant="solid" tone="accent">
        <SearchIcon />
      </IconButton>
      <IconButton aria-label="Search" loading>
        <SearchIcon />
      </IconButton>
      <IconButton aria-label="Search" disabled>
        <SearchIcon />
      </IconButton>
    </Inline>
  ),
};
