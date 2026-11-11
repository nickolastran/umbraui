import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Popover as P } from 'radix-ui';
import { cx } from '../../utils/cx';

/** Props for {@link Popover}. */
export interface PopoverProps {
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. @default false */
  defaultOpen?: boolean;
  /** Called when the popover opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Trap focus and block outside interaction while open. @default false */
  modal?: boolean;
  /** `PopoverTrigger` and `PopoverContent`. */
  children?: ReactNode;
}

/** Floating panel anchored to a trigger, for secondary content and small forms. */
export function Popover(props: PopoverProps) {
  return <P.Root {...props} />;
}

/** Props for {@link PopoverTrigger}. */
export type PopoverTriggerProps = ComponentPropsWithoutRef<typeof P.Trigger>;
/** Toggles the popover. Use `asChild` to pass your own button. */
export const PopoverTrigger = P.Trigger;
/** Props for {@link PopoverClose}. */
export type PopoverCloseProps = ComponentPropsWithoutRef<typeof P.Close>;
/** Closes the popover. Use `asChild` to pass your own button. */
export const PopoverClose = P.Close;

/** Props for {@link PopoverContent}. */
export interface PopoverContentProps extends Omit<ComponentPropsWithoutRef<typeof P.Content>, 'asChild'> {
  /** Shows a small arrow pointing at the trigger. @default false */
  arrow?: boolean;
}

/** The floating panel. Focus moves in on open and returns to the trigger on close. */
export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(function PopoverContent(
  { arrow = false, sideOffset = 6, collisionPadding = 8, className, children, ...rest },
  ref,
) {
  return (
    <P.Portal>
      <P.Content ref={ref} sideOffset={sideOffset} collisionPadding={collisionPadding} className={cx('umbra-popover', className)} {...rest}>
        {children}
        {arrow ? <P.Arrow className="umbra-popover__arrow" width={12} height={6} /> : null}
      </P.Content>
    </P.Portal>
  );
});
