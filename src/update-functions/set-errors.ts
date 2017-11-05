import { SetErrorsAction } from '../actions';
import { AbstractControlState, ValidationErrors } from '../state';
import { abstractControlReducer, ensureState, ProjectFn } from './util';

// export function setErrors<TValue extends FormControlValueTypes>(param: ValidationErrors | ValidationErrors[]): ProjectFn<FormControlState<TValue>>;
// export function setErrors<TValue extends KeyValue>(param: ValidationErrors | ValidationErrors[]): ProjectFn<FormGroupState<TValue>>;
export function setErrors<TValue>(param: ValidationErrors | ValidationErrors[]): ProjectFn<AbstractControlState<TValue>>;
export function setErrors<TValue>(param: ValidationErrors | ValidationErrors[], state: AbstractControlState<TValue>): AbstractControlState<TValue>;
export function setErrors<TValue>(param: ValidationErrors | ValidationErrors[], state?: AbstractControlState<TValue>) {
  if (!!state) {
    param = Array.isArray(param) ? param : [param];
    const errors = (param as ValidationErrors[]).reduce((agg, err) => Object.assign(agg, err), {} as ValidationErrors);

    return abstractControlReducer(state, new SetErrorsAction(state.id, errors));
  }

  return (s: AbstractControlState<TValue>) => setErrors(param, ensureState(s));
}
