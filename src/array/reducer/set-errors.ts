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

  if (Object.keys(action.payload.errors).some(key => key.startsWith('_'))) {
    throw new Error(`Control errors must not use underscore as a prefix; got ${JSON.stringify(action.payload.errors)}`); // `;
  }

  if (Object.keys(action.payload.errors).some(key => key.startsWith('$'))) {
    throw new Error(`Control errors must not use $ as a prefix; got ${JSON.stringify(action.payload.errors)}`); // `;
  }

  const childAndAsyncErrors =
    Object.keys(state.errors)
      .filter(key => key.startsWith('_') || key.startsWith('$'))
      .reduce((res, key) => Object.assign(res, { [key]: state.errors[key] }), {});

  const newErrors = Object.assign(childAndAsyncErrors, action.payload.errors);

  return computeArrayState(state.id, state.controls, state.value, newErrors, state.pendingValidations, state.userDefinedProperties);
}
