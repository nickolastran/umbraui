import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Checkbox as C } from 'radix-ui';
import { cx } from '../../utils/cx';
import { useFieldControl } from '../form-field/FormField';
import { CheckIcon, MinusIcon } from '../internal/icons';

/** Props for {@link Checkbox}. */
export interface CheckboxProps extends Omit<ComponentPropsWithoutRef<typeof C.Root>, 'asChild' | 'children'> {
  /** Inline label. When present the root element is a `<label>` that receives `className`; other props go to the control. */
  children?: ReactNode;
  /** Marks the control as invalid (sets `aria-invalid`). Inherited from FormField when omitted. */
  invalid?: boolean;
}

/** A tri-state checkbox (`true`, `false`, `"indeterminate"`). Controlled via `checked` or uncontrolled via `defaultChecked`. */
export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox({ children, invalid, className, ...rest }, ref) {
  const control = (
    <C.Root ref={ref} className={cx('umbra-checkbox', !children && className)} {...rest} {...useFieldControl(rest, invalid)}>
      <C.Indicator className="umbra-checkbox__indicator">
        <CheckIcon className="umbra-checkbox__check" />
        <MinusIcon className="umbra-checkbox__minus" />
      </C.Indicator>
    </C.Root>
  );
  if (!children) return control;
  return (
    <label className={cx('umbra-choice', className)} data-disabled={rest.disabled || undefined}>
      {control}
      <span className="umbra-choice__label">{children}</span>
    </label>
  );
});
