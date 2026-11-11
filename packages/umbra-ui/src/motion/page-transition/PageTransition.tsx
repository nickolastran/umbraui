import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { cx } from '../../utils/cx';
import { transitions } from '../presets';
import { useReducedMotion, type ReducedMotionSetting } from '../../utils/reduced-motion';

type Conflicts = 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart';

const variants = {
  fade: { initial: { opacity: 0 }, exit: { opacity: 0 } },
  slide: { initial: { opacity: 0, y: 12 }, exit: { opacity: 0, y: -8 } },
  scale: { initial: { opacity: 0, scale: 0.98 }, exit: { opacity: 0, scale: 1.01 } },
} as const;

/** Props for {@link PageTransition}. */
export interface PageTransitionProps extends Omit<HTMLAttributes<HTMLDivElement>, Conflicts> {
  /** Changes when the page changes, e.g. the pathname. A new key plays the exit, then the enter. */
  transitionKey: string | number;
  /** Movement style. @default "slide" */
  variant?: 'fade' | 'slide' | 'scale';
  /** `wait` finishes the exit before entering; `sync` overlaps them. @default "wait" */
  mode?: 'wait' | 'sync';
  /** Reduced-motion override. Under reduced motion every variant becomes a plain fade. @default "system" */
  reducedMotion?: ReducedMotionSetting;
}

/** Animates between pages or views. Wrap the changing content and key it by route. */
export const PageTransition = forwardRef<HTMLDivElement, PageTransitionProps>(function PageTransition(
  { transitionKey, variant = 'slide', mode = 'wait', reducedMotion, className, children, ...rest },
  ref,
) {
  const reduced = useReducedMotion(reducedMotion);
  const v = variants[reduced ? 'fade' : variant];
  return (
    <AnimatePresence mode={mode} initial={false}>
      <motion.div
        key={transitionKey}
        ref={ref}
        className={cx('umbra-page-transition', className)}
        initial={v.initial}
        animate={{ opacity: 1, y: 0, scale: 1, transition: transitions.slow }}
        exit={{ ...v.exit, transition: transitions.fast }}
        {...rest}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
});
