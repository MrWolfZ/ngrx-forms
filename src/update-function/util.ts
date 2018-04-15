import { Action } from '@ngrx/store';

import { formArrayReducer } from '../array/reducer';
import { formControlReducer } from '../control/reducer';
import { formGroupReducer } from '../group/reducer';
import { AbstractControlState, isArrayState, isGroupState } from '../state';

export type ProjectFn<T> = (t: T) => T;
export type ProjectFn2<T, K> = (t: T, k: K) => T;

export function abstractControlReducer<TValue>(state: AbstractControlState<TValue>, action: Action): AbstractControlState<TValue> {
  if (isArrayState(state)) {
    return formArrayReducer(state, action as any) as any;
  }

  if (isGroupState(state)) {
    return formGroupReducer(state, action);
  }

  return formControlReducer(state as any, action) as any;
}

export function compose<T>(...fns: ((t: T) => T)[]) {
  return (t: T) => fns.reduce((res, f) => f(res), t);
}

export function ensureState<TState>(state: TState | undefined): TState {
  if (!state) {
    throw new Error('state must not be undefined!');
  }

  return state;
}
