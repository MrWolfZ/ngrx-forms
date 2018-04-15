import { AddArrayControlAction } from '../actions';
import { formArrayReducer } from '../array/reducer';
import { FormArrayState, isArrayState } from '../state';
import { ensureState } from './util';

/**
 * This update function takes a value and optionally an index and returns a projection function
 * that adds a child control at the given index or at the end of a form array state.
 */
export function addArrayControl<TValue>(value: TValue, index?: number): (state: FormArrayState<TValue>) => FormArrayState<TValue>;

/**
 * This update function takes an array form state, a value, and optionally an index and adds a
 * child control at the given index or at the end of the state.
 */
export function addArrayControl<TValue>(state: FormArrayState<TValue>, value: TValue, index?: number): FormArrayState<TValue>;

export function addArrayControl<TValue>(valueOrState: TValue | FormArrayState<TValue>, indexOrValue: number | TValue | undefined, index?: number) {
  if (isArrayState(valueOrState)) {
    return formArrayReducer(valueOrState, new AddArrayControlAction(valueOrState.id, indexOrValue as TValue, index));
  }

  return (s: FormArrayState<TValue>) => addArrayControl(ensureState(s), valueOrState as TValue, indexOrValue as number);
}
