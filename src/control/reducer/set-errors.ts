import { FormControlState, FormControlValueTypes } from '../../state';
import { Actions, SetErrorsAction } from '../../actions';
import { isEmpty, deepEquals } from '../../util';

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

  if (state.errors === action.payload.errors) {
    return state;
  }

  if (deepEquals(state.errors, action.payload.errors)) {
    return state;
  }

  if (!action.payload.errors || typeof action.payload.errors !== 'object' || Array.isArray(action.payload.errors)) {
    throw new Error(`Control errors must be an object; got ${action.payload.errors}`); // `;
  }

  if (Object.keys(action.payload.errors).some(key => key.startsWith('$'))) {
    throw new Error(`Control errors must not use $ as a prefix; got ${JSON.stringify(action.payload.errors)}`); // `;
  }

  const asyncErrors =
    Object.keys(state.errors)
      .filter(key => key.startsWith('$'))
      .reduce((res, key) => Object.assign(res, { [key]: state.errors[key] }), {});

  const newErrors = isEmpty(asyncErrors) ? action.payload.errors : Object.assign(asyncErrors, action.payload.errors);
  const isValid = isEmpty(newErrors);

  return {
    ...state,
    isValid,
    isInvalid: !isValid,
    errors: newErrors,
  };
}
