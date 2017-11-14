import { Action } from '@ngrx/store';

import { formGroupReducer } from '../group/reducer';
import { computeGroupState } from '../group/reducer/util';
import { AbstractControlState, FormGroupControls, FormGroupState, KeyValue } from '../state';
import { ProjectFn2 } from './util';

export type StateUpdateFns<TValue extends KeyValue> =
  {[controlId in keyof TValue]?: ProjectFn2<AbstractControlState<TValue[controlId]>, FormGroupState<TValue>> };

function updateGroupControlsState<TValue extends KeyValue>(updateFns: StateUpdateFns<TValue>) {
  return (state: FormGroupState<TValue>) => {
    let hasChanged = false;
    const newControls = Object.keys(state.controls).reduce((res, key) => {
      const control = state.controls[key];
      res[key] = control;
      if (updateFns.hasOwnProperty(key)) {
        const newControl = updateFns[key]!(control, state);
        hasChanged = hasChanged || newControl !== control;
        res[key] = newControl;
      }
      return res;
    }, {} as FormGroupControls<TValue>);
    return hasChanged ? newControls : state.controls;
  };
}

function updateGroupSingle<TValue extends KeyValue>(updateFns: StateUpdateFns<TValue>) {
  return (state: FormGroupState<TValue>): FormGroupState<TValue> => {
    const newControls = updateGroupControlsState<TValue>(updateFns)(state);
    return newControls !== state.controls
      ? computeGroupState<TValue>(state.id, newControls, state.value, state.errors, state.pendingValidations, state.userDefinedProperties)
      : state;
  };
}

/**
 * Returns a function that applies all given update function objects one after another to the given form group state.
 */
export function updateGroup<TValue extends KeyValue>(...updateFnsArr: Array<StateUpdateFns<TValue>>) {
  return (state: FormGroupState<TValue>): FormGroupState<TValue> => {
    return updateFnsArr.reduce((s, updateFns) => updateGroupSingle<TValue>(updateFns)(s), state);
  };
}

/**
 * Returns a reducer function that first updates a given state with an action and afterwards applies
 * all given update function objects one after another to the resulting form group state.
 */
export function createFormGroupReducerWithUpdate<TValue extends KeyValue>(...updateFnsArr: Array<StateUpdateFns<TValue>>) {
  return (state: FormGroupState<TValue>, action: Action) => {
    state = formGroupReducer(state, action);
    return updateGroup<TValue>(...updateFnsArr)(state);
  };
}
