import { DisableAction } from '../actions';
import { AbstractControlState } from '../state';
import { abstractControlReducer } from './util';

// export function disable<TValue extends FormControlValueTypes>(state: FormControlState<TValue>): FormControlState<TValue>;
// export function disable<TValue extends KeyValue>(state: FormGroupState<TValue>): FormGroupState<TValue>;
export function disable<TValue>(state: AbstractControlState<TValue>) {
  return abstractControlReducer(state, new DisableAction(state.id));
}
