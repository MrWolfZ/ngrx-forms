import { isGroupState } from '../..';
import { RemoveArrayControlAction, RemoveControlAction } from '../actions';
import { formArrayReducer } from '../array/reducer';
import { formGroupReducer } from '../group/reducer';
import { FormArrayState, FormGroupState, KeyValue, isArrayState } from '../state';
import { ProjectFn } from './util';

/**
 * Returns a function that removes a child control at the given index from a form array.
 */
export function removeControl<TValue>(index: number): ProjectFn<FormArrayState<TValue>>;

/**
 * Returns a function that removes a child control with the given name from a form group.
 */
export function removeControl<TValue extends KeyValue>(name: keyof TValue): ProjectFn<FormGroupState<TValue>>;

export function removeControl<TValue>(name: keyof TValue | number): ProjectFn<FormArrayState<TValue>> | ProjectFn<FormGroupState<TValue>> {
  return (state: FormGroupState<TValue> | FormArrayState<TValue>) => {
    if (isArrayState(state)) {
      return formArrayReducer(state, new RemoveArrayControlAction(state.id, name as number));
    }

    if (isGroupState(state)) {
      return formGroupReducer(state, new RemoveControlAction<TValue>(state.id, name as keyof TValue));
    }

    return state as any;
  };
}
