import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { DropdownMenu as M } from 'radix-ui';
import { cx } from '../../utils/cx';
import { CheckIcon } from '../internal/icons';

/** Props for {@link DropdownMenu}. */
export interface DropdownMenuProps {
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. @default false */
  defaultOpen?: boolean;
  /** Called when the menu opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Block interaction outside the menu while open. @default true */
  modal?: boolean;
  /** `DropdownMenuTrigger` and `DropdownMenuContent`. */
  children?: ReactNode;
}

/** A menu of actions opened from a button. Arrow keys, typeahead, Home/End and Escape are handled. */
export function DropdownMenu(props: DropdownMenuProps) {
  return <M.Root {...props} />;
}

/** Props for {@link DropdownMenuTrigger}. */
export type DropdownMenuTriggerProps = ComponentPropsWithoutRef<typeof M.Trigger>;
/** Opens the menu. Use `asChild` to pass your own button. */
export const DropdownMenuTrigger = M.Trigger;

/** Props for {@link DropdownMenuContent}. */
export type DropdownMenuContentProps = Omit<ComponentPropsWithoutRef<typeof M.Content>, 'asChild'>;
/** The floating menu surface. */
export const DropdownMenuContent = forwardRef<HTMLDivElement, DropdownMenuContentProps>(function DropdownMenuContent(
  { sideOffset = 4, collisionPadding = 8, align = 'start', className, ...rest },
  ref,
) {
  return (
    <M.Portal>
      <M.Content ref={ref} sideOffset={sideOffset} collisionPadding={collisionPadding} align={align} className={cx('umbra-menu', className)} {...rest} />
    </M.Portal>
  );
});

/** Props for {@link DropdownMenuItem}. */
export interface DropdownMenuItemProps extends Omit<ComponentPropsWithoutRef<typeof M.Item>, 'asChild'> {
  /** Colour intent; `danger` for destructive actions. @default "neutral" */
  tone?: 'neutral' | 'danger';
  /** Keyboard shortcut hint shown at the end of the row (visual only). */
  shortcut?: ReactNode;
}

/** An action in the menu. `onSelect` fires on click, Enter and Space. */
export const DropdownMenuItem = forwardRef<HTMLDivElement, DropdownMenuItemProps>(function DropdownMenuItem(
  { tone = 'neutral', shortcut, className, children, ...rest },
  ref,
) {
  return (
    <M.Item ref={ref} className={cx('umbra-menu__item', className)} data-tone={tone} {...rest}>
      {children}
      {shortcut ? <span className="umbra-menu__shortcut">{shortcut}</span> : null}
    </M.Item>
  );
});

/** Props for {@link DropdownMenuCheckboxItem}. */
export type DropdownMenuCheckboxItemProps = Omit<ComponentPropsWithoutRef<typeof M.CheckboxItem>, 'asChild'>;
/** A menu item that toggles. Controlled via `checked` / `onCheckedChange`. */
export const DropdownMenuCheckboxItem = forwardRef<HTMLDivElement, DropdownMenuCheckboxItemProps>(function DropdownMenuCheckboxItem(
  { className, children, ...rest },
  ref,
) {
  return (
    <M.CheckboxItem ref={ref} className={cx('umbra-menu__item', className)} {...rest}>
      {children}
      <M.ItemIndicator className="umbra-menu__indicator">
        <CheckIcon />
      </M.ItemIndicator>
    </M.CheckboxItem>
  );
});

/** Props for {@link DropdownMenuRadioGroup}. */
export type DropdownMenuRadioGroupProps = Omit<ComponentPropsWithoutRef<typeof M.RadioGroup>, 'asChild'>;
/** Groups `DropdownMenuRadioItem`s; holds the selected `value`. */
export const DropdownMenuRadioGroup = M.RadioGroup;

/** Props for {@link DropdownMenuRadioItem}. */
export type DropdownMenuRadioItemProps = Omit<ComponentPropsWithoutRef<typeof M.RadioItem>, 'asChild'>;
/** A single-choice menu item inside a `DropdownMenuRadioGroup`. */
export const DropdownMenuRadioItem = forwardRef<HTMLDivElement, DropdownMenuRadioItemProps>(function DropdownMenuRadioItem(
  { className, children, ...rest },
  ref,
) {
  return (
    <M.RadioItem ref={ref} className={cx('umbra-menu__item', className)} {...rest}>
      {children}
      <M.ItemIndicator className="umbra-menu__indicator">
        <CheckIcon />
      </M.ItemIndicator>
    </M.RadioItem>
  );
});

/** Props for {@link DropdownMenuLabel}. */
export type DropdownMenuLabelProps = Omit<ComponentPropsWithoutRef<typeof M.Label>, 'asChild'>;
/** A non-interactive heading for a group of items. */
export const DropdownMenuLabel = forwardRef<HTMLDivElement, DropdownMenuLabelProps>(function DropdownMenuLabel({ className, ...rest }, ref) {
  return <M.Label ref={ref} className={cx('umbra-menu__label', className)} {...rest} />;
});

/** Props for {@link DropdownMenuSeparator}. */
export type DropdownMenuSeparatorProps = Omit<ComponentPropsWithoutRef<typeof M.Separator>, 'asChild'>;
/** A line between groups of items. */
export const DropdownMenuSeparator = forwardRef<HTMLDivElement, DropdownMenuSeparatorProps>(function DropdownMenuSeparator(
  { className, ...rest },
  ref,
) {
  return <M.Separator ref={ref} className={cx('umbra-menu__separator', className)} {...rest} />;
});
