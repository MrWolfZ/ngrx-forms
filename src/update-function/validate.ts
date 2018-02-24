import { SetErrorsAction } from '../actions';
import {
  FormArrayState,
  FormControlState,
  FormControlValueTypes,
  FormGroupState,
  InferredControlState,
  ValidationErrors,
} from '../state';
import { abstractControlReducer, ensureState, ProjectFn } from './util';

export type ValidationFn<TValue> = (value: TValue) => ValidationErrors;
export type ValidateParam<TValue> = ValidationFn<TValue> | Array<ValidationFn<TValue>>;

/**
 * This update function takes a validation function or an array of validation
 * functions and returns a projection function that sets the errors of a form
 * state to the result of applying the given validation function(s) to the
 * state's value.
 */
export function validate<TValue>(param: ValidateParam<TValue>): ProjectFn<InferredControlState<TValue>>;

/**
 * This update function takes a validation function or an array of validation
 * functions and a form control state and sets the errors of the state to the
 * result of applying the given validation function(s) to the state's value.
 */
export function validate<TValue extends FormControlValueTypes>(param: ValidateParam<TValue>, state: FormControlState<TValue>): FormControlState<TValue>;

/**
 * This update function takes a validation function or an array of validation
 * functions and a form array state and sets the errors of the state to the
 * result of applying the given validation function(s) to the state's value.
 */
export function validate<TValue>(param: ValidateParam<TValue>, state: FormArrayState<TValue>): FormArrayState<TValue>;

/**
 * This update function takes a validation function or an array of validation
 * functions and a form group state and sets the errors of the state to the
 * result of applying the given validation function(s) to the state's value.
 */
export function validate<TValue>(param: ValidateParam<TValue>, state: FormGroupState<TValue>): FormGroupState<TValue>;

/**
 * This update function takes a validation function or an array of validation
 * functions and a form state and sets the errors of the state to the result
 * of applying the given validation function(s) to the state's value.
 */
export function validate<TValue>(param: ValidateParam<TValue>, state: InferredControlState<TValue>): InferredControlState<TValue>;

export function validate<TValue>(param: ValidateParam<TValue>, state?: InferredControlState<TValue>) {
  if (!!state) {
    param = Array.isArray(param) ? param : [param];
    const errors = param.reduce((agg, validationFn) => Object.assign(agg, validationFn(state.value as TValue)), {} as ValidationErrors);

    return abstractControlReducer(state, new SetErrorsAction(state.id, errors));
  }

  return (s: InferredControlState<TValue>) => validate(param, ensureState(s));
}
