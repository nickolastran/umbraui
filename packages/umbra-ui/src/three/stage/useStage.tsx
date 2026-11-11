import { Component, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode, Ref } from 'react';
import { cssVarName, tokens, type ThemedTokenName } from '../../tokens/tokens';
import { useReducedMotion, type ReducedMotionSetting } from '../../utils/reduced-motion';
import type { SceneBaseProps, SceneColors } from './types';
import { detectWebGL } from './webgl';

const COLOR_TOKENS: Record<keyof SceneColors, ThemedTokenName> = {
  bg: 'color-bg',
  surface: 'color-surface-2',
  border: 'color-border-strong',
  text: 'color-text',
  muted: 'color-text-muted',
  accent: 'color-accent',
  accentText: 'color-accent-text',
  neon: 'color-neon',
};
const KEYS = Object.keys(COLOR_TOKENS) as (keyof SceneColors)[];
const defaults = Object.fromEntries(KEYS.map((k) => [k, tokens.dark[COLOR_TOKENS[k]]])) as unknown as SceneColors;

const readColors = (el: Element): SceneColors => {
  const style = getComputedStyle(el);
  return Object.fromEntries(
    KEYS.map((k) => [k, style.getPropertyValue(cssVarName(COLOR_TOKENS[k])).trim() || defaults[k]]),
  ) as unknown as SceneColors;
};

/**
 * Resolves scene colours from the token custom properties in effect on `el` and re-resolves them when the
 * theme attribute changes anywhere above it or the root's inline style / class changes (token overrides).
 */
function useTokenColors(el: Element | null): SceneColors {
  const [colors, setColors] = useState(defaults);
  useEffect(() => {
    if (!el) return;
    const update = () =>
      setColors((prev) => {
        const next = readColors(el);
        return KEYS.every((k) => prev[k] === next[k]) ? prev : next;
      });
    update();
    const root = new MutationObserver(update);
    root.observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'class', 'data-umbra-theme'] });
    const scoped = new MutationObserver(update);
    scoped.observe(document.documentElement, { attributes: true, attributeFilter: ['data-umbra-theme'], subtree: true });
    return () => {
      root.disconnect();
      scoped.disconnect();
    };
  }, [el]);
  return colors;
}

/** `placeholder` until mounted, `loading` while the lazy chunk and first frame arrive, then `ready` — or `fallback`. */
export type StageMode = 'placeholder' | 'loading' | 'ready' | 'fallback';

interface StageOptions {
  reducedMotion?: ReducedMotionSetting;
  /** Interactive viewers keep rendering under reduced motion (they just stop moving on their own). */
  keepOnReducedMotion?: boolean;
}

/** Everything a 3D wrapper needs: mount/WebGL/visibility state, theme colours and the props to hand to its lazy scene. */
export function useStage({ reducedMotion, keepOnReducedMotion = false }: StageOptions) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [idle, setIdle] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(true);
  const reduced = useReducedMotion(reducedMotion);
  const pointer = useRef({ x: 0, y: 0 });
  const colors = useTokenColors(el);

  // Nothing here runs on the server: the first client render matches the server-rendered placeholder.
  useEffect(() => setMounted(true), []);
  // The scene (three.js download, parse, shader compile) waits for an idle moment so it never competes with
  // hydration and first interaction. The static fallback does not wait: it is shown as soon as it is known.
  useEffect(() => {
    if (typeof window.requestIdleCallback !== 'function') {
      const t = window.setTimeout(() => setIdle(true), 1);
      return () => window.clearTimeout(t);
    }
    const id = window.requestIdleCallback(() => setIdle(true), { timeout: 1500 });
    return () => window.cancelIdleCallback(id);
  }, []);

  useEffect(() => {
    if (!el) return;
    let onScreen = true;
    const update = () => setVisible(onScreen && document.visibilityState !== 'hidden');
    const io = new IntersectionObserver(
      (entries) => {
        onScreen = entries[entries.length - 1]?.isIntersecting ?? true;
        update();
      },
      { rootMargin: '64px' },
    );
    io.observe(el);
    document.addEventListener('visibilitychange', update);
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pointer.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.current.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
    };
    const leave = () => {
      pointer.current.x = 0;
      pointer.current.y = 0;
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', update);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [el]);

  const onReady = useCallback(() => setReady(true), []);
  const onError = useCallback(() => setFailed(true), []);
  const mode: StageMode = !mounted
    ? 'placeholder'
    : failed || !detectWebGL() || (reduced && !keepOnReducedMotion)
      ? 'fallback'
      : !idle
        ? 'placeholder'
        : ready
          ? 'ready'
          : 'loading';

  const sceneProps: Omit<SceneBaseProps, 'quality'> = { active: visible, colors, pointer, onReady };
  return { setEl, mode, reduced, onError, sceneProps, pointer };
}

class StageBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  override componentDidCatch() {
    this.props.onError();
  }
  override render() {
    return this.state.failed ? null : this.props.children;
  }
}

interface StageLayerProps {
  stage: Pick<ReturnType<typeof useStage>, 'mode' | 'onError'>;
  /** Static fallback (the `fallback` prop, or the component's built-in one). */
  fallback: ReactNode;
  /** The lazy scene element. Only rendered on the client, when WebGL is available. */
  children: ReactNode;
}

/**
 * The visual layer of a 3D component: a token-styled placeholder while the three.js chunk loads, the lazy
 * scene behind Suspense and an error boundary, or the static fallback. The canvas is always decorative;
 * interactive semantics live on the DOM element that wraps this layer.
 */
export function StageLayer({ stage, fallback, children }: StageLayerProps) {
  const { mode } = stage;
  if (mode === 'fallback') {
    return (
      <span className="umbra-stage__layer" data-state="fallback">
        {fallback}
      </span>
    );
  }
  return (
    <span className="umbra-stage__layer" data-state={mode} aria-hidden="true">
      {mode !== 'ready' ? <span className="umbra-stage__placeholder" data-testid="umbra-stage-placeholder" /> : null}
      {mode !== 'placeholder' ? (
        <StageBoundary onError={stage.onError}>
          <Suspense fallback={null}>{children}</Suspense>
        </StageBoundary>
      ) : null}
    </span>
  );
}

/** Assigns one node to several refs. */
export const mergeRefs =
  <T,>(...refs: (Ref<T> | undefined)[]) =>
  (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as { current: T | null }).current = node;
    }
  };
