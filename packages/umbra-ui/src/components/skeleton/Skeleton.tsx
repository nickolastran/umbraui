import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';

/** Props for {@link Skeleton}. */
export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  /** `text` matches a line of text, `rect` is a block, `circle` an avatar. @default "text" */
  variant?: 'text' | 'rect' | 'circle';
  /** CSS width (number = px). Defaults to 100% (`circle`: its height). */
  width?: number | string;
  /** CSS height (number = px). Defaults to one line of text. */
  height?: number | string;
  /** Disables the pulse. It is always off under `prefers-reduced-motion`. @default true */
  animated?: boolean;
}

/**
 * Placeholder for content that is loading. Decorative (`aria-hidden`): put `aria-busy="true"` on the
 * region being loaded so assistive tech knows.
 */
export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(
  { variant = 'text', width, height, animated = true, className, style, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cx('umbra-skeleton', className)}
      data-variant={variant}
      data-animated={animated || undefined}
      style={{ width, height, ...style }}
      {...rest}
    />
  );
});
