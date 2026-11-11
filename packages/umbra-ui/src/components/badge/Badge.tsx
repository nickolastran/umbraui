import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import type { Tone } from '../internal/types';

/** Props for {@link Badge}. */
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Visual weight. @default "soft" */
  variant?: 'soft' | 'solid' | 'outline';
  /** Colour intent. @default "neutral" */
  tone?: Tone;
  /** Badge height. @default "md" */
  size?: 'sm' | 'md';
  /** Shows a status dot before the label. @default false */
  dot?: boolean;
}

/** A compact label for status, counts and categories. Not interactive. */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = 'soft', tone = 'neutral', size = 'md', dot = false, className, children, ...rest },
  ref,
) {
  return (
    <span ref={ref} className={cx('umbra-badge', className)} data-variant={variant} data-tone={tone} data-size={size} {...rest}>
      {dot ? <span className="umbra-badge__dot" aria-hidden="true" /> : null}
      {children}
    </span>
  );
});
