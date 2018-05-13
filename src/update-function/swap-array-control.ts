import { SwapArrayControlAction } from '../actions';
import { formArrayReducer } from '../array/reducer';
import { FormArrayState } from '../state';
import { ensureState } from './util';

/**
 * This update function takes an index and returns a projection function
 * that swaps the child controls at the source and destination indices in a form array state.
 */
export function swapArrayControl<TValue>(from: number, to: number): (state: FormArrayState<TValue>) => FormArrayState<TValue>;

/**
 * This update function takes a source index, a destination index, an form array state, and swap the
 * child controls at the source and destination indices in the form array state.
 */
export function swapArrayControl<TValue>(from: number, to: number, state: FormArrayState<TValue>): FormArrayState<TValue>;

export function swapArrayControl<TValue>(from: number, to: number, state?: FormArrayState<TValue>) {
  if (!!state) {
    return formArrayReducer(state, new SwapArrayControlAction(state.id, from, to));
  }

  return (s: FormArrayState<TValue>) => swapArrayControl(from, to, ensureState(s));
}
