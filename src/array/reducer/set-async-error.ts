import { Actions, SetAsyncErrorAction } from '../../actions';
import { FormArrayState } from '../../state';
import { deepEquals } from '../../util';
import { childReducer, computeArrayState } from './util';

export function setAsyncErrorReducer<TValue>(
  state: FormArrayState<TValue>,
  action: Actions<TValue[]>,
): FormArrayState<TValue> {
  if (action.type !== SetAsyncErrorAction.TYPE) {
    return state;
  }

  if (action.controlId !== state.id) {
    return childReducer(state, action);
  }

  if (state.isDisabled) {
    return state;
  }

  if (state.pendingValidations.indexOf(action.payload.name) < 0) {
    return state;
  }

  const name = '$' + action.payload.name;
  let value = action.payload.value;

  if (deepEquals(state.errors[name], action.payload.value)) {
    value = state.errors[name];
  }

  const errors = { ...state.errors, [name]: value };
  const pendingValidations = state.pendingValidations.filter(v => v !== action.payload.name);

  return computeArrayState(state.id, state.controls, state.value, errors, pendingValidations, state.userDefinedProperties);
}
