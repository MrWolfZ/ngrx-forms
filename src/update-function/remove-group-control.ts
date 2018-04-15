import { RemoveGroupControlAction } from '../actions';
import { formGroupReducer } from '../group/reducer';
import { FormGroupState, isGroupState, KeyValue } from '../state';
import { ensureState } from './util';

/**
 * This update function takes a name and returns a projection function
 * that removes the child control with the given name from a form group state.
 */
export function removeGroupControl<TValue extends KeyValue>(name: keyof TValue): (state: FormGroupState<TValue>) => FormGroupState<TValue>;

/**
 * This update function takes a group form state and a name and removes the
 * child control with the given name from the state.
 */
export function removeGroupControl<TValue extends KeyValue>(state: FormGroupState<TValue>, name: keyof TValue): FormGroupState<TValue>;

export function removeGroupControl<TValue extends KeyValue>(nameOrState: keyof TValue | FormGroupState<TValue>, name?: keyof TValue) {
  if (isGroupState(nameOrState)) {
    return formGroupReducer(nameOrState, new RemoveGroupControlAction<TValue>(nameOrState.id, name!));
  }

  return (s: FormGroupState<TValue>) => removeGroupControl(ensureState(s), nameOrState as keyof TValue);
}
