import { Actions, AddControlAction } from '../../actions';
import { createChildState, FormGroupState, KeyValue } from '../../state';
import { childReducer, computeGroupState } from './util';

export function addControlReducer<TValue extends KeyValue>(
  state: FormGroupState<TValue>,
  action: Actions<TValue>,
): FormGroupState<TValue> {
  if (action.type !== AddControlAction.TYPE) {
    return state;
  }

  if (action.controlId !== state.id) {
    return childReducer(state, action);
  }

  if (state.controls.hasOwnProperty(action.payload.name)) {
    throw new Error(`Group '${state.id}' already has child control '${action.payload.name}'!`); // `;
  }

  const controls = Object.assign({}, state.controls, {
    [action.payload.name]: createChildState(`${state.id}.${action.payload.name}`, action.payload.value),
  });

  return computeGroupState(
    state.id,
    controls,
    state.value,
    state.errors,
    state.pendingValidations,
    state.userDefinedProperties,
  );
}
