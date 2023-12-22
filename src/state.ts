import { deepEquals, isEmpty } from './util';

export type FormControlValueTypes = string | number | boolean | null | undefined;
export type NgrxFormControlId = string;

/**
 * This type represents a collection of named errors.
 */
export interface ValidationErrors { readonly [key: string]: any; }
export interface KeyValue { [key: string]: any; }

/**
 * Base interface for all types of form states.
 */
export interface AbstractControlState<TValue> {
  /**
   * The unique ID of the form state. Usually this is the name or index
   * of the control in the form value prefixed by the ID of the containing
   * group or array, e.g. `MY_FORM.someTextInput` or `MY_FORM.0`.
   */
  readonly id: string;

  /**
   * The value of the form state.
   */
  readonly value: TValue;

  /**
   * This property is `true` if the state does not have any errors.
   */
  readonly isValid: boolean;

  /**
   * This property is `true` if the state has at least one error.
   */
  readonly isInvalid: boolean;

  /**
   * The errors of the state. This property always has a value.
   * If the state has no errors the property is set to `{}`.
   */
  readonly errors: ValidationErrors;

  /**
   * The names of all asynchronous validations currently running
   * for the state.
   */
  readonly pendingValidations: readonly string[];

  /**
   * This property indicates whether the control is currently being
   * asynchronously validated.
   */
  readonly isValidationPending: boolean;

  /**
   * This property indicates whether the state is enabled. When it
   * is `false` the `errors` are always `{}` (i.e. the state is
   * always valid if disabled) and `pendingValidations` is always `[]`
   * (i.e. all pending validations are cancelled).
   */
  readonly isEnabled: boolean;

  /**
   * This property indicates whether the state is disabled. When it
   * is `true` the `errors` are always `{}` (i.e. the state is
   * always valid if disabled) and `pendingValidations` is always `[]`
   * (i.e. all pending validations are cancelled).
   */
  readonly isDisabled: boolean;

  /**
   * This property is set to `true` as soon as the state's value changes.
   */
  readonly isDirty: boolean;

  /**
   * This property is `true` as long as the state's value never changed.
   */
  readonly isPristine: boolean;

  /**
   * This property is set to `true` as soon as the state is touched.
   */
  readonly isTouched: boolean;

  /**
   * This property is `true` as long as the state is not touched.
   */
  readonly isUntouched: boolean;

  /**
   * This property is set to `true` as soon as the state is submitted.
   */
  readonly isSubmitted: boolean;

  /**
   * This property is `true` as long as the state is not submitted.
   */
  readonly isUnsubmitted: boolean;

  /**
   * This property is a container for user-defined metadata (e.g. if
   * you wanted to count the number of times a state's value has been
   * changed, what keys were pressed on an input, or how often a form
   * has been submitted etc.). While it is possible to store this kind
   * of information outside of **ngrx-forms** in your own state the
   * `userDefinedProperties` allow you to store your own metadata
   * directly in the state.
   */
  readonly userDefinedProperties: KeyValue;
}

/**
 * State associated with a form control, i.e. an HTML form
 * element in the view (e.g. `input`, `select`, `textarea` etc.).
 */
export interface FormControlState<TValue extends FormControlValueTypes> extends AbstractControlState<TValue> {
  /**
   * The value of the form state. Form controls only support values of
   * type `string`, `number`, `boolean`, `null`, and `undefined` to
   * keep the state string serializable.
   */
  readonly value: TValue;

  /**
   * This property is `true` if the form control does not have any errors.
   */
  readonly isValid: boolean;

  /**
   * This property is `true` if the form control has at least one error.
   */
  readonly isInvalid: boolean;

  /**
   * The errors of the form control. This property always has a value.
   * If the control has no errors the property is set to `{}`.
   */
  readonly errors: ValidationErrors;

  /**
   * The names of all asynchronous validations currently running for the
   * form control.
   */
  readonly pendingValidations: readonly string[];

  /**
   * This property indicates whether the control is currently being
   * asynchronously validated (i.e. this is `true` if and only if
   * `pendingValidations` is not empty).
   */
  readonly isValidationPending: boolean;

  /**
   * This property indicates whether the form control is enabled.
   * When it is `false` the `errors` are always `{}` (i.e. the form
   * control is always valid if disabled) and `pendingValidations`
   * is always `[]` (i.e. all pending validations are cancelled).
   */
  readonly isEnabled: boolean;

