export type FormControlValueTypes = string | number | boolean | null | undefined;
export type NgrxFormControlId = string;

/**
 * This type represents a collection of named errors.
 */
export interface ValidationErrors { [key: string]: any; }
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
  id: string;

  /**
   * The value of the form state.
   */
  value: TValue;

  /**
   * This property is `true` if the state does not have any errors.
   */
  isValid: boolean;

  /**
   * This property is `true` if the state has at least one error.
   */
  isInvalid: boolean;

  /**
   * The errors of the state. This property always has a value.
   * If the state has no errors the property is set to `{}`.
   */
  errors: ValidationErrors;

  /**
   * The names of all asynchronous validations currently running
   * for the state.
   */
  pendingValidations: string[];

  /**
   * This property indicates whether the control is currently being
   * asynchronously validated.
   */
  isValidationPending: boolean;

  /**
   * This property indicates whether the state is enabled. When it
   * is `false` the `errors` are always `{}` (i.e. the state is
   * always valid if disabled) and `pendingValidations` is always `[]`
   * (i.e. all pending validations are cancelled).
   */
  isEnabled: boolean;

  /**
   * This property indicates whether the state is disabled. When it
   * is `true` the `errors` are always `{}` (i.e. the state is
   * always valid if disabled) and `pendingValidations` is always `[]`
   * (i.e. all pending validations are cancelled).
   */
  isDisabled: boolean;

  /**
   * This property is set to `true` as soon as the state's value changes.
   */
  isDirty: boolean;

  /**
   * This property is `true` as long as the state's value never changed.
   */
  isPristine: boolean;

  /**
   * This property is set to `true` as soon as the state is touched.
   */
  isTouched: boolean;

  /**
   * This property is `true` as long as the state is not touched.
   */
  isUntouched: boolean;

  /**
   * This property is set to `true` as soon as the state is submitted.
   */
  isSubmitted: boolean;

  /**
   * This property is `true` as long as the state is not submitted.
   */
  isUnsubmitted: boolean;

  /**
   * This property is a container for user-defined metadata (e.g. if
   * you wanted to count the number of times a state's value has been
   * changed, what keys were pressed on an input, or how often a form
   * has been submitted etc.). While it is possible to store this kind
   * of information outside of `ngrx-forms` in your own state the
   * `userDefinedProperties` allow you to store your own metadata
   * directly in the state.
   */
  userDefinedProperties: KeyValue;
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
  value: TValue;

  /**
   * This property is `true` if the form control does not have any errors.
   */
  isValid: boolean;

  /**
   * This property is `true` if the form control has at least one error.
   */
  isInvalid: boolean;

  /**
   * The errors of the form control. This property always has a value.
   * If the control has no errors the property is set to `{}`.
   */
  errors: ValidationErrors;

  /**
   * The names of all asynchronous validations currently running for the
   * form control.
   */
  pendingValidations: string[];

  /**
   * This property indicates whether the control is currently being
   * asynchronously validated (i.e. this is `true` if and only if
   * `pendingValidations` is not empty).
   */
  isValidationPending: boolean;

  /**
   * This property indicates whether the form control is enabled.
   * When it is `false` the `errors` are always `{}` (i.e. the form
   * control is always valid if disabled) and `pendingValidations`
   * is always `[]` (i.e. all pending validations are cancelled).
   */
  isEnabled: boolean;

  /**
   * This property indicates whether the form control is disabled.
   * When it is `true` the `errors` are always `{}` (i.e. the form
   * control is always valid if disabled) and `pendingValidations`
   * is always `[]` (i.e. all pending validations are cancelled).
   */
  isDisabled: boolean;

  /**
   * This property is set to `true` as soon as the underlying
   * `FormViewAdapter` or `ControlValueAccessor` reports a new
   * value for the first time.
   */
  isDirty: boolean;

  /**
   * This property is `true` as long as the underlying
   * `FormViewAdapter` or `ControlValueAccessor` has never
   * reported a new value.
   */
  isPristine: boolean;

  /**
   * This property is set to `true` based on the rules of the
   * underlying `FormViewAdapter` (usually on `blur` for most form
   * elements).
   */
  isTouched: boolean;

  /**
   * This property is `true` as long as the control is not touched.
   */
  isUntouched: boolean;

  /**
   * This property is set to `true` as soon as the group or array
   * containing this form control is submitted. A form control can
   * never be submitted on its own.
   */
  isSubmitted: boolean;

  /**
   * This property is `true` as long as the state is not submitted.
   */
  isUnsubmitted: boolean;

  /**
   * This property is set to `true` if the form control currently
   * has focus. This feature is opt-in. To enable it you have to
   * enable it for a given form element like this:
   *
   * ```html
   * <input [ngrxFormControlState]="state"
   *       [ngrxEnableFocusTracking]="true" />
   * ```
   */
  isFocused: boolean;

  /**
   * This property is `true` if the control currently does not have
   * focus or focus tracking is not enabled for the form control.
   */
  isUnfocused: boolean;
}

