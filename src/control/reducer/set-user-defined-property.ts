import {NgrxFormActionTypes, SetUserDefinedPropertyAction} from '../../actions';
import { FormControlState, FormControlValueTypes } from '../../state';

export function setUserDefinedPropertyReducer<TValue extends FormControlValueTypes>(
  state: FormControlState<TValue>,
  action: NgrxFormActionTypes,
): FormControlState<TValue> {
  if (action.type !== SetUserDefinedPropertyAction.type) {
    return state;
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