  /**
   * This property indicates whether the form control is disabled.
   * When it is `true` the `errors` are always `{}` (i.e. the form
   * control is always valid if disabled) and `pendingValidations`
   * is always `[]` (i.e. all pending validations are cancelled).
   */
  readonly isDisabled: boolean;

  /**
   * This property is set to `true` as soon as the underlying
   * `FormViewAdapter` or `ControlValueAccessor` reports a new
   * value for the first time.
   */
  readonly isDirty: boolean;

  /**
   * This property is `true` as long as the underlying
   * `FormViewAdapter` or `ControlValueAccessor` has never
   * reported a new value.
   */
  readonly isPristine: boolean;

  /**
   * This property is set to `true` based on the rules of the
   * underlying `FormViewAdapter` (usually on `blur` for most form
   * elements).
   */
  readonly isTouched: boolean;

  /**
   * This property is `true` as long as the control is not touched.
   */
  readonly isUntouched: boolean;

  /**
   * This property is set to `true` as soon as the group or array
   * containing this form control is submitted. A form control can
   * never be submitted on its own.
   */
  readonly isSubmitted: boolean;

  /**
   * This property is `true` as long as the state is not submitted.
   */
  readonly isUnsubmitted: boolean;

  /**
   * This property is set to `true` if the form control currently
   * has focus. This feature is opt-in. To enable it you have to
   * enable it for a given form element like this:
   *
```html
<input [ngrxFormControlState]="state"
      [ngrxEnableFocusTracking]="true" />
```
   */
  readonly isFocused: boolean;

  /**
   * This property is `true` if the control currently does not have
   * focus or focus tracking is not enabled for the form control.
   */
  readonly isUnfocused: boolean;
}

/**
 * This type represents the child control states of a form group.
 */
export type FormGroupControls<TValue extends KeyValue> = {
  readonly [controlId in keyof TValue]: FormState<TValue[controlId]>;
};

/**
 * Form groups are collections of named controls. Just like controls
 * groups are represented as plain state objects. The state of a
 * group is determined almost fully by its child states.
 */
export interface FormGroupState<TValue extends KeyValue> extends AbstractControlState<TValue> {
  /**
   * The aggregated value of the form group. The value is computed by
   * aggregating the values of all children, e.g.
   *
```typescript
{
  child1: 'some value',
  child2: {
    nestedChild: 10,
  },
}
```
   */
  readonly value: TValue;

  /**
   * This property is `true` if the form group does not have any errors
   * itself and none of its children have any errors.
   */
  readonly isValid: boolean;

  /**
   * This property is `true` if the form group or any of its children
   * have at least one error.
   */
  readonly isInvalid: boolean;

  /**
   * The errors of the form group. This property is computed by merging
   * the errors of the group with the errors of all its children where
   * the child errors are a property of the `errors` object prefixed with
   * an underscore, e.g.
   *
```
{
  groupError: true,
  _child: {
    childError: true,
  },
}
```
   *
   * If neither the group nor any children have errors the property is
   * set to `{}`.
   */
  readonly errors: ValidationErrors;

  /**
   * The names of all asynchronous validations currently running for the
   * form group.
   */
  readonly pendingValidations: readonly string[];

  /**
   * This property indicates whether the group or any of its children
   * are currently being asynchronously validated.
   */
  readonly isValidationPending: boolean;

  /**
   * This property indicates whether the form group is enabled. It is
   * `true` if and only if at least one of its child states is
   * enabled. When it is `false` the `errors` are always `{}` (i.e.
   * the form group is always valid if disabled) and `pendingValidations`
   * is always `[]` (i.e. all pending validations are cancelled).
   */
  readonly isEnabled: boolean;

  /**
   * This property indicates whether the form group is disabled. It is
   * `true` if and only if all of its child state are disabled. When
   * it is `true` the `errors` are always `{}` (i.e. the form group
   * is always valid if disabled) and `pendingValidations` is always
   * `[]` (i.e. all pending validations are cancelled).
   */
  readonly isDisabled: boolean;

  /**
   * This property is `true` if and only if at least one of the form
   * group's child states is marked as dirty.
   */
  readonly isDirty: boolean;

  /**
   * This property is `true` if and only if all of the form group's
   * child states are pristine.
   */
  readonly isPristine: boolean;

  /**
   * This property is `true` if and only if at least one of the form
   * group's child states is marked as touched.
   */
  readonly isTouched: boolean;

  /**
   * This property is `true` if and only if all of the form group's
   * child states are untouched.
   */
  readonly isUntouched: boolean;

