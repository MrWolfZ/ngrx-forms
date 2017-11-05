import { MarkAsUnsubmittedAction } from '../actions';
import { AbstractControlState } from '../state';
import { abstractControlReducer } from './util';

// export function markAsUnsubmitted<TValue extends FormControlValueTypes>(state: FormControlState<TValue>): FormControlState<TValue>;
// export function markAsUnsubmitted<TValue extends KeyValue>(state: FormGroupState<TValue>): FormGroupState<TValue>;
export function markAsUnsubmitted<TValue>(state: AbstractControlState<TValue>) {
  return abstractControlReducer(state, new MarkAsUnsubmittedAction(state.id));
}
