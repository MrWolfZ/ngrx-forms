import { Actions, SetUserDefinedPropertyAction } from '../../actions';
import { FormControlState, FormControlValueTypes } from '../../state';

export function setUserDefinedPropertyReducer<TValue extends FormControlValueTypes>(
  state: FormControlState<TValue>,
  action: Actions<TValue>,
): FormControlState<TValue> {
  if (action.type !== SetUserDefinedPropertyAction.TYPE) {
    return state;
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