  /**
   * This property is set to `true` as soon as the form group is
   * submitted. This is tracked by the `NgrxFormDirective`, which
   * needs to be applied to a form like this:
   *
```html
<form [ngrxFormState]="groupState">
</form>
```
   *
   * Note that applying this directive to a form prevents normal form
   * submission since that does not make much sense for ngrx forms.
   */
  readonly isSubmitted: boolean;

  /**
   * This property is `true` as long as the state is not submitted.
   */
  readonly isUnsubmitted: boolean;

  /**
   * This property contains all child states of the form group. As
   * you may have noticed the type of each child state is
   * `AbstractControlState` which sometimes forces you to cast the
   * state explicitly. It is not possible to improve this typing
   * until [conditional mapped types](https://github.com/Microsoft/TypeScript/issues/12424)
   * are added to TypeScript.
   */
  readonly controls: FormGroupControls<TValue>;
}

/**
 * Form arrays are collections of controls. They are represented as
 * plain state arrays. The state of an array is determined almost
 * fully by its child states.
 */
export interface FormArrayState<TValue> extends AbstractControlState<readonly TValue[]> {
  /**
   * The aggregated value of the form array. The value is computed by
   * aggregating the values of all children into an array.
   */
  readonly value: TValue[];

  /**
   * This property is `true` if the form array does not have any errors
   * itself and none of its children have any errors.
   */
  readonly isValid: boolean;

  /**
   * This property is `true` if the form array or any of its children
   * have at least one error.
   */
  readonly isInvalid: boolean;

  /**
   * The errors of the form array. This property is computed by merging
   * the errors of the array with the errors of all its children where
   * the child errors are a property of the `errors` object prefixed with
   * an underscore, e.g.
   *
```
{
  arrayError: true,
  _0: {
    childError: true,
  },
}
```
   *
   * If neither the array nor any children have errors the property is
   * set to `{}`.
   */
  readonly errors: ValidationErrors;

  /**
   * The names of all asynchronous validations currently running for the
   * form array.
   */
  readonly pendingValidations: readonly string[];

  /**
   * This property indicates whether the array or any of its children
   * are currently being asynchronously validated.
   */
  readonly isValidationPending: boolean;

  /**
   * This property indicates whether the form array is enabled. It is
   * `true` if and only if at least one of its child states is
   * enabled. When it is `false` the `errors` are always `{}` (i.e.
   * the form array is always valid if disabled) and `pendingValidations`
   * is always `[]` (i.e. all pending validations are cancelled).
   */
  readonly isEnabled: boolean;

  /**
   * This property indicates whether the form array is disabled. It is
   * `true` if and only if all of its child states are disabled. When
   * it is `true` the `errors` are always `{}` (i.e. the form array
   * is always valid if disabled) and `pendingValidations` is always
   * `[]` (i.e. all pending validations are cancelled).
   */
  readonly isDisabled: boolean;

  /**
   * This property is `true` if and only if at least one of the form
   * array's child states is marked as dirty.
   */
  readonly isDirty: boolean;

  /**
   * This property is `true` if and only if all of the form array's
   * child states are pristine.
   */
  readonly isPristine: boolean;

  /**
   * This property is `true` if and only if at least one of the form
   * array's child states is marked as touched.
   */
  readonly isTouched: boolean;

  /**
   * This property is `true` if and only if all of the form array's
   * child states are untouched.
   */
  readonly isUntouched: boolean;

  /**
   * This property is set to `true` as soon as the form array is
   * submitted. This is tracked by the `NgrxFormDirective`, which
   * needs to be applied to a form like this:
   *
```html
<form [ngrxFormState]="arrayState">
</form>
```
   *
   * Note that applying this directive to a form prevents normal form
   * submission since that does not make much sense for ngrx forms.
   */
  readonly isSubmitted: boolean;

  /**
   * This property is `true` as long as the state is not submitted.
   */
  readonly isUnsubmitted: boolean;

  /**
   * This property contains all child states of the form array. As
   * you may have noticed the type of each child state is
   * `AbstractControlState` which sometimes forces you to cast the
   * state explicitly. It is not possible to improve this typing
   * until [conditional mapped types](https://github.com/Microsoft/TypeScript/issues/12424)
   * are added to TypeScript.
   */
  readonly controls: readonly FormState<TValue>[];
}

/**
 * This is a helper type that allows working around the distributiveness
 * of conditional types.
 */
export interface InferenceWrapper<T> {
  t: T;
}

/**
 * This is a helper type that infers the correct form state type based
 * on the string type contained in the inference wrapper.
 */
