import { Actions } from '../../actions';
import { formArrayReducerInternal } from '../../array/reducer';
import { formControlReducerInternal } from '../../control/reducer';
import {
  computeGroupState,
  FormGroupControls,
  FormGroupState,
  InferredControlState,
  isArrayState,
  isGroupState,
  KeyValue,
  FormControlState,
} from '../../state';
import { formGroupReducerInternal } from '../reducer';

export function callChildReducer<TValue>(
  state: InferredControlState<TValue>,
  action: Actions<any>,
): InferredControlState<TValue> {
  if (isArrayState(state)) {
    return formArrayReducerInternal<TValue>(state, action) as any;
  }

  if (isGroupState(state)) {
    return formGroupReducerInternal(state, action) as any;
  }

  return formControlReducerInternal(state as FormControlState<any>, action) as any;
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
    .map(key => [key, callChildReducer(controls[key], action)] as [string, InferredControlState<any>])
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
