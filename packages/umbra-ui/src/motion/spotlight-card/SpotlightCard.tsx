import { forwardRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'motion/react';
import { Card, type CardProps } from '../../components/card/Card';
import { cx } from '../../utils/cx';
import { transitions } from '../presets';
import { useReducedMotion, type ReducedMotionSetting } from '../../utils/reduced-motion';

/** Props for {@link SpotlightCard}. */
export interface SpotlightCardProps extends CardProps {
  /** Diameter of the light in px. @default 360 */
  spotlightSize?: number;
  /** Reduced-motion override. Under reduced motion the light fades in centred and does not follow the pointer. @default "system" */
  reducedMotion?: ReducedMotionSetting;
}

/** A Card lit by a soft glow that follows the pointer and picks out the border. Takes every Card prop. */
export const SpotlightCard = forwardRef<HTMLDivElement, SpotlightCardProps>(function SpotlightCard(
  { spotlightSize = 360, reducedMotion, className, children, onPointerMove, onPointerEnter, onPointerLeave, ...rest },
  ref,
) {
  const reduced = useReducedMotion(reducedMotion);
  const [lit, setLit] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const at = useMotionTemplate`${x}px ${y}px`;

  const move = (e: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(e);
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  return (
    <Card
      ref={ref}
      className={cx('umbra-spotlight-card', className)}
      onPointerMove={move}
      onPointerEnter={(e) => {
        onPointerEnter?.(e);
        setLit(true);
      }}
      onPointerLeave={(e) => {
        onPointerLeave?.(e);
        setLit(false);
      }}
      {...rest}
    >
      <motion.span
        aria-hidden="true"
        className="umbra-spotlight-card__light"
        style={{ '--_size': `${spotlightSize}px`, '--_at': reduced ? '50% 0%' : at } as never}
        initial={false}
        animate={{ opacity: lit ? 1 : 0 }}
        transition={transitions.base}
      />
      {children}
    </Card>
  );
});
