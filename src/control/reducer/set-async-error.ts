import { FormControlState, FormControlValueTypes } from '../../state';
import { Actions, SetAsyncErrorAction } from '../../actions';
import { isEmpty, deepEquals } from '../../util';

export function setAsyncErrorReducer<TValue extends FormControlValueTypes>(
  state: FormControlState<TValue>,
  action: Actions<TValue>,
): FormControlState<TValue> {
  if (action.type !== SetAsyncErrorAction.TYPE) {
    return state;
  }

  if (state.isDisabled) {
    return state;
  }

  const name = '$' + action.payload.name;

  if (state.errors[name] === action.payload.value) {
    return state;
  }

  if (deepEquals(state.errors[name], action.payload.value)) {
    return state;
  }

  const errors = { ...state.errors, [name]: action.payload.value };

  return {
    ...state,
    isValid: false,
    isInvalid: true,
    errors,
  };
}
