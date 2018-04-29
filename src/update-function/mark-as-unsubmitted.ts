import { MarkAsUnsubmittedAction } from '../actions';
import { AbstractControlState, FormArrayState, FormControlState, FormControlValueTypes, FormGroupState, FormState } from '../state';
import { abstractControlReducer } from './util';

/**
 * This update function takes a form control state and marks it as unsubmitted.
 */
export function markAsUnsubmitted<TValue extends FormControlValueTypes>(state: FormControlState<TValue>): FormControlState<TValue>;

/**
 * This update function takes a form array state and marks it and all of its children as unsubmitted.
 */
export function markAsUnsubmitted<TValue>(state: FormArrayState<TValue>): FormArrayState<TValue>;

/**
 * This update function takes a form group state and marks it and all of its children as unsubmitted.
 */
export function markAsUnsubmitted<TValue>(state: FormGroupState<TValue>): FormGroupState<TValue>;

/**
 * This update function takes a state and marks it as unsubmitted. For groups and arrays this also marks
 * all children as unsubmitted.
 */
export function markAsUnsubmitted<TValue>(state: AbstractControlState<TValue>): FormState<TValue>;

export function markAsUnsubmitted<TValue>(state: AbstractControlState<TValue>) {
  return abstractControlReducer(state, new MarkAsUnsubmittedAction(state.id));
}
