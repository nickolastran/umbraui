import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { Separator } from 'radix-ui';
import { cx } from '../../utils/cx';

/** Props for {@link Divider}. */
export interface DividerProps extends Omit<ComponentPropsWithoutRef<typeof Separator.Root>, 'asChild'> {
  /** Line direction. @default "horizontal" */
  orientation?: 'horizontal' | 'vertical';
  /** When `true` the divider is purely visual and hidden from assistive tech. @default true */
  decorative?: boolean;
}

/** A 1px rule between sections. */
export const Divider = forwardRef<HTMLDivElement, DividerProps>(function Divider(
  { orientation = 'horizontal', decorative = true, className, ...rest },
  ref,
) {
  return <Separator.Root ref={ref} orientation={orientation} decorative={decorative} className={cx('umbra-divider', className)} {...rest} />;
});
