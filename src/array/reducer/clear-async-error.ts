import { Actions, ClearAsyncErrorAction } from '../../actions';
import { FormArrayState } from '../../state';
import { childReducer, computeArrayState } from './util';

export function clearAsyncErrorReducer<TValue>(
  state: FormArrayState<TValue>,
  action: Actions<TValue[]>,
): FormArrayState<TValue> {
  if (action.type !== ClearAsyncErrorAction.TYPE) {
    return state;
  }

  if (action.controlId !== state.id) {
    return childReducer(state, action);
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

  return computeArrayState(state.id, state.controls, state.value, errors, pendingValidations, state.userDefinedProperties);
}
