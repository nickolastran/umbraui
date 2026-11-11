import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { expectNoA11yViolations } from '../test/axe';
import { media } from '../test/setup';
import { tokens } from '../tokens/tokens';
import { AnimatedTabs, AnimatedTabsContent, AnimatedTabsList, AnimatedTabsTrigger } from './animated-tabs/AnimatedTabs';
import { BeamBorder } from './beam-border/BeamBorder';
import { Marquee } from './marquee/Marquee';
import { NumberTicker } from './number-ticker/NumberTicker';
import { PageTransition } from './page-transition/PageTransition';
import { motionTokens, transitions } from './presets';
import { MotionPreferenceProvider, useReducedMotion } from '../utils/reduced-motion';
import { ShimmerButton } from './shimmer-button/ShimmerButton';
import { SpotlightCard } from './spotlight-card/SpotlightCard';
import { StaggeredList } from './staggered-list/StaggeredList';
import { TextReveal } from './text-reveal/TextReveal';

afterEach(() => {
  media['prefers-reduced-motion'] = false;
});

describe('motion presets', () => {
  it('are built only from the motion tokens', () => {
    expect(motionTokens).toBe(tokens.motion);
    expect(transitions.fast.duration).toBe(tokens.motion.duration.fast);
    expect(transitions.base.ease).toEqual([...tokens.motion.ease.out]);
    expect(transitions.snappy).toEqual(tokens.motion.spring.snappy);
  });
});

describe('useReducedMotion', () => {
  const Probe = ({ override }: { override?: 'system' | 'always' | 'never' }) => <output>{String(useReducedMotion(override))}</output>;
  it('follows the OS setting by default', () => {
    render(<Probe />);
    expect(screen.getByRole('status')).toHaveTextContent('false');
    media['prefers-reduced-motion'] = true;
    render(<Probe />, { container: document.body.appendChild(document.createElement('div')) });
    expect(screen.getAllByRole('status')[1]).toHaveTextContent('true');
  });
  it('provider overrides the OS; the prop overrides the provider', () => {
    render(
      <MotionPreferenceProvider reducedMotion="always">
        <Probe />
        <Probe override="never" />
      </MotionPreferenceProvider>,
    );
    const [a, b] = screen.getAllByRole('status');
    expect(a).toHaveTextContent('true');
    expect(b).toHaveTextContent('false');
  });
});

describe('ShimmerButton', () => {
  it('is a Button with a decorative sweep', async () => {
    const onClick = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    render(<ShimmerButton ref={ref} className="mine" onClick={onClick}>Deploy</ShimmerButton>);
    const b = screen.getByRole('button', { name: 'Deploy' });
    expect(b).toBe(ref.current);
    expect(b).toHaveClass('umbra-button', 'umbra-shimmer-button', 'mine');
    expect(b.querySelector('.umbra-shimmer-button__clip')).toHaveAttribute('aria-hidden', 'true');
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledOnce();
  });
  it('removes the sweep under reduced motion, when disabled, loading or effect="glow"', () => {
    const { container, rerender } = render(<ShimmerButton reducedMotion="always">A</ShimmerButton>);
    const sweep = () => container.querySelector('.umbra-shimmer-button__shine');
    expect(sweep()).toBeNull();
    expect(screen.getByRole('button')).toHaveAttribute('data-glow');
    rerender(<ShimmerButton disabled>A</ShimmerButton>);
    expect(sweep()).toBeNull();
    rerender(<ShimmerButton loading>A</ShimmerButton>);
    expect(sweep()).toBeNull();
    rerender(<ShimmerButton effect="glow">A</ShimmerButton>);
    expect(sweep()).toBeNull();
    rerender(<ShimmerButton effect="shimmer">A</ShimmerButton>);
    expect(sweep()).not.toBeNull();
    expect(screen.getByRole('button')).not.toHaveAttribute('data-glow');
  });
});

