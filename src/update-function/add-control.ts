import { AddArrayControlAction, AddControlAction } from '../actions';
import { formArrayReducer } from '../array/reducer';
import { formGroupReducer } from '../group/reducer';
import { FormArrayState, FormGroupState, isArrayState, isGroupState, KeyValue } from '../state';
import { ProjectFn } from './util';

/**
 * Returns a function that adds a child control at the given index or the end of a form array.
 */
export function addControl<TValue>(value: TValue, index?: number | null): ProjectFn<FormArrayState<TValue>>;

/**
 * Returns a function that adds a child control with the given name and value to a form group.
 */
export function addControl<TValue extends KeyValue, TControlKey extends keyof TValue>(
  name: keyof TValue,
  value: TValue[TControlKey],
): ProjectFn<FormGroupState<TValue>>;

export function addControl<TValue extends KeyValue, TControlKey extends keyof TValue>(
  name: keyof TValue | TValue,
  value: TValue[TControlKey] | number | null = null,
): ProjectFn<FormArrayState<TValue>> | ProjectFn<FormGroupState<TValue>> {
  return (state: FormGroupState<TValue> | FormArrayState<TValue>) => {
    if (isArrayState(state)) {
      return formArrayReducer(state, new AddArrayControlAction(state.id, name, value as number));
    }

    if (isGroupState(state)) {
      return formGroupReducer(state, new AddControlAction<TValue, TControlKey>(state.id, name as keyof TValue, value));
    }

    return state as any;
  };
}
