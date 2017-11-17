import { RemoveArrayControlAction } from '../actions';
import { formArrayReducer } from '../array/reducer';
import { FormArrayState } from '../state';
import { ensureState } from './util';

/**
 * This update function takes an index and returns a projection function
 * that removes the child control at the given index from a form array state.
 */
export function removeArrayControl<TValue>(index: number): (state: FormArrayState<TValue>) => FormArrayState<TValue>;

/**
 * This update function takes an index and an array form state and removes the
 * child control at the given index from the state.
 */
export function removeArrayControl<TValue>(index: number, state: FormArrayState<TValue>): FormArrayState<TValue>;

export function removeArrayControl<TValue>(index: number, state?: FormArrayState<TValue>) {
  if (!!state) {
    return formArrayReducer(state, new RemoveArrayControlAction(state.id, index));
  }

  return (s: FormArrayState<TValue>) => removeArrayControl(index, ensureState(s));
}
