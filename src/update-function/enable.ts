import { EnableAction } from '../actions';
import { AbstractControlState, FormArrayState, FormControlState, FormControlValueTypes, FormGroupState, FormState } from '../state';
import { abstractControlReducer } from './util';

/**
 * This update function takes a form control state and enables it.
 */
export function enable<TValue extends FormControlValueTypes>(state: FormControlState<TValue>): FormControlState<TValue>;

/**
 * This update function takes a form array state and enables it and all of its children.
 */
export function enable<TValue>(state: FormArrayState<TValue>): FormArrayState<TValue>;

/**
 * This update function takes a form group state and enables it and all of its children.
 */
export function enable<TValue>(state: FormGroupState<TValue>): FormGroupState<TValue>;

/**
 * This update function takes a form state and enables it. For groups and arrays also
 * enables all children.
 */
export function enable<TValue>(state: AbstractControlState<TValue>): FormState<TValue>;

export function enable<TValue>(state: AbstractControlState<TValue>) {
  return abstractControlReducer(state, new EnableAction(state.id));
}
