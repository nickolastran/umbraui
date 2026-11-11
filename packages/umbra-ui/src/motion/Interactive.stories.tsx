import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../components/button/Button';
import { Kbd } from '../components/kbd/Kbd';
import { Inline, Stack } from '../components/layout/Layout';
import { AnimatedTabs, AnimatedTabsContent, AnimatedTabsList, AnimatedTabsTrigger } from './animated-tabs/AnimatedTabs';
import { CommandPalette, type CommandItem } from './command-palette/CommandPalette';
import { Toaster, toast } from './toast/Toast';

const meta: Meta = { title: 'Animated/Interactive', argTypes: { reducedMotion: { control: 'inline-radio', options: ['system', 'always', 'never'] } } };
export default meta;

export const AnimatedTabsStory: StoryObj<typeof AnimatedTabs> = {
  name: 'AnimatedTabs',
  args: { defaultValue: 'overview', variant: 'underline', size: 'md' },
  argTypes: { variant: { control: 'inline-radio', options: ['underline', 'pill'] }, size: { control: 'inline-radio', options: ['sm', 'md'] } },
  render: (args) => (
    <AnimatedTabs {...args}>
      <AnimatedTabsList aria-label="Project sections">
        <AnimatedTabsTrigger value="overview">Overview</AnimatedTabsTrigger>
        <AnimatedTabsTrigger value="deployments">Deployments</AnimatedTabsTrigger>
        <AnimatedTabsTrigger value="logs">Logs</AnimatedTabsTrigger>
        <AnimatedTabsTrigger value="billing" disabled>Billing</AnimatedTabsTrigger>
      </AnimatedTabsList>
      <AnimatedTabsContent value="overview">Traffic, errors and latency for the last 24 hours.</AnimatedTabsContent>
      <AnimatedTabsContent value="deployments">Every build, newest first.</AnimatedTabsContent>
      <AnimatedTabsContent value="logs">Live output from running functions.</AnimatedTabsContent>
    </AnimatedTabs>
  ),
};
export const AnimatedTabsPill: StoryObj<typeof AnimatedTabs> = { ...AnimatedTabsStory, args: { ...AnimatedTabsStory.args, variant: 'pill' } };
export const AnimatedTabsReducedMotion: StoryObj<typeof AnimatedTabs> = { ...AnimatedTabsStory, args: { ...AnimatedTabsStory.args, variant: 'pill', reducedMotion: 'always' } };

export const ToastStory: StoryObj<typeof Toaster> = {
  name: 'Toast',
  args: { position: 'bottom-right', max: 4 },
  argTypes: { position: { control: 'select', options: ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'] } },
  render: (args) => (
    <div style={{ minHeight: 360 }}>
      <Stack gap="3" align="start">
        <Inline>
          <Button variant="soft" tone="neutral" onClick={() => toast('Link copied')}>Neutral</Button>
          <Button variant="soft" tone="neutral" onClick={() => toast({ title: 'Deployment ready', description: 'acme-production is live.', tone: 'success' })}>Success</Button>
          <Button variant="soft" tone="neutral" onClick={() => toast({ title: 'Build failed', description: 'Type error in app/page.tsx.', tone: 'danger', duration: Infinity })}>
            Danger (sticky)
          </Button>
          <Button
            variant="soft"
            tone="neutral"
            onClick={() => toast({ title: 'Project archived', tone: 'info', action: { label: 'Undo', onClick: () => toast('Project restored') } })}
          >
            With action
          </Button>
          <Button variant="ghost" tone="neutral" onClick={() => toast.dismiss()}>Dismiss all</Button>
        </Inline>
        <span style={{ color: 'var(--umbra-color-text-muted)', fontSize: 'var(--umbra-text-xs-size)' }}>
          Press <Kbd size="sm">F8</Kbd> to focus the newest toast, <Kbd size="sm">Esc</Kbd> to dismiss it.
        </span>
      </Stack>
      <Toaster {...args} />
    </div>
  ),
};
export const ToastReducedMotion: StoryObj<typeof Toaster> = { ...ToastStory, args: { ...ToastStory.args, reducedMotion: 'always' } };

const commands: CommandItem[] = [
  { id: 'new', label: 'New project', group: 'Projects', shortcut: 'N' },
  { id: 'import', label: 'Import Git repository', group: 'Projects', keywords: ['github', 'gitlab'] },
  { id: 'domains', label: 'Add domain', group: 'Projects', disabled: true },
  { id: 'theme', label: 'Toggle theme', group: 'Preferences', shortcut: '⌘J', keywords: ['dark', 'light'] },
  { id: 'docs', label: 'Search documentation', group: 'Help' },
  { id: 'support', label: 'Contact support', group: 'Help' },
];
export const CommandPaletteStory: StoryObj<typeof CommandPalette> = {
  name: 'CommandPalette',
  args: { items: commands, hotkey: true, closeOnSelect: true },
  argTypes: { items: { control: false } },
  render: (args) => {
    const [open, setOpen] = useState(false);
    const [last, setLast] = useState<string>();
    return (
      <div style={{ minHeight: 420 }}>
        <Inline gap="3">
          <Button variant="soft" tone="neutral" onClick={() => setOpen(true)}>Open palette <Kbd size="sm">⌘K</Kbd></Button>
          {last ? <span>Ran: {last}</span> : null}
        </Inline>
        <CommandPalette {...args} open={open} onOpenChange={setOpen} onSelect={(item) => setLast(item.label)} />
      </div>
    );
  },
};
export const CommandPaletteOpen: StoryObj<typeof CommandPalette> = {
  args: { items: commands, defaultOpen: true },
  render: (args) => <div style={{ minHeight: 480 }}><CommandPalette {...args} /></div>,
};
export const CommandPaletteReducedMotion: StoryObj<typeof CommandPalette> = { ...CommandPaletteOpen, args: { ...CommandPaletteOpen.args, reducedMotion: 'always' } };
