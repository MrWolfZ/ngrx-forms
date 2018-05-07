import {Actions} from '../../actions';
import {formControlReducerInternal} from '../../control/reducer';
import {formGroupReducerInternal} from '../../group/reducer';
import {AbstractControlState, computeArrayState, FormArrayState, FormGroupControls, FormGroupState, isArrayState, isGroupState, KeyValue} from '../../state';
import {formArrayReducerInternal} from '../reducer';

export function callChildReducer(
  state: AbstractControlState<any>,
  action: Actions<any>,
): AbstractControlState<any> {
  if (isArrayState(state)) {
    return formArrayReducerInternal(state, action as any);
  }

  if (isGroupState(state)) {
    return formGroupReducerInternal(state, action);
  }

  return formControlReducerInternal(state as any, action);
}

export function dispatchActionPerChild<TValue>(
  controls: Array<AbstractControlState<TValue>>,
  actionCreator: (controlId: string) => Actions<TValue>,
) {
  let hasChanged = false;
  const newControls = controls
    .map(state => {
      const newState = callChildReducer(state, actionCreator(state.id));
      hasChanged = hasChanged || state !== newState;
      return newState;
    });
  return hasChanged ? newControls : controls;
}

function callChildReducers<TValue>(
  controls: Array<AbstractControlState<TValue>>,
  action: Actions<TValue[]>,
): Array<AbstractControlState<TValue>> {
  let hasChanged = false;
  const newControls = controls
    .map(state => {
      const newState = callChildReducer(state, action);
      hasChanged = hasChanged || state !== newState;
      return newState;
    });
  return hasChanged ? newControls : controls;
}

export function childReducer<TValue>(state: FormArrayState<TValue>, action: Actions<TValue[]>) {
  const controls = callChildReducers(state.controls, action);

  if (state.controls === controls) {
    return state;
  }

  return computeArrayState(state.id, controls, state.value, state.errors, state.pendingValidations, state.userDefinedProperties);
}

export function updateIdRecursiveForGroup<TValue extends KeyValue>(state: FormGroupState<TValue>, newId: string): FormGroupState<TValue> {
  const controls: FormGroupControls<TValue> =
    Object.keys(state.controls).reduce((agg, key) => Object.assign(agg, {
      [key]: updateIdRecursive(state.controls[key], `${newId}.${key}`),
    }), {} as FormGroupControls<TValue>);

  return {
    ...state,
    id: newId,
    controls,
  };
}

export function updateIdRecursiveForArray<TValue>(state: FormArrayState<TValue>, newId: string): FormArrayState<TValue> {
  const controls = state.controls.map((c, i) => updateIdRecursive(c, `${newId}.${i}`));

  return {
    ...state,
    id: newId,
    controls,
  };
}

export function updateIdRecursive(state: AbstractControlState<any>, newId: string): AbstractControlState<any> {
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