describe('SpotlightCard', () => {
  it('is a Card with a decorative light that tracks the pointer', async () => {
    const ref = createRef<HTMLDivElement>();
    const onPointerMove = vi.fn();
    render(<SpotlightCard ref={ref} className="mine" data-testid="card" onPointerMove={onPointerMove}>Body</SpotlightCard>);
    expect(ref.current).toHaveClass('umbra-card', 'umbra-spotlight-card', 'mine');
    const light = ref.current!.querySelector('.umbra-spotlight-card__light') as HTMLElement;
    expect(light).toHaveAttribute('aria-hidden', 'true');
    await userEvent.pointer({ target: ref.current!, coords: { clientX: 40, clientY: 30 } });
    expect(onPointerMove).toHaveBeenCalled();
    await waitFor(() => expect(light.style.getPropertyValue('--_at')).toBe('40px 30px'));
  });
  it('keeps the light centred under reduced motion', async () => {
    const { container } = render(<SpotlightCard reducedMotion="always">Body</SpotlightCard>);
    const light = container.querySelector('.umbra-spotlight-card__light') as HTMLElement;
    await userEvent.pointer({ target: container.firstElementChild!, coords: { clientX: 40, clientY: 30 } });
    expect(light.style.getPropertyValue('--_at')).toBe('50% 0%');
  });
});

describe('BeamBorder', () => {
  it('wraps content; the beam is decorative and stops when paused or reduced', () => {
    const ref = createRef<HTMLDivElement>();
    const { rerender } = render(<BeamBorder ref={ref} radius="md" borderWidth={2} className="mine">Content</BeamBorder>);
    expect(ref.current).toHaveClass('umbra-beam-border', 'mine');
    expect(ref.current).toHaveAttribute('data-radius', 'md');
    expect(ref.current).toHaveAttribute('data-running', 'true');
    expect(ref.current!.style.getPropertyValue('--_bw')).toBe('2px');
    expect(ref.current!.querySelector('.umbra-beam-border__beam')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('Content')).toBeVisible();
    rerender(<BeamBorder ref={ref} paused>Content</BeamBorder>);
    expect(ref.current).not.toHaveAttribute('data-running');
    rerender(<BeamBorder ref={ref} reducedMotion="always">Content</BeamBorder>);
    expect(ref.current).not.toHaveAttribute('data-running');
  });
});

describe('TextReveal', () => {
  it('exposes the full sentence once to assistive tech and animated pieces to nobody', () => {
    const ref = createRef<HTMLElement>();
    render(<TextReveal ref={ref} as="h2" className="mine">Out of the dark</TextReveal>);
    const h = screen.getByRole('heading', { level: 2, name: 'Out of the dark' });
    expect(h).toBe(ref.current);
    expect(h).toHaveClass('umbra-text-reveal', 'mine');
    expect(h.querySelectorAll('.umbra-text-reveal__piece')).toHaveLength(4);
    expect(h.querySelector('[aria-hidden="true"]')).toHaveTextContent('Out of the dark');
  });
  it('splits by character on request', () => {
    const { container } = render(<TextReveal by="char">Umbra</TextReveal>);
    expect(container.querySelectorAll('.umbra-text-reveal__piece')).toHaveLength(5);
  });
  it('becomes plain text once the reveal finishes, so selection and copy behave normally', async () => {
    const ref = createRef<HTMLElement>();
    render(<TextReveal ref={ref} as="h2">Out of the dark</TextReveal>);
    await waitFor(() => expect(ref.current!.querySelector('.umbra-text-reveal__piece')).toBeNull(), { timeout: 4000 });
    expect(ref.current!.childNodes).toHaveLength(1);
    expect(ref.current!.firstChild!.nodeType).toBe(Node.TEXT_NODE);
    expect(screen.getByRole('heading', { level: 2, name: 'Out of the dark' })).toBe(ref.current);
  });
  it('settles under reduced motion too', async () => {
    const ref = createRef<HTMLElement>();
    render(<TextReveal ref={ref} reducedMotion="always">Out of the dark</TextReveal>);
    await waitFor(() => expect(ref.current!.childNodes).toHaveLength(1), { timeout: 4000 });
    expect(ref.current).toHaveTextContent('Out of the dark');
  });
  it('renders one unsplit block under reduced motion', () => {
    const { container } = render(<TextReveal reducedMotion="always">Out of the dark</TextReveal>);
    expect(container.querySelectorAll('.umbra-text-reveal__piece')).toHaveLength(0);
    expect(container.querySelector('[aria-hidden="true"]')).toHaveTextContent('Out of the dark');
  });
});

