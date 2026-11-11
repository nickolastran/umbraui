import { forwardRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import { useFieldControl } from '../form-field/FormField';

/** Props for {@link Textarea}. */
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Marks the value as invalid (sets `aria-invalid`). Inherited from FormField when omitted. */
  invalid?: boolean;
  /** Which directions the user may resize. @default "vertical" */
  resize?: 'none' | 'vertical' | 'both';
}

/** Multi-line text input. Works controlled (`value`) or uncontrolled (`defaultValue`). */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid, resize = 'vertical', rows = 3, className, ...rest },
  ref,
) {
  return <textarea ref={ref} rows={rows} className={cx('umbra-textarea', className)} data-resize={resize} {...rest} {...useFieldControl(rest, invalid)} />;
});
