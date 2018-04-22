import { Actions, SetErrorsAction } from '../../actions';
import { FormControlState, FormControlValueTypes, ValidationErrors } from '../../state';
import { deepEquals, isEmpty } from '../../util';

export function setErrorsReducer<TValue extends FormControlValueTypes>(
  state: FormControlState<TValue>,
  action: Actions<TValue>,
): FormControlState<TValue> {
  if (action.type !== SetErrorsAction.TYPE) {
    return state;
  }

  if (state.isDisabled) {
    return state;
  }

  if (state.errors === action.errors) {
    return state;
  }

  if (deepEquals(state.errors, action.errors)) {
    return state;
  }

  if (!action.errors || typeof (action.errors as any) !== 'object' || Array.isArray(action.errors)) {
    throw new Error(`Control errors must be an object; got ${action.errors}`); // `;
  }

  if (Object.keys(action.errors).some(key => key.startsWith('$'))) {
    throw new Error(`Control errors must not use $ as a prefix; got ${JSON.stringify(action.errors)}`); // `;
  }

  const asyncErrors =
    Object.keys(state.errors)
      .filter(key => key.startsWith('$'))
      .reduce((res, key) => Object.assign(res, { [key]: state.errors[key] }), {} as ValidationErrors);

  const newErrors = isEmpty(asyncErrors) ? action.errors : Object.assign(asyncErrors, action.errors);
  const isValid = isEmpty(newErrors);

  return {
    ...state,
    isValid,
    isInvalid: !isValid,
    errors: newErrors,
  };
}
