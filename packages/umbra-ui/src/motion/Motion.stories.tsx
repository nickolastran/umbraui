import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Badge } from '../components/badge/Badge';
import { Button } from '../components/button/Button';
import { CardDescription, CardHeader, CardTitle } from '../components/card/Card';
import { Kbd } from '../components/kbd/Kbd';
import { Box, Grid, Inline, Stack } from '../components/layout/Layout';
import { BeamBorder } from './beam-border/BeamBorder';
import { Marquee } from './marquee/Marquee';
import { NumberTicker } from './number-ticker/NumberTicker';
import { PageTransition } from './page-transition/PageTransition';
import { MotionPreferenceProvider } from '../utils/reduced-motion';
import { ShimmerButton } from './shimmer-button/ShimmerButton';
import { SpotlightCard } from './spotlight-card/SpotlightCard';
import { StaggeredList } from './staggered-list/StaggeredList';
import { TextReveal } from './text-reveal/TextReveal';

/**
 * Display-oriented animated components. Every story has a `ReducedMotion` twin showing what users with
 * `prefers-reduced-motion: reduce` get.
 */
const meta: Meta = { title: 'Animated/Effects', argTypes: { reducedMotion: { control: 'inline-radio', options: ['system', 'always', 'never'] } } };
export default meta;

const reduced = { args: { reducedMotion: 'always' as const } };

export const ShimmerButtonStory: StoryObj<typeof ShimmerButton> = {
  name: 'ShimmerButton',
  args: { children: 'Start deploying', effect: 'both', size: 'lg' },
  argTypes: { effect: { control: 'inline-radio', options: ['shimmer', 'glow', 'both'] }, size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  render: (args) => <ShimmerButton {...args} />,
};
export const ShimmerButtonStates: StoryObj<typeof ShimmerButton> = {
  render: (args) => (
    <Inline gap="4">
      <ShimmerButton {...args} effect="shimmer">Shimmer</ShimmerButton>
      <ShimmerButton {...args} effect="glow">Glow</ShimmerButton>
      <ShimmerButton {...args} tone="neutral">Neutral</ShimmerButton>
      <ShimmerButton {...args} variant="soft">Soft</ShimmerButton>
      <ShimmerButton {...args} loading>Loading</ShimmerButton>
      <ShimmerButton {...args} disabled>Disabled</ShimmerButton>
    </Inline>
  ),
};
export const ShimmerButtonReducedMotion: StoryObj<typeof ShimmerButton> = { ...ShimmerButtonStory, ...reduced, args: { ...ShimmerButtonStory.args, ...reduced.args } };

const cardBody = (
  <CardHeader>
    <CardTitle>Preview deployments</CardTitle>
    <CardDescription>Every pull request gets its own URL. Move the pointer across the card.</CardDescription>
  </CardHeader>
);
export const SpotlightCardStory: StoryObj<typeof SpotlightCard> = {
  name: 'SpotlightCard',
  args: { spotlightSize: 360, variant: 'surface' },
  render: (args) => (
    <Grid minItemWidth="240px" style={{ maxWidth: 760 }}>
      <SpotlightCard {...args}>{cardBody}</SpotlightCard>
      <SpotlightCard {...args}>{cardBody}</SpotlightCard>
      <SpotlightCard {...args} variant="outline">{cardBody}</SpotlightCard>
    </Grid>
  ),
};
export const SpotlightCardReducedMotion: StoryObj<typeof SpotlightCard> = { ...SpotlightCardStory, ...reduced };

export const BeamBorderStory: StoryObj<typeof BeamBorder> = {
  name: 'BeamBorder',
  args: { radius: 'lg', borderWidth: 1, speed: 1, paused: false },
  argTypes: { radius: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'full'] }, borderWidth: { control: 'inline-radio', options: [1, 2] } },
  render: (args) => (
    <BeamBorder {...args} style={{ maxWidth: 360 }}>
      <Box padding="6">
        <Stack gap="2" align="start">
          <Badge tone="accent">New</Badge>
          <strong>Edge functions, now in every region</strong>
        </Stack>
      </Box>
    </BeamBorder>
  ),
};
export const BeamBorderPaused: StoryObj<typeof BeamBorder> = { ...BeamBorderStory, args: { ...BeamBorderStory.args, paused: true } };
export const BeamBorderPill: StoryObj<typeof BeamBorder> = {
  render: (args) => (
    <BeamBorder {...args} radius="full" borderWidth={2} style={{ display: 'inline-block' }}>
      <Box paddingX="4" paddingY="1.5">Press <Kbd size="sm">⌘K</Kbd> to search</Box>
    </BeamBorder>
  ),
};
export const BeamBorderReducedMotion: StoryObj<typeof BeamBorder> = { ...BeamBorderStory, args: { ...BeamBorderStory.args, ...reduced.args } };

const headline = { fontSize: 'var(--umbra-text-3xl-size)', lineHeight: 'var(--umbra-text-3xl-line)', letterSpacing: 'var(--umbra-text-3xl-tracking)', fontWeight: 600, margin: 0 };
export const TextRevealStory: StoryObj<typeof TextReveal> = {
  name: 'TextReveal',
  args: { children: 'Interfaces that come out of the dark', as: 'h1', by: 'word', trigger: 'mount', delay: 0 },
  argTypes: { by: { control: 'inline-radio', options: ['word', 'char'] }, trigger: { control: 'inline-radio', options: ['mount', 'inView'] } },
  render: (args) => <TextReveal key={JSON.stringify(args)} {...args} style={headline} />,
};
export const TextRevealByChar: StoryObj<typeof TextReveal> = { ...TextRevealStory, args: { ...TextRevealStory.args, by: 'char', children: 'Umbra UI' } };
export const TextRevealReducedMotion: StoryObj<typeof TextReveal> = { ...TextRevealStory, args: { ...TextRevealStory.args, ...reduced.args } };

