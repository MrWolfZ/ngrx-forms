import { AddArrayControlAction } from '../actions';
import { formArrayReducer } from '../array/reducer';
import { FormArrayState, isArrayState } from '../state';
import { ensureState } from './util';

/**
 * This update function takes a value and optionally an index and returns a projection function
 * that adds a child control at the given index or at the end of a form array state.
 */
export function addArrayControl<TValue>(value: TValue, index?: number | null): (state: FormArrayState<TValue>) => FormArrayState<TValue>;

/**
 * This update function takes a value, an array form state and optionally an index and adds a
 * child control at the given index or at the end of the state.
 */
export function addArrayControl<TValue>(value: TValue, state: FormArrayState<TValue>, index?: number | null): FormArrayState<TValue>;

export function addArrayControl<TValue>(value: TValue, indexOrState: number | null | FormArrayState<TValue> = null, index: number | null = null) {
  if (indexOrState !== null && isArrayState(indexOrState as any)) {
    return formArrayReducer(indexOrState as any, new AddArrayControlAction((indexOrState as any).id, value, index));
  }

  return (s: FormArrayState<TValue>) => addArrayControl(value, ensureState(s), indexOrState as number | null);
}
