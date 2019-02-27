import { SwapArrayControlAction } from '../actions';
import { formArrayReducer } from '../array/reducer';
import { FormArrayState, isArrayState } from '../state';
import { ensureState } from './util';

/**
 * This update function takes a source index, a destination index and returns a projection function
 * that swaps the child controls at the source and destination indices in a form array state.
 */
export function swapArrayControl(fromIndex: number, toIndex: number): <TValue>(state: FormArrayState<TValue>) => FormArrayState<TValue>;

/**
 * This update function takes a form array state, a source index, a destination index and swaps the
 * child controls at the source and destination indices in a form array state.
 */
export function swapArrayControl<TValue>(state: FormArrayState<TValue>, fromIndex: number, toIndex: number): FormArrayState<TValue>;

export function swapArrayControl<TValue>(indexOrState: number | FormArrayState<TValue>, fromIndex: number, toIndex?: number) {
  if (isArrayState(indexOrState)) {
    return formArrayReducer(indexOrState, new SwapArrayControlAction(indexOrState.id, fromIndex, toIndex!));
  }

  return (s: FormArrayState<TValue>) => swapArrayControl(ensureState(s), indexOrState as number, fromIndex);
}
