import { Actions, SetUserDefinedPropertyAction } from '../../actions';
import { FormGroupState, KeyValue } from '../../state';
import { childReducer } from './util';

export function setUserDefinedPropertyReducer<TValue extends KeyValue>(
  state: FormGroupState<TValue>,
  action: Actions<TValue>,
): FormGroupState<TValue> {
  if (action.type !== SetUserDefinedPropertyAction.TYPE) {
    return state;
  }

  if (action.controlId !== state.id) {
    return childReducer(state, action);
  }

  if (state.userDefinedProperties[action.payload.name] === action.payload.value) {
    return state;
  }

  return {
    ...state,
    userDefinedProperties: {
      ...state.userDefinedProperties,
      [action.payload.name]: action.payload.value,
    },
  };
}
