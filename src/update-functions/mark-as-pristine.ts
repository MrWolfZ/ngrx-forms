import { MarkAsPristineAction } from '../actions';
import { AbstractControlState } from '../state';
import { abstractControlReducer } from './util';

// export function markAsPristine<TValue extends FormControlValueTypes>(state: FormControlState<TValue>): FormControlState<TValue>;
// export function markAsPristine<TValue extends KeyValue>(state: FormGroupState<TValue>): FormGroupState<TValue>;
export function markAsPristine<TValue>(state: AbstractControlState<TValue>) {
  return abstractControlReducer(state, new MarkAsPristineAction(state.id));
}
