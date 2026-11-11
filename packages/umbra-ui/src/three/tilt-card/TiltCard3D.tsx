import { forwardRef, lazy, useRef } from 'react';
import type { HTMLAttributes, PointerEvent } from 'react';
import { cx } from '../../utils/cx';
import type { Scene3DProps } from '../stage/types';
import { StageLayer, mergeRefs, useStage } from '../stage/useStage';

const Scene = lazy(() => import('./TiltCard3D.scene'));

/** Props for {@link TiltCard3D}. */
export interface TiltCard3DProps extends HTMLAttributes<HTMLDivElement>, Scene3DProps {
  /** Maximum tilt in degrees at the card's edge. @default 8 */
  maxTilt?: number;
  /** Show the highlight that follows the pointer. @default true */
  glare?: boolean;
}

/**
 * A card that tilts toward the pointer, with lit 3D shapes inside it that shift in parallax and a glare that
 * follows the cursor. Content is ordinary DOM and stays fully accessible; the 3D layer is decorative.
 * Under reduced motion the card does not tilt and shows the static fallback artwork.
 */
export const TiltCard3D = forwardRef<HTMLDivElement, TiltCard3DProps>(function TiltCard3D(
  { quality = 'medium', fallback, reducedMotion, maxTilt = 8, glare = true, className, children, onPointerMove, onPointerLeave, ...rest },
  ref,
) {
  const stage = useStage({ reducedMotion });
  const el = useRef<HTMLDivElement | null>(null);

  // Tilt is written straight to custom properties: no React render per pointer event, transform-only animation.
  const tilt = (x: number, y: number) => {
    el.current?.style.setProperty('--_rx', `${(-y * maxTilt).toFixed(2)}deg`);
    el.current?.style.setProperty('--_ry', `${(x * maxTilt).toFixed(2)}deg`);
    el.current?.style.setProperty('--_gx', `${((x + 1) * 50).toFixed(1)}%`);
    el.current?.style.setProperty('--_gy', `${((1 - y) * 50).toFixed(1)}%`);
  };
  const move = (e: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(e);
    if (stage.reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    tilt(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
  };

  return (
    <div
      ref={mergeRefs(ref, stage.setEl, el)}
      className={cx('umbra-stage umbra-tilt-card', className)}
      data-glare={(glare && !stage.reduced) || undefined}
      onPointerMove={move}
      onPointerLeave={(e) => {
        onPointerLeave?.(e);
        tilt(0, 0);
      }}
      {...rest}
    >
      <div className="umbra-tilt-card__surface">
        <StageLayer stage={stage} fallback={fallback ?? <span className="umbra-tilt-card__fallback" aria-hidden="true" />}>
          <Scene {...stage.sceneProps} quality={quality} />
        </StageLayer>
        <div className="umbra-stage__content">{children}</div>
      </div>
    </div>
  );
});
