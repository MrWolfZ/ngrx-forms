import { Actions, SetErrorsAction } from '../../actions';
import { FormArrayState } from '../../state';
import { deepEquals } from '../../util';
import { childReducer, computeArrayState } from './util';

export function setErrorsReducer<TValue>(
  state: FormArrayState<TValue>,
  action: Actions<TValue[]>,
): FormArrayState<TValue> {
  if (action.type !== SetErrorsAction.TYPE) {
    return state;
  }

  if (action.controlId !== state.id) {
    return childReducer(state, action);
  }

  if (!action.payload.errors) {
    throw new Error(`Control errors must be an object; got ${JSON.stringify(action.payload.errors)}`); // `;
  }

  if (Object.keys(action.payload.errors).some(key => key.startsWith('_'))) {
    throw new Error(`Control errors must not use underscore as a prefix; got ${JSON.stringify(action.payload.errors)}`); // `;
  }

  if (state.errors === action.payload.errors) {
    return state;
  }

  if (deepEquals(state.errors, action.payload.errors)) {
    return state;
  }

  if (state.isDisabled) {
    return state;
  }

  const childErrors =
    Object.keys(state.errors)
      .filter(key => key.startsWith('_'))
      .reduce((res, key) => Object.assign(res, { [key]: state.errors[key] }), {});

  const newErrors = Object.assign(childErrors, action.payload.errors);

  return computeArrayState(state.id, state.controls, state.value, newErrors, state.pendingValidations, state.userDefinedProperties);
}
