import { forwardRef } from 'react';
import { motion } from 'motion/react';
import { Button, type ButtonProps } from '../../components/button/Button';
import { cx } from '../../utils/cx';
import { motionTokens } from '../presets';
import { useReducedMotion, type ReducedMotionSetting } from '../../utils/reduced-motion';

/** Props for {@link ShimmerButton}. */
export interface ShimmerButtonProps extends Omit<ButtonProps, 'asChild'> {
  /** `shimmer` sweeps a highlight across the face, `glow` adds a gradient border and halo, `both` does both. @default "both" */
  effect?: 'shimmer' | 'glow' | 'both';
  /** Reduced-motion override. Under reduced motion the sweep is removed; the static glow stays. @default "system" */
  reducedMotion?: ReducedMotionSetting;
}

/** A call-to-action Button with a looping shimmer and a glowing gradient border. Takes every Button prop. */
export const ShimmerButton = forwardRef<HTMLButtonElement, ShimmerButtonProps>(function ShimmerButton(
  { effect = 'both', reducedMotion, className, children, disabled, loading, ...rest },
  ref,
) {
  const reduced = useReducedMotion(reducedMotion);
  const sweep = effect !== 'glow' && !reduced && !disabled && !loading;
  return (
    <Button
      ref={ref}
      className={cx('umbra-shimmer-button', className)}
      data-glow={effect !== 'shimmer' || undefined}
      disabled={disabled}
      loading={loading}
      {...rest}
    >
      {sweep ? (
        <span className="umbra-shimmer-button__clip" aria-hidden="true">
          <motion.span
            className="umbra-shimmer-button__shine"
            initial={{ x: '-150%' }}
            animate={{ x: '350%' }}
            transition={{ duration: motionTokens.duration.loop / 3, ease: 'linear', repeat: Infinity, repeatDelay: motionTokens.duration.slower }}
          />
        </span>
      ) : null}
      {children}
    </Button>
  );
});
