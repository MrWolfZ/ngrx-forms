import { MoveArrayControlAction } from '../actions';
import { formArrayReducer } from '../array/reducer';
import { FormArrayState } from '../state';
import { ensureState } from './util';

/**
 * This update function takes a source index, a destination index, and returns a projection function
 * that move the child controls at the source index to the destination index from a form array state.
 */
export function moveArrayControl<TValue>(from: number, to: number): (state: FormArrayState<TValue>) => FormArrayState<TValue>;

/**
 * This update function takes a source index, a destination index, an form array state, and moves the
 * child controls at the source index to the destination index in the form array state.
 */
export function moveArrayControl<TValue>(from: number, to: number, state: FormArrayState<TValue>): FormArrayState<TValue>;

export function moveArrayControl<TValue>(from: number, to: number, state?: FormArrayState<TValue>) {
  if (!!state) {
    return formArrayReducer(state, new MoveArrayControlAction(state.id, from, to));
  }

  return (s: FormArrayState<TValue>) => moveArrayControl(from, to, ensureState(s));
}
