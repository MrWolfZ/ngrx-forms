import { FormGroupState, KeyValue } from '../../state';
import { Actions, EnableAction } from '../../actions';
import { computeGroupState, dispatchActionPerChild, childReducer } from './util';

export function enableReducer<TValue extends KeyValue>(
  state: FormGroupState<TValue>,
  action: Actions<TValue>,
): FormGroupState<TValue> {
  if (action.type !== EnableAction.TYPE) {
    return state;
  }

  if (action.controlId !== state.id) {
    return childReducer(state, action);
  }

  const controls = dispatchActionPerChild(state.controls, controlId => new EnableAction(controlId));

  if (controls === state.controls) {
    return state;
  }

  return computeGroupState(
    state.id,
    controls,
    state.value,
    state.errors,
    state.pendingValidations,
    state.userDefinedProperties,
  );
}
