import { Actions, ClearAsyncErrorAction } from '../../actions';
import { FormControlState, FormControlValueTypes } from '../../state';
import { isEmpty } from '../../util';

export function clearAsyncErrorReducer<TValue extends FormControlValueTypes>(
  state: FormControlState<TValue>,
  action: Actions<TValue>,
): FormControlState<TValue> {
  if (action.type !== ClearAsyncErrorAction.TYPE) {
    return state;
  }

  if (state.pendingValidations.indexOf(action.name) < 0) {
    return state;
  }

  const name = `$${action.name}`;

  let errors = state.errors;

  if (state.errors.hasOwnProperty(name)) {
    errors = { ...state.errors };
    delete (errors as any)[name];
  }

  const pendingValidations = state.pendingValidations.filter(v => v !== action.name);
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
