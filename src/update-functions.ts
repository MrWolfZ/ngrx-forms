import { Action } from '@ngrx/store';

import { SetErrorsAction } from './actions';
import { AbstractControlState, FormGroupState, FormGroupControls, ValidationErrors } from './state';
import { formControlReducer } from './control/reducer';
import { formGroupReducer } from './group/reducer';
import { isGroupState, computeGroupState } from './group/reducer/util';

export type ProjectFn<T> = (t: T) => T;
export type StateUpdateFns<TValue> = {[controlId in keyof TValue]?: ProjectFn<AbstractControlState<TValue[controlId]>> };

function updateControlsState<TValue extends object>(updateFns: StateUpdateFns<TValue>) {
  return (controls: FormGroupControls<TValue>) => {
    let hasChanged = false;
    const newControls = Object.keys(controls).reduce((res, key) => {
      const control = controls[key];
      res[key] = control;
      if (updateFns.hasOwnProperty(key)) {
        const newControl = updateFns[key]!(control);
        hasChanged = hasChanged || newControl !== control;
        res[key] = newControl;
      }
      return res;
    }, {} as FormGroupControls<TValue>);
    return hasChanged ? newControls : controls;
  };
}

export function updateGroup<TValue extends object>(updateFns: StateUpdateFns<TValue>) {
  return (state: FormGroupState<TValue>) => {
    const newControls = updateControlsState(updateFns)(state.controls);
    return newControls !== state.controls ? computeGroupState(state.id, newControls, state.value, state.errors) : state;
  };
}

export function compose<T>(...fns: Array<(t: T) => T>) {
  return (t: T) => fns.reduce((res, f) => f(res), t);
}

export function groupUpdateReducer<TValue extends object>(...updateFnsArr: Array<StateUpdateFns<TValue>>) {
  return (state: FormGroupState<TValue>, action: Action) =>
    compose<FormGroupState<TValue>>(
      s => formGroupReducer(s, action),
      ...updateFnsArr.map(updateFns => updateGroup<TValue>(updateFns)),
    )(state);
}

function abstractControlReducer<TValue>(state: AbstractControlState<TValue>, action: Action): AbstractControlState<TValue> {
  return isGroupState(state) ? formGroupReducer(state as any, action) as any : formControlReducer(state as any, action);
}

export function validate<TValue>(validatorFn: (value: TValue) => ValidationErrors) {
  return (state: AbstractControlState<TValue>) => abstractControlReducer(state, new SetErrorsAction(state.id, validatorFn(state.value)));
}
