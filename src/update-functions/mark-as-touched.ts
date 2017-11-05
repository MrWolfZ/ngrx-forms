import { MarkAsTouchedAction } from '../actions';
import { AbstractControlState } from '../state';
import { abstractControlReducer } from './util';

// export function markAsTouched<TValue extends FormControlValueTypes>(state: FormControlState<TValue>): FormControlState<TValue>;
// export function markAsTouched<TValue extends KeyValue>(state: FormGroupState<TValue>): FormGroupState<TValue>;
export function markAsTouched<TValue>(state: AbstractControlState<TValue>) {
  return abstractControlReducer(state, new MarkAsTouchedAction(state.id));
}
