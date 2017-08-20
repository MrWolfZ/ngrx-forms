import { ValidationErrors } from '@angular/forms';

export type SupportedNgrxFormControlValueTypes = string | number | boolean | null | undefined;
export type NgrxFormControlId = string;

export class AbstractControlState<TValue> {
  readonly id: string;
  readonly value: TValue;
  readonly isValid: boolean;
  readonly isInvalid: boolean;
  readonly errors: ValidationErrors;
  readonly isDirty: boolean;
  readonly isPristine: boolean;
  readonly isEnabled: boolean;
  readonly isDisabled: boolean;
  readonly isTouched: boolean;
  readonly isUntouched: boolean;
  readonly isSubmitted: boolean;
  readonly isUnsubmitted: boolean;
}

export class FormControlState<TValue extends SupportedNgrxFormControlValueTypes> extends AbstractControlState<TValue> {
  readonly isFocused: boolean;
  readonly isUnfocused: boolean;
  readonly lastKeyDownCode: number;
}

export type FormGroupControls<TValue> = {[controlId in keyof TValue]: AbstractControlState<TValue[controlId]> };
export class FormGroupState<TValue extends object> extends AbstractControlState<TValue> {
  readonly controls: FormGroupControls<TValue>;
}

export function cast<TValue extends SupportedNgrxFormControlValueTypes>(
  state: AbstractControlState<TValue>,
): FormControlState<TValue>;
export function cast<TValue extends object>(
  state: AbstractControlState<TValue>,
): FormGroupState<TValue>;
export function cast<TValue>(
  state: AbstractControlState<TValue>,
) {
  return state as any;
}

export function createFormControlState<TValue extends SupportedNgrxFormControlValueTypes>(
  id: NgrxFormControlId,
  value: TValue,
): FormControlState<TValue> {
  return {
    id,
    value,
    isValid: true,
    isInvalid: false,
    isEnabled: true,
    isDisabled: false,
    isFocused: false,
    isUnfocused: true,
    errors: {},
    isPristine: true,
    isDirty: false,
    isTouched: false,
    isUntouched: true,
    lastKeyDownCode: -1,
    isSubmitted: false,
    isUnsubmitted: true,
  };
}

export function createFormGroupState<TValue extends object>(
  id: NgrxFormControlId,
  initialValue: TValue,
): FormGroupState<TValue> {
  function createState(key: string, value: any) {
    if (value !== null && typeof value === 'object') {
      return createFormGroupState(`${id}.${key}`, value);
    }

    return createFormControlState(`${id}.${key}`, value);
  }

  const controls = Object.keys(initialValue)
    .map((key: keyof TValue) => [key, createState(key, initialValue[key])] as [string, AbstractControlState<any>])
    .reduce((res, [controlId, state]) => Object.assign(res, { [controlId]: state }), {} as FormGroupControls<TValue>);

  return {
    id,
    value: initialValue,
    isValid: true,
    isInvalid: false,
    isEnabled: true,
    isDisabled: false,
    errors: {},
    isPristine: true,
    isDirty: false,
    isTouched: false,
    isUntouched: true,
    controls,
    isSubmitted: false,
    isUnsubmitted: true,
  };
}
