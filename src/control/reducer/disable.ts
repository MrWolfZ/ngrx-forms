import { DisableAction, NgrxFormActionTypes} from '../../actions';
import { FormControlState, FormControlValueTypes } from '../../state';

export function disableReducer<TValue extends FormControlValueTypes>(
  state: FormControlState<TValue>,
  action: NgrxFormActionTypes,
): FormControlState<TValue> {
  if (action.type !== DisableAction.type) {
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
