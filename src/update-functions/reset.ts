import { ResetAction } from '../actions';
import { AbstractControlState } from '../state';
import { abstractControlReducer } from './util';

// export function reset<TValue extends FormControlValueTypes>(state: FormControlState<TValue>): FormControlState<TValue>;
// export function reset<TValue extends KeyValue>(state: FormGroupState<TValue>): FormGroupState<TValue>;

/**
 * Marks a given form control state as pristine, untouched, and unsubmitted.
 * For groups and arrays also marks all children as pristine, untouched, and unsubmitted.
 */
export function reset<TValue>(state: AbstractControlState<TValue>) {
  return abstractControlReducer(state, new ResetAction(state.id));
}
