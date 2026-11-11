import { forwardRef, lazy, useRef, useState } from 'react';
import type { HTMLAttributes, KeyboardEvent, PointerEvent, ReactNode } from 'react';
import { IconButton } from '../../components/button/Button';
import { ChevronLeftIcon, ChevronRightIcon, MinusIcon, PauseIcon, PlayIcon, PlusIcon, ResetIcon } from '../../components/internal/icons';
import { cx } from '../../utils/cx';
import type { Scene3DProps } from '../stage/types';
import { StageLayer, mergeRefs, useStage } from '../stage/useStage';
import type { ModelView } from './ModelViewer.scene';

const Scene = lazy(() => import('./ModelViewer.scene'));

const HOME: ModelView = { rotY: 0, rotX: 0.2, zoom: 1 };
const STEP = Math.PI / 12;
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** Labels for the viewer's controls, for localisation. */
export interface ModelViewerLabels {
  rotateLeft: string;
  rotateRight: string;
  zoomIn: string;
  zoomOut: string;
  reset: string;
  pause: string;
  play: string;
  controls: string;
}

const defaultLabels: ModelViewerLabels = {
  rotateLeft: 'Rotate left',
  rotateRight: 'Rotate right',
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  reset: 'Reset view',
  pause: 'Pause rotation',
  play: 'Start rotation',
  controls: 'Model controls',
};

/** Props for {@link ModelViewer}. */
export interface ModelViewerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'aria-label'>, Scene3DProps {
  /** Accessible name describing the model, e.g. "Headphones, matte black". Required. */
  'aria-label': string;
  /** URL of a glTF / GLB file. Without `src` or `model`, a demo torus knot is shown. */
  src?: string;
  /** React Three Fiber elements to show instead of a file (rendered inside the canvas). */
  model?: ReactNode;
  /** Spin slowly until the user interacts. Never spins under reduced motion. @default true */
  autoRotate?: boolean;
  /** Hide the on-screen control buttons (keyboard and drag still work). @default false */
  hideControls?: boolean;
  /** Override control labels for localisation. */
  labels?: Partial<ModelViewerLabels>;
}

/**
 * A rotating product / model viewer. Drag to rotate; use the on-screen buttons or, with focus inside the
 * viewer, ←/→/↑/↓ to rotate, +/− to zoom, Home to reset and Space to pause or resume auto-rotation.
 *
 * Unlike the decorative scenes this one keeps rendering under reduced motion — it just never moves on its
 * own and snaps instead of easing — because a static picture would remove its purpose.
 */
export const ModelViewer = forwardRef<HTMLDivElement, ModelViewerProps>(function ModelViewer(
  { quality = 'medium', fallback, reducedMotion, src, model, autoRotate = true, hideControls = false, labels, className, onKeyDown, ...rest },
  ref,
) {
  const stage = useStage({ reducedMotion, keepOnReducedMotion: true });
  const l = { ...defaultLabels, ...labels };
  const [view, setView] = useState(HOME);
  const [spinning, setSpinning] = useState(autoRotate);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const live = stage.mode !== 'fallback';

  const act = (change: (v: ModelView) => ModelView) => {
    setSpinning(false);
    setView((v) => {
      const next = change(v);
      return { rotY: next.rotY, rotX: clamp(next.rotX, -1.3, 1.3), zoom: clamp(next.zoom, 0.5, 2.5) };
    });
  };
  const rotate = (dy: number, dx = 0) => act((v) => ({ ...v, rotY: v.rotY + dy, rotX: v.rotX + dx }));
  const zoom = (factor: number) => act((v) => ({ ...v, zoom: v.zoom * factor }));

  const keys: Record<string, () => void> = {
    ArrowLeft: () => rotate(-STEP),
    ArrowRight: () => rotate(STEP),
    ArrowUp: () => rotate(0, -STEP / 2),
    ArrowDown: () => rotate(0, STEP / 2),
    '+': () => zoom(1.2),
    '=': () => zoom(1.2),
    '-': () => zoom(1 / 1.2),
    Home: () => act(() => HOME),
  };
  const keyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    const run = keys[e.key];
    if (!run || !live || e.defaultPrevented) return;
    e.preventDefault();
    run();
  };

  const pointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!live || (e.target as HTMLElement).closest('button')) return;
    drag.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const pointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const from = drag.current;
    if (!from) return;
    rotate((e.clientX - from.x) * 0.01, (e.clientY - from.y) * 0.01);
    drag.current = { x: e.clientX, y: e.clientY };
  };
  const pointerUp = () => {
    drag.current = null;
  };

  const control = (label: string, icon: ReactNode, onClick: () => void) => (
    <IconButton size="sm" variant="ghost" tone="neutral" aria-label={label} onClick={onClick}>
      {icon}
    </IconButton>
  );

  return (
    // Keyboard shortcuts and drag are conveniences layered over the real buttons in the toolbar below.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      ref={mergeRefs(ref, stage.setEl)}
      role="group"
      className={cx('umbra-stage umbra-model-viewer', className)}
      onKeyDown={keyDown}
      onPointerDown={pointerDown}
      onPointerMove={pointerMove}
      onPointerUp={pointerUp}
      onPointerCancel={pointerUp}
      {...rest}
    >
      <StageLayer stage={stage} fallback={fallback ?? <span className="umbra-model-viewer__fallback" aria-hidden="true" />}>
        <Scene
          {...stage.sceneProps}
          quality={quality}
          view={view}
          spinning={spinning && !stage.reduced}
          instant={stage.reduced}
          src={src}
          model={model}
        />
      </StageLayer>
      {live && !hideControls ? (
        <div role="toolbar" aria-label={l.controls} className="umbra-model-viewer__controls">
          {control(l.rotateLeft, <ChevronLeftIcon />, () => rotate(-STEP))}
          {control(l.rotateRight, <ChevronRightIcon />, () => rotate(STEP))}
          {control(l.zoomOut, <MinusIcon />, () => zoom(1 / 1.2))}
          {control(l.zoomIn, <PlusIcon />, () => zoom(1.2))}
          {control(l.reset, <ResetIcon />, () => act(() => HOME))}
          {stage.reduced ? null : control(spinning ? l.pause : l.play, spinning ? <PauseIcon /> : <PlayIcon />, () => setSpinning((s) => !s))}
        </div>
      ) : null}
    </div>
  );
});
