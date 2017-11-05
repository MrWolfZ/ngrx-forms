import { SetValueAction } from '../actions';
import { AbstractControlState } from '../state';
import { abstractControlReducer, ensureState, ProjectFn } from './util';

// export function setValue<TValue extends FormControlValueTypes>(value: TValue): ProjectFn<FormControlState<TValue>>;
// export function setValue<TValue extends KeyValue>(value: TValue): ProjectFn<FormGroupState<TValue>>;
export function setValue<TValue>(value: TValue): ProjectFn<AbstractControlState<TValue>>;
export function setValue<TValue>(value: TValue, state: AbstractControlState<TValue>): AbstractControlState<TValue>;
export function setValue<TValue>(value: TValue, state?: AbstractControlState<TValue>) {
  if (!!state) {
    return abstractControlReducer(state, new SetValueAction(state.id, value));
  }

  return (s: AbstractControlState<TValue>) => setValue(value, ensureState(s));
}