/**
 * This type represents the child control states of a form group.
 */
export type FormGroupControls<TValue> = {[controlId in keyof TValue]: AbstractControlState<TValue[controlId]> };

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
   * ```typescript
   * {
   *   child1: 'some value',
   *   child2: {
   *     nestedChild: 10,
   *   },
   * }
   * ```
   */
  value: TValue;

  /**
   * This property is `true` if the form group does not have any errors
   * itself and none of its children have any errors.
   */
  isValid: boolean;

  /**
   * This property is `true` if the form group or any of its children
   * have at least one error.
   */
  isInvalid: boolean;

  /**
   * The errors of the form group. This property is computed by merging
   * the errors of the group with the errors of all its children where
   * the child errors are a property of the `errors` object prefixed with
   * an underscore, e.g.
   *
   * ```
   * {
   *   groupError: true,
   *   _child: {
   *     childError: true,
   *   },
   * }
   * ```
   *
   * If neither the group nor any children have errors the property is
   * set to `{}`.
   */
  errors: ValidationErrors;

  /**
   * The names of all asynchronous validations currently running for the
   * form group.
   */
  pendingValidations: string[];

  /**
   * This property indicates whether the group or any of its children
   * are currently being asynchronously validated.
   */
  isValidationPending: boolean;

  /**
   * This property indicates whether the form group is enabled. It is
   * `true` if and only if at least one of its child states is
   * enabled. When it is `false` the `errors` are always `{}` (i.e.
   * the form group is always valid if disabled) and `pendingValidations`
   * is always `[]` (i.e. all pending validations are cancelled).
   */
  isEnabled: boolean;

  /**
   * This property indicates whether the form group is disabled. It is
   * `true` if and only if all of its child state are disabled. When
   * it is `true` the `errors` are always `{}` (i.e. the form group
   * is always valid if disabled) and `pendingValidations` is always
   * `[]` (i.e. all pending validations are cancelled).
   */
  isDisabled: boolean;

  /**
   * This property is `true` if and only if at least one of the form
   * group's child states is marked as dirty.
   */
  isDirty: boolean;

  /**
   * This property is `true` if and only if all of the form group's
   * child states are pristine.
   */
  isPristine: boolean;

  /**
   * This property is `true` if and only if at least one of the form
   * group's child states is marked as touched.
   */
  isTouched: boolean;

  /**
   * This property is `true` if and only if all of the form group's
   * child states are untouched.
   */
  isUntouched: boolean;

  /**
   * This property is set to `true` as soon as the form group is
   * submitted. This is tracked by the `NgrxFormDirective`, which
   * needs to be applied to a form like this:
   *
   * ```html
   * <form [ngrxFormState]="groupState">
   * </form>
   * ```
   *
   * Note that applying this directive to a form prevents normal form
   * submission since that does not make much sense for ngrx forms.
   */
  isSubmitted: boolean;

  /**
   * This property is `true` as long as the state is not submitted.
   */
  isUnsubmitted: boolean;

  /**
   * This property contains all child states of the form group. As
   * you may have noticed the type of each child state is
   * `AbstractControlState` which sometimes forces you to cast the
   * state explicitly. It is not possible to improve this typing
   * until [conditional mapped types](https://github.com/Microsoft/TypeScript/issues/12424)
   * are added to TypeScript.
   */
  controls: FormGroupControls<TValue>;
}

/**
 * Form arrays are collections of controls. They are represented as
 * plain state arrays. The state of an array is determined almost
 * fully by its child states.
 */
export interface FormArrayState<TValue> extends AbstractControlState<TValue[]> {
  /**
   * The aggregated value of the form array. The value is computed by
   * aggregating the values of all children into an array.
   */
  value: TValue[];

  /**
   * This property is `true` if the form array does not have any errors
   * itself and none of its children have any errors.
   */
  isValid: boolean;

  /**
   * This property is `true` if the form array or any of its children
   * have at least one error.
   */
  isInvalid: boolean;

  /**
   * The errors of the form array. This property is computed by merging
   * the errors of the array with the errors of all its children where
   * the child errors are a property of the `errors` object prefixed with
   * an underscore, e.g.
   *
   * ```
   * {
   *   arrayError: true,
   *   _0: {
   *     childError: true,
   *   },
   * }
   * ```
   *
   * If neither the array nor any children have errors the property is
   * set to `{}`.
   */
  errors: ValidationErrors;

  /**
   * The names of all asynchronous validations currently running for the
   * form array.
   */
  pendingValidations: string[];

  /**
   * This property indicates whether the array or any of its children
   * are currently being asynchronously validated.
   */
  isValidationPending: boolean;

