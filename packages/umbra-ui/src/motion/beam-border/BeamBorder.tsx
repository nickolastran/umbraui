import { forwardRef } from 'react';
import type { CSSProperties, HTMLAttributes } from 'react';
import { motion, useAnimationFrame, useMotionValue } from 'motion/react';
import { cx } from '../../utils/cx';
import { motionTokens } from '../presets';
import { useReducedMotion, type ReducedMotionSetting } from '../../utils/reduced-motion';

/** Props for {@link BeamBorder}. */
export interface BeamBorderProps extends HTMLAttributes<HTMLDivElement> {
  /** Corner radius token. @default "lg" */
  radius?: 'sm' | 'md' | 'lg' | 'full';
  /** Border thickness in px. @default 1 */
  borderWidth?: 1 | 2;
  /** Speed multiplier; 1 is one lap per `duration-loop` token. @default 1 */
  speed?: number;
  /** Freezes the beam where it is. @default false */
  paused?: boolean;
  /** Reduced-motion override. Under reduced motion the beam is a static gradient highlight. @default "system" */
  reducedMotion?: ReducedMotionSetting;
}

/** Wraps content in a border with a beam of light travelling around it. */
export const BeamBorder = forwardRef<HTMLDivElement, BeamBorderProps>(function BeamBorder(
  { radius = 'lg', borderWidth = 1, speed = 1, paused = false, reducedMotion, className, style, children, ...rest },
  ref,
) {
  const reduced = useReducedMotion(reducedMotion);
  const rotate = useMotionValue(0);
  const running = !reduced && !paused;
  useAnimationFrame((_, delta) => {
    if (!running) return;
    rotate.set((rotate.get() + (delta / 1000 / motionTokens.duration.loop) * 360 * speed) % 360);
  });

  return (
    <div
      ref={ref}
      className={cx('umbra-beam-border', className)}
      data-radius={radius}
      data-running={running || undefined}
      style={{ '--_bw': `${borderWidth}px`, ...style } as CSSProperties}
      {...rest}
    >
      <motion.span aria-hidden="true" className="umbra-beam-border__beam" style={{ rotate }} />
      <div className="umbra-beam-border__content">{children}</div>
    </div>
  );
});
