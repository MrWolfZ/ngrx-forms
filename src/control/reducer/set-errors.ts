import { FormControlState, FormControlValueTypes } from '../../state';
import { Actions, SetErrorsAction } from '../../actions';
import { isEmpty } from '../../util';

export function setErrorsReducer<TValue extends FormControlValueTypes>(
  state: FormControlState<TValue>,
  action: Actions<TValue>,
): FormControlState<TValue> {
  if (action.type !== SetErrorsAction.TYPE) {
    return state;
  }

  if (!action.payload.errors) {
    throw new Error(`Control errors must be an object; got ${action.payload.errors}`); // `;
  }

  if (state.errors === action.payload.errors) {
    return state;
  }

  // TODO: deepEquals
  if (isEmpty(state.errors) && isEmpty(action.payload.errors)) {
    return state;
  }

  if (state.isDisabled) {
    return state;
  }

  const isValid = isEmpty(action.payload.errors);
  return {
    ...state,
    isValid,
    isInvalid: !isValid,
    errors: action.payload.errors,
  };
}
