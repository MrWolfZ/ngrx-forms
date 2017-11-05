import { MarkAsUntouchedAction } from '../actions';
import { AbstractControlState } from '../state';
import { abstractControlReducer } from './util';

// export function markAsUntouched<TValue extends FormControlValueTypes>(state: FormControlState<TValue>): FormControlState<TValue>;
// export function markAsUntouched<TValue extends KeyValue>(state: FormGroupState<TValue>): FormGroupState<TValue>;
export function markAsUntouched<TValue>(state: AbstractControlState<TValue>) {
  return abstractControlReducer(state, new MarkAsUntouchedAction(state.id));
}
