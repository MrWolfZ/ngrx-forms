import { Actions, RemoveArrayControlAction } from '../../actions';
import { computeArrayState, FormArrayState } from '../../state';
import { childReducer } from './util';

export function removeControlReducer<TValue>(
  state: FormArrayState<TValue>,
  action: Actions<TValue[]>,
): FormArrayState<TValue> {
  if (action.type !== RemoveArrayControlAction.TYPE) {
    return state;
  }

  if (action.controlId !== state.id) {
    return childReducer(state, action);
  }

  if (action.payload.index >= state.controls.length || action.payload.index < 0) {
    throw new Error(`Index ${action.payload.index} is out of bounds for array '${state.id}' with length ${state.controls.length}!`); // `;
  }

  const index = action.payload.index;
  const controls = state.controls.filter((_, i) => i !== index).map((c, i) => ({ ...c, id: `${state.id}.${i}` }));

  return computeArrayState(
    state.id,
    controls,
    state.value,
    state.errors,
    state.pendingValidations,
    state.userDefinedProperties,
  );
}
