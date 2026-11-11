import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Switch as S } from 'radix-ui';
import { cx } from '../../utils/cx';
import { useFieldControl } from '../form-field/FormField';

/** Props for {@link Switch}. */
export interface SwitchProps extends Omit<ComponentPropsWithoutRef<typeof S.Root>, 'asChild' | 'children'> {
  /** Track size. @default "md" */
  size?: 'sm' | 'md';
  /** Inline label. When present the root element is a `<label>` that receives `className`; other props go to the control. */
  children?: ReactNode;
}

/** Toggles a setting on or off with immediate effect. Controlled via `checked` or uncontrolled via `defaultChecked`. */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch({ size = 'md', children, className, ...rest }, ref) {
  const control = (
    <S.Root ref={ref} className={cx('umbra-switch', !children && className)} data-size={size} {...rest} {...useFieldControl(rest)}>
      <S.Thumb className="umbra-switch__thumb" />
    </S.Root>
  );
  if (!children) return control;
  return (
    <label className={cx('umbra-choice', className)} data-disabled={rest.disabled || undefined}>
      {control}
      <span className="umbra-choice__label">{children}</span>
    </label>
  );
});
