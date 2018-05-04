import { Actions, RemoveArrayControlAction } from '../../actions';
import { AbstractControlState, computeArrayState, FormArrayState, FormGroupState, FormGroupControls, isArrayState, isGroupState } from '../../state';
import { childReducer } from './util';

function updateIdRecursiveForGroup(state: FormGroupState<any>, newId: string) {
  const controls: FormGroupControls<any> =
    Object.keys(state.controls).reduce((agg, key) => Object.assign(agg, {
      [key]: updateIdRecursive(state.controls[key], `${newId}.${key}`),
    }), {});

  return {
    ...state,
    id: newId,
    controls,
  };
}

function updateIdRecursiveForArray(state: FormArrayState<any>, newId: string) {
  const controls = state.controls.map((c, i) => updateIdRecursive(c, `${newId}.${i}`));

  return {
    ...state,
    id: newId,
    controls,
  };
}

function updateIdRecursive(state: AbstractControlState<any>, newId: string): AbstractControlState<any> {
  if (state.id === newId) {
    return state;
  }

  if (isGroupState(state)) {
    return updateIdRecursiveForGroup(state, newId);
  }

  if (isArrayState(state)) {
    return updateIdRecursiveForArray(state, newId);
  }

  return {
    ...state,
    id: newId,
  };
}

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
  const controls = state.controls.filter((_, i) => i !== index).map((c, i) => updateIdRecursive(c, `${state.id}.${i}`));

  return computeArrayState(
    state.id,
    controls,
    state.value,
    state.errors,
    state.pendingValidations,
    state.userDefinedProperties,
    true
  );
}
