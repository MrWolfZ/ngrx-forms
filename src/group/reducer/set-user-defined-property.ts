import {NgrxFormActionTypes, SetUserDefinedPropertyAction} from '../../actions';
import { FormGroupState, KeyValue } from '../../state';
import { childReducer } from './util';

export function setUserDefinedPropertyReducer<TValue extends KeyValue>(
  state: FormGroupState<TValue>,
  action: NgrxFormActionTypes,
): FormGroupState<TValue> {
  if (action.type !== SetUserDefinedPropertyAction.type) {
    return state;
  }

  if (action.controlId !== state.id) {
    return childReducer(state, action);
  }

  if (state.userDefinedProperties[action.name] === action.value) {
    return state;
  }

  return {
    ...state,
    userDefinedProperties: {
      ...state.userDefinedProperties,
      [action.name]: action.value,
    },
  };
}