describe('NumberTicker', () => {
  it('announces only the final value and counts towards it', async () => {
    const ref = createRef<HTMLSpanElement>();
    render(<NumberTicker ref={ref} value={1200} trigger="mount" locale="en-US" className="mine" />);
    expect(ref.current).toHaveClass('umbra-number-ticker', 'mine');
    expect(ref.current!.querySelector('.umbra-sr-only')).toHaveTextContent('1,200');
    const visual = ref.current!.querySelector('[aria-hidden="true"]')!;
    expect(visual).toHaveTextContent('0');
    await waitFor(() => expect(visual).toHaveTextContent('1,200'), { timeout: 4000 });
  });
  it('shows the final value immediately under reduced motion, with formatting', () => {
    render(<NumberTicker value={0.5} reducedMotion="always" locale="en-US" format={{ style: 'percent' }} data-testid="n" />);
    expect(screen.getByTestId('n').querySelector('[aria-hidden="true"]')).toHaveTextContent('50%');
  });
});

describe('Marquee', () => {
  const items = (
    <>
      <a href="/a">Alpha</a>
      <a href="/b">Beta</a>
    </>
  );
  it('duplicates content in an inert, hidden copy', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Marquee ref={ref} className="mine" gap="4">{items}</Marquee>);
    expect(ref.current).toHaveClass('umbra-marquee', 'mine');
    const groups = ref.current!.querySelectorAll('.umbra-marquee__group');
    expect(groups).toHaveLength(2);
    expect(groups[1]).toHaveAttribute('aria-hidden', 'true');
    expect(groups[1]).toHaveAttribute('inert');
    expect(ref.current!.style.getPropertyValue('--_gap')).toBe('var(--umbra-space-4)');
  });
  it('moves, and pauses while hovered or focused', async () => {
    const { container } = render(<Marquee speed={50}>{items}</Marquee>);
    const track = container.querySelector('.umbra-marquee__track') as HTMLElement;
    await waitFor(() => expect(track.style.transform).toMatch(/translateX\(-\d/));
    await userEvent.tab();
    expect(screen.getAllByRole('link', { name: 'Alpha' })[0]).toHaveFocus();
    await act(() => new Promise((r) => setTimeout(r, 60)));
    const frozen = track.style.transform;
    await act(() => new Promise((r) => setTimeout(r, 120)));
    expect(track.style.transform).toBe(frozen);
  });
  it('is static and unduplicated under reduced motion', () => {
    const { container } = render(<Marquee reducedMotion="always">{items}</Marquee>);
    expect(container.firstChild).toHaveAttribute('data-static', 'true');
    expect(container.querySelectorAll('.umbra-marquee__group')).toHaveLength(1);
    expect((container.querySelector('.umbra-marquee__track') as HTMLElement).style.transform).toBe('');
  });
});

