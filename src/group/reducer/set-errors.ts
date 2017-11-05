import { FormGroupState, KeyValue } from '../../state';
import { Actions, SetErrorsAction } from '../../actions';
import { computeGroupState, childReducer } from './util';
import { deepEquals } from '../../util';

export function setErrorsReducer<TValue extends KeyValue>(
  state: FormGroupState<TValue>,
  action: Actions<TValue>,
): FormGroupState<TValue> {
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

  return computeGroupState(state.id, state.controls, state.value, newErrors, state.pendingValidations, state.userDefinedProperties);
}
