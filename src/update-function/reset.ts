import { ResetAction } from '../actions';
import { AbstractControlState, FormArrayState, FormControlState, FormControlValueTypes, FormGroupState, FormState } from '../state';
import { abstractControlReducer } from './util';

/**
 * This update function takes a form control state and marks it as pristine,
 * untouched, and unsubmitted.
 */
export function reset<TValue extends FormControlValueTypes>(state: FormControlState<TValue>): FormControlState<TValue>;

/**
 * This update function takes a form array state and marks it and all of its
 * children as pristine, untouched, and unsubmitted.
 */
export function reset<TValue>(state: FormArrayState<TValue>): FormArrayState<TValue>;

/**
 * This update function takes a form group state and marks it and all of its
 * children as pristine, untouched, and unsubmitted.
 */
export function reset<TValue>(state: FormGroupState<TValue>): FormGroupState<TValue>;

/**
 * This update function takes a state and marks it as pristine, untouched, and
 * unsubmitted. For groups and arrays this also marks all children as pristine,
 * untouched, and unsubmitted.
 */
export function reset<TValue>(state: AbstractControlState<TValue>): FormState<TValue>;

export function reset<TValue>(state: AbstractControlState<TValue>) {
  return abstractControlReducer(state, new ResetAction(state.id));
}
