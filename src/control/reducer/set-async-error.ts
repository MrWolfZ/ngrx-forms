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

  if (state.pendingValidations.indexOf(action.payload.name) < 0) {
    return state;
  }

  const name = '$' + action.payload.name;
  let value = action.payload.value;

  if (deepEquals(state.errors[name], action.payload.value)) {
    value = state.errors[name];
  }

  const errors = { ...state.errors, [name]: value };
  const pendingValidations = state.pendingValidations.filter(v => v !== action.payload.name);

  return {
    ...state,
    isValid: false,
    isInvalid: true,
    errors,
    pendingValidations,
    isValidationPending: pendingValidations.length > 0,
  };
}
