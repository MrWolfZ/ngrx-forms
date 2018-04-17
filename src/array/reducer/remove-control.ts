import { Actions, RemoveArrayControlAction } from '../../actions';
import { computeArrayState, FormArrayState, FormGroupControls, FormGroupState, InferredControlState, isArrayState, isGroupState } from '../../state';
import { childReducer } from './util';

function updateIdRecursiveForGroup(state: FormGroupState<any>, newId: string) {
  const controls: FormGroupControls<any> =
    Object.keys(state.controls)
      .reduce((agg, key) => Object.assign(agg, {
        [key]: updateIdRecursive(state.controls[key], `${newId}.${key}`),
      }), {} as FormGroupControls<any>);

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

function updateIdRecursive(state: InferredControlState<any>, newId: string): InferredControlState<any> {
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

  if (action.index >= state.controls.length || action.index < 0) {
    throw new Error(`Index ${action.index} is out of bounds for array '${state.id}' with length ${state.controls.length}!`); // `;
  }

  const index = action.index;
  const controls = state.controls.filter((_, i) => i !== index).map((c, i) => updateIdRecursive(c, `${state.id}.${i}`)) as InferredControlState<TValue>[];

  return computeArrayState(
    state.id,
    controls,
    state.value,
    state.errors,
    state.pendingValidations,
    state.userDefinedProperties,
  );
}
