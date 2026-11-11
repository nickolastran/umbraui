import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';
import { Tooltip as T } from 'radix-ui';
import { cx } from '../../utils/cx';

/** Props for {@link Tooltip}. Remaining props are spread onto the tooltip bubble. */
export interface TooltipProps extends Omit<ComponentPropsWithoutRef<typeof T.Content>, 'asChild' | 'content' | 'children'> {
  /** Text shown in the bubble. Keep it short; it supplements, never replaces, the trigger's accessible name. */
  content: ReactNode;
  /** The trigger: a single focusable element such as a Button or IconButton. */
  children: ReactElement;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the tooltip shows or hides. */
  onOpenChange?: (open: boolean) => void;
  /** Delay before showing on hover, in ms. Keyboard focus shows it immediately. @default 400 */
  delay?: number;
}

/** Short hint shown on hover and keyboard focus; dismissed with Escape. */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(
  { content, children, open, defaultOpen, onOpenChange, delay = 400, sideOffset = 6, collisionPadding = 8, className, ...rest },
  ref,
) {
  return (
    <T.Provider delayDuration={delay}>
      <T.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        <T.Trigger asChild>{children}</T.Trigger>
        <T.Portal>
          <T.Content ref={ref} sideOffset={sideOffset} collisionPadding={collisionPadding} className={cx('umbra-tooltip', className)} {...rest}>
            {content}
          </T.Content>
        </T.Portal>
      </T.Root>
    </T.Provider>
  );
});