export type InferredStringFormState<T extends InferenceWrapper<any>> =
  T extends InferenceWrapper<string> ? FormControlState<string>
  : T extends InferenceWrapper<string | undefined> ? FormControlState<string | undefined>
  : T extends InferenceWrapper<string | null> ? FormControlState<string | null>
  : T extends InferenceWrapper<string | undefined | null> ? FormControlState<string | undefined | null>
  : never
  ;

/**
 * This is a helper type that infers the correct form state type based
 * on the number type contained in the inference wrapper.
 */
export type InferredNumberFormState<T extends InferenceWrapper<any>> =
  T extends InferenceWrapper<number> ? FormControlState<number>
  : T extends InferenceWrapper<number | undefined> ? FormControlState<number | undefined>
  : T extends InferenceWrapper<number | null> ? FormControlState<number | null>
  : T extends InferenceWrapper<number | undefined | null> ? FormControlState<number | undefined | null>
  : never
  ;

/**
 * This is a helper type that infers the correct form state type based
 * on the boolean type contained in the inference wrapper.
 */
export type InferredBooleanFormState<T extends InferenceWrapper<any>> =
  T extends InferenceWrapper<boolean> ? FormControlState<boolean>
  : T extends InferenceWrapper<boolean | undefined> ? FormControlState<boolean | undefined>
  : T extends InferenceWrapper<boolean | null> ? FormControlState<boolean | null>
  : T extends InferenceWrapper<boolean | undefined | null> ? FormControlState<boolean | undefined | null>
  : never
  ;

/**
 * This is a helper type that infers the correct form state type based
 * on the type contained in the inference wrapper.
 */
export type InferredFormState<T extends InferenceWrapper<any>> =
  // (ab)use 'symbol' to catch 'any' typing
  T extends InferenceWrapper<symbol> ? AbstractControlState<any>
  : T extends InferenceWrapper<undefined> ? AbstractControlState<any>
  : T extends InferenceWrapper<null> ? AbstractControlState<any>

  // control
  : T extends InferenceWrapper<string | undefined | null> ? InferredStringFormState<T>
  : T extends InferenceWrapper<number | undefined | null> ? InferredNumberFormState<T>
  : T extends InferenceWrapper<boolean | undefined | null> ? InferredBooleanFormState<T>

  // array
  : T extends InferenceWrapper<readonly (infer U)[] | undefined | null> ? FormArrayState<U>

  // group
  : T extends InferenceWrapper<infer U | undefined | null> ? U extends KeyValue ? FormGroupState<U> : never

  // fallback type (this case should never (no pun intended) be hit)
  : never
  ;

/**
 * This is a type that can infer the concrete type of a form state based
 * on the given type parameter.
 */
export type FormState<T> = InferredFormState<InferenceWrapper<T>>;

/**
 * This function determines if a value is a form state.
 */
export function isFormState<TValue = any>(state: any): state is FormState<TValue> {
  return !!state && state.hasOwnProperty('id') && state.hasOwnProperty('value') && state.hasOwnProperty('errors');
}

/**
 * This function determines if a value is an array state.
 */
export function isArrayState<TValue = any>(state: any): state is FormArrayState<TValue> {
  return isFormState(state) && state.hasOwnProperty('controls') && Array.isArray((state as any).controls);
}

/**
 * This function determines if a value is a group state.
 */
export function isGroupState<TValue extends KeyValue = any>(state: any): state is FormGroupState<TValue> {
  return isFormState(state) && state.hasOwnProperty('controls') && !Array.isArray((state as any).controls) && typeof (state as any).controls !== 'function';
}

export function createChildState<TValue>(id: string, childValue: TValue): FormState<TValue> {
  if (childValue !== null && Array.isArray(childValue)) {
    return createFormArrayState(id, childValue as any[]) as FormState<TValue>;
  }

  if (childValue !== null && typeof childValue === 'object') {
    return createFormGroupState(id, childValue) as FormState<TValue>;
  }

  return createFormControlState<any>(id, childValue) as FormState<TValue>;
}

export function verifyFormControlValueIsValid<TValue>(value: TValue) {
  if (value === null || ['string', 'number', 'boolean', 'undefined'].includes(typeof value) || 
    (Array.isArray(value) && (value.length === 0 || value.every(item => ['string', 'number'].includes(typeof item))))
    ) {
    return value;
  }

  const serialized = JSON.stringify(value);
  const deserialized = JSON.parse(serialized);

  if (deepEquals(value, deserialized, { treatUndefinedAndMissingKeyAsSame: true })) {
    return value;
  }

  throw new Error(`A form control value must be serializable (i.e. value === JSON.parse(JSON.stringify(value))), got: ${JSON.stringify(value)}`);
}

