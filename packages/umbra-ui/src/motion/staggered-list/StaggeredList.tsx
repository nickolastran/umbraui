import { Children, forwardRef } from 'react';
import type { HTMLAttributes, Ref } from 'react';
import { motion } from 'motion/react';
import { cssVar, type SpaceToken } from '../../tokens/tokens';
import { cx } from '../../utils/cx';
import { motionTokens, transitions } from '../presets';
import { useReducedMotion, type ReducedMotionSetting } from '../../utils/reduced-motion';

type Conflicts = 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart';

/** Props for {@link StaggeredList}. */
export interface StaggeredListProps extends Omit<HTMLAttributes<HTMLElement>, Conflicts> {
  /** List element. Each child is wrapped in an `<li>` (or a `<div>` when `as="div"`). @default "ul" */
  as?: 'ul' | 'ol' | 'div';
  /** Start on mount, or when scrolled into view. @default "inView" */
  trigger?: 'mount' | 'inView';
  /** Space between items, as a spacing token step. @default "2" */
  gap?: SpaceToken;
  /** Reduced-motion override. Under reduced motion all items fade in together, with no movement. @default "system" */
  reducedMotion?: ReducedMotionSetting;
}

/** Reveals its children one after another. Each direct child becomes one list item. */
export const StaggeredList = forwardRef<HTMLElement, StaggeredListProps>(function StaggeredList(
  { as = 'ul', trigger = 'inView', gap = '2', reducedMotion, className, style, children, ...rest },
  ref,
) {
  const reduced = useReducedMotion(reducedMotion);
  const List = motion[as];
  const Item = as === 'div' ? motion.div : motion.li;
  const play = trigger === 'mount' ? { animate: 'visible' } : { whileInView: 'visible', viewport: { once: true, amount: 0.2 } };
  return (
    <List
      ref={ref as Ref<never>}
      className={cx('umbra-staggered-list', className)}
      style={{ gap: cssVar(`space-${gap}`), ...style }}
      initial="hidden"
      {...play}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: reduced ? 0 : motionTokens.duration.stagger } } }}
      {...rest}
    >
      {Children.map(children, (child) =>
        child == null || child === false ? null : (
          <Item
            className="umbra-staggered-list__item"
            variants={{ hidden: { opacity: 0, y: reduced ? 0 : 12 }, visible: { opacity: 1, y: 0, transition: reduced ? transitions.base : transitions.smooth } }}
          >
            {child}
          </Item>
        ),
      )}
    </List>
  );
});
