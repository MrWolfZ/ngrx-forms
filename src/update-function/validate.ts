import { SetErrorsAction } from '../actions';
import { formStateReducer } from '../reducer';
import { AbstractControlState, FormState, isFormState, ValidationErrors } from '../state';
import { ensureState } from './util';

export type ValidationFn<TValue> = (value: TValue) => ValidationErrors;

/**
 * This update function takes one or more validation functions and a form
 * state and sets the errors of the state to the result of applying the
 * given validation function(s) to the state's value.
 */
export function validate<TValue>(
  state: AbstractControlState<TValue>,
  fn: ValidationFn<TValue>,
  ...rest: ValidationFn<TValue>[]
): FormState<TValue>;

/**
 * This update function takes an array of validation functions and a form
 * state and sets the errors of the state to the result of applying the given
 * validation function(s) to the state's value.
 */
export function validate<TValue>(
  state: AbstractControlState<TValue>,
  rest: ValidationFn<TValue>[],
): FormState<TValue>;

/**
 * This update function takes one or more validation functions and returns
 * a projection function that sets the errors of a form state to the result
 * of applying the given validation function(s) to the state's value.
 */
export function validate<TValue>(
  fn: ValidationFn<TValue>,
  ...rest: ValidationFn<TValue>[]
): (state: AbstractControlState<TValue>) => FormState<TValue>;

/**
 * This update function takes an array of validation functions and returns a
 * projection function that sets the errors of a form state to the result of
 * applying the given validation function(s) to the state's value.
 */
export function validate<TValue>(
  rest: ValidationFn<TValue>[],
): (state: AbstractControlState<TValue>) => FormState<TValue>;

export function validate<TValue>(
  stateOrFunctionOrFunctionArray: FormState<TValue> | ValidationFn<TValue> | ValidationFn<TValue>[],
  functionOrFunctionArr?: ValidationFn<TValue> | ValidationFn<TValue>[],
  ...rest: ValidationFn<TValue>[]
) {
  if (isFormState<TValue>(stateOrFunctionOrFunctionArray)) {
    const functionArr = Array.isArray(functionOrFunctionArr) ? functionOrFunctionArr : [functionOrFunctionArr!];
    const errors = functionArr.concat(...rest)
      .reduce((agg, validationFn) => Object.assign(agg, validationFn(stateOrFunctionOrFunctionArray.value)), {} as ValidationErrors);
    return formStateReducer<TValue>(stateOrFunctionOrFunctionArray, new SetErrorsAction(stateOrFunctionOrFunctionArray.id, errors));
  }

  let updateFnArr = Array.isArray(stateOrFunctionOrFunctionArray) ? stateOrFunctionOrFunctionArray : [stateOrFunctionOrFunctionArray];
  updateFnArr = functionOrFunctionArr === undefined ? updateFnArr : updateFnArr.concat(functionOrFunctionArr);
  return (s: AbstractControlState<TValue>) => validate<TValue>(ensureState(s), updateFnArr.concat(rest));
}
