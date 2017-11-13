import { Actions, StartAsyncValidationAction } from '../../actions';
import { FormControlState, FormControlValueTypes } from '../../state';

export function startAsyncValidationReducer<TValue extends FormControlValueTypes>(
  state: FormControlState<TValue>,
  action: Actions<TValue>,
): FormControlState<TValue> {
  if (action.type !== StartAsyncValidationAction.TYPE) {
    return state;
  }

  if (state.pendingValidations.indexOf(action.payload.name) >= 0) {
    return state;
  }

  return {
    ...state,
    pendingValidations: [...state.pendingValidations, action.payload.name],
    isValidationPending: true,
  };
}
