import { RemoveArrayControlAction } from '../actions';
import { formArrayReducer } from '../array/reducer';
import { FormArrayState, isArrayState } from '../state';
import { ensureState } from './util';

/**
 * This update function takes an index and returns a projection function
 * that removes the child control at the given index from a form array state.
 */
export function removeArrayControl(index: number): <TValue>(state: FormArrayState<TValue>) => FormArrayState<TValue>;

/**
 * This update function takes an array form state and an index and removes the
 * child control at the given index from the state.
 */
export function removeArrayControl<TValue>(state: FormArrayState<TValue>, index: number): FormArrayState<TValue>;

export function removeArrayControl<TValue>(indexOrState: number | FormArrayState<TValue>, index?: number) {
  if (isArrayState(indexOrState)) {
    return formArrayReducer(indexOrState, new RemoveArrayControlAction(indexOrState.id, index!));
  }

  return (s: FormArrayState<TValue>) => removeArrayControl(ensureState(s), indexOrState as number);
}
