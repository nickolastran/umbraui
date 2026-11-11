import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { renderToString } from 'react-dom/server';
import { expectNoA11yViolations } from '../test/axe';
import { media } from '../test/setup';
import { HeroScene } from './hero-scene/HeroScene';
import { Logo3D } from './logo-3d/Logo3D';
import { ModelViewer } from './model-viewer/ModelViewer';
import { Orb } from './orb/Orb';
import { ParticleField } from './particle-field/ParticleField';
import { detectWebGL } from './stage/webgl';
import { TiltCard3D } from './tilt-card/TiltCard3D';

// WebGL output is not testable in jsdom. These tests cover what the library guarantees around it: the lazy
// boundary, the placeholder, the fallback paths and the accessible DOM. Each scene chunk is replaced by a probe
// that reports the props it was given.
vi.mock('./stage/webgl', () => ({ detectWebGL: vi.fn(() => false) }));
const webgl = vi.mocked(detectWebGL);

// Like the real canvas, the probe is not focusable: a focusable stand-in would be a different a11y tree.
const probe = (name: string) => ({
  default: (props: Record<string, unknown> & { onReady: () => void }) => (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- test probe
    <div data-testid={`scene-${name}`} data-props={JSON.stringify(props, (k, v) => (k === 'pointer' || typeof v === 'function' ? undefined : v))} onClick={props.onReady}>
      scene
    </div>
  ),
});
vi.mock('./hero-scene/HeroScene.scene', () => probe('hero'));
vi.mock('./particle-field/ParticleField.scene', () => probe('particles'));
vi.mock('./orb/Orb.scene', () => probe('orb'));
vi.mock('./tilt-card/TiltCard3D.scene', () => probe('tilt'));
vi.mock('./logo-3d/Logo3D.scene', () => probe('logo'));
vi.mock('./model-viewer/ModelViewer.scene', () => {
  let fail = false;
  return {
    __setFail: (v: boolean) => (fail = v),
    default: (props: Record<string, unknown>) => {
      if (fail) throw new Error('context lost');
      return <div data-testid="scene-model" data-props={JSON.stringify({ view: props.view, spinning: props.spinning, instant: props.instant })} />;
    },
  };
});

const sceneProps = (name: string) => JSON.parse(screen.getByTestId(`scene-${name}`).dataset.props!);

beforeEach(() => {
  webgl.mockReturnValue(false);
  media['prefers-reduced-motion'] = false;
  document.documentElement.removeAttribute('style');
});

describe('SSR safety', () => {
  it('renders only the placeholder on the server: no window, WebGL or scene code is touched', () => {
    webgl.mockClear();
    const html = renderToString(
      <>
        <HeroScene>content</HeroScene>
        <ParticleField />
        <Orb aria-label="Go" />
        <TiltCard3D>card</TiltCard3D>
        <ModelViewer aria-label="Model" />
        <Logo3D aria-label="Umbra" />
      </>,
    );
    expect(html.match(/umbra-stage__placeholder/g)).toHaveLength(6);
    expect(html).not.toContain('scene-');
    expect(html).toContain('content');
    expect(webgl).not.toHaveBeenCalled();
  });
});

