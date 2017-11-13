import { Actions, EnableAction } from '../../actions';
import { FormArrayState } from '../../state';
import { childReducer, computeArrayState, dispatchActionPerChild } from './util';

export function enableReducer<TValue>(
  state: FormArrayState<TValue>,
  action: Actions<TValue[]>,
): FormArrayState<TValue> {
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

  return computeArrayState(
    state.id,
    controls,
    state.value,
    state.errors,
    state.pendingValidations,
    state.userDefinedProperties,
  );
}
