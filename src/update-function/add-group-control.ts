import { AddGroupControlAction } from '../actions';
import { formGroupReducer } from '../group/reducer';
import { FormGroupState, isGroupState, KeyValue } from '../state';
import { ensureState } from './util';

/**
 * This update function takes a name and a value and returns a projection function
 * that adds a child control with the given name and value to a form group state.
 */
export function addGroupControl<TValue extends KeyValue, TControlKey extends keyof TValue = keyof TValue>(
  name: TControlKey,
  value: TValue[TControlKey],
): (state: FormGroupState<TValue>) => FormGroupState<TValue>;

/**
 * This update function takes a form group state, a name, and a value, and adds a child
 * control with the given name and value to the form group state.
 */
export function addGroupControl<TValue extends KeyValue, TControlKey extends keyof TValue = keyof TValue>(
  state: FormGroupState<TValue>,
  name: TControlKey,
  value: TValue[TControlKey],
): FormGroupState<TValue>;

export function addGroupControl<TValue extends KeyValue, TControlKey extends keyof TValue = keyof TValue>(
  nameOrState: TControlKey | FormGroupState<TValue>,
  valueOrName: TValue[TControlKey] | TControlKey,
  value?: TValue[TControlKey],
) {
  if (isGroupState(nameOrState)) {
    return formGroupReducer(nameOrState, new AddGroupControlAction<TValue, TControlKey>(nameOrState.id, valueOrName as TControlKey, value!));
  }

  return (s: FormGroupState<TValue>) => addGroupControl(ensureState(s), nameOrState as TControlKey, valueOrName as TValue[TControlKey]);
}