export const NumberTickerStory: StoryObj<typeof NumberTicker> = {
  name: 'NumberTicker',
  args: { value: 128430, from: 0, trigger: 'mount' },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return (
      <Stack gap="4" align="start">
        <NumberTicker {...args} value={value} style={headline} />
        <Inline>
          <Button size="sm" variant="soft" tone="neutral" onClick={() => setValue((v) => v + 2500)}>Add 2,500</Button>
          <Button size="sm" variant="soft" tone="neutral" onClick={() => setValue(0)}>Reset</Button>
        </Inline>
      </Stack>
    );
  },
};
export const NumberTickerFormats: StoryObj<typeof NumberTicker> = {
  render: (args) => (
    <Inline gap="8">
      <NumberTicker {...args} trigger="mount" value={99.98} format={{ style: 'unit', unit: 'percent', maximumFractionDigits: 2, minimumFractionDigits: 2 }} locale="en-US" />
      <NumberTicker {...args} trigger="mount" value={4820} format={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }} locale="en-US" />
      <NumberTicker {...args} trigger="mount" value={38} format={{ style: 'unit', unit: 'millisecond', maximumFractionDigits: 0 }} locale="en-US" />
    </Inline>
  ),
};
export const NumberTickerReducedMotion: StoryObj<typeof NumberTicker> = { ...NumberTickerStory, args: { ...NumberTickerStory.args, ...reduced.args } };

const logos = ['Northwind', 'Kestrel', 'Halcyon', 'Tessellate', 'Obsidian Labs', 'Parallax', 'Quanta'];
export const MarqueeStory: StoryObj<typeof Marquee> = {
  name: 'Marquee',
  args: { speed: 1, direction: 'left', pauseOnHover: true, paused: false, fade: true, gap: '8' },
  argTypes: { direction: { control: 'inline-radio', options: ['left', 'right'] } },
  render: (args) => (
    <Marquee {...args} aria-label="Teams using Umbra" role="group" style={{ maxWidth: 640 }}>
      {logos.map((name) => (
        <Badge key={name} size="md" variant="outline">{name}</Badge>
      ))}
    </Marquee>
  ),
};
export const MarqueePaused: StoryObj<typeof Marquee> = { ...MarqueeStory, args: { ...MarqueeStory.args, paused: true } };
export const MarqueeReducedMotion: StoryObj<typeof Marquee> = { ...MarqueeStory, args: { ...MarqueeStory.args, ...reduced.args } };

const steps = ['Install the package', 'Import the stylesheet', 'Wrap the app in ThemeProvider', 'Ship'];
export const StaggeredListStory: StoryObj<typeof StaggeredList> = {
  name: 'StaggeredList',
  args: { as: 'ol', trigger: 'mount', gap: '2' },
  argTypes: { as: { control: 'inline-radio', options: ['ul', 'ol', 'div'] }, trigger: { control: 'inline-radio', options: ['mount', 'inView'] } },
  render: (args) => {
    const [run, setRun] = useState(0);
    return (
      <Stack gap="4" align="start" style={{ maxWidth: 360 }}>
        <StaggeredList key={run} {...args} style={{ width: '100%' }}>
          {steps.map((s) => (
            <Box key={s} padding="3" surface="surface-1" radius="md" bordered>{s}</Box>
          ))}
        </StaggeredList>
        <Button size="sm" variant="soft" tone="neutral" onClick={() => setRun((r) => r + 1)}>Replay</Button>
      </Stack>
    );
  },
};
export const StaggeredListReducedMotion: StoryObj<typeof StaggeredList> = { ...StaggeredListStory, args: { ...StaggeredListStory.args, ...reduced.args } };

export const PageTransitionStory: StoryObj<typeof PageTransition> = {
  name: 'PageTransition',
  args: { variant: 'slide', mode: 'wait' },
  argTypes: { variant: { control: 'inline-radio', options: ['fade', 'slide', 'scale'] }, mode: { control: 'inline-radio', options: ['wait', 'sync'] } },
  render: (args) => {
    const pages = ['Overview', 'Deployments', 'Settings'];
    const [page, setPage] = useState(0);
    return (
      <Stack gap="4" style={{ maxWidth: 420 }}>
        <Inline>
          {pages.map((p, i) => (
            <Button key={p} size="sm" variant={i === page ? 'soft' : 'ghost'} tone="neutral" aria-current={i === page ? 'page' : undefined} onClick={() => setPage(i)}>
              {p}
            </Button>
          ))}
        </Inline>
        <div style={{ minHeight: 96 }}>
          <PageTransition {...args} transitionKey={page}>
            <Box padding="5" surface="surface-1" radius="lg" bordered>
              <strong>{pages[page]}</strong>
              <p style={{ margin: 0, color: 'var(--umbra-color-text-secondary)' }}>Content for the {pages[page]!.toLowerCase()} view.</p>
            </Box>
          </PageTransition>
        </div>
      </Stack>
    );
  },
};
export const PageTransitionReducedMotion: StoryObj<typeof PageTransition> = { ...PageTransitionStory, args: { ...PageTransitionStory.args, ...reduced.args } };

/** One provider switches a whole subtree to reduced motion. */
export const MotionPreferenceProviderStory: StoryObj = {
  name: 'MotionPreferenceProvider',
  render: () => (
    <MotionPreferenceProvider reducedMotion="always">
      <Stack gap="4" align="start">
        <ShimmerButton>No shimmer in here</ShimmerButton>
        <Marquee style={{ maxWidth: 420 }}>{logos.map((n) => <Badge key={n}>{n}</Badge>)}</Marquee>
      </Stack>
    </MotionPreferenceProvider>
  ),
};
