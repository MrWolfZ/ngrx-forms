import { MarkAsSubmittedAction } from '../actions';
import { AbstractControlState } from '../state';
import { abstractControlReducer } from './util';

// export function markAsSubmitted<TValue extends FormControlValueTypes>(state: FormControlState<TValue>): FormControlState<TValue>;
// export function markAsSubmitted<TValue extends KeyValue>(state: FormGroupState<TValue>): FormGroupState<TValue>;

/*
 * Marks a given form control state as submitted. For groups and arrays also marks all children as submitted.
 */
export function markAsSubmitted<TValue>(state: AbstractControlState<TValue>) {
  return abstractControlReducer(state, new MarkAsSubmittedAction(state.id));
}