describe('fallback paths', () => {
  it('renders the designed static fallback when WebGL is unavailable, and never loads the scene', async () => {
    const { container } = render(
      <>
        <HeroScene />
        <ParticleField />
        <Orb aria-label="Go" />
        <TiltCard3D />
        <ModelViewer aria-label="Model" />
        <Logo3D aria-label="Umbra" />
      </>,
    );
    for (const cls of ['umbra-hero-scene', 'umbra-particle-field', 'umbra-orb', 'umbra-tilt-card', 'umbra-model-viewer']) {
      expect(container.querySelector(`.${cls}__fallback`)).toBeInTheDocument();
    }
    expect(container.querySelector('.umbra-logo-3d__mark')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-state="fallback"]')).toHaveLength(6);
    await act(() => new Promise((r) => setTimeout(r, 20)));
    expect(screen.queryByText('scene')).not.toBeInTheDocument();
  });

  it('renders the fallback under prefers-reduced-motion even when WebGL works', () => {
    webgl.mockReturnValue(true);
    media['prefers-reduced-motion'] = true;
    const { container } = render(<HeroScene />);
    expect(container.querySelector('.umbra-hero-scene__fallback')).toBeInTheDocument();
  });

  it('reducedMotion="always" forces the fallback and "never" overrides the OS setting', async () => {
    webgl.mockReturnValue(true);
    const { container, rerender } = render(<ParticleField reducedMotion="always" />);
    expect(container.querySelector('.umbra-particle-field__fallback')).toBeInTheDocument();
    media['prefers-reduced-motion'] = true;
    rerender(<ParticleField reducedMotion="never" />);
    expect(await screen.findByTestId('scene-particles')).toBeInTheDocument();
  });

  it('accepts a custom fallback, which is not hidden from assistive tech', () => {
    render(<HeroScene fallback={<img src="/hero.png" alt="Eclipse over a ridge" />} />);
    expect(screen.getByRole('img', { name: 'Eclipse over a ridge' })).toBeInTheDocument();
  });

  it('falls back when the scene throws (chunk load failure, lost context)', async () => {
    webgl.mockReturnValue(true);
    const mod = (await import('./model-viewer/ModelViewer.scene')) as unknown as { __setFail: (v: boolean) => void };
    mod.__setFail(true);
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { container } = render(<ModelViewer aria-label="Model" />);
    await waitFor(() => expect(container.querySelector('.umbra-model-viewer__fallback')).toBeInTheDocument());
    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
    spy.mockRestore();
    mod.__setFail(false);
  });
});

