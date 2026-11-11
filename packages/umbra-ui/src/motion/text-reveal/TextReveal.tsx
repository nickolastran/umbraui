import { forwardRef } from 'react';
import type { ElementType, HTMLAttributes } from 'react';
import { motion } from 'motion/react';
import { cx } from '../../utils/cx';
import { motionTokens, transitions } from '../presets';
import { useReducedMotion, type ReducedMotionSetting } from '../../utils/reduced-motion';

/** Props for {@link TextReveal}. */
export interface TextRevealProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** The text to reveal. Must be a plain string so it can be split and still read as one phrase. */
  children: string;
  /** Element to render, e.g. `"h1"`. @default "p" */
  as?: ElementType;
  /** Split unit. @default "word" */
  by?: 'word' | 'char';
  /** Start on mount, or when scrolled into view. @default "mount" */
  trigger?: 'mount' | 'inView';
  /** Seconds to wait before starting. @default 0 */
  delay?: number;
  /** Reduced-motion override. Under reduced motion the whole text fades in at once, with no movement. @default "system" */
  reducedMotion?: ReducedMotionSetting;
}

/** Reveals a line of text piece by piece. Screen readers get the full sentence once, not the fragments. */
export const TextReveal = forwardRef<HTMLElement, TextRevealProps>(function TextReveal(
  { children, as: Comp = 'p', by = 'word', trigger = 'mount', delay = 0, reducedMotion, className, ...rest },
  ref,
) {
  const reduced = useReducedMotion(reducedMotion);
  const pieces = by === 'char' ? Array.from(children) : children.split(/(\s+)/);
  const play = trigger === 'mount' ? { animate: 'visible' } : { whileInView: 'visible', viewport: { once: true, amount: 0.6 } };

  return (
    <Comp ref={ref} className={cx('umbra-text-reveal', className)} {...rest}>
      <span className="umbra-sr-only">{children}</span>
      <motion.span
        aria-hidden="true"
        initial="hidden"
        {...play}
        variants={
          reduced
            ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { ...transitions.slow, delay } } }
            : { hidden: {}, visible: { transition: { staggerChildren: motionTokens.duration.stagger, delayChildren: delay } } }
        }
      >
        {reduced
          ? children
          : pieces.map((piece, i) =>
              /^\s+$/.test(piece) ? (
                piece
              ) : (
                <span key={i} className="umbra-text-reveal__clip">
                  <motion.span
                    className="umbra-text-reveal__piece"
                    variants={{ hidden: { y: '100%', opacity: 0 }, visible: { y: 0, opacity: 1, transition: transitions.slower } }}
                  >
                    {piece}
                  </motion.span>
                </span>
              ),
            )}
      </motion.span>
    </Comp>
  );
});
