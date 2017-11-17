import { AddControlAction } from '../actions';
import { formGroupReducer } from '../group/reducer';
import { FormGroupState, KeyValue } from '../state';
import { ensureState } from './util';

/**
 * This update function takes a name and a value and returns a projection function
 * that adds a child control with the given name and value to a form group state.
 */
export function addGroupControl<TValue extends KeyValue, TControlKey extends keyof TValue = string>(
  name: keyof TValue,
  value: TValue[TControlKey],
): (state: FormGroupState<TValue>) => FormGroupState<TValue>;

/**
 * This update function takes a name, a value, and a form group state and adds a child
 * control with the given name and value to the form group state.
 */
export function addGroupControl<TValue extends KeyValue, TControlKey extends keyof TValue = string>(
  name: keyof TValue,
  value: TValue[TControlKey],
  state: FormGroupState<TValue>,
): FormGroupState<TValue>;

export function addGroupControl<TValue extends KeyValue, TControlKey extends keyof TValue = string>(
  name: keyof TValue,
  value: TValue[TControlKey],
  state?: FormGroupState<TValue>,
) {
  if (!!state) {
    return formGroupReducer(state, new AddControlAction<TValue, TControlKey>(state.id, name, value));
  }

  return (s: FormGroupState<TValue>) => addGroupControl(name, value, ensureState(s));
}
