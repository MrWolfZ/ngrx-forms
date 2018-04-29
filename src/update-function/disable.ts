import { DisableAction } from '../actions';
import { AbstractControlState, FormArrayState, FormControlState, FormControlValueTypes, FormGroupState, FormState } from '../state';
import { abstractControlReducer } from './util';

/**
 * This update function takes a form control state and disables it. Disabling a control
 * will clear all of its errors (i.e. making it always valid) and will remove all
 * pending validations (thereby effectively cancelling those validations).
 */
export function disable<TValue extends FormControlValueTypes>(state: FormControlState<TValue>): FormControlState<TValue>;

/**
 * This update function takes a form array state and disables it and all of its children.
 * Disabling a control will clear all of its errors (i.e. making it always valid) and
 * will remove all pending validations (thereby effectively cancelling those validations).
 */
export function disable<TValue>(state: FormArrayState<TValue>): FormArrayState<TValue>;

/**
 * This update function takes a form group state and disables it and all of its children.
 * Disabling a control will clear all of its errors (i.e. making it always valid) and
 * will remove all pending validations (thereby effectively cancelling those validations).
 */
export function disable<TValue>(state: FormGroupState<TValue>): FormGroupState<TValue>;

/**
 * This update function takes a form state and disables it. For groups and arrays also
 * disables all children. Disabling a control will clear all of its errors (i.e. making
 * it always valid) and will remove all pending validations (thereby effectively
 * cancelling those validations).
 */
export function disable<TValue>(state: AbstractControlState<TValue>): FormState<TValue>;

export function disable<TValue>(state: AbstractControlState<TValue>) {
  return abstractControlReducer(state, new DisableAction(state.id));
}
