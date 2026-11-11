import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { AlertIcon, CloseIcon, InfoIcon, SuccessIcon } from '../internal/icons';
import type { Tone } from '../internal/types';

/** Props for {@link Alert}. */
export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Colour intent. `danger` and `warning` are announced assertively (`role="alert"`), others politely. @default "info" */
  tone?: Tone;
  /** Visual weight. @default "soft" */
  variant?: 'soft' | 'outline';
  /** Short heading. */
  title?: ReactNode;
  /** Replaces the default icon; pass `null` to hide it. */
  icon?: ReactNode;
  /** When provided, shows a dismiss button that calls this handler. */
  onDismiss?: () => void;
  /** Accessible label for the dismiss button. @default "Dismiss" */
  dismissLabel?: string;
}

const icons: Record<Tone, ReactNode> = {
  neutral: <InfoIcon />,
  accent: <InfoIcon />,
  info: <InfoIcon />,
  success: <SuccessIcon />,
  warning: <AlertIcon />,
  danger: <AlertIcon />,
};

/** An inline message about the state of the page or a task. */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { tone = 'info', variant = 'soft', title, icon, onDismiss, dismissLabel = 'Dismiss', className, children, ...rest },
  ref,
) {
  const glyph = icon === undefined ? icons[tone] : icon;
  return (
    <div
      ref={ref}
      role={tone === 'danger' || tone === 'warning' ? 'alert' : 'status'}
      className={cx('umbra-alert', className)}
      data-tone={tone}
      data-variant={variant}
      {...rest}
    >
      {glyph ? (
        <span className="umbra-alert__icon" aria-hidden="true">
          {glyph}
        </span>
      ) : null}
      <div className="umbra-alert__body">
        {title ? <div className="umbra-alert__title">{title}</div> : null}
        {children ? <div className="umbra-alert__description">{children}</div> : null}
      </div>
      {onDismiss ? (
        <button
          type="button"
          className="umbra-button umbra-icon-button umbra-alert__dismiss"
          data-variant="ghost"
          data-tone="neutral"
          data-size="sm"
          aria-label={dismissLabel}
          onClick={onDismiss}
        >
          <CloseIcon />
        </button>
      ) : null}
    </div>
  );
});
