import { forwardRef, useRef, useState } from 'react';
import type { HTMLAttributes } from 'react';
import { motion, useAnimationFrame, useMotionValue, useTransform } from 'motion/react';
import { cssVar, type SpaceToken } from '../../tokens/tokens';
import { cx } from '../../utils/cx';
import { motionTokens } from '../presets';
import { useReducedMotion, type ReducedMotionSetting } from '../../utils/reduced-motion';

/** Props for {@link Marquee}. */
export interface MarqueeProps extends HTMLAttributes<HTMLDivElement> {
  /** Speed multiplier; 1 scrolls the content once per four `duration-loop` tokens. @default 1 */
  speed?: number;
  /** Scroll direction. @default "left" */
  direction?: 'left' | 'right';
  /** Pause while hovered or while focus is inside (WCAG 2.2.2). @default true */
  pauseOnHover?: boolean;
  /** Pause from outside, e.g. from a "pause animations" control. @default false */
  paused?: boolean;
  /** Space between items, as a spacing token step. @default "8" */
  gap?: SpaceToken;
  /** Fade the left and right edges. @default true */
  fade?: boolean;
  /** Reduced-motion override. Under reduced motion the items wrap in place and nothing moves. @default "system" */
  reducedMotion?: ReducedMotionSetting;
}

/** An endlessly scrolling row for logos or short items. The duplicate copy is inert and hidden from assistive tech. */
export const Marquee = forwardRef<HTMLDivElement, MarqueeProps>(function Marquee(
  { speed = 1, direction = 'left', pauseOnHover = true, paused = false, gap = '8', fade = true, reducedMotion, className, style, children, ...rest },
  ref,
) {
  const reduced = useReducedMotion(reducedMotion);
  const [held, setHeld] = useState(false);
  const progress = useMotionValue(0); // 0 → 50 (% of the doubled track)
  const x = useTransform(progress, (p) => `${direction === 'left' ? -p : p - 50}%`);
  const running = useRef(false);
  running.current = !reduced && !paused && !(pauseOnHover && held);

  useAnimationFrame((_, delta) => {
    if (!running.current) return;
    progress.set((progress.get() + (delta / 1000 / (motionTokens.duration.loop * 4)) * 50 * speed) % 50);
  });

  const hold = pauseOnHover
    ? {
        onPointerEnter: () => setHeld(true),
        onPointerLeave: () => setHeld(false),
        onFocusCapture: () => setHeld(true),
        onBlurCapture: () => setHeld(false),
      }
    : {};

  return (
    <div
      ref={ref}
      className={cx('umbra-marquee', className)}
      data-static={reduced || undefined}
      data-fade={(fade && !reduced) || undefined}
      style={{ '--_gap': cssVar(`space-${gap}`), ...style } as never}
      {...hold}
      {...rest}
    >
      <motion.div className="umbra-marquee__track" style={reduced ? undefined : { x }}>
        <div className="umbra-marquee__group">{children}</div>
        {reduced ? null : (
          // `inert` keeps links in the visual duplicate out of the tab order (set via ref: React 18 and 19 disagree on the prop).
          <div className="umbra-marquee__group" aria-hidden="true" ref={(el) => void el?.setAttribute('inert', '')}>
            {children}
          </div>
        )}
      </motion.div>
    </div>
  );
});
