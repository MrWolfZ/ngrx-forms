import { SetErrorsAction } from '../actions';
import {
  AbstractControlState,
  FormArrayState,
  FormControlState,
  FormControlValueTypes,
  FormGroupState,
  ValidationErrors,
} from '../state';
import { abstractControlReducer, ensureState } from './util';

/**
 * This update function takes an error object or an array of error objects and returns
 * a projection function that sets the errors of a form state.
 */
export function setErrors<TValue>(param: ValidationErrors | ValidationErrors[]): (state: AbstractControlState<TValue>) => AbstractControlState<TValue>;

/**
 * This update function takes an error object or an array of error objects and a form
 * state and sets the errors of the state.
 */
export function setErrors<TValue extends FormControlValueTypes>(
  param: ValidationErrors | ValidationErrors[],
  state: FormControlState<TValue>,
): FormControlState<TValue>;

/**
 * This update function takes an error object or an array of error objects and a form
 * array state and sets the errors of the state.
 */
export function setErrors<TValue>(param: ValidationErrors | ValidationErrors[], state: FormArrayState<TValue>): FormArrayState<TValue>;

/**
 * This update function takes an error object or an array of error objects and a form
 * group state and sets the errors of the state.
 */
export function setErrors<TValue>(param: ValidationErrors | ValidationErrors[], state: FormGroupState<TValue>): FormGroupState<TValue>;

/**
 * This update function takes an error object or an array of error objects and a form
 * state and sets the errors of the state.
 */
export function setErrors<TValue>(param: ValidationErrors | ValidationErrors[], state: AbstractControlState<TValue>): AbstractControlState<TValue>;

export function setErrors<TValue>(param: ValidationErrors | ValidationErrors[], state?: AbstractControlState<TValue>) {
  if (!!state) {
    param = Array.isArray(param) ? param : [param];
    const errors = (param as ValidationErrors[]).reduce((agg, err) => Object.assign(agg, err), {} as ValidationErrors);

    return abstractControlReducer(state, new SetErrorsAction(state.id, errors));
  }

  return (s: AbstractControlState<TValue>) => setErrors(param, ensureState(s));
}
