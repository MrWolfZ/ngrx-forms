import { Actions, DisableAction } from '../../actions';
import { FormControlState, FormControlValueTypes } from '../../state';

export function disableReducer<TValue extends FormControlValueTypes>(
  state: FormControlState<TValue>,
  action: Actions<TValue>,
): FormControlState<TValue> {
  if (action.type !== DisableAction.TYPE) {
    return state;
  }

  if (state.isDisabled) {
    return state;
  }

  return {
    ...state,
    isEnabled: false,
    isDisabled: true,
    isValid: true,
    isInvalid: false,
    errors: {},
    pendingValidations: [],
    isValidationPending: false,
  };
}
