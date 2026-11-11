import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Select as S } from 'radix-ui';
import { cx } from '../../utils/cx';
import { useFieldControl } from '../form-field/FormField';
import { CheckIcon, ChevronDownIcon } from '../internal/icons';
import type { Size } from '../internal/types';

/** Props for {@link Select}. Remaining props are spread onto the trigger button. */
export interface SelectProps extends Omit<ComponentPropsWithoutRef<typeof S.Trigger>, 'asChild' | 'value' | 'defaultValue' | 'dir'> {
  /** Controlled value. */
  value?: string;
  /** Initial value when uncontrolled. */
  defaultValue?: string;
  /** Called with the newly selected value. */
  onValueChange?: (value: string) => void;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the listbox opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Field name submitted with a form. */
  name?: string;
  /** Marks the field as required for form validation. */
  required?: boolean;
  /** Text shown when no value is selected. */
  placeholder?: ReactNode;
  /** Control height. @default "md" */
  size?: Size;
  /** Marks the value as invalid (sets `aria-invalid`). Inherited from FormField when omitted. */
  invalid?: boolean;
  /** `SelectItem`, `SelectGroup` and `SelectSeparator` elements. */
  children: ReactNode;
}

/** Picks one value from a list. Built on Radix Select: typeahead, arrow keys, Home/End and form integration included. */
export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  { value, defaultValue, onValueChange, open, defaultOpen, onOpenChange, name, placeholder, size = 'md', invalid, className, children, ...rest },
  ref,
) {
  const field = useFieldControl(rest, invalid);
  return (
    <S.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      name={name}
      required={field.required}
      disabled={field.disabled}
    >
      <S.Trigger ref={ref} className={cx('umbra-select', className)} data-size={size} {...rest} {...field}>
        <span className="umbra-select__value">
          <S.Value placeholder={placeholder} />
        </span>
        <S.Icon className="umbra-select__icon">
          <ChevronDownIcon />
        </S.Icon>
      </S.Trigger>
      <S.Portal>
        <S.Content className="umbra-menu umbra-select__content" position="popper" sideOffset={4}>
          <S.Viewport>{children}</S.Viewport>
        </S.Content>
      </S.Portal>
    </S.Root>
  );
});

/** Props for {@link SelectItem}. */
export interface SelectItemProps extends Omit<ComponentPropsWithoutRef<typeof S.Item>, 'asChild'> {
  /** Value reported to `onValueChange` and submitted with forms. */
  value: string;
  /** Option label. */
  children: ReactNode;
}

/** One option inside a {@link Select}. */
export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(function SelectItem({ className, children, ...rest }, ref) {
  return (
    <S.Item ref={ref} className={cx('umbra-menu__item', className)} {...rest}>
      <S.ItemText>{children}</S.ItemText>
      <S.ItemIndicator className="umbra-menu__indicator">
        <CheckIcon />
      </S.ItemIndicator>
    </S.Item>
  );
});

/** Props for {@link SelectGroup}. */
export interface SelectGroupProps extends Omit<ComponentPropsWithoutRef<typeof S.Group>, 'asChild'> {
  /** Visible group heading, announced with the group. */
  label: ReactNode;
}

/** A labelled group of options. */
export const SelectGroup = forwardRef<HTMLDivElement, SelectGroupProps>(function SelectGroup({ label, children, ...rest }, ref) {
  return (
    <S.Group ref={ref} {...rest}>
      <S.Label className="umbra-menu__label">{label}</S.Label>
      {children}
    </S.Group>
  );
});

/** Props for {@link SelectSeparator}. */
export type SelectSeparatorProps = Omit<ComponentPropsWithoutRef<typeof S.Separator>, 'asChild'>;

/** A line between groups of options. */
export const SelectSeparator = forwardRef<HTMLDivElement, SelectSeparatorProps>(function SelectSeparator({ className, ...rest }, ref) {
  return <S.Separator ref={ref} className={cx('umbra-menu__separator', className)} {...rest} />;
});
