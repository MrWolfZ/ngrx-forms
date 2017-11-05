import { Actions, StartAsyncValidationAction } from '../../actions';
import { FormGroupState, KeyValue } from '../../state';
import { childReducer, computeGroupState } from './util';

export function startAsyncValidationReducer<TValue extends KeyValue>(
  state: FormGroupState<TValue>,
  action: Actions<TValue>,
): FormGroupState<TValue> {
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

  return computeGroupState(state.id, state.controls, state.value, state.errors, pendingValidations, state.userDefinedProperties);
}
