import { MoveArrayControlAction } from '../actions';
import { formArrayReducer } from '../array/reducer';
import { FormArrayState, isArrayState } from '../state';
import { ensureState } from './util';

/**
 * This update function takes a source index, a destination index, and returns a projection function
 * that moves the child control at the source index to the destination index from a form array state.
 */
export function moveArrayControl(fromIndex: number, toIndex: number): <TValue>(state: FormArrayState<TValue>) => FormArrayState<TValue>;

/**
 * This update function takes a form array state, a source index, a destination index and moves the
 * child control at the source index to the destination index in the form array state.
 */
export function moveArrayControl<TValue>(state: FormArrayState<TValue>, fromIndex: number, toIndex: number): FormArrayState<TValue>;

export function moveArrayControl<TValue>(indexOrState: number | FormArrayState<TValue>, fromIndex: number, toIndex?: number) {
  if (isArrayState(indexOrState)) {
    return formArrayReducer(indexOrState, new MoveArrayControlAction(indexOrState.id, fromIndex, toIndex!));
  }

  return (s: FormArrayState<TValue>) => moveArrayControl(ensureState(s), indexOrState as number, fromIndex);
}
