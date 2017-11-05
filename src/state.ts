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
  readonly pendingValidations: string[];
  readonly isValidationPending: boolean;
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

export function isArrayState(state: AbstractControlState<any>): state is FormArrayState<any> {
  return state.hasOwnProperty('controls') && Array.isArray((state as any).controls);
}

export function isGroupState(state: AbstractControlState<any>): state is FormGroupState<any> {
  return state.hasOwnProperty('controls') && !Array.isArray((state as any).controls);
}

export function cast<TValue extends FormControlValueTypes>(
  state: AbstractControlState<TValue>,
): FormControlState<TValue>;
export function cast<TArray extends TValue[], TValue = any>(
  state: AbstractControlState<TArray>,
): FormArrayState<TValue>;
export function cast<TArray extends TValue[], TValue = any>(
  state: AbstractControlState<TArray | undefined>,
): FormArrayState<TValue> | undefined;
export function cast<TValue extends KeyValue>(
  state: AbstractControlState<TValue>,
): FormGroupState<TValue>;
export function cast<TValue extends KeyValue>(
  state: AbstractControlState<TValue | undefined>,
): FormGroupState<TValue> | undefined;
export function cast<TValue>(
  state: AbstractControlState<TValue>,
) {
  return state as any;
}

export function createChildState(id: string, childValue: any): AbstractControlState<any> {
  if (childValue !== null && Array.isArray(childValue)) {
    return createFormArrayState(id, childValue);
  }

  if (childValue !== null && typeof childValue === 'object') {
    return createFormGroupState(id, childValue);
  }

  return createFormControlState(id, childValue);
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
    pendingValidations: [],
    isValidationPending: false,
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
  const controls = Object.keys(initialValue)
    .map((key: keyof TValue) => [key, createChildState(`${id}.${key}`, initialValue[key])] as [string, AbstractControlState<any>])
    .reduce((res, [controlId, state]) => Object.assign(res, { [controlId]: state }), {} as FormGroupControls<TValue>);

  return {
    id,
    value: initialValue,
    isValid: true,
    isInvalid: false,
    isEnabled: true,
    isDisabled: false,
    errors: {},
    pendingValidations: [],
    isValidationPending: false,
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
  const controls = initialValue
    .map((value, i) => createChildState(`${id}.${i}`, value) as AbstractControlState<TValue>);

  return {
    id,
    value: initialValue,
    isValid: true,
    isInvalid: false,
    isEnabled: true,
    isDisabled: false,
    errors: {},
    pendingValidations: [],
    isValidationPending: false,
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
