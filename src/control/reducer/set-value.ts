import {NgrxFormActionTypes, SetValueAction} from '../../actions';
import { FormControlState, FormControlValueTypes, verifyFormControlValueIsValid } from '../../state';

export function setValueReducer<TValue extends FormControlValueTypes>(
  state: FormControlState<TValue>,
  action: NgrxFormActionTypes,
): FormControlState<TValue> {
  if (action.type !== SetValueAction.type) {
    return state;
  }

  if (state.value === action.value) {
    return state;
  }

  return {
    ...state,
    value: verifyFormControlValueIsValid(action.value),
  };
}
