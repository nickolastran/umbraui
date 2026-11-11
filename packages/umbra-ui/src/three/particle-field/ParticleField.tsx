import { forwardRef, lazy } from 'react';
import type { HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import type { Scene3DProps } from '../stage/types';
import { StageLayer, mergeRefs, useStage } from '../stage/useStage';

const Scene = lazy(() => import('./ParticleField.scene'));

/** Props for {@link ParticleField}. */
export interface ParticleFieldProps extends HTMLAttributes<HTMLDivElement>, Scene3DProps {
  /** Exact particle count, capped at 6000. Defaults to 500 / 1400 / 3200 by `quality`. */
  count?: number;
  /** Drift speed multiplier. @default 1 */
  speed?: number;
}

/**
 * A slowly drifting field of accent-to-neon particles with depth fog and pointer parallax. `children` render
 * above it as ordinary DOM. Decorative: hidden from assistive tech.
 */
export const ParticleField = forwardRef<HTMLDivElement, ParticleFieldProps>(function ParticleField(
  { quality = 'medium', fallback, reducedMotion, count, speed = 1, className, children, ...rest },
  ref,
) {
  const stage = useStage({ reducedMotion });
  return (
    <div ref={mergeRefs(ref, stage.setEl)} className={cx('umbra-stage umbra-particle-field', className)} {...rest}>
      <StageLayer stage={stage} fallback={fallback ?? <span className="umbra-particle-field__fallback" aria-hidden="true" />}>
        <Scene {...stage.sceneProps} quality={quality} count={count} speed={speed} />
      </StageLayer>
      {children ? <div className="umbra-stage__content">{children}</div> : null}
    </div>
  );
});
