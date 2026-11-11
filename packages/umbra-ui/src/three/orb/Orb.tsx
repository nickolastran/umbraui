import { forwardRef, lazy, useState } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import type { Size } from '../../components/internal/types';
import type { Scene3DProps } from '../stage/types';
import { StageLayer, useStage } from '../stage/useStage';

const Scene = lazy(() => import('./Orb.scene'));

/** Props for {@link Orb}. `className` and `style` apply to the wrapper; everything else, and the ref, go to the `<button>`. */
export interface OrbProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'>, Scene3DProps {
  /** Accessible name. Required: the orb has no visible text of its own. */
  'aria-label': string;
  /** Diameter: 56 / 88 / 128 px. @default "md" */
  size?: Size;
  /** Body colour. @default "accent" */
  tone?: 'accent' | 'neon';
  /** Optional icon or short label centred over the orb. */
  children?: ReactNode;
}

/**
 * A 3D button: a living, distorting sphere that swells on hover and compresses on press. It is a real
 * `<button>` — focusable, operable with Enter and Space, with a token focus ring — and the canvas is decorative.
 */
export const Orb = forwardRef<HTMLButtonElement, OrbProps>(function Orb(
  { quality = 'medium', fallback, reducedMotion, size = 'md', tone = 'accent', className, style, children, disabled, ...rest },
  ref,
) {
  const stage = useStage({ reducedMotion });
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  return (
    <span
      ref={stage.setEl}
      className={cx('umbra-stage umbra-orb', className)}
      style={style}
      data-size={size}
      data-tone={tone}
      data-disabled={disabled || undefined}
      data-pressed={pressed || undefined}
    >
      <StageLayer stage={stage} fallback={fallback ?? <span className="umbra-orb__fallback" aria-hidden="true" />}>
        <Scene {...stage.sceneProps} quality={quality} tone={tone} hovered={hovered} pressed={pressed} disabled={Boolean(disabled)} />
      </StageLayer>
      <button
        ref={ref}
        type="button"
        className="umbra-orb__button"
        disabled={disabled}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => {
          setHovered(false);
          setPressed(false);
        }}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        {...rest}
      >
        {children}
      </button>
    </span>
  );
});
