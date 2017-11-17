import { SetUserDefinedPropertyAction } from '../actions';
import { AbstractControlState, FormArrayState, FormControlState, FormControlValueTypes, FormGroupState } from '../state';
import { abstractControlReducer, ensureState } from './util';

/**
 * This update function takes a name and a value and returns
 * a projection function that sets a user-defined property on
 * a form state.
 */
export function setUserDefinedProperty<TValue>(name: string, value: any): (state: AbstractControlState<TValue>) => AbstractControlState<TValue>;

/**
 * This update function takes a name, a value, and a form
 * state and sets a user-defined property on the state.
 */
export function setUserDefinedProperty<TValue extends FormControlValueTypes>(
  name: string, value: any,
  state: FormControlState<TValue>,
): FormControlState<TValue>;

/**
 * This update function takes a name, a value, and a form
 * array state and sets a user-defined property on the state.
 */
export function setUserDefinedProperty<TValue>(name: string, value: any, state: FormArrayState<TValue>): FormArrayState<TValue>;

/**
 * This update function takes a name, a value, and a form
 * group state and sets a user-defined property on the state.
 */
export function setUserDefinedProperty<TValue>(name: string, value: any, state: FormGroupState<TValue>): FormGroupState<TValue>;

/**
 * This update function takes a name, a value, and a form
 * state and sets a user-defined property on the state.
 */
export function setUserDefinedProperty<TValue>(name: string, value: any, state: AbstractControlState<TValue>): AbstractControlState<TValue>;

export function setUserDefinedProperty<TValue>(name: string, value: any, state?: AbstractControlState<TValue>) {
  if (!!state) {
    return abstractControlReducer(state, new SetUserDefinedPropertyAction(state.id, name, value));
  }

  return (s: AbstractControlState<TValue>) => setUserDefinedProperty(name, value, ensureState(s));
}
