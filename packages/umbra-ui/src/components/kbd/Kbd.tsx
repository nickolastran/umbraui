import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';

/** Props for {@link Kbd}. */
export interface KbdProps extends HTMLAttributes<HTMLElement> {
  /** Key cap size. @default "md" */
  size?: 'sm' | 'md';
}

/** A keyboard key or shortcut, e.g. `<Kbd>⌘K</Kbd>`. */
export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd({ size = 'md', className, ...rest }, ref) {
  return <kbd ref={ref} className={cx('umbra-kbd', className)} data-size={size} {...rest} />;
});
