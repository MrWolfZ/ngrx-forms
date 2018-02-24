import { MarkAsSubmittedAction } from '../actions';
import { AbstractControlState, FormArrayState, FormControlState, FormControlValueTypes, FormGroupState } from '../state';
import { abstractControlReducer } from './util';

/**
 * This update function takes a form control state and marks it as submitted.
 */
export function markAsSubmitted<TValue extends FormControlValueTypes>(state: FormControlState<TValue>): FormControlState<TValue>;

/**
 * This update function takes a form array state and marks it and all of its children as submitted.
 */
export function markAsSubmitted<TValue>(state: FormArrayState<TValue>): FormArrayState<TValue>;

/**
 * This update function takes a form group state and marks it and all of its children as submitted.
 */
export function markAsSubmitted<TValue>(state: FormGroupState<TValue>): FormGroupState<TValue>;

export function markAsSubmitted<TValue>(state: AbstractControlState<TValue>) {
  return abstractControlReducer(state, new MarkAsSubmittedAction(state.id));
}
