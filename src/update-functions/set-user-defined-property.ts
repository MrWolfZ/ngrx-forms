import { SetUserDefinedPropertyAction } from '../actions';
import { AbstractControlState } from '../state';
import { abstractControlReducer } from './util';

export function setUserDefinedProperty<TValue>(name: string, value: any) {
  return (state: AbstractControlState<TValue>) => abstractControlReducer(state, new SetUserDefinedPropertyAction(state.id, name, value));
}
