import { EnableAction } from '../actions';
import { AbstractControlState } from '../state';
import { abstractControlReducer } from './util';

// export function enable<TValue extends FormControlValueTypes>(state: FormControlState<TValue>): FormControlState<TValue>;
// export function enable<TValue extends KeyValue>(state: FormGroupState<TValue>): FormGroupState<TValue>;

/*
 * Enables a given form state. For groups and arrays also enables all children.
 */
export function enable<TValue>(state: AbstractControlState<TValue>) {
  return abstractControlReducer(state, new EnableAction(state.id));
}
