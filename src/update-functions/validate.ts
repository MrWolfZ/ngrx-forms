import { SetErrorsAction } from '../actions';
import { AbstractControlState, ValidationErrors } from '../state';
import { abstractControlReducer, ensureState, ProjectFn } from './util';

export type ValidationFn<TValue> = (value: TValue) => ValidationErrors;
export type ValidateParam<TValue> = ValidationFn<TValue> | Array<ValidationFn<TValue>>;

// export function validate<TValue extends FormControlValueTypes>(param: ValidateParam<TValue>): ProjectFn<FormControlState<TValue>>;
// export function validate<TValue extends KeyValue>(param: ValidateParam<TValue>): ProjectFn<FormGroupState<TValue>>;
export function validate<TValue>(param: ValidateParam<TValue>): ProjectFn<AbstractControlState<TValue>>;
export function validate<TValue>(param: ValidateParam<TValue>, state: AbstractControlState<TValue>): AbstractControlState<TValue>;
export function validate<TValue>(param: ValidateParam<TValue>, state?: AbstractControlState<TValue>) {
  if (!!state) {
    param = Array.isArray(param) ? param : [param];
    const errors = param.reduce((agg, validationFn) => Object.assign(agg, validationFn(state.value)), {} as ValidationErrors);

    return abstractControlReducer(state, new SetErrorsAction(state.id, errors));
  }

  return (s: AbstractControlState<TValue>) => validate(param, ensureState(s));
}
