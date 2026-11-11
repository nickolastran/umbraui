import { forwardRef, lazy } from 'react';
import type { HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import type { Scene3DProps } from '../stage/types';
import { StageLayer, mergeRefs, useStage } from '../stage/useStage';

const Scene = lazy(() => import('./HeroScene.scene'));

/** Props for {@link HeroScene}. */
export interface HeroSceneProps extends HTMLAttributes<HTMLDivElement>, Scene3DProps {}

/**
 * A full-bleed hero background: an eclipsed body with an accent corona, orbiting rim lights and a star field
 * that drifts with the pointer. `children` render above it as ordinary DOM. Decorative: hidden from assistive tech.
 */
export const HeroScene = forwardRef<HTMLDivElement, HeroSceneProps>(function HeroScene(
  { quality = 'medium', fallback, reducedMotion, className, children, ...rest },
  ref,
) {
  const stage = useStage({ reducedMotion });
  return (
    <div ref={mergeRefs(ref, stage.setEl)} className={cx('umbra-stage umbra-hero-scene', className)} {...rest}>
      <StageLayer stage={stage} fallback={fallback ?? <span className="umbra-hero-scene__fallback" aria-hidden="true" />}>
        <Scene {...stage.sceneProps} quality={quality} />
      </StageLayer>
      {children ? <div className="umbra-stage__content">{children}</div> : null}
    </div>
  );
});
