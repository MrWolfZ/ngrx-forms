import { computeArrayState } from '../array/reducer/util';
import { AbstractControlState, FormArrayState } from '../state';
import { ProjectFn2 } from './util';

function updateArrayControlsState<TValue>(updateFn: ProjectFn2<AbstractControlState<TValue>, FormArrayState<TValue>>) {
  return (state: FormArrayState<TValue>) => {
    let hasChanged = false;
    const newControls = state.controls.map(control => {
      const newControl = updateFn(control, state);
      hasChanged = hasChanged || newControl !== control;
      return newControl;
    });
    return hasChanged ? newControls : state.controls;
  };
}

function updateArraySingle<TValue>(updateFn: ProjectFn2<AbstractControlState<TValue>, FormArrayState<TValue>>) {
  return (state: FormArrayState<TValue>): FormArrayState<TValue> => {
    const newControls = updateArrayControlsState<TValue>(updateFn)(state);
    return newControls !== state.controls
      ? computeArrayState<TValue>(state.id, newControls, state.value, state.errors, state.pendingValidations, state.userDefinedProperties)
      : state;
  };
}

/**
 * Returns a function that applies all given update functions one after another to the given form array state.
 */
export function updateArray<TValue>(...updateFnArr: Array<ProjectFn2<AbstractControlState<TValue>, FormArrayState<TValue>>>) {
  return (state: FormArrayState<TValue>): FormArrayState<TValue> => {
    return updateFnArr.reduce((s, updateFn) => updateArraySingle<TValue>(updateFn)(s), state);
  };
}
