import { Actions } from '../../actions';
import { formArrayReducerInternal } from '../../array/reducer';
import { formControlReducerInternal } from '../../control/reducer';
import {
  AbstractControlState,
  FormGroupControls,
  FormGroupState,
  isArrayState,
  isGroupState,
  KeyValue,
  computeGroupState,
} from '../../state';
import { formGroupReducerInternal } from '../reducer';

export function callChildReducer(
  state: AbstractControlState<any>,
  action: Actions<any>,
): AbstractControlState<any> {
  if (isArrayState(state)) {
    return formArrayReducerInternal(state as any, action as any);
  }

  if (isGroupState(state)) {
    return formGroupReducerInternal(state as any, action);
  }

  return formControlReducerInternal(state as any, action);
}

export function dispatchActionPerChild<TValue extends KeyValue>(
  controls: FormGroupControls<TValue>,
  actionCreator: (controlId: string) => Actions<TValue>,
) {
  let hasChanged = false;
  const newControls = Object.keys(controls)
    .reduce((c, key) => {
      c[key] = callChildReducer(controls[key], actionCreator(controls[key].id));
      hasChanged = hasChanged || c[key] !== controls[key];
      return c;
    }, {} as FormGroupControls<TValue>);
  return hasChanged ? newControls : controls;
}

function callChildReducers<TValue extends { [key: string]: any }>(
  controls: FormGroupControls<TValue>,
  action: Actions<TValue>,
): FormGroupControls<TValue> {
  let hasChanged = false;
  const newControls = Object.keys(controls)
    .map(key => [key, callChildReducer(controls[key], action)] as [string, AbstractControlState<any>])
    .reduce((res, [key, state]) => {
      hasChanged = hasChanged || state !== controls[key];
      return Object.assign(res, { [key]: state });
    }, {} as FormGroupControls<TValue>);
  return hasChanged ? newControls : controls;
}

export function childReducer<TValue extends KeyValue>(state: FormGroupState<TValue>, action: Actions<TValue>) {
  const controls = callChildReducers(state.controls, action);

  if (state.controls === controls) {
    return state;
  }

  return computeGroupState(state.id, controls, state.value, state.errors, state.pendingValidations, state.userDefinedProperties);
}
