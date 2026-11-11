import { createContext, forwardRef, useContext, useId, useMemo } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';

interface FieldContextValue {
  id: string;
  labelId: string;
  describedBy?: string;
  invalid: boolean;
  required: boolean;
  disabled: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);

interface ControlA11yProps {
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean | 'true' | 'false' | 'grammar' | 'spelling';
  required?: boolean;
  disabled?: boolean;
}

/**
 * Wires a control to the surrounding {@link FormField}: id, `aria-describedby`, `aria-invalid`,
 * `required` and `disabled`. Explicit props always win. Outside a FormField it only maps `invalid`.
 */
export function useFieldControl(props: ControlA11yProps, invalid?: boolean): ControlA11yProps {
  const field = useContext(FieldContext);
  const isInvalid = invalid ?? field?.invalid ?? false;
  return {
    id: props.id ?? field?.id,
    'aria-describedby': [props['aria-describedby'], field?.describedBy].filter(Boolean).join(' ') || undefined,
    'aria-invalid': props['aria-invalid'] ?? (isInvalid || undefined),
    required: props.required ?? (field?.required || undefined),
    disabled: props.disabled ?? (field?.disabled || undefined),
  };
}

/** Id of the surrounding FormField's label, for group controls that need `aria-labelledby`. */
export const useFieldLabelId = (): string | undefined => useContext(FieldContext)?.labelId;

/** Props for {@link FormField}. */
export interface FormFieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Visible label, associated with the control. */
  label: ReactNode;
  /** Helper text shown under the control and announced with it. */
  description?: ReactNode;
  /** Error message. When set the field is invalid and the message is announced. */
  error?: ReactNode;
  /** Marks the control as required and shows an indicator next to the label. */
  required?: boolean;
  /** Disables the control and dims the label. */
  disabled?: boolean;
  /** Id for the control. Generated when omitted. */
  controlId?: string;
  /** A single Umbra control (Input, Textarea, Select, Checkbox, RadioGroup, Switch). */
  children: ReactNode;
}

/**
 * Label, description and error message for one control. The child control picks up its id and
 * ARIA wiring automatically; no props need to be threaded through.
 */
export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(function FormField(
  { label, description, error, required = false, disabled = false, controlId, className, children, ...rest },
  ref,
) {
  const auto = useId();
  const id = controlId ?? `${auto}-control`;
  const descriptionId = description ? `${auto}-description` : undefined;
  const errorId = error ? `${auto}-error` : undefined;
  const labelId = `${auto}-label`;
  const invalid = Boolean(error);
  const describedBy = [errorId, descriptionId].filter(Boolean).join(' ') || undefined;
  const ctx = useMemo(
    () => ({ id, labelId, describedBy, invalid, required, disabled }),
    [id, labelId, describedBy, invalid, required, disabled],
  );

  return (
    <div ref={ref} className={cx('umbra-field', className)} data-invalid={invalid || undefined} data-disabled={disabled || undefined} {...rest}>
      <label id={labelId} className="umbra-field__label" htmlFor={id}>
        {label}
        {required ? (
          <span className="umbra-field__required" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      <FieldContext.Provider value={ctx}>{children}</FieldContext.Provider>
      {description ? (
        <p id={descriptionId} className="umbra-field__description">
          {description}
        </p>
      ) : null}
      <p id={errorId} className="umbra-field__error" aria-live="polite" hidden={!error}>
        {error}
      </p>
    </div>
  );
});
