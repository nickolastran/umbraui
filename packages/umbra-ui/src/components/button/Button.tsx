import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from 'react';
import { Slot } from 'radix-ui';
import { cx } from '../../utils/cx';
import { Spinner } from '../internal/icons';
import type { Size } from '../internal/types';

/** Props for {@link Button}. */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual weight. @default "solid" */
  variant?: 'solid' | 'soft' | 'outline' | 'ghost';
  /** Colour intent. @default "accent" */
  tone?: 'accent' | 'neutral' | 'danger';
  /** Control height. @default "md" */
  size?: Size;
  /** Shows a spinner, sets `aria-busy` and ignores clicks while keeping focus. @default false */
  loading?: boolean;
  /** Icon rendered before the label (decorative). */
  startIcon?: ReactNode;
  /** Icon rendered after the label (decorative). */
  endIcon?: ReactNode;
  /** Stretch to the container width. @default false */
  fullWidth?: boolean;
  /** Render the single child element (e.g. a router link) with button styling instead of a `<button>`. @default false */
  asChild?: boolean;
}

/** Triggers an action. Use one solid accent button per view; everything else is soft, outline or ghost. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'solid',
    tone = 'accent',
    size = 'md',
    loading = false,
    startIcon,
    endIcon,
    fullWidth = false,
    asChild = false,
    className,
    disabled,
    type,
    onClick,
    children,
    ...rest
  },
  ref,
) {
  const Comp = asChild ? Slot.Root : 'button';
  return (
    <Comp
      ref={ref}
      className={cx('umbra-button', className)}
      data-variant={variant}
      data-tone={tone}
      data-size={size}
      data-loading={loading || undefined}
      data-full-width={fullWidth || undefined}
      type={asChild ? undefined : (type ?? 'button')}
      disabled={disabled}
      aria-disabled={loading || undefined}
      aria-busy={loading || undefined}
      onClick={(e: MouseEvent<HTMLButtonElement>) => {
        if (loading) return e.preventDefault();
        onClick?.(e);
      }}
      {...rest}
    >
      {loading ? (
        <Spinner />
      ) : startIcon ? (
        <span className="umbra-button__icon" aria-hidden="true">
          {startIcon}
        </span>
      ) : null}
      <Slot.Slottable>{children}</Slot.Slottable>
      {endIcon ? (
        <span className="umbra-button__icon" aria-hidden="true">
          {endIcon}
        </span>
      ) : null}
    </Comp>
  );
});

/** Props for {@link IconButton}. */
export interface IconButtonProps extends Omit<ButtonProps, 'startIcon' | 'endIcon' | 'fullWidth' | 'aria-label'> {
  /** Accessible name. Required because the button has no visible text. */
  'aria-label': string;
  /** The icon. */
  children: ReactNode;
}

/** A square button holding a single icon. Always needs an `aria-label`. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { variant = 'ghost', tone = 'neutral', loading, children, className, ...rest },
  ref,
) {
  return (
    <Button ref={ref} variant={variant} tone={tone} loading={loading} className={cx('umbra-icon-button', className)} {...rest}>
      {loading ? null : children}
    </Button>
  );
});
