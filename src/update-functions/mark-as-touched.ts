import { MarkAsTouchedAction } from '../actions';
import { AbstractControlState } from '../state';
import { abstractControlReducer } from './util';

// export function markAsTouched<TValue extends FormControlValueTypes>(state: FormControlState<TValue>): FormControlState<TValue>;
// export function markAsTouched<TValue extends KeyValue>(state: FormGroupState<TValue>): FormGroupState<TValue>;

/*
 * Marks a given form control state as touched. For groups and arrays also marks all children as touched.
 */
export function markAsTouched<TValue>(state: AbstractControlState<TValue>) {
  return abstractControlReducer(state, new MarkAsTouchedAction(state.id));
}