/**
 * This function creates a form control state with an ID and a value.
 */
export function createFormControlState<TValue extends FormControlValueTypes>(
  id: NgrxFormControlId,
  value: TValue,
): FormControlState<TValue> {
  return {
    id,
    value: verifyFormControlValueIsValid(value),
    errors: {},
    pendingValidations: [],
    isValidationPending: false,
    isValid: true,
    isInvalid: false,
    isEnabled: true,
    isDisabled: false,
    isDirty: false,
    isPristine: true,
    isTouched: false,
    isUntouched: true,
    isSubmitted: false,
    isUnsubmitted: true,
    isFocused: false,
    isUnfocused: true,
    userDefinedProperties: {},
  };
}

export function getFormGroupValue<TValue extends KeyValue>(
  controls: FormGroupControls<TValue>,
  originalValue: Partial<TValue>,
): TValue {
  let hasChanged = Object.keys(originalValue).length !== Object.keys(controls).length;
  const newValue = Object.keys(controls).reduce((res, key: keyof TValue) => {
    const control = controls[key] as AbstractControlState<TValue[keyof TValue]>;
    hasChanged = hasChanged || originalValue[key] !== control.value;
    res[key] = control.value;
    return res;
  }, {} as TValue);

  return hasChanged ? newValue : originalValue as TValue;
}

export function getFormGroupErrors<TValue extends KeyValue>(
  controls: FormGroupControls<TValue>,
  originalErrors: ValidationErrors,
): ValidationErrors {
  let hasChanged = false;
  const groupErrors =
    Object.keys(originalErrors)
      .filter(key => !key.startsWith('_'))
      .reduce((res, key) => Object.assign(res, { [key]: originalErrors[key] }), {} as ValidationErrors);

  const newErrors = Object.keys(controls).reduce((res, key: any) => {
    const control = controls[key] as AbstractControlState<TValue[keyof TValue]>;
    const controlErrors = control.errors;
    if (!isEmpty(controlErrors)) {
      hasChanged = hasChanged || originalErrors[`_${key}`] !== controlErrors;
      Object.assign(res, { [`_${key}`]: control.errors });
    } else {
      hasChanged = hasChanged || originalErrors.hasOwnProperty(`_${key}`);
    }

    return res;
  }, groupErrors);

  hasChanged = hasChanged || Object.keys(originalErrors).length !== Object.keys(newErrors).length;

  return hasChanged ? newErrors : originalErrors;
}

export function computeGroupState<TValue extends KeyValue>(
  id: string,
  controls: FormGroupControls<TValue>,
  partialValue: Partial<TValue>,
  errors: ValidationErrors,
  pendingValidations: readonly string[],
  userDefinedProperties: KeyValue,
  flags: {
    wasOrShouldBeDirty?: boolean;
    wasOrShouldBeEnabled?: boolean;
    wasOrShouldBeTouched?: boolean;
    wasOrShouldBeSubmitted?: boolean;
  },
): FormGroupState<TValue> {
  const value = getFormGroupValue<TValue>(controls, partialValue);
  errors = getFormGroupErrors(controls, errors);
  const isValid = isEmpty(errors);
  const typedControls = Object.keys(controls).map(key => controls[key] as AbstractControlState<TValue[keyof TValue]>);
  const isDirty = flags.wasOrShouldBeDirty || typedControls.some(control => control.isDirty);
  const isEnabled = flags.wasOrShouldBeEnabled || typedControls.some(control => control.isEnabled);
  const isTouched = flags.wasOrShouldBeTouched || typedControls.some(control => control.isTouched);
  const isSubmitted = flags.wasOrShouldBeSubmitted || typedControls.some(control => control.isSubmitted);
  const isValidationPending = pendingValidations.length > 0 || typedControls.some(control => control.isValidationPending);
  return {
    id,
    value,
    errors,
    pendingValidations,
    isValidationPending,
    isValid,
    isInvalid: !isValid,
    isEnabled,
    isDisabled: !isEnabled,
    isDirty,
    isPristine: !isDirty,
    isTouched,
    isUntouched: !isTouched,
    isSubmitted,
    isUnsubmitted: !isSubmitted,
    userDefinedProperties,
    controls,
  };
}

