import { Actions, ClearAsyncErrorAction } from '../../actions';
import { FormGroupState, KeyValue } from '../../state';
import { childReducer, computeGroupState } from './util';

export function clearAsyncErrorReducer<TValue extends KeyValue>(
  state: FormGroupState<TValue>,
  action: Actions<TValue>,
): FormGroupState<TValue> {
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

  if (errors.hasOwnProperty(name)) {
    errors = { ...state.errors };
    delete errors[name];
  }

  const pendingValidations = state.pendingValidations.filter(v => v !== action.payload.name);

  return computeGroupState(state.id, state.controls, state.value, errors, pendingValidations, state.userDefinedProperties);
}
