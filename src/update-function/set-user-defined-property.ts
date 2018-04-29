import { SetUserDefinedPropertyAction } from '../actions';
import { formStateReducer } from '../reducer';
import { AbstractControlState, FormState, isFormState } from '../state';
import { ensureState } from './util';

/**
 * This update function takes a name and a value and returns a projection
 * function that sets a user-defined property on a form state.
 */
export function setUserDefinedProperty(name: string, value: any): <TValue>(state: AbstractControlState<TValue>) => FormState<TValue>;

/**
 * This update function takes a form state, a name, and a value and sets
 * a user-defined property on the state.
 */
export function setUserDefinedProperty<TValue>(state: AbstractControlState<TValue>, name: string, value: any): FormState<TValue>;

export function setUserDefinedProperty<TValue>(nameOrState: string | FormState<TValue>, valueOrName: any | string, value?: any) {
  if (isFormState<TValue>(nameOrState)) {
    return formStateReducer(nameOrState, new SetUserDefinedPropertyAction(nameOrState.id, valueOrName, value));
  }

  return (s: AbstractControlState<TValue>) => setUserDefinedProperty(ensureState(s), nameOrState, valueOrName);
}
