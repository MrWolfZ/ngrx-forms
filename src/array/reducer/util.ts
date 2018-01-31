import { Actions } from '../../actions';
import { formControlReducerInternal } from '../../control/reducer';
import { formGroupReducerInternal } from '../../group/reducer';
import { AbstractControlState, computeArrayState, FormArrayState, isArrayState, isGroupState } from '../../state';
import { formArrayReducerInternal } from '../reducer';

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
