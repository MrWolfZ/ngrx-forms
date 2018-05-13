import { Actions, SetValueAction } from '../../actions';
import { FormControlState, FormControlValueTypes, verifyFormControlValueIsValid } from '../../state';

export function setValueReducer<TValue extends FormControlValueTypes>(
  state: FormControlState<TValue>,
  action: Actions<TValue>,
): FormControlState<TValue> {
  if (action.type !== SetValueAction.TYPE) {
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
