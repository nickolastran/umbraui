import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import { useFieldControl } from '../form-field/FormField';
import type { Size } from '../internal/types';

/** Props for {@link Input}. */
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Control height. @default "md" */
  size?: Size;
  /** Marks the value as invalid (sets `aria-invalid`). Inherited from FormField when omitted. */
  invalid?: boolean;
  /** Native `size` attribute (visible width in characters). */
  htmlSize?: number;
}

/** Single-line text input. Works controlled (`value`) or uncontrolled (`defaultValue`). */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size = 'md', invalid, htmlSize, className, ...rest },
  ref,
) {
  return <input ref={ref} className={cx('umbra-input', className)} data-size={size} size={htmlSize} {...rest} {...useFieldControl(rest, invalid)} />;
});
