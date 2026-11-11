import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, HTMLAttributes, ReactNode } from 'react';
import { Dialog as D } from 'radix-ui';
import { cx } from '../../utils/cx';
import { CloseIcon } from '../internal/icons';

/** Props for {@link Dialog}. */
export interface DialogProps {
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. @default false */
  defaultOpen?: boolean;
  /** Called when the dialog opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** When `false`, content behind stays interactive and focus is not trapped. @default true */
  modal?: boolean;
  /** `DialogTrigger` and `DialogContent`. */
  children?: ReactNode;
}

/** A modal window. Traps focus, closes on Escape and outside click, and restores focus to the trigger. */
export function Dialog(props: DialogProps) {
  return <D.Root {...props} />;
}

/** Props for {@link DialogTrigger}. */
export type DialogTriggerProps = ComponentPropsWithoutRef<typeof D.Trigger>;
/** Opens the dialog. Use `asChild` to pass your own button. */
export const DialogTrigger = D.Trigger;

/** Props for {@link DialogClose}. */
export type DialogCloseProps = ComponentPropsWithoutRef<typeof D.Close>;
/** Closes the dialog. Use `asChild` to pass your own button. */
export const DialogClose = D.Close;

/** Props for {@link DialogContent}. */
export interface DialogContentProps extends Omit<ComponentPropsWithoutRef<typeof D.Content>, 'asChild' | 'title'> {
  /** Dialog title. Required: it is the dialog's accessible name. */
  title: ReactNode;
  /** Supporting text under the title, announced as the dialog's description. */
  description?: ReactNode;
  /** Maximum width. @default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** Hides the corner close button (Escape and outside click still close). @default false */
  hideClose?: boolean;
  /** Accessible label for the close button. @default "Close" */
  closeLabel?: string;
}

/** The dialog window, rendered in a portal above a scrim. */
export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(function DialogContent(
  { title, description, size = 'md', hideClose = false, closeLabel = 'Close', className, children, ...rest },
  ref,
) {
  return (
    <D.Portal>
      <D.Overlay className="umbra-dialog__overlay" />
      <D.Content
        ref={ref}
        className={cx('umbra-dialog', className)}
        data-size={size}
        {...(description ? {} : { 'aria-describedby': undefined })}
        {...rest}
      >
        <div className="umbra-dialog__header">
          <D.Title className="umbra-dialog__title">{title}</D.Title>
          {description ? <D.Description className="umbra-dialog__description">{description}</D.Description> : null}
        </div>
        {children}
        {hideClose ? null : (
          <D.Close className="umbra-button umbra-icon-button umbra-dialog__close" data-variant="ghost" data-tone="neutral" data-size="sm" aria-label={closeLabel}>
            <CloseIcon />
          </D.Close>
        )}
      </D.Content>
    </D.Portal>
  );
});

/** Props for {@link DialogFooter}. */
export type DialogFooterProps = HTMLAttributes<HTMLDivElement>;
/** Right-aligned action row at the bottom of a dialog. */
export const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(function DialogFooter({ className, ...rest }, ref) {
  return <div ref={ref} className={cx('umbra-dialog__footer', className)} {...rest} />;
});