describe('AnimatedTabs', () => {
  const tabs = (props: Partial<React.ComponentProps<typeof AnimatedTabs>> = {}) => (
    <AnimatedTabs defaultValue="a" {...props}>
      <AnimatedTabsList aria-label="Sections">
        <AnimatedTabsTrigger value="a">Alpha</AnimatedTabsTrigger>
        <AnimatedTabsTrigger value="b">Beta</AnimatedTabsTrigger>
      </AnimatedTabsList>
      <AnimatedTabsContent value="a">Panel A</AnimatedTabsContent>
      <AnimatedTabsContent value="b">Panel B</AnimatedTabsContent>
    </AnimatedTabs>
  );
  it('moves the single indicator to the selected tab by click and keyboard', async () => {
    const onValueChange = vi.fn();
    const ref = createRef<HTMLDivElement>();
    render(tabs({ onValueChange, ref, className: 'mine' }));
    expect(ref.current).toHaveClass('umbra-tabs', 'mine');
    expect(ref.current).toHaveAttribute('data-animated');
    const indicator = () => document.querySelectorAll('.umbra-tabs__indicator');
    expect(screen.getByRole('tab', { name: 'Alpha' })).toContainElement(indicator()[0] as HTMLElement);
    await userEvent.click(screen.getByRole('tab', { name: 'Beta' }));
    expect(onValueChange).toHaveBeenCalledWith('b');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel B');
    await waitFor(() => expect(indicator()).toHaveLength(1));
    expect(screen.getByRole('tab', { name: 'Beta' })).toContainElement(indicator()[0] as HTMLElement);
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveAttribute('aria-selected', 'true');
  });
  it('supports controlled value and has no axe violations', async () => {
    function Controlled() {
      const [v, setV] = useState('b');
      return tabs({ value: v, onValueChange: setV, defaultValue: undefined, reducedMotion: 'always' });
    }
    const { container } = render(<Controlled />);
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel B');
    await userEvent.click(screen.getByRole('tab', { name: 'Alpha' }));
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel A');
    await expectNoA11yViolations(container);
  });
});

describe('StaggeredList', () => {
  it('wraps each child in a list item and forwards props', () => {
    const ref = createRef<HTMLElement>();
    render(
      <StaggeredList ref={ref} as="ol" trigger="mount" gap="3" className="mine" aria-label="Steps">
        <span>One</span>
        {null}
        <span>Two</span>
      </StaggeredList>,
    );
    const list = screen.getByRole('list', { name: 'Steps' });
    expect(list).toBe(ref.current);
    expect(list.tagName).toBe('OL');
    expect(list).toHaveClass('umbra-staggered-list', 'mine');
    expect(list.style.gap).toBe('var(--umbra-space-3)');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });
  it('renders divs when asked and becomes visible', async () => {
    const { container } = render(<StaggeredList as="div" trigger="mount" reducedMotion="always"><span>One</span></StaggeredList>);
    const item = container.querySelector('.umbra-staggered-list__item') as HTMLElement;
    expect(item.tagName).toBe('DIV');
    await waitFor(() => expect(item.style.opacity).toBe('1'), { timeout: 3000 });
  });
});

describe('PageTransition', () => {
  it('swaps content when the key changes', async () => {
    const ref = createRef<HTMLDivElement>();
    const { rerender } = render(<PageTransition ref={ref} transitionKey="a" className="mine">Page A</PageTransition>);
    expect(ref.current).toHaveClass('umbra-page-transition', 'mine');
    expect(screen.getByText('Page A')).toBeInTheDocument();
    rerender(<PageTransition transitionKey="b" variant="scale">Page B</PageTransition>);
    expect(await screen.findByText('Page B', {}, { timeout: 3000 })).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText('Page A')).not.toBeInTheDocument(), { timeout: 3000 });
  });
  it('uses a plain fade under reduced motion', async () => {
    const { rerender } = render(<PageTransition transitionKey="a" reducedMotion="always">Page A</PageTransition>);
    rerender(<PageTransition transitionKey="b" reducedMotion="always">Page B</PageTransition>);
    const next = await screen.findByText('Page B', {}, { timeout: 3000 });
    expect(next.style.transform === '' || next.style.transform === 'none').toBe(true);
  });
});

it('effect components have no axe violations', async () => {
  const { container } = render(
    <main>
      <ShimmerButton>Deploy</ShimmerButton>
      <SpotlightCard>Body</SpotlightCard>
      <BeamBorder>Content</BeamBorder>
      <TextReveal as="h1">Out of the dark</TextReveal>
      <NumberTicker value={10} />
      <Marquee><a href="/a">Alpha</a></Marquee>
      <StaggeredList trigger="mount"><span>One</span></StaggeredList>
      <PageTransition transitionKey="a">Page</PageTransition>
    </main>,
  );
  await expectNoA11yViolations(container);
});
