import { Actions, StartAsyncValidationAction } from '../../actions';
import { FormArrayState } from '../../state';
import { childReducer, computeArrayState } from './util';

export function startAsyncValidationReducer<TValue>(
  state: FormArrayState<TValue>,
  action: Actions<TValue[]>,
): FormArrayState<TValue> {
  if (action.type !== StartAsyncValidationAction.TYPE) {
    return state;
  }

  if (action.controlId !== state.id) {
    return childReducer(state, action);
  }

  if (state.pendingValidations.indexOf(action.payload.name) >= 0) {
    return state;
  }

  const pendingValidations = [...state.pendingValidations, action.payload.name];

  return computeArrayState(state.id, state.controls, state.value, state.errors, pendingValidations, state.userDefinedProperties);
}
