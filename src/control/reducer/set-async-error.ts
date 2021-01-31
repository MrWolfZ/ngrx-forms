import {NgrxFormActionTypes, SetAsyncErrorAction} from '../../actions';
import { FormControlState, FormControlValueTypes } from '../../state';
import { deepEquals } from '../../util';

export function setAsyncErrorReducer<TValue extends FormControlValueTypes>(
  state: FormControlState<TValue>,
  action: NgrxFormActionTypes,
): FormControlState<TValue> {
  if (action.type !== SetAsyncErrorAction.type) {
    return state;
  }

  if (state.isDisabled) {
    return state;
  }

  const name = `$${action.name}`;
  let value = action.value;

  if (deepEquals(state.errors[name], action.value)) {
    value = state.errors[name];
  }

  const errors = { ...state.errors, [name]: value };
  const pendingValidations = state.pendingValidations.filter(v => v !== action.name);

  return {
    ...state,
    isValid: false,
    isInvalid: true,
    errors,
    pendingValidations,
    isValidationPending: pendingValidations.length > 0,
  };
}
