import { FormControlState, FormControlValueTypes } from '../../state';
import { Actions, ClearAsyncErrorAction } from '../../actions';
import { isEmpty, deepEquals } from '../../util';

export function clearAsyncErrorReducer<TValue extends FormControlValueTypes>(
  state: FormControlState<TValue>,
  action: Actions<TValue>,
): FormControlState<TValue> {
  if (action.type !== ClearAsyncErrorAction.TYPE) {
    return state;
  }

  if (state.pendingValidations.indexOf(action.payload.name) < 0) {
    return state;
  }

  const name = '$' + action.payload.name;

  let errors = state.errors;

  if (state.errors.hasOwnProperty(name)) {
    errors = { ...state.errors };
    delete errors[name];
  }

  const pendingValidations = state.pendingValidations.filter(v => v !== action.payload.name);
  const isValid = isEmpty(errors);

  return {
    ...state,
    isValid,
    isInvalid: !isValid,
    errors,
    pendingValidations,
    isValidationPending: pendingValidations.length > 0,
  };
}
