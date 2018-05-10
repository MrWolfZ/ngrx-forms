import { Actions, RemoveGroupControlAction } from '../../actions';
import { computeGroupState, FormGroupState, KeyValue } from '../../state';
import { childReducer } from './util';

export function removeControlReducer<TValue extends KeyValue>(
  state: FormGroupState<TValue>,
  action: Actions<TValue>,
): FormGroupState<TValue> {
  if (action.type !== RemoveGroupControlAction.TYPE) {
    return state;
  }

  if (action.controlId !== state.id) {
    return childReducer(state, action);
  }

  if (!state.controls.hasOwnProperty(action.name)) {
    throw new Error(`Group '${state.id}' does not have child control '${action.name}'!`); // `;
  }

  const controls = Object.assign({}, state.controls);
  delete controls[action.name];

  return computeGroupState(
    state.id,
    controls,
    state.value,
    state.errors,
    state.pendingValidations,
    state.userDefinedProperties,
    {
      wasOrShouldBeDirty: true,
      wasOrShouldBeEnabled: state.isEnabled,
      wasOrShouldBeTouched: state.isTouched,
      wasOrShouldBeSubmitted: state.isSubmitted,
    },
  );
}
