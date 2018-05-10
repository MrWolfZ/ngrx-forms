import { Actions, AddGroupControlAction } from '../../actions';
import { computeGroupState, createChildState, FormGroupState, KeyValue } from '../../state';
import { childReducer } from './util';

export function addControlReducer<TValue extends KeyValue>(
  state: FormGroupState<TValue>,
  action: Actions<TValue>,
): FormGroupState<TValue> {
  if (action.type !== AddGroupControlAction.TYPE) {
    return state;
  }

  if (action.controlId !== state.id) {
    return childReducer(state, action);
  }

  if (state.controls.hasOwnProperty(action.name)) {
    throw new Error(`Group '${state.id}' already has child control '${action.name}'!`); // `;
  }

  const controls = Object.assign({}, state.controls, {
    [action.name]: createChildState(`${state.id}.${action.name}`, action.value),
  });

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
