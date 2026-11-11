import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { RadioGroup as R } from 'radix-ui';
import { cx } from '../../utils/cx';
import { useFieldControl, useFieldLabelId } from '../form-field/FormField';

/** Props for {@link RadioGroup}. */
export interface RadioGroupProps extends Omit<ComponentPropsWithoutRef<typeof R.Root>, 'asChild'> {
  /** Layout direction; also decides which arrow keys move the selection. @default "vertical" */
  orientation?: 'horizontal' | 'vertical';
  /** Marks the group as invalid (sets `aria-invalid`). Inherited from FormField when omitted. */
  invalid?: boolean;
}

/** A set of mutually exclusive options. Arrow keys move and select; Tab enters and leaves the group. */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  { orientation = 'vertical', invalid, className, ...rest },
  ref,
) {
  const labelId = useFieldLabelId();
  const { id, ...field } = useFieldControl(rest, invalid);
  return (
    <R.Root
      ref={ref}
      id={id}
      orientation={orientation}
      className={cx('umbra-radio-group', className)}
      aria-labelledby={rest['aria-label'] ? undefined : labelId}
      {...rest}
      {...field}
    />
  );
});

/** Props for {@link Radio}. */
export interface RadioProps extends Omit<ComponentPropsWithoutRef<typeof R.Item>, 'asChild' | 'children'> {
  /** Value selected when this option is chosen. */
  value: string;
  /** Inline label. When present the root element is a `<label>` that receives `className`; other props go to the control. */
  children?: ReactNode;
}

/** One option inside a {@link RadioGroup}. */
export const Radio = forwardRef<HTMLButtonElement, RadioProps>(function Radio({ children, className, ...rest }, ref) {
  const control = (
    <R.Item ref={ref} className={cx('umbra-radio', !children && className)} {...rest}>
      <R.Indicator className="umbra-radio__indicator" />
    </R.Item>
  );
  if (!children) return control;
  return (
    <label className={cx('umbra-choice', className)} data-disabled={rest.disabled || undefined}>
      {control}
      <span className="umbra-choice__label">{children}</span>
    </label>
  );
});