  /**
   * This property indicates whether the form array is enabled. It is
   * `true` if and only if at least one of its child states is
   * enabled. When it is `false` the `errors` are always `{}` (i.e.
   * the form array is always valid if disabled) and `pendingValidations`
   * is always `[]` (i.e. all pending validations are cancelled).
   */
  isEnabled: boolean;

  /**
   * This property indicates whether the form array is disabled. It is
   * `true` if and only if all of its child states are disabled. When
   * it is `true` the `errors` are always `{}` (i.e. the form array
   * is always valid if disabled) and `pendingValidations` is always
   * `[]` (i.e. all pending validations are cancelled).
   */
  isDisabled: boolean;

  /**
   * This property is `true` if and only if at least one of the form
   * array's child states is marked as dirty.
   */
  isDirty: boolean;

  /**
   * This property is `true` if and only if all of the form array's
   * child states are pristine.
   */
  isPristine: boolean;

  /**
   * This property is `true` if and only if at least one of the form
   * array's child states is marked as touched.
   */
  isTouched: boolean;

  /**
   * This property is `true` if and only if all of the form array's
   * child states are untouched.
   */
  isUntouched: boolean;

  /**
   * This property is set to `true` as soon as the form array is
   * submitted. This is tracked by the `NgrxFormDirective`, which
   * needs to be applied to a form like this:
   *
   * ```html
   * <form [ngrxFormState]="arrayState">
   * </form>
   * ```
   *
   * Note that applying this directive to a form prevents normal form
   * submission since that does not make much sense for ngrx forms.
   */
  isSubmitted: boolean;

  /**
   * This property is `true` as long as the state is not submitted.
   */
  isUnsubmitted: boolean;

  /**
   * This property contains all child states of the form array. As
   * you may have noticed the type of each child state is
   * `AbstractControlState` which sometimes forces you to cast the
   * state explicitly. It is not possible to improve this typing
   * until [conditional mapped types](https://github.com/Microsoft/TypeScript/issues/12424)
   * are added to TypeScript.
   */
  controls: Array<AbstractControlState<TValue>>;
}

/**
 * This function determines if a form state is an array state.
 */
export function isArrayState(state: AbstractControlState<any>): state is FormArrayState<any> {
  return state.hasOwnProperty('controls') && Array.isArray((state as any).controls);
}

/**
 * This function determines if a form state is a group state.
 */
export function isGroupState(state: AbstractControlState<any>): state is FormGroupState<any> {
  return state.hasOwnProperty('controls') && !Array.isArray((state as any).controls);
}

/**
 * This utility function allows the compiler to correctly infer
 * the type of a form state. It can be used in places where a
 * sub-type of `AbstractControlState` is expected.
 */
export function cast<TValue extends FormControlValueTypes>(
  state: AbstractControlState<TValue>,
): FormControlState<TValue>;

/**
 * This utility function allows the compiler to correctly infer
 * the type of a form state. It can be used in places where a
 * sub-type of `AbstractControlState` is expected.
 */
export function cast<TArray extends TValue[], TValue = any>(
  state: AbstractControlState<TArray>,
): FormArrayState<TValue>;

/**
 * This utility function allows the compiler to correctly infer
 * the type of a form state. It can be used in places where a
 * sub-type of `AbstractControlState` is expected.
 */
export function cast<TArray extends TValue[], TValue = any>(
  state: AbstractControlState<TArray | undefined>,
): FormArrayState<TValue> | undefined;

/**
 * This utility function allows the compiler to correctly infer
 * the type of a form state. It can be used in places where a
 * sub-type of `AbstractControlState` is expected.
 */
export function cast<TValue extends KeyValue>(
  state: AbstractControlState<TValue>,
): FormGroupState<TValue>;

/**
 * This utility function allows the compiler to correctly infer
 * the type of a form state. It can be used in places where a
 * sub-type of `AbstractControlState` is expected.
 */
export function cast<TValue extends KeyValue>(
  state: AbstractControlState<TValue | undefined>,
): FormGroupState<TValue> | undefined;

/**
 * This utility function allows the compiler to correctly infer
 * the type of a form state. It can be used in places where a
 * sub-type of `AbstractControlState` is expected.
 */
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

/**
 * This function creates a form control state with an ID and a value.
 */
export function createFormControlState<TValue extends FormControlValueTypes>(
  id: NgrxFormControlId,
  value: TValue,
): FormControlState<TValue> {
  return {
    id,
    value,
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
    .map((key: keyof TValue) => [key, createChildState(`${id}.${key}`, initialValue[key])] as [string, AbstractControlState<any>])
    .reduce((res, [controlId, state]) => Object.assign(res, { [controlId]: state }), {} as FormGroupControls<TValue>);

  return {
    id,
    value: initialValue,
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
    userDefinedProperties: {},
    controls,
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
    .map((value, i) => createChildState(`${id}.${i}`, value) as AbstractControlState<TValue>);

  return {
    id,
    value: initialValue,
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
    userDefinedProperties: {},
    controls,
  };
}
