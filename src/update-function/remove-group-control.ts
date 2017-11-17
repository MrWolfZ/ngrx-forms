import { RemoveGroupControlAction } from '../actions';
import { formGroupReducer } from '../group/reducer';
import { FormGroupState, KeyValue } from '../state';
import { ensureState } from './util';

/**
 * This update function takes a name and returns a projection function
 * that removes the child control with the given name from a form group state.
 */
export function removeGroupControl<TValue extends KeyValue>(name: keyof TValue): (state: FormGroupState<TValue>) => FormGroupState<TValue>;

/**
 * This update function takes a name and a group form state and removes the
 * child control with the given name from the state.
 */
export function removeGroupControl<TValue extends KeyValue>(name: keyof TValue, state: FormGroupState<TValue>): FormGroupState<TValue>;

export function removeGroupControl<TValue extends KeyValue>(name: keyof TValue, state?: FormGroupState<TValue>) {
  if (!!state) {
    return formGroupReducer(state, new RemoveGroupControlAction<TValue>(state.id, name));
  }

  return (s: FormGroupState<TValue>) => removeGroupControl(name, ensureState(s));
}
