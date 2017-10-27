export type FormControlValueTypes = string | number | boolean | null | undefined;
export type NgrxFormControlId = string;

export interface ValidationErrors { [key: string]: any; }
export interface KeyValue { [key: string]: any; }

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
  readonly userDefinedProperties: KeyValue;
}

export class FormControlState<TValue extends FormControlValueTypes> extends AbstractControlState<TValue> {
  readonly isFocused: boolean;
  readonly isUnfocused: boolean;
}

export type FormGroupControls<TValue> = {[controlId in keyof TValue]: AbstractControlState<TValue[controlId]> };
export class FormGroupState<TValue extends KeyValue> extends AbstractControlState<TValue> {
  readonly controls: FormGroupControls<TValue>;
}

export class FormArrayState<TValue> extends AbstractControlState<TValue[]> {
  readonly controls: Array<AbstractControlState<TValue>>;
}

export function cast<TValue extends FormControlValueTypes>(
  state: AbstractControlState<TValue>,
): FormControlState<TValue>;
export function cast<TValue extends any[]>(
  state: AbstractControlState<TValue>,
): FormArrayState<TValue>;
export function cast<TValue extends KeyValue>(
  state: AbstractControlState<TValue>,
): FormGroupState<TValue>;
export function cast<TValue>(
  state: AbstractControlState<TValue>,
) {
  return state as any;
}

export function createFormControlState<TValue extends FormControlValueTypes>(
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
    isSubmitted: false,
    isUnsubmitted: true,
    userDefinedProperties: {},
  };
}

export function createFormGroupState<TValue extends KeyValue>(
  id: NgrxFormControlId,
  initialValue: TValue,
): FormGroupState<TValue> {
  function createState(key: string, value: any) {
    if (value !== null && Array.isArray(value)) {
      return createFormArrayState(`${id}.${key}`, value);
    }

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
    userDefinedProperties: {},
  };
}

export function createFormArrayState<TValue>(
  id: NgrxFormControlId,
  initialValue: TValue[],
): FormArrayState<TValue> {
  function createState(index: number, value: any) {
    if (value !== null && Array.isArray(value)) {
      return createFormArrayState(`${id}.${index}`, value);
    }

    if (value !== null && typeof value === 'object') {
      return createFormGroupState(`${id}.${index}`, value);
    }

    return createFormControlState(`${id}.${index}`, value);
  }

  const controls = initialValue
    .map((value, i) => createState(i, value) as AbstractControlState<TValue>);

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
    userDefinedProperties: {},
  };
}
