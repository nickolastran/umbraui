import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../components/badge/Badge';
import { Button } from '../components/button/Button';
import { Inline, Stack } from '../components/layout/Layout';
import { HeroScene } from './hero-scene/HeroScene';
import { Logo3D } from './logo-3d/Logo3D';
import { ModelViewer } from './model-viewer/ModelViewer';
import { Orb } from './orb/Orb';
import { ParticleField } from './particle-field/ParticleField';
import { TiltCard3D } from './tilt-card/TiltCard3D';

/**
 * Every 3D component lazy-loads three.js and shows a token-styled placeholder meanwhile. The `…Fallback` stories
 * show what renders without WebGL or under `prefers-reduced-motion` (forced here with `reducedMotion="always"`).
 */
const meta: Meta = {
  title: '3D/Scenes',
  argTypes: {
    quality: { control: 'inline-radio', options: ['low', 'medium', 'high'] },
    reducedMotion: { control: 'inline-radio', options: ['system', 'always', 'never'] },
  },
  args: { quality: 'medium', reducedMotion: 'system' },
  parameters: { layout: 'fullscreen' },
};
export default meta;

const fallbackArgs = { args: { reducedMotion: 'always' as const } };
const heading = { margin: 0, fontSize: 'var(--umbra-text-3xl-size)', lineHeight: 'var(--umbra-text-3xl-line)', letterSpacing: 'var(--umbra-text-3xl-tracking)', fontWeight: 600 };
const center = { display: 'grid', placeItems: 'center', minHeight: 420, textAlign: 'center' as const, padding: 24 };

export const HeroSceneStory: StoryObj<typeof HeroScene> = {
  name: 'HeroScene',
  render: (args) => (
    <HeroScene {...args} style={{ minHeight: 480 }}>
      <div style={center}>
        <Stack gap="4" align="center">
          <h1 style={heading}>Out of the dark</h1>
          <Button size="lg">Get started</Button>
        </Stack>
      </div>
    </HeroScene>
  ),
};
export const HeroSceneFallback: StoryObj<typeof HeroScene> = { ...HeroSceneStory, ...fallbackArgs };
export const HeroSceneCustomFallback: StoryObj<typeof HeroScene> = {
  ...HeroSceneStory,
  args: { reducedMotion: 'always', fallback: <div style={{ background: 'var(--umbra-gradient-accent)', opacity: 0.25 }} /> },
};
export const HeroSceneLowQuality: StoryObj<typeof HeroScene> = { ...HeroSceneStory, args: { quality: 'low' } };

export const ParticleFieldStory: StoryObj<typeof ParticleField> = {
  name: 'ParticleField',
  args: { speed: 1 },
  render: (args) => (
    <ParticleField {...args} style={{ minHeight: 360 }}>
      <div style={{ ...center, minHeight: 360 }}>
        <h2 style={heading}>3,200 particles, one draw call</h2>
      </div>
    </ParticleField>
  ),
};
export const ParticleFieldFallback: StoryObj<typeof ParticleField> = { ...ParticleFieldStory, args: { ...ParticleFieldStory.args, ...fallbackArgs.args } };

export const OrbStory: StoryObj<typeof Orb> = {
  name: 'Orb',
  args: { 'aria-label': 'Start listening', size: 'lg', tone: 'accent' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] }, tone: { control: 'inline-radio', options: ['accent', 'neon'] } },
  parameters: { layout: 'padded' },
  render: (args) => <Orb {...args} />,
};
export const OrbStates: StoryObj<typeof Orb> = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <Inline gap="6">
      <Orb {...args} aria-label="Small" size="sm" />
      <Orb {...args} aria-label="Medium" size="md" />
      <Orb {...args} aria-label="Large" size="lg" />
      <Orb {...args} aria-label="Neon" size="lg" tone="neon" />
      <Orb {...args} aria-label="With label" size="lg">Go</Orb>
      <Orb {...args} aria-label="Disabled" size="lg" disabled />
    </Inline>
  ),
};
export const OrbFallback: StoryObj<typeof Orb> = { ...OrbStates, ...fallbackArgs };

export const TiltCard3DStory: StoryObj<typeof TiltCard3D> = {
  name: 'TiltCard3D',
  args: { maxTilt: 8, glare: true },
  parameters: { layout: 'padded' },
  render: (args) => (
    <TiltCard3D {...args} style={{ maxWidth: 520, height: 240 }}>
      <Stack gap="3" align="start" style={{ maxWidth: 260 }}>
        <Badge tone="accent">Pro</Badge>
        <strong style={{ fontSize: 'var(--umbra-text-xl-size)', letterSpacing: 'var(--umbra-text-xl-tracking)' }}>Edge compute</strong>
        <span style={{ color: 'var(--umbra-color-text-secondary)' }}>Move the pointer across the card: the surface tilts and the shapes inside shift in depth.</span>
      </Stack>
    </TiltCard3D>
  ),
};
export const TiltCard3DFallback: StoryObj<typeof TiltCard3D> = { ...TiltCard3DStory, args: { ...TiltCard3DStory.args, ...fallbackArgs.args } };

export const ModelViewerStory: StoryObj<typeof ModelViewer> = {
  name: 'ModelViewer',
  args: { 'aria-label': 'Torus knot, violet', autoRotate: true, hideControls: false },
  parameters: { layout: 'padded' },
  render: (args) => <ModelViewer {...args} style={{ maxWidth: 520, height: 360 }} />,
};
export const ModelViewerPaused: StoryObj<typeof ModelViewer> = { ...ModelViewerStory, args: { ...ModelViewerStory.args, autoRotate: false } };
/** Interactive viewers keep rendering under reduced motion; they stop auto-rotating and snap instead of easing. */
export const ModelViewerReducedMotion: StoryObj<typeof ModelViewer> = { ...ModelViewerStory, args: { ...ModelViewerStory.args, ...fallbackArgs.args } };
/** What renders when WebGL is unavailable (simulated with a load error). */
export const ModelViewerFallback: StoryObj<typeof ModelViewer> = {
  ...ModelViewerStory,
  args: { ...ModelViewerStory.args, src: 'data:model/gltf+json,broken' },
};

export const Logo3DStory: StoryObj<typeof Logo3D> = {
  name: 'Logo3D',
  args: { 'aria-label': 'Umbra', depth: 0.18 },
  parameters: { layout: 'padded' },
  render: (args) => <Logo3D {...args} style={{ width: 280 }} />,
};
export const Logo3DCustomPath: StoryObj<typeof Logo3D> = {
  ...Logo3DStory,
  args: { 'aria-label': 'Diamond', path: 'M50 5 95 50 50 95 5 50Z M50 30 30 50 50 70 70 50Z', depth: 0.3 },
};
export const Logo3DFallback: StoryObj<typeof Logo3D> = { ...Logo3DStory, args: { ...Logo3DStory.args, ...fallbackArgs.args } };