describe('lazy boundary', () => {
  beforeEach(() => webgl.mockReturnValue(true));

  it('shows the placeholder, then the lazily imported scene, and drops the placeholder once the scene is ready', async () => {
    const { container } = render(<HeroScene quality="high">content</HeroScene>);
    expect(screen.getByTestId('umbra-stage-placeholder')).toBeInTheDocument();
    expect(screen.queryByTestId('scene-hero')).not.toBeInTheDocument(); // not in the initial render: it is a dynamic import
    const scene = await screen.findByTestId('scene-hero');
    expect(container.querySelector('.umbra-stage__layer')).toHaveAttribute('data-state', 'loading');
    expect(screen.getByTestId('umbra-stage-placeholder')).toBeInTheDocument();
    await userEvent.click(scene); // probe calls onReady
    expect(container.querySelector('.umbra-stage__layer')).toHaveAttribute('data-state', 'ready');
    expect(screen.queryByTestId('umbra-stage-placeholder')).not.toBeInTheDocument();
    expect(sceneProps('hero')).toMatchObject({ quality: 'high', active: true });
  });

  it('the canvas layer is hidden from assistive tech while DOM children stay exposed', async () => {
    const { container } = render(<HeroScene><h1>Title</h1></HeroScene>);
    await screen.findByTestId('scene-hero');
    expect(container.querySelector('.umbra-stage__layer')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument();
  });

  it('pauses the scene when the tab is hidden', async () => {
    render(<HeroScene />);
    await screen.findByTestId('scene-hero');
    const state = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');
    act(() => void document.dispatchEvent(new Event('visibilitychange')));
    expect(sceneProps('hero').active).toBe(false);
    state.mockReturnValue('visible');
    act(() => void document.dispatchEvent(new Event('visibilitychange')));
    expect(sceneProps('hero').active).toBe(true);
    state.mockRestore();
  });

  it('resolves scene colours from the active tokens and updates them when the theme changes', async () => {
    // jsdom does not inherit custom properties through the cascade, so the token is set on the stage itself;
    // inheritance from <html> is covered by the browser checks. What matters here is read + re-read on theme change.
    const ref = createRef<HTMLDivElement>();
    render(<ParticleField ref={ref} style={{ '--umbra-color-accent': '#ff0000' } as never} />);
    await screen.findByTestId('scene-particles');
    expect(sceneProps('particles').colors.accent).toBe('#ff0000');
    expect(sceneProps('particles').colors.bg).toBe('#08090a'); // unresolved → dark token default
    act(() => {
      ref.current!.style.setProperty('--umbra-color-accent', '#00ff00');
      document.documentElement.setAttribute('data-umbra-theme', 'light');
    });
    await waitFor(() => expect(sceneProps('particles').colors.accent).toBe('#00ff00'));
  });
});

describe('root element contract', () => {
  it('forwards ref, className and rest props', () => {
    const hero = createRef<HTMLDivElement>();
    const field = createRef<HTMLDivElement>();
    const tilt = createRef<HTMLDivElement>();
    const logo = createRef<HTMLDivElement>();
    render(
      <>
        <HeroScene ref={hero} className="mine" data-testid="hero" />
        <ParticleField ref={field} className="mine" id="field" />
        <TiltCard3D ref={tilt} className="mine" id="tilt" />
        <Logo3D ref={logo} className="mine" aria-label="Umbra" id="logo" />
      </>,
    );
    expect(hero.current).toBe(screen.getByTestId('hero'));
    expect(hero.current).toHaveClass('umbra-stage', 'umbra-hero-scene', 'mine');
    expect(field.current).toHaveAttribute('id', 'field');
    expect(tilt.current).toHaveClass('umbra-tilt-card', 'mine');
    expect(logo.current).toHaveClass('umbra-logo-3d', 'mine');
  });
});

describe('Orb', () => {
  it('is a real button: named, focusable and operable with Enter and Space', async () => {
    const onClick = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    render(<Orb ref={ref} aria-label="Start listening" onClick={onClick} className="mine" size="lg" tone="neon" />);
    const button = screen.getByRole('button', { name: 'Start listening' });
    expect(button).toBe(ref.current);
    expect(button.parentElement).toHaveClass('umbra-orb', 'mine');
    expect(button.parentElement).toHaveAttribute('data-size', 'lg');
    await userEvent.tab();
    expect(button).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('passes interaction state to the scene and honours disabled', async () => {
    webgl.mockReturnValue(true);
    const onClick = vi.fn();
    const { rerender } = render(<Orb aria-label="Go" onClick={onClick} />);
    await screen.findByTestId('scene-orb');
    expect(sceneProps('orb')).toMatchObject({ hovered: false, pressed: false, tone: 'accent' });
    await userEvent.hover(screen.getByRole('button', { name: 'Go' }));
    expect(sceneProps('orb').hovered).toBe(true);
    rerender(<Orb aria-label="Go" onClick={onClick} disabled />);
    await userEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(onClick).not.toHaveBeenCalled();
    expect(sceneProps('orb').disabled).toBe(true);
  });
});

describe('TiltCard3D', () => {
  const rect = { left: 0, top: 0, width: 200, height: 100, right: 200, bottom: 100, x: 0, y: 0, toJSON() {} };
  it('tilts toward the pointer and resets on leave', async () => {
    const { container } = render(<TiltCard3D maxTilt={10}>Body</TiltCard3D>);
    const card = container.firstElementChild as HTMLElement;
    card.getBoundingClientRect = () => rect;
    await userEvent.pointer({ target: card, coords: { clientX: 200, clientY: 0 } });
    expect(card.style.getPropertyValue('--_ry')).toBe('10.00deg');
    expect(card.style.getPropertyValue('--_rx')).toBe('-10.00deg');
    await userEvent.unhover(card);
    expect(card.style.getPropertyValue('--_ry')).toBe('0.00deg');
    expect(screen.getByText('Body')).toBeInTheDocument();
  });
  it('does not tilt under reduced motion', async () => {
    const { container } = render(<TiltCard3D reducedMotion="always">Body</TiltCard3D>);
    const card = container.firstElementChild as HTMLElement;
    card.getBoundingClientRect = () => rect;
    await userEvent.pointer({ target: card, coords: { clientX: 200, clientY: 0 } });
    expect(card.style.getPropertyValue('--_ry')).toBe('');
    expect(card).not.toHaveAttribute('data-glare');
  });
});

describe('ModelViewer', () => {
  beforeEach(() => webgl.mockReturnValue(true));
  const view = () => sceneProps('model');

  it('is a labelled group with a toolbar of real buttons', async () => {
    const ref = createRef<HTMLDivElement>();
    render(<ModelViewer ref={ref} aria-label="Headphones" className="mine" />);
    await screen.findByTestId('scene-model');
    expect(screen.getByRole('group', { name: 'Headphones' })).toBe(ref.current);
    expect(ref.current).toHaveClass('umbra-model-viewer', 'mine');
    const names = screen.getAllByRole('button').map((b) => b.getAttribute('aria-label'));
    expect(names).toEqual(['Rotate left', 'Rotate right', 'Zoom out', 'Zoom in', 'Reset view', 'Pause rotation']);
    expect(screen.getByRole('toolbar', { name: 'Model controls' })).toBeInTheDocument();
  });

  it('auto-rotates until the user interacts, and can be paused and resumed', async () => {
    render(<ModelViewer aria-label="Model" />);
    await screen.findByTestId('scene-model');
    expect(view().spinning).toBe(true);
    await userEvent.click(screen.getByRole('button', { name: 'Pause rotation' }));
    expect(view().spinning).toBe(false);
    await userEvent.click(screen.getByRole('button', { name: 'Start rotation' }));
    expect(view().spinning).toBe(true);
    await userEvent.click(screen.getByRole('button', { name: 'Rotate right' }));
    expect(view().spinning).toBe(false);
  });

  it('buttons and keyboard shortcuts rotate, zoom (clamped) and reset', async () => {
    render(<ModelViewer aria-label="Model" autoRotate={false} />);
    await screen.findByTestId('scene-model');
    const start = view().view;
    await userEvent.click(screen.getByRole('button', { name: 'Rotate right' }));
    expect(view().view.rotY).toBeCloseTo(start.rotY + Math.PI / 12);
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(view().view.rotY).toBeCloseTo(start.rotY - Math.PI / 12);
    await userEvent.keyboard('{ArrowUp}');
    expect(view().view.rotX).toBeLessThan(start.rotX);
    await userEvent.keyboard('+');
    expect(view().view.zoom).toBeCloseTo(1.2);
    for (let i = 0; i < 12; i++) await userEvent.keyboard('-');
    expect(view().view.zoom).toBe(0.5);
    await userEvent.keyboard('{Home}');
    expect(view().view).toEqual(start);
  });

  it('keeps rendering under reduced motion, without auto-rotation or easing', async () => {
    render(<ModelViewer aria-label="Model" reducedMotion="always" />);
    await screen.findByTestId('scene-model');
    expect(view()).toMatchObject({ spinning: false, instant: true });
    expect(screen.queryByRole('button', { name: /rotation/ })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Rotate left' })).toBeInTheDocument();
  });

  it('supports label overrides and hiding the controls', async () => {
    const { rerender } = render(<ModelViewer aria-label="Model" labels={{ zoomIn: 'Agrandir' }} />);
    await screen.findByTestId('scene-model');
    expect(screen.getByRole('button', { name: 'Agrandir' })).toBeInTheDocument();
    rerender(<ModelViewer aria-label="Model" hideControls />);
    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
  });
});

describe('Logo3D', () => {
  it('is exposed as one named image; the fallback draws the same path', () => {
    const { container } = render(<Logo3D aria-label="Umbra" path="M0 0H100V100H0Z" />);
    expect(screen.getByRole('img', { name: 'Umbra' })).toBeInTheDocument();
    expect(container.querySelector('path')).toHaveAttribute('d', 'M0 0H100V100H0Z');
  });
  it('uses a text fallback when given text and a font', () => {
    const { container } = render(<Logo3D aria-label="Acme" text="Acme" font="/font.json" />);
    expect(container.querySelector('.umbra-logo-3d__text')).toHaveTextContent('Acme');
  });
});

it('3D components have no axe violations in fallback and loaded states', async () => {
  const tree = (
    <main>
      <HeroScene><h1>Title</h1></HeroScene>
      <ParticleField />
      <Orb aria-label="Go" />
      <TiltCard3D>Body</TiltCard3D>
      <ModelViewer aria-label="Model" />
      <Logo3D aria-label="Umbra" />
    </main>
  );
  const { container, unmount } = render(tree);
  await expectNoA11yViolations(container);
  unmount();
  webgl.mockReturnValue(true);
  const loaded = render(tree);
  await screen.findByTestId('scene-model');
  await screen.findByTestId('scene-logo');
  await expectNoA11yViolations(loaded.container);
});
