import { SetUserDefinedPropertyAction } from '../actions';
import { AbstractControlState } from '../state';
import { abstractControlReducer } from './util';

/**
 * Returns a function that sets the user-defined property `name` to `value` of a given form state.
 */
export function setUserDefinedProperty<TValue>(name: string, value: any) {
  return (state: AbstractControlState<TValue>) => abstractControlReducer(state, new SetUserDefinedPropertyAction(state.id, name, value));
}
