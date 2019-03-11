import { SwapArrayControlAction } from '../actions';
import { formArrayReducer } from '../array/reducer';
import { FormArrayState, isArrayState } from '../state';
import { ensureState } from './util';

/**
 * This update function takes two indices and returns a projection function that swaps the
 * child controls at those indices in a form array state.
 */
export function swapArrayControl(fromIndex: number, toIndex: number): <TValue>(state: FormArrayState<TValue>) => FormArrayState<TValue>;

/**
 * This update function takes a form array state and two indices and swaps the
 * child controls at those indices in the state.
 */
export function swapArrayControl<TValue>(state: FormArrayState<TValue>, fromIndex: number, toIndex: number): FormArrayState<TValue>;

export function swapArrayControl<TValue>(indexOrState: number | FormArrayState<TValue>, fromIndex: number, toIndex?: number) {
  if (isArrayState(indexOrState)) {
    return formArrayReducer(indexOrState, new SwapArrayControlAction(indexOrState.id, fromIndex, toIndex!));
  }

  return (s: FormArrayState<TValue>) => swapArrayControl(ensureState(s), indexOrState as number, fromIndex);
}