/**
 * This function creates a form group state with an ID and a value.
 * From the value the shape of the group state is inferred, i.e.
 * object properties are inferred as form groups, array properties
 * are inferred as form arrays, and primitive properties are inferred
 * as form controls.
 */
export function createFormGroupState<TValue extends KeyValue>(
  id: NgrxFormControlId,
  initialValue: TValue,
): FormGroupState<TValue> {
  const controls = Object.keys(initialValue)
    .map((key: keyof TValue) => [key, createChildState(`${id}.${key as string}`, initialValue[key])] as [string, FormState<any>])
    .reduce((res, [controlId, state]) => Object.assign(res, { [controlId]: state }), {} as FormGroupControls<TValue>);

  return computeGroupState(id, controls, initialValue, {}, [], {}, { wasOrShouldBeEnabled: true });
}

function getFormArrayValue<TValue>(
  controls: readonly AbstractControlState<TValue>[],
  originalValue: TValue[],
): TValue[] {
  let hasChanged = Object.keys(originalValue).length !== Object.keys(controls).length;
  const newValue = controls.map((state, i) => {
    hasChanged = hasChanged || originalValue[i] !== state.value;
    return state.value;
  });

  return hasChanged ? newValue : originalValue;
}

function getFormArrayErrors<TValue>(
  controls: readonly AbstractControlState<TValue>[],
  originalErrors: ValidationErrors,
): ValidationErrors {
  let hasChanged = false;
  const groupErrors =
    Object.keys(originalErrors)
      .filter(key => !key.startsWith('_'))
      .reduce((res, key) => Object.assign(res, { [key]: originalErrors[key] }), {} as ValidationErrors);

  const newErrors = controls.reduce((res, state, i) => {
    const controlErrors = state.errors;
    if (!isEmpty(controlErrors)) {
      hasChanged = hasChanged || originalErrors[`_${i}`] !== controlErrors;
      Object.assign(res, { [`_${i}`]: controlErrors });
    } else {
      hasChanged = hasChanged || originalErrors.hasOwnProperty(`_${i}`);
    }

    return res;
  }, groupErrors);

  hasChanged = hasChanged || Object.keys(originalErrors).length !== Object.keys(newErrors).length;

  return hasChanged ? newErrors : originalErrors;
}

export function computeArrayState<TValue>(
  id: string,
  inferredControls: readonly FormState<TValue>[],
  value: TValue[],
  errors: ValidationErrors,
  pendingValidations: readonly string[],
  userDefinedProperties: KeyValue,
  flags: {
    wasOrShouldBeDirty?: boolean;
    wasOrShouldBeEnabled?: boolean;
    wasOrShouldBeTouched?: boolean;
    wasOrShouldBeSubmitted?: boolean;
  },
): FormArrayState<TValue> {
  const controls = inferredControls as readonly AbstractControlState<any>[];

  value = getFormArrayValue<TValue>(controls, value);
  errors = getFormArrayErrors(controls, errors);
  const isValid = isEmpty(errors);
  const isDirty = flags.wasOrShouldBeDirty || controls.some(state => state.isDirty);
  const isEnabled = flags.wasOrShouldBeEnabled || controls.some(state => state.isEnabled);
  const isTouched = flags.wasOrShouldBeTouched || controls.some(state => state.isTouched);
  const isSubmitted = flags.wasOrShouldBeSubmitted || controls.some(state => state.isSubmitted);
  const isValidationPending = pendingValidations.length > 0 || controls.some(state => state.isValidationPending);
  return {
    id,
    value,
    errors,
    pendingValidations,
    isValidationPending,
    isValid,
    isInvalid: !isValid,
    isEnabled,
    isDisabled: !isEnabled,
    isDirty,
    isPristine: !isDirty,
    isTouched,
    isUntouched: !isTouched,
    isSubmitted,
    isUnsubmitted: !isSubmitted,
    userDefinedProperties,
    controls: inferredControls,
  };
}

/**
 * This function creates a form array state with an ID and a value.
 * From the value the shape of the array state is inferred, i.e.
 * object values are inferred as form groups, array values
 * are inferred as form arrays, and primitive values are inferred
 * as form controls.
 */
export function createFormArrayState<TValue>(
  id: NgrxFormControlId,
  initialValue: TValue[],
): FormArrayState<TValue> {
  const controls = initialValue
    .map((value, i) => createChildState(`${id}.${i}`, value));

  return computeArrayState(id, controls, initialValue, {}, [], {}, { wasOrShouldBeEnabled: true });
}
